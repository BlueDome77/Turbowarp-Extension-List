/**
 * Original non-functional proof of concept by LilyMakesThings
 */

(function (Scratch) {
	"use strict";

	if (!Scratch.extensions.unsandboxed) {
		throw new Error("Inline Blocks must run unsandboxed");
	}
	
	const vm = Scratch.vm;
	const runtime = vm.runtime;
	
	if (!(vm.exports.IRGenerator && vm.exports.JSGenerator)) {
		console.error("VM is too old, the Inline Blocks extension will only work with the compiler disabled.\nPlease compile the GUI with the VM PR https://github.com/TurboWarp/scratch-vm/pull/141");
	}
	
	const exId = "cstlmsInline";
	
	const PATCHES_ID = "__patches_" + exId;
	const patch = (obj, functions) => {
		if (obj[PATCHES_ID]) return;
		obj[PATCHES_ID] = {};
		for (const name in functions) {
			const original = obj[name];
			obj[PATCHES_ID][name] = obj[name];
			if (original) {
				obj[name] = function(...args) {
					const callOriginal = (...args) => original.call(this, ...args);
					return functions[name].call(this, callOriginal, ...args);
				};
			} else {
				obj[name] = function (...args) {
					return functions[name].call(this, () => {}, ...args);
				}
			}
		}
	}
	const unpatch = (obj) => {
		if (!obj[PATCHES_ID]) return;
		for (const name in obj[PATCHES_ID]) {
			obj[name] = obj[PATCHES_ID][name];
		}
		obj[PATCHES_ID] = null;
	}
	
	// Fix report bubble
	patch(runtime.constructor.prototype, {
		visualReport(original, blockId, value) {
			if (vm.editingTarget) {
				const block = vm.editingTarget.blocks.getBlock(blockId);
				if (block.opcode === (exId + "_inline") && !block.topLevel) return;
			}
			original(blockId, value);
		}
	});
	
	// Compiler support
	if (vm.exports.IRGenerator && vm.exports.JSGenerator) {
		const IRGenerator = vm.exports.IRGenerator;
		const JSGenerator = vm.exports.JSGenerator;
		const ScriptTreeGenerator = IRGenerator.exports.ScriptTreeGenerator;
		const {Frame, TypedInput, TYPE_UNKNOWN} = JSGenerator.exports;
		
		patch(ScriptTreeGenerator.prototype, {
			descendStackedBlock(original, block) {
				if (block.opcode === (exId) + "_return") {
					return {
						kind: exId + ".return",
						value: this.descendInputOfBlock(block, "VALUE")
					};
				}
				return original(block);
			},
			// inline {} can be used both as a stack (top-level) and reporter (in input)
			descendInput(original, block) {
				if (block.opcode === (exId + "_inline")) {
					return {
						kind: exId + ".inline",
						stack: this.descendSubstack(block, "SUBSTACK")
					};
				}
				return original(block);
			},
		});
		
		patch(JSGenerator.prototype, {
			descendStackedBlock(original, node) {
				if (node.kind === (exId + ".return")) {
					this.source += `throw {inlineReturn: true, value: ${this.descendInput(node.value).asSafe()}}\n`;
				} else {
					original(node);
				}
			},
			// inline {} can be used both as a stack (top-level) and reporter (in input)
			descendInput(original, node) {
				if (node.kind === (exId + ".inline")) {
					// big hack
					const oldSrc = this.source;
					this.descendStack(node.stack, new Frame(false));
					const stackSrc = this.source.substring(oldSrc.length);
					this.source = oldSrc;
					
					return new TypedInput(
						`(yield* (function*() {
							try {
								${stackSrc};
								return "";
							} catch (e) {
								if (!e.inlineReturn) throw e;
								return e.value;
							}
							})()
						)`,
						TYPE_UNKNOWN
					);
				}
				return original(node);
			},
			// Error handling for when returning at the top level
			descendStack(original, nodes, frame) {
				if (nodes !== this.script.stack || this.isProcedure)
					return original(nodes, frame);
				this.source += `try {\n`;
				original(nodes, frame);
				this.source += `} catch(e) {\n`;
				this.source += `if (!e.inlineReturn) throw e;\n`;
				this.source += `}\n`;
			},
		});
	}
	
	class inline {
		getInfo() {
			return {
				id: exId,
				color1: "#565656",
				name: "Inline Blocks",
				blocks: [
					{
						opcode: "inline",
						blockType: Scratch.BlockType.OUTPUT,
						text: ["inline"],
						output: "Boolean",
						outputShape: 3,
						branchCount: 1
					},
					{
						opcode: "return",
						blockType: Scratch.BlockType.COMMAND,
						text: "return [VALUE]",
						arguments: {
							VALUE: {
								type: Scratch.ArgumentType.STRING
							}
						},
						isTerminal: true
					}
				]
			}
		}
		
		// The below functions run only in the interpreter.

		inline(args, util) {
			const thread = util.thread;
			if (typeof util.stackFrame._inlineLastReturn !== "undefined") {
				// Stage 3: We have a return value and we
				// can return the value, return it!
				return util.stackFrame._inlineReturn;
			} else if (typeof util.stackFrame._inlineReturn !== "undefined") {
				// Stage 2: We have a return value, but we'll skip
				// over the outer block.
				// To prevent this, push it onto the stack again
				// and have a third stage
				const returnValue = util.stackFrame._inlineReturn;
				
				util.thread.popStack();
				
				util.stackFrame._inlineLastReturn = true;
				util.stackFrame._inlineReturn = returnValue;
				
				return returnValue;
			} else {
				// Stage 1: Run the stack.
				// Pretend the block returns a promise so that
				// the interpreter pauses on the block,
				// and continue running the script after execute()
				// finishes.
				
				if (util.stackFrame._inlineLoopRan) {
					thread.popStack();
					return "";
				};
				
				const stackFrame = thread.peekStackFrame();
				const oldGoToNextBlock = thread.goToNextBlock;
				
				const resetGoToNext = function() {
					thread.goToNextBlock = oldGoToNextBlock;
				}
				const blockGlowInFrame = thread.blockGlowInFrame;
				const resetGlowInFrame = function() {
					delete thread.blockGlowInFrame;
					thread.blockGlowInFrame = blockGlowInFrame;
				}
				
				const trap = () => {
					thread.status = thread.constructor.STATUS_RUNNING;
					
					const realBlockId = stackFrame.reporting;
					thread.pushStack(realBlockId);
					
					util.stackFrame._inlineLoopRan = true;
					this.stepToBranchWithBlockId(realBlockId, thread, 1, true);
				}
				
				// Trap thread.goToNextBlock for edge-activated hats
				thread.goToNextBlock = function() {
					resetGlowInFrame();
					
					trap();
					
					thread.goToNextBlock = oldGoToNextBlock;
					oldGoToNextBlock.call(this);
					resetGoToNext();
				}
				// Add a getter on thread.blockGlowInFrame for other scripts
				Object.defineProperty(thread, "blockGlowInFrame", {
					get() {
						return blockGlowInFrame;
					},
					set(newValue) {
						resetGoToNext();
						trap();
						resetGlowInFrame();
					},
					enumerable: true,
					configurable: true,
				});
				
				// Fake promise
				return {then: () => {}};
			}
		}
		
		stepToBranchWithBlockId(blockId, thread, branchNum, isLoop) {
			if (!branchNum) {
				branchNum = 1;
			}
			const currentBlockId = blockId;
			const branchId = thread.target.blocks.getBranch(
				currentBlockId,
				branchNum
			);
			thread.peekStackFrame().isLoop = isLoop;
			if (branchId) {
				// Push branch ID to the thread's stack.
				thread.pushStack(branchId);
			} else {
				thread.pushStack(null);
			}
		}

		return({VALUE}, util) {
			const thread = util.thread;
			const returnValue = VALUE ?? "";
			
			let blockID = thread.peekStack();
			while (blockID) {
				const block = thread.target.blocks.getBlock(blockID);
				if (block && block.opcode === exId + "_inline") {
					break;
				}
				thread.popStack();
				blockID = thread.peekStack();
			}
			
			if (thread.stack.length === 0) {
				// Clean up!
				thread.requestScriptGlowInFrame = false;
				thread.status = thread.constructor.STATUS_DONE;
			} else {
				// Return the value
				util.stackFrame._inlineReturn = returnValue;
				thread.status = thread.constructor.STATUS_RUNNING;
			}
		}
	}

	// Reimplementing the "output" and "outputShape" block parameters
	const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
	runtime._convertBlockForScratchBlocks = function(blockInfo, categoryInfo) {
		const res = cbfsb(blockInfo, categoryInfo);
		if (blockInfo.outputShape) {
			if (!res.json.outputShape) res.json.outputShape = blockInfo.outputShape;
		}
		if (blockInfo.output) {
			if (!res.json.output) res.json.output = blockInfo.output;
		}
		if (!res.json.branchCount) res.json.branchCount = blockInfo.branchCount;
		return res;
	}

	Scratch.extensions.register(new inline());
})(Scratch);
