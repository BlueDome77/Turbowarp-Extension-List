// !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// FINISH REMOVING num()
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!


(function(Scratch) {
	"use strict";

	if (!Scratch.extensions.unsandboxed) {
		throw new Error("WebGL extension must be run unsandboxed");
	}

	const TypedArrays = {
		Int8Array,
		Uint8Array,
		Int16Array,
		Uint16Array,
		Int32Array,
		Uint32Array,
		Float32Array,
		Float64Array
	}
	const Category = {
		BUFFERS: "Buffers",
		VAO: "VAO",
		SHADERS: "Shaders",
		PROGRAMS: "Programs",
		UNIFORMS: "Uniforms",
		ATTRIBUTES: "Attributes",
		TEXTURES: "Textures",
		RENDERBUFFERS: "Render Buffers",
		FRAMEBUFFERS: "Frame Buffers",
		SAMPLERS: "Samplers",
		QUERIES: "Queries",
		TRANSFORMFEEDBACK: "Transform Feedback",
		SYNC: "Sync",
		RENDERING: "Rendering",
		WRITEOPTIONS: "Write Options",
	}

//https://registry.khronos.org/webgl/specs/latest/2.0/#TEXTURE_PIXELS_TYPE_TABLE
	let gl2typed = `Int8Array BYTE
Uint8Array UNSIGNED_BYTE
Uint8ClampedArray UNSIGNED_BYTE
Int16Array SHORT
Uint16Array UNSIGNED_SHORT
Uint16Array UNSIGNED_SHORT_5_6_5
Uint16Array UNSIGNED_SHORT_5_5_5_1
Uint16Array UNSIGNED_SHORT_4_4_4_4
Int32Array INT
Uint32Array UNSIGNED_INT
Uint32Array UNSIGNED_INT_5_9_9_9_REV
Uint32Array UNSIGNED_INT_2_10_10_10_REV
Uint32Array UNSIGNED_INT_10F_11F_11F_REV
Uint32Array UNSIGNED_INT_24_8
Uint16Array HALF_FLOAT
Float32Array FLOAT`

	const ArgumentType = Scratch.ArgumentType;
	const BlockType = Scratch.BlockType;
	const Cast = Scratch.Cast;
	const num  = Cast.toNumber;
	const str  = Cast.toString;
	const bool = Cast.toBoolean;
	let   Skin = null;
	const vm = Scratch.vm;
	const renderer = vm.renderer;
	const runtime = vm.runtime;
	//const readbackFB = renderer.gl.createFramebuffer();


//TEMPORARY!!!!!!
if(window.ScratchBlocks) {
	ScratchBlocks.defineBlocksWithJsonArray = function(jsonArray) {
		for (var i = 0; i < jsonArray.length; i++) {
			let jsonDef = jsonArray[i];
			if (!jsonDef) {
				console.warn(
					'Block definition #' + i + ' in JSON array is ' + jsonDef + '. ' +
					'Skipping.');
			} else {
				var typename = jsonDef.type;
				if (typename == null || typename === '') {
					console.warn(
						'Block definition #' + i +
						' in JSON array is missing a type attribute. Skipping.');
				} else {
					if (ScratchBlocks.Blocks[typename]) {
						/*console.warn(
							'Block definition #' + i + ' in JSON array' +
							' overwrites prior definition of "' + typename + '".');*/
					}
					ScratchBlocks.Blocks[typename] = {init: function() {
						let block = this;
						let row = 0;
						while(jsonDef["args"+row]) {
							let blockArgs = jsonDef["args"+row];
							for(let arg of blockArgs) {
								if(typeof arg.options === "function") {
									const menuGen = arg.options;
									arg.options = function(...args) {
										return menuGen(...args, block.id);
									}
								}
							}
							row++;
						}
						this.jsonInit(jsonDef);
					}}
				}
			}
		}
	};
}
//END

	const canvas = document.createElement("canvas", { preserveDrawingBuffer: true });
	canvas.width = 480;
	canvas.height = 360;
	let gl = canvas.getContext("webgl2");
	window.gl = gl;



	gl2typed = Object.fromEntries(gl2typed.split("\n").map(e => {
		let split = e.split(" ");
		return [gl[split[1]], window[split[0]]];
	}));

	

	let skin = null;
	let skinId = null;
	let drawableId = null;

	console.log(gl.__proto__);

	const allConsts = [];
	Object.entries(Object.getOwnPropertyDescriptors(gl.__proto__))
	.filter(([, desc]) => desc.hasOwnProperty('value') && typeof desc.value !== 'function')
	.forEach(([key]) => {
		if(typeof gl[key] == "number") {
			allConsts.push({text: "gl."+key, value: ""+gl[key]});
		}
	});

	// Obtain Skin
	let tempSkin = renderer.createTextSkin("say", "", true);
	Skin = renderer._allSkins[tempSkin].__proto__.__proto__.constructor;
	renderer.destroySkin(tempSkin);

	class SimpleSkin extends Skin {
		constructor(id, renderer) {
			super(id, renderer);
			const gl = renderer.gl;
			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,255,0,255]));
			this._texture = texture;
			this._rotationCenter = [240,180];
		}
		dispose() {
			if(this._texture) {
				this._renderer.gl.deleteTexture(this._texture);
				this._texture = null;
			}
			super.dispose();
		}
		get size() {
			return [480, 360];
		}
		getTexture(scale) {
			return this._texture || super.getTexture();
		}
		setContent(textureData) {
			const gl = this._renderer.gl;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
			this.emitWasAltered();
		}
	}

	// Register new drawable group "webgl2"
	let index = renderer._groupOrdering.indexOf("video");
	let copy = renderer._groupOrdering.slice();
	copy.splice(index, 0, "webgl2");
	renderer.setLayerGroupOrdering(copy);


	// Create drawable and skin
	skinId = renderer._nextSkinId++;
	renderer._allSkins[skinId] = skin = new SimpleSkin(skinId, renderer);
	drawableId = renderer.createDrawable("webgl2"); // TODO change to "webgl"
	renderer.updateDrawableSkinId(drawableId, skinId);
	redraw();

	const drawOriginal = renderer.draw;
	renderer.draw = function() {
		if(this.dirty) redraw();
		drawOriginal.call(this);
	}

	function redraw() {
		skin.setContent(canvas);
		runtime.requestRedraw();
	}


	let objectStorage = new Map();
	let objectStorageInv = new Map();
	let objectId = 0;

	function addToStorage(value, ...args) {
		if(!value) return "";
		objectStorage.set(objectId, [value, ...args]);
		objectStorageInv.set(value, objectId);
		return objectId++;
	}

	let definitions = [
		{
			opcode: "resizeCanvas",
			blockType: BlockType.COMMAND,
			text: "resize canvas to width [WIDTH] height [HEIGHT]",
			arguments: {
				WIDTH: {
					type: ArgumentType.NUMBER,
					defaultValue: 480
				},
				HEIGHT: {
					type: ArgumentType.NUMBER,
					defaultValue: 360
				},
			},
			def: function({WIDTH, HEIGHT}) {
				canvas.width = Cast.toNumber(WIDTH);
				canvas.height = Cast.toNumber(HEIGHT);
			}
		},
		{
			opcode: "getConst",
			blockType: BlockType.REPORTER,
			text: "[CONSTANT]",
			disableMonitor: true,
			arguments: {
				CONSTANT: {
					type: ArgumentType.NUMBER,
					menu: "allConsts"
				},
			},
			def: function({CONSTANT}) {
				return CONSTANT;
			}
		},
		"---",
		{
			opcode: "activeTexture",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.activeTexture [TEXTURE]",
			arguments: {
				TEXTURE: {
					type: ArgumentType.NUMBER,
					menu: "textureUnits"
				},
			},
			def: function({TEXTURE}) {
				gl.activeTexture(TEXTURE);
			}
		},
		{
			opcode: "attachShader",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.attachShader [PROGRAM] [SHADER]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY,
				},
				SHADER: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({PROGRAM, SHADER}) {
				const program = objectStorage.get(num(PROGRAM));
				const shader = objectStorage.get(num(SHADER));
				if(!program || program[1] !== "program") return;
				if(!shader || shader[1] !== "shader") return;
				gl.attachShader(program[0], shader[0]);
			}
		},
		{
			opcode: "beginQuery",
			category: Category.QUERIES,
			blockType: BlockType.COMMAND,
			text: "gl.beginQuery [TARGET] [QUERY]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "queryTarget",
					defaultValue: gl.ANY_SAMPLES_PASSED
				},
				QUERY: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({TARGET, QUERY}) {
				const query = objectStorage.get(QUERY);
				if(!query || query[1] !== "query") return;
				gl.beginQuery(TARGET, query[0]);
			}
		},
		{
			opcode: "beginTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.COMMAND,
			text: "gl.beginTransformFeedback [PRIMITIVES]",
			arguments: {
				PRIMITIVES: {
					type: ArgumentType.NUMBER,
					menu: "primitiveTypeMain",
					defaultValue: gl.POINTS
				}
			},
			def: function({PRIMITIVES}) {
				gl.beginTransformFeedback(PRIMITIVES);
			}
		},
/*bindAttribLocation
bindBufferBase
bindBufferRange
bindRenderbuffer
bindSampler*/
		{
			opcode: "bindTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.COMMAND,
			text: "gl.bindTransformFeedback [TARGET] [TRANSFORMFEEDBACK]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "transformFeedbackTarget",
					defaultValue: gl.TRANSFORM_FEEDBACK
				},
				TRANSFORMFEEDBACK: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({TARGET, TRANSFORMFEEDBACK}) {
				let tf = objectStorage.get(TRANSFORMFEEDBACK);
				if(!tf || tf[1] !== "transform feedback") return;
				gl.bindTransformFeedback(TARGET, tf[0]);
			}
		},
		{
			opcode: "bindVertexArray",
			category: Category.VAO,
			blockType: BlockType.COMMAND,
			text: "gl.bindVertexArray [VAO]",
			arguments: {
				VAO: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({VAO}) {
				let vao = objectStorage.get(num(VAO));
				if(!vao || vao[1] !== "vertex array") return;
				gl.bindVertexArray(vao[0]);
			}
		},
		{
			opcode: "blendColor",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.blendColor [RED] [GREEN] [BLUE] [ALPHA]",
			arguments: {
				RED: {
					type: ArgumentType.NUMBER,
				},
				GREEN: {
					type: ArgumentType.NUMBER,
				},
				BLUE: {
					type: ArgumentType.NUMBER,
				},
				ALPHA: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({RED, GREEN, BLUE, ALPHA}) {
				gl.blendColor(RED, GREEN, BLUE, ALPHA);
			}
		},
		{
			opcode: "blendEquation",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.blendEquation [MODE]",
			arguments: {
				MODE: {
					type: ArgumentType.NUMBER,
					menu: "blendEquation",
					defaultValue: gl.FUNC_ADD
				},
			},
			def: function({MODE}) {
				gl.blendEquation(MODE);
			}
		},
		{
			opcode: "blendEquationSeparate",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.blendEquationSeparate [MODERGB] [MODEA]",
			arguments: {
				MODERGB: {
					type: ArgumentType.NUMBER,
					menu: "blendEquation",
					defaultValue: gl.FUNC_ADD
				},
				MODEA: {
					type: ArgumentType.NUMBER,
					menu: "blendEquation",
					defaultValue: gl.FUNC_ADD
				},
			},
			def: function({MODERGB, MODEA}) {
				gl.blendEquationSeparate(MODERGB, MODEA);
			}
		},
		{
			opcode: "blendFunc",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.blendFunc [SRC] [DST]",
			arguments: {
				SRC: {
					type: ArgumentType.NUMBER,
					menu: "blendFunc",
					defaultValue: gl.SRC_ALPHA
				},
				DST: {
					type: ArgumentType.NUMBER,
					menu: "blendFunc",
					defaultValue: gl.ONE_MINUS_SRC_ALPHA
				}
			},
			def: function({SRC, DST}) {
				gl.blendFunc(SRC, DST);
			}
		},
		{
			opcode: "blendFuncSeparate",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.blendFuncSeparate [SRCRGB] [DSTRGB] [SRCA] [DSTA]",
			arguments: {
				SRCRGB: {
					type: ArgumentType.NUMBER,
					menu: "blendFunc",
					defaultValue: gl.SRC_ALPHA
				},
				DSTRGB: {
					type: ArgumentType.NUMBER,
					menu: "blendFunc",
					defaultValue: gl.ONE_MINUS_SRC_ALPHA
				},
				SRCA: {
					type: ArgumentType.NUMBER,
					menu: "blendFunc",
					defaultValue: gl.SRC_ALPHA
				},
				DSTA: {
					type: ArgumentType.NUMBER,
					menu: "blendFunc",
					defaultValue: gl.ONE_MINUS_SRC_ALPHA
				}
			},
			def: function({SRCRGB, DSTRGB, SRCA, DSTA}) {
				gl.blendFuncSeparate(SRCRGB, DSTRGB, SRCA, DSTA);
			}
		},
		{
			opcode: "blitFramebuffer",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.blitFramebuffer [SRCX1] [SRCY1] [SRCX2] [SRCY2] [DSTX1] [DSTY1] [DSTX2] [DSTY2] [MASK] [FILTER]",
			arguments: {
				SRCX1: {
					type: ArgumentType.NUMBER,
				},
				SRCY1: {
					type: ArgumentType.NUMBER,
				},
				SRCX2: {
					type: ArgumentType.NUMBER,
				},
				SRCY2: {
					type: ArgumentType.NUMBER,
				},
				DSTX1: {
					type: ArgumentType.NUMBER,
				},
				DSTY1: {
					type: ArgumentType.NUMBER,
				},
				DSTX2: {
					type: ArgumentType.NUMBER,
				},
				DSTY2: {
					type: ArgumentType.NUMBER,
				},
				MASK: {
					type: ArgumentType.NUMBER,
					menu: "clearBufferBits"
				},
				FILTER: {
					type: ArgumentType.NUMBER,
					menu: "textureFiltering"
				}
			},
			def: function({SRCX1,SRCY1,SRCX2,SRCY2,DSTX1,DSTY1,DSTX2,DSTY2,MASK,FILTER}) {
				gl.blitFramebuffer(SRCX1,SRCY1,SRCX2,SRCY2,DSTX1,DSTY1,DSTX2,DSTY2,MASK,FILTER);
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
		{
			opcode: "bufferData1",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bufferData [TARGET] [USAGE]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				USAGE: {
					type: ArgumentType.NUMBER,
					menu: "bufferUsage"
				},
			},
			def: function({TARGET, USAGE}) {
				gl.bufferData(TARGET, USAGE);
			}
		},
		{
			opcode: "bufferData2",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bufferData [TARGET] [SIZE] [USAGE]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				SIZE: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				USAGE: {
					type: ArgumentType.NUMBER,
					menu: "bufferUsage"
				},
				SRCOFFSET: {
					type: ArgumentType.NUMBER
				},
			},
			def: function({TARGET, SIZE, USAGE}) {
				gl.bufferData(TARGET, SIZE, USAGE, SRCOFFSET);
			}
		},
		{
			opcode: "bufferData3",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bufferData [TARGET] [ARRAYTYPE] [DATA] [USAGE]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				ARRAYTYPE: {
					type: ArgumentType.STRING,
					menu: "typedArrays",
					defaultValue: "Float32Array"
				},
				DATA: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
				USAGE: {
					type: ArgumentType.NUMBER,
					menu: "bufferUsage"
				},
			},
			def: function({TARGET, ARRAYTYPE, DATA, USAGE},{target}) {
				const list = target.lookupVariableByNameAndType(DATA, "list");
				if(!list) return;
				let data = new (TypedArrays[ARRAYTYPE])(list.value.map(Number));
				gl.bufferData(TARGET, data, USAGE);
			}
		},
		{
			opcode: "bufferData4",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bufferData [TARGET] [USAGE] [SRCOFFSET]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				USAGE: {
					type: ArgumentType.NUMBER,
					menu: "bufferUsage"
				},
				SRCOFFSET: {
					type: ArgumentType.NUMBER
				},
			},
			def: function({TARGET, USAGE, SRCOFFSET}) {
				gl.bufferData(TARGET, USAGE, SRCOFFSET);
			}
		},
		{
			opcode: "bufferData5",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bufferData [TARGET] [ARRAYTYPE] [DATA] [USAGE] [SRCOFFSET]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				ARRAYTYPE: {
					type: ArgumentType.STRING,
					menu: "typedArrays",
					defaultValue: "Float32Array"
				},
				DATA: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
				USAGE: {
					type: ArgumentType.NUMBER,
					menu: "bufferUsage"
				},
				SRCOFFSET: {
					type: ArgumentType.NUMBER
				},
			},
			def: function({TARGET, ARRAYTYPE, DATA, USAGE, SRCOFFSET},{target}) {
				const list = target.lookupVariableByNameAndType(DATA, "list");
				if(!list) return;
				let data = new (TypedArrays[ARRAYTYPE])(list.value);
				gl.bufferData(TARGET, data, USAGE, SRCOFFSET);
			}
		},
		{
			opcode: "bufferData6",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bufferData [TARGET] [ARRAYTYPE] [DATA] [USAGE] [SRCOFFSET] [LENGTH]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				ARRAYTYPE: {
					type: ArgumentType.STRING,
					menu: "typedArrays",
					defaultValue: "Float32Array"
				},
				DATA: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
				USAGE: {
					type: ArgumentType.NUMBER,
					menu: "bufferUsage"
				},
				SRCOFFSET: {
					type: ArgumentType.NUMBER
				},
				LENGTH: {
					type: ArgumentType.NUMBER
				},
			},
			def: function({TARGET, ARRAYTYPE, DATA, USAGE, SRCOFFSET, LENGTH},{target}) {
				const list = target.lookupVariableByNameAndType(DATA, "list");
				if(!list) return;
				let data = new (TypedArrays[ARRAYTYPE])(list.value);
				gl.bufferData(TARGET, data, USAGE, SRCOFFSET, LENGTH);
			}
		},
/*bufferSubData
checkFramebufferStatus*/
		{
			opcode: "clientWaitSync",
			category: Category.SYNC,
			blockType: BlockType.REPORTER,
			text: "gl.clientWaitSync [SYNC] [FLAGS] [TIMEOUT]",
			arguments: {
				SYNC: {
					type: ArgumentType.EMPTY
				},
				FLAGS: {
					type: ArgumentType.NUMBER
				},
				TIMEOUT: {
					type: ArgumentType.NUMBER
				},
			},
			def: function({SYNC, FLAGS, TIMEOUT}) {
				let sync = objectStorage.get(num(SYNC));
				if(!sync || sync[1] !== "sync") return;
				return gl.clientWaitSync(sync[0], FLAGS, TIMEOUT);
			}
		},
		{
			opcode: "compileShader",
			category: Category.SHADERS,
			blockType: BlockType.COMMAND,
			text: "gl.compileShader [SHADER]",
			arguments: {
				SHADER: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({SHADER}) {
				let shader = objectStorage.get(num(SHADER));
				if(!shader || shader[1] !== "shader") return;
				gl.compileShader(shader[0]);
			}
		},
/*compressedTexImage2D
compressedTexImage3D
compressedTexSubImage2D
compressedTexSubImage3D
copyBufferSubData
copyTexImage2D
copyTexSubImage2D
copyTexSubImage3D*/
		{
			opcode: "createBuffer",
			category: Category.BUFFERS,
			blockType: BlockType.REPORTER,
			text: "gl.createBuffer",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createBuffer(), "buffer");
			}
		},
		{
			opcode: "createFramebuffer",
			category: Category.FRAMEBUFFERS,
			blockType: BlockType.REPORTER,
			text: "gl.createFramebuffer",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createFramebuffer(), "framebuffer");
			}
		},
		{
			opcode: "createProgram",
			category: Category.PROGRAMS,
			blockType: BlockType.REPORTER,
			text: "gl.createProgram",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createProgram(), "program", {uniforms:{}});
			}
		},
		{
			opcode: "createQuery",
			category: Category.QUERIES,
			blockType: BlockType.REPORTER,
			text: "gl.createQuery",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createQuery(), "query");
			}
		},
		{
			opcode: "createRenderbuffer",
			category: Category.RENDERBUFFERS,
			blockType: BlockType.REPORTER,
			text: "gl.createRenderbuffer",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createRenderbuffer(), "renderbuffer");
			}
		},
		{
			opcode: "createSampler",
			category: Category.SAMPLERS,
			blockType: BlockType.REPORTER,
			text: "gl.createSampler",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createSampler(), "sampler");
			}
		},
		{
			opcode: "createShader",
			category: Category.SHADERS,
			blockType: BlockType.REPORTER,
			text: "gl.createShader [TYPE]",
			arguments: {
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "shaderType"
				},
			},
			def: function({TYPE}) {
				return addToStorage(gl.createShader(TYPE), "shader");
			}
		},
		{
			opcode: "createTexture",
			category: Category.TEXTURES,
			blockType: BlockType.REPORTER,
			text: "gl.createTexture",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createTexture(), "texture");
			}
		},
		{
			opcode: "createTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.REPORTER,
			text: "gl.createTransformFeedback",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createTransformFeedback(), "transform feedback");
			}
		},
		{
			opcode: "createVertexArray",
			category: Category.VAO,
			blockType: BlockType.REPORTER,
			text: "gl.createVertexArray",
			disableMonitor: true,
			def: function() {
				return addToStorage(gl.createVertexArray(), "vertex array");
			}
		},
		{
			opcode: "cullFace",
			blockType: BlockType.COMMAND,
			text: "gl.cullFace [FACE]",
			arguments: {
				FACE: {
					type: ArgumentType.NUMBER,
					menu: "faces",
					defaultValue: gl.BACK
				},
			},
			def: function({FACE}) {
				gl.cullFace(num(FACE));
			}
		},
		{
			opcode: "deleteBuffer",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.deleteBuffer [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(THINGTODELETE);
				if(!thingToDelete || thingToDelete[1] !== "buffer") return;
				gl.deleteBuffer(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteFramebuffer",
			category: Category.FRAMEBUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.deleteFramebuffer [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(THINGTODELETE);
				if(!thingToDelete || thingToDelete[1] !== "framebuffer") return;
				gl.deleteFramebuffer(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteProgram",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.deleteProgram [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "program") return;
				gl.deleteProgram(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteQuery",
			category: Category.QUERIES,
			blockType: BlockType.COMMAND,
			text: "gl.deleteQuery [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "query") return;
				gl.deleteQuery(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteRenderbuffer",
			category: Category.RENDERBUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.deleteRenderbuffer [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "renderbuffer") return;
				gl.deleteRenderbuffer(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteSampler",
			category: Category.SAMPLERS,
			blockType: BlockType.COMMAND,
			text: "gl.deleteSampler [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "sampler") return;
				gl.deleteSampler(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteShader",
			category: Category.SHADERS,
			blockType: BlockType.COMMAND,
			text: "gl.deleteShader [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "shader") return;
				gl.deleteShader(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteSync",
			category: Category.SYNC,
			blockType: BlockType.COMMAND,
			text: "gl.deleteSync [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "sync") return;
				gl.deleteSync(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteTexture",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.deleteTexture [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "texture") return;
				gl.deleteTexture(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.COMMAND,
			text: "gl.deleteTransformFeedback [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "transform feedback") return;
				gl.deleteTransformFeedback(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "deleteVertexArray",
			category: Category.VAO,
			blockType: BlockType.COMMAND,
			text: "gl.deleteVertexArray [THINGTODELETE]",
			arguments: {
				THINGTODELETE: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({THINGTODELETE}) {
				let thingToDelete = objectStorage.get(num(THINGTODELETE));
				if(!thingToDelete || thingToDelete[1] !== "vertex array") return;
				gl.deleteVertexArray(thingToDelete[0]);
				objectStorage.delete(THINGTODELETE);
				objectStorageInv.delete(thingToDelete);
			}
		},
		{
			opcode: "depthFunc",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.depthFunc [FUNC]",
			arguments: {
				FUNC: {
					type: ArgumentType.NUMBER,
					menu: "compareFunc"
				},
			},
			def: function({FUNC}) {
				gl.depthFunc(FUNC);
			}
		},
		{
			opcode: "depthMask",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.depthMask [FLAG]",
			arguments: {
				FLAG: {
					type: ArgumentType.BOOLEAN
				},
			},
			def: function({FLAG}) {
				gl.depthMask(FLAG);
			}
		},
		{
			opcode: "depthRange",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.depthRange [ZNEAR] [ZFAR]",
			arguments: {
				ZNEAR: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				},
				ZFAR: {
					type: ArgumentType.NUMBER,
					defaultValue: 1
				},
			},
			def: function({ZNEAR, ZFAR}) {
				gl.depthRange(ZNEAR, ZFAR);
			}
		},
		{
			opcode: "detachShader",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.detachShader [PROGRAM] [SHADER]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY,
				},
				SHADER: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({PROGRAM, SHADER}) {
				const program = objectStorage.get(num(PROGRAM));
				const shader = objectStorage.get(num(SHADER));
				if(!program || program[1] !== "program") return;
				if(!shader || shader[1] !== "shader") return;
				gl.detachShader(program[0], shader[0]);
			}
		},
		{
			opcode: "disable",
			blockType: BlockType.COMMAND,
			text: "gl.disable [CAPABILITY]",
			arguments: {
				CAPABILITY: {
					type: ArgumentType.NUMBER,
					menu: "capability"
				},
			},
			def: function({CAPABILITY}) {
				gl.disable(CAPABILITY);
			}
		},
		{
			opcode: "drawArraysInstanced",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.drawArraysInstanced [PRIMITIVE] [OFFSET] [COUNT] [INSTANCES]",
			arguments: {
				PRIMITIVE: {
					type: ArgumentType.NUMBER,
					menu: "primitiveType",
					defaultValue: gl.TRIANGLES
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
				COUNT: {
					type: ArgumentType.NUMBER,
				},
				INSTANCES: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
			},
			def: function({PRIMITIVE, OFFSET, COUNT, INSTANCES}) {
				gl.drawArraysInstanced(PRIMITIVE,OFFSET,COUNT,INSTANCES);
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
		{
			opcode: "drawElementsInstanced",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.drawElementsInstanced [PRIMITIVE] [COUNT] [TYPE] [OFFSET] [INSTANCES]",
			arguments: {
				PRIMITIVE: {
					type: ArgumentType.NUMBER,
					menu: "primitiveType",
					defaultValue: gl.TRIANGLES
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
				COUNT: {
					type: ArgumentType.NUMBER,
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "unsignedInts",
					defaultValue: gl.UNSIGNED_SHORT
				},
				INSTANCES: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
			},
			def: function({PRIMITIVE, COUNT, TYPE, OFFSET, INSTANCES}) {
				gl.drawElementsInstanced(PRIMITIVE,COUNT,TYPE,OFFSET,INSTANCES);
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
		{
			opcode: "drawRangeElements",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.drawRangeElements [PRIMITIVE] [START] [END] [COUNT] [TYPE] [OFFSET]",
			arguments: {
				PRIMITIVE: {
					type: ArgumentType.NUMBER,
					menu: "primitiveType",
					defaultValue: gl.TRIANGLES
				},
				START: {
					type: ArgumentType.NUMBER,
				},
				END: {
					type: ArgumentType.NUMBER,
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
				COUNT: {
					type: ArgumentType.NUMBER,
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "unsignedInts",
					defaultValue: gl.UNSIGNED_SHORT
				}
			},
			def: function({PRIMITIVE, START, END, COUNT, TYPE, OFFSET}) {
				gl.drawRangeElements(PRIMITIVE,START,END,COUNT,TYPE,OFFSET);
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
		{
			opcode: "enable",
			blockType: BlockType.COMMAND,
			text: "gl.enable [CAPABILITY]",
			arguments: {
				CAPABILITY: {
					type: ArgumentType.NUMBER,
					menu: "capability"
				},
			},
			def: function({CAPABILITY}) {
				gl.enable(CAPABILITY);
			}
		},
		{
			opcode: "endQuery",
			category: Category.QUERIES,
			blockType: BlockType.COMMAND,
			text: "gl.endQuery [QUERY]",
			arguments: {
				QUERY: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({QUERY}) {
				const query = objectStorage.get(QUERY);
				if(!query || query[1] !== "query") return;
				gl.endQuery(query[0]);
			}
		},
		{
			opcode: "endTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.COMMAND,
			text: "gl.endTransformFeedback",
			def: function() {
				gl.endTransformFeedback();
			}
		},
		{
			opcode: "fenceSync",
			category: Category.SYNC,
			blockType: BlockType.REPORTER,
			text: "gl.fenceSync [CONDITION] [FLAGS]",
			arguments: {
				CONDITION: {
					type: ArgumentType.NUMBER,
					menu: "syncCondition",
					defaultValue: gl.SYNC_GPU_COMMANDS_COMPLETE
				},
				FLAGS: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				}
			},
			def: function({CONDITION, FLAGS}) {
				return addToStorage(gl.fenceSync(CONDITION, FLAGS), "sync");
			}
		},
		{
			opcode: "finish",
			blockType: BlockType.COMMAND,
			text: "gl.finish",
			def: function() {
				gl.finish();
			}
		},
		{
			opcode: "flush",
			blockType: BlockType.COMMAND,
			text: "gl.flush",
			def: function() {
				gl.flush();
			}
		},
/*
framebufferRenderbuffer
framebufferTexture2D
framebufferTextureLayer*/
		{
			opcode: "frontFace",
			blockType: BlockType.COMMAND,
			text: "gl.frontFace [MODE]",
			arguments: {
				MODE: {
					type: ArgumentType.NUMBER,
					menu: "frontFace",
					defaultValue: gl.CCW
				},
			},
			def: function({MODE}) {
				gl.frontFace(MODE);
			}
		},
		{
			opcode: "generateMipmap",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.generateMipmap [TARGET]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "textureTarget",
					defaultValue: gl.TEXTURE_2D
				},
			},
			def: function({TARGET}) {
				gl.generateMipmap(TARGET);
			}
		},
/*getActiveAttrib
getActiveUniform
getActiveUniformBlockName
getActiveUniformBlockParameter
getActiveUniforms*/
		{
			opcode: "getAttachedShaders",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.getAttachedShaders [PROGRAM] [OUTPUT]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				OUTPUT: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				}
			},
			def: function({PROGRAM, OUTPUT}, {target}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				let shaders = gl.getAttachedShaders(program[0]);
				let keys = [];
				objectStorage.forEach((value, key) => {
					if(value[1] === "shader" && shaders.indexOf(value[0]) > -1) keys.push(key)
				});
				const list = target.lookupVariableByNameAndType(OUTPUT, "list");
				if(!list) return;
				list.value = keys;
			}
		},
		{
			opcode: "getAttribLocation",
			category: Category.ATTRIBUTES,
			blockType: BlockType.REPORTER,
			text: "gl.getAttribLocation [PROGRAM] [NAME]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				NAME: {
					type: ArgumentType.STRING,
					defaultValue: "a_position"
				},
			},
			def: function({PROGRAM, NAME}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				return gl.getAttribLocation(program[0], str(NAME));
			}
		},
/*getBufferParameter
getBufferSubData
getContextAttributes*/
		{
			opcode: "getError",
			blockType: BlockType.REPORTER,
			text: "gl.getError",
			disableMonitor: true,
			def: function() {
				return gl.getError();
			}
		},
/*
!!!!!getExtension*/
		{
			opcode: "getFragDataLocation",
			blockType: BlockType.REPORTER,
			text: "gl.getFragDataLocation [PROGRAM] [NAME]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				NAME: {
					type: ArgumentType.STRING
				},
			},
			def: function({PROGRAM, NAME}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				return gl.getFragDataLocation(program[0], NAME);
			}
		},
/*getFramebufferAttachmentParameter
getIndexedParameter
getInternalformatParameter
getParameter*/
		{
			opcode: "getProgramInfoLog",
			category: Category.PROGRAMS,
			blockType: BlockType.REPORTER,
			text: "gl.getProgramInfoLog [PROGRAM]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({PROGRAM}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				return gl.getProgramInfoLog(program[0]);
			}
		},
		{
			opcode: "getProgramParameter",
			category: Category.PROGRAMS,
			blockType: BlockType.REPORTER,
			text: "gl.getProgramParameter [PROGRAM] [PARAM]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				PARAM: {
					type: ArgumentType.NUMBER,
					menu: "programParameter"
				},
			},
			def: function({PROGRAM, PARAM}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				return gl.getProgramParameter(program[0], PARAM);
			}
		},
		{
			opcode: "getQuery",
			category: Category.QUERIES,
			blockType: BlockType.REPORTER,
			text: "gl.getQuery [TARGET] [PNAME]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "queryTarget",
					defaultValue: gl.ANY_SAMPLES_PASSED
				},
				PNAME: {
					type: ArgumentType.NUMBER,
					menu: "queryPname1",
					defaultValue: gl.CURRENT_QUERY
				},
			},
			def: function({TARGET, PNAME}) {
				let qu = gl.getQuery(TARGET, PNAME);
				if(!qu) return "";
				return objectStorageInv.get(qu);
			}
		},
		{
			opcode: "getQueryParameter",
			category: Category.QUERIES,
			blockType: BlockType.REPORTER,
			text: "gl.getQueryParameter [QUERY] [PNAME]",
			arguments: {
				QUERY: {
					type: ArgumentType.EMPTY,
				},
				PNAME: {
					type: ArgumentType.NUMBER,
					menu: "queryPname2",
					defaultValue: gl.QUERY_RESULT
				},
			},
			def: function({QUERY, PNAME}) {
				let query = objectStorage.get(QUERY);
				if(!query || query[1] !== "query") return;
				return gl.getQueryParameter(query[0], PNAME);
			}
		},
/*
getRenderbufferParameter
getSamplerParameter*/
		{
			opcode: "getShaderInfoLog",
			category: Category.SHADERS,
			blockType: BlockType.REPORTER,
			text: "gl.getShaderInfoLog [SHADER]",
			arguments: {
				SHADER: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({SHADER}) {
				let shader = objectStorage.get(num(SHADER));
				if(!shader || shader[1] !== "shader") return;
				return gl.getShaderInfoLog(shader[0]);
			}
		},
		{
			opcode: "getShaderParameter",
			category: Category.SHADERS,
			blockType: BlockType.REPORTER,
			text: "gl.getShaderParameter [SHADER] [PARAM]",
			arguments: {
				SHADER: {
					type: ArgumentType.EMPTY
				},
				PARAM: {
					type: ArgumentType.NUMBER,
					menu: "shaderParameter"
				},
			},
			def: function({SHADER, PARAM}) {
				let shader = objectStorage.get(num(SHADER));
				if(!shader || shader[1] !== "shader") return;
				return gl.getShaderParameter(shader[0], PARAM);
			}
		},
		{
			opcode: "getShaderPrecisionFormat",
			category: Category.SHADERS,
			blockType: BlockType.REPORTER,
			text: "gl.getShaderPrecisionFormat [SHADERTYPE] [PRECTYPE] . [COMPONENT]",
			arguments: {
				SHADERTYPE: {
					type: ArgumentType.NUMBER,
					menu: "shaderType"
				},
				PRECTYPE: {
					type: ArgumentType.NUMBER,
					menu: "shaderPrecisionType"
				},
				COMPONENT: {
					type: ArgumentType.STRING,
					menu: "shaderPrecisionComponent"
				},
			},
			def: function({SHADERTYPE, PRECTYPE, COMPONENT}) {
				let data = gl.getShaderPrecisionFormat(SHADERTYPE, PRECTYPE);
				if(!data) return "";
				if(COMPONENT == "rangeMin") return data.rangeMin;
				if(COMPONENT == "rangeMax") return data.rangeMax;
				if(COMPONENT == "precision") return data.precision;
				return "";
			}
		},
		{
			opcode: "getShaderSource",
			category: Category.SHADERS,
			blockType: BlockType.REPORTER,
			text: "gl.getShaderSource [SHADER]",
			arguments: {
				SHADER: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({SHADER}) {
				let shader = objectStorage.get(num(SHADER));
				if(!shader || shader[1] !== "shader") return;
				return gl.getShaderSource(shader[0]);
			}
		},
/*!!!!!getSupportedExtensions*/
		{
			opcode: "getSyncParameter",
			category: Category.SYNC,
			blockType: BlockType.REPORTER,
			text: "gl.getSyncParameter [SYNC] [PARAM]",
			arguments: {
				SYNC: {
					type: ArgumentType.EMPTY
				},
				PARAM: {
					type: ArgumentType.NUMBER,
					menu: "syncParameter",
					defaultValue: gl.SYNC_STATUS
				},
			},
			def: function({SYNC, PARAM}) {
				let sync = objectStorage.get(num(SYNC));
				if(!sync || sync[1] !== "sync") return;
				return gl.getSyncParameter(sync[0], PARAM);
			}
		},
/*
getTexParameter*/

		{
			opcode: "getTransformFeedbackVarying",
			category: Category.PROGRAMS,
			blockType: BlockType.REPORTER,
			text: "gl.getTransformFeedbackVarying [PROGRAM] [INDEX].[PROP]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				PROP: {
					type: ArgumentType.STRING,
					menu: "activeInfo",
					defaultValue: "name"
				}
			},
			def: function({PROGRAM, INDEX, PROP}) {
				let program = objectStorage.get(PROGRAM);
				if(!program || program[1] !== "program") return;
				return gl.getTransformFeedbackVarying(program[0], INDEX)[PROP] || "";
			}
		},
/*getUniform
getUniformBlockIndex
getUniformIndices*/

		{
			opcode: "getUniformLocation",
			category: Category.UNIFORMS,
			blockType: BlockType.REPORTER,
			text: "gl.getUniformLocation [PROGRAM] [NAME]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				NAME: {
					type: ArgumentType.STRING,
					defaultValue: "u_resolution"
				},
			},
			def: function({PROGRAM, NAME}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				if(program[2].uniforms[str(NAME)]) return program[2].uniforms[str(NAME)];
				let res = addToStorage(gl.getUniformLocation(program[0], str(NAME)), "uniform location");
				if(res) program[2].uniforms[str(NAME)] = res;
				return res;
			}
		},
/*getVertexAttrib
getVertexAttribOffset*/
		{
			opcode: "hint",
			blockType: BlockType.COMMAND,
			text: "gl.hint [TARGET] [MODE]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "hintTarget",
					defaultValue: gl.FRAGMENT_SHADER_DERIVATIVE_HINT
				},
				MODE: {
					type: ArgumentType.NUMBER,
					menu: "hintMode",
					defaultValue: gl.DONT_CARE
				},
			},
			def: function({TARGET, MODE}) {
				gl.hint(TARGET, MODE);
			}
		},
		{
			opcode: "invalidateFramebuffer",
			blockType: BlockType.COMMAND,
			text: "gl.invalidateFramebuffer [TARGET] [ATTACHMENTS]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "framebufferTarget",
					defaultValue: gl.FRAGMENT_SHADER_DERIVATIVE_HINT
				},
				ATTACHMENTS: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
			},
			def: function({TARGET, ATTACHMENTS}, {target}) {
				const list = target.lookupVariableByNameAndType(ATTACHMENTS, "list");
				if(!list) return;
				gl.invalidateFramebuffer(TARGET, list.value);
			}
		},
		{
			opcode: "invalidateSubFramebuffer",
			blockType: BlockType.COMMAND,
			text: "gl.invalidateSubFramebuffer [TARGET] [ATTACHMENTS] [X] [Y] [WIDTH] [HEIGHT]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "framebufferTarget",
					defaultValue: gl.FRAGMENT_SHADER_DERIVATIVE_HINT
				},
				ATTACHMENTS: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
				X: {
					type: ArgumentType.NUMBER
				},
				Y: {
					type: ArgumentType.NUMBER
				},
				WIDTH: {
					type: ArgumentType.NUMBER
				},
				HEIGHT: {
					type: ArgumentType.NUMBER
				}
			},
			def: function({TARGET, ATTACHMENTS, X, Y, WIDTH, HEIGHT}, {target}) {
				const list = target.lookupVariableByNameAndType(ATTACHMENTS, "list");
				if(!list) return;
				gl.invalidateSubFramebuffer(TARGET, list.value, X, Y, WIDTH, HEIGHT);
			}
		},
/*
isBuffer*/
		{
			opcode: "isContextLost",
			blockType: BlockType.BOOLEAN,
			text: "gl.isContextLost",
			def: function() {
				return gl.isContextLost();
			}
		},
		{
			opcode: "isEnabled",
			blockType: BlockType.BOOLEAN,
			text: "gl.isEnabled [CAPABILITY]",
			arguments: {
				CAPABILITY: {
					type: ArgumentType.NUMBER,
					menu: "capability"
				},
			},
			def: function({CAPABILITY}) {
				return gl.isEnabled(CAPABILITY);
			}
		},
/*isFramebuffer
isProgram
isQuery
isRenderbuffer
isSampler
isShader
isSync
isTexture
isTransformFeedback
isVertexArray*/
		{
			opcode: "lineWidth",
			blockType: BlockType.COMMAND,
			text: "gl.lineWidth [WIDTH]",
			arguments: {
				WIDTH: {
					type: ArgumentType.NUMBER,
					defaultValue: 1
				},
			},
			def: function({WIDTH}) {
				gl.lineWidth(WIDTH);
			}
		},
		{
			opcode: "linkProgram",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.linkProgram [PROGRAM]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({PROGRAM}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				gl.linkProgram(program[0]);
			}
		},
		{
			opcode: "pauseTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.COMMAND,
			text: "gl.pauseTransformFeedback",
			def: function() {
				gl.pauseTransformFeedback();
			}
		},
		{
			opcode: "pixelStorei",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.pixelStorei [PNAME] [PARAM]",
			arguments: {
				PNAME: {
					type: ArgumentType.NUMBER,
					menu: "pixelstorei",
					defaultVlaue: gl.PACK_ALIGNMENT
				},
				PARAM: {
					type: ArgumentType.NUMBER
				}
			},
			def: function({PNAME, PARAM}) {
				gl.pixelStorei(PNAME, PARAM);
			}
		},
		{
			opcode: "polygonOffset",
			blockType: BlockType.COMMAND,
			text: "gl.polygonOffset [FACTOR] [UNITS]",
			arguments: {
				FACTOR: {
					type: ArgumentType.NUMBER
				},
				UNITS: {
					type: ArgumentType.NUMBER
				},
			},
			def: function({FACTOR, UNITS}) {
				gl.polygonOffset(FACTOR, UNITS);
			}
		},

/*readBuffer
readPixels
renderbufferStorage
renderbufferStorageMultisample*/
		{
			opcode: "resumeTransformFeedback",
			category: Category.TRANSFORMFEEDBACK,
			blockType: BlockType.COMMAND,
			text: "gl.resumeTransformFeedback",
			def: function() {
				gl.resumeTransformFeedback();
			}
		},
		{
			opcode: "sampleCoverage",
			blockType: BlockType.COMMAND,
			text: "gl.sampleCoverage [VALUE] [INVERT]",
			arguments: {
				VALUE: {
					type: ArgumentType.NUMBER
				},
				INVERT: {
					type: ArgumentType.BOOLEAN
				},
			},
			def: function({VALUE, INVERT}) {
				gl.sampleCoverage(VALUE, INVERT);
			}
		},
/*samplerParameterf
samplerParameteri*/
		{
			opcode: "shaderSource",
			category: Category.SHADERS,
			blockType: BlockType.COMMAND,
			text: "gl.shaderSource [SHADER] [SOURCE]",
			arguments: {
				SHADER: {
					type: ArgumentType.EMPTY
				},
				SOURCE: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
			},
			def: function({SHADER, SOURCE},{target}) {
				const list = target.lookupVariableByNameAndType(SOURCE, "list")
				if(!list) return;
				let shader = objectStorage.get(num(SHADER));
				if(!shader || shader[1] !== "shader") return;
				gl.shaderSource(shader[0], list.value.join("\n"));
			}
		},
		{
			opcode: "stencilFunc",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.stencilFunc [FUNC] [REF] [FLAG]",
			arguments: {
				FUNC: {
					type: ArgumentType.NUMBER,
					menu: "compareFunc"
				},
				REF: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				},
				FLAG: {
					type: ArgumentType.NUMBER,
					defaultValue: 1
				}
			},
			def: function({FUNC, REF, FLAG}) {
				gl.stencilFunc(FUNC, REF, FLAG);
			}
		},
		{
			opcode: "stencilFuncSeparate",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.stencilFuncSeparate [FACE] [FUNC] [REF] [FLAG]",
			arguments: {
				FACE: {
					type: ArgumentType.NUMBER,
					menu: "faces"
				},
				FUNC: {
					type: ArgumentType.NUMBER,
					menu: "compareFunc"
				},
				REF: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				},
				FLAG: {
					type: ArgumentType.NUMBER,
					defaultValue: 1
				}
			},
			def: function({FACE, FUNC, REF, FLAG}) {
				gl.stencilFuncSeparate(FACE, FUNC, REF, FLAG);
			}
		},
		{
			opcode: "stencilMask",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.stencilMask [MASK]",
			arguments: {
				MASK: {
					type: ArgumentType.NUMBER,
					defaultvalue: "0b11111111"
				},
			},
			def: function({MASK}) {
				gl.stencilMask(num(MASK));
			}
		},
		{
			opcode: "stencilMaskSeparate",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.stencilMaskSeparate [FACE] [MASK]",
			arguments: {
				FACE: {
					type: ArgumentType.NUMBER,
					menu: "faces"
				},
				MASK: {
					type: ArgumentType.NUMBER,
					defaultvalue: "0b11111111"
				},
			},
			def: function({FACE, MASK}) {
				gl.stencilMaskSeparate(FACE, MASK);
			}
		},
		{
			opcode: "stencilOp",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.stencilOp [SFAIL] [ZFAIL] [PASS]",
			arguments: {
				SFAIL: {
					type: ArgumentType.NUMBER,
					menu: "stencilOp",
					defaultValue: gl.KEEP
				},
				ZFAIL: {
					type: ArgumentType.NUMBER,
					menu: "stencilOp",
					defaultValue: gl.KEEP
				},
				PASS: {
					type: ArgumentType.NUMBER,
					menu: "stencilOp",
					defaultValue: gl.KEEP
				},
			},
			def: function({SFAIL, ZFAIL, PASS}) {
				gl.stencilOp(SFAIL, ZFAIL, PASS);
			}
		},
		{
			opcode: "stencilOpSeparate",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.stencilOpSeparate [SFAIL] [ZFAIL] [PASS]",
			arguments: {
				FACE: {
					type: ArgumentType.NUMBER,
					menu: "faces"
				},
				SFAIL: {
					type: ArgumentType.NUMBER,
					menu: "stencilOp",
					defaultValue: gl.KEEP
				},
				ZFAIL: {
					type: ArgumentType.NUMBER,
					menu: "stencilOp",
					defaultValue: gl.KEEP
				},
				PASS: {
					type: ArgumentType.NUMBER,
					menu: "stencilOp",
					defaultValue: gl.KEEP
				},
			},
			def: function({FACE, SFAIL, ZFAIL, PASS}) {
				gl.stencilOp(FACE, SFAIL, ZFAIL, PASS);
			}
		},
		{
			opcode: "texImage2D1",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.texImage2D [TARGET] [LEVEL] [INTERNALFORMAT] [WIDTH] [HEIGHT] [BORDER] [FORMAT] [TYPE]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "textureTarget2"
				},
				LEVEL: {
					type: ArgumentType.NUMBER
				},
				INTERNALFORMAT: {
					type: ArgumentType.NUMBER,
					menu: "internalFormat",
					defaultValue: gl.RGBA
				},
				WIDTH: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				HEIGHT: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				BORDER: {
					type: ArgumentType.NUMBER,
				},
				FORMAT: {
					type: ArgumentType.NUMBER,
					menu: "format",
					defaultValue: gl.RGBA
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "textureDataType",
					defaultValue: gl.UNSIGNED_BYTE
				},
			},
			def: function({TARGET, LEVEL, INTERNALFORMAT, WIDTH, HEIGHT, BORDER, FORMAT, TYPE}) {
				gl.texImage2D(TARGET, LEVEL, INTERNALFORMAT, WIDTH, HEIGHT, BORDER, FORMAT, TYPE);
			}
		},
		{
			opcode: "texImage2D2",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.texImage2D [TARGET] [LEVEL] [INTERNALFORMAT] [COSTUME]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "textureTarget2"
				},
				LEVEL: {
					type: ArgumentType.NUMBER
				},
				INTERNALFORMAT: {
					type: ArgumentType.NUMBER,
					menu: "internalFormat",
					defaultValue: gl.RGBA
				},
				COSTUME: {
					type: ArgumentType.STRING,
					menu: "costumes"
				},
			},
			def: function({TARGET, LEVEL, INTERNALFORMAT, COSTUME},{target}) {
				const costume = COSTUME.toLowerCase() === "current" ? target.getCurrentCostume() : target.getCostumes()[target.getCostumeIndexByName(COSTUME)];
				if(!costume) return;
				const skin = renderer._allSkins[costume.skinId];
				if(!skin._textureSize) return; // Not bitmap
				const texture = skin.getTexture();
				const width = skin._textureSize[0];
				const height = skin._textureSize[1];
				const rgl = renderer.gl;
				const fb = rgl.createFramebuffer();
				rgl.bindFramebuffer(rgl.FRAMEBUFFER, fb);
				rgl.framebufferTexture2D(rgl.FRAMEBUFFER, rgl.COLOR_ATTACHMENT0, rgl.TEXTURE_2D, texture, 0);
				if(rgl.checkFramebufferStatus(rgl.FRAMEBUFFER) !== rgl.FRAMEBUFFER_COMPLETE) return;
				const pixels = new Uint8Array(width * height * 4);
				rgl.readPixels(0, 0, width, height, rgl.RGBA, rgl.UNSIGNED_BYTE, pixels);
				console.log(pixels);
				rgl.bindFramebuffer(rgl.FRAMEBUFFER, null);
				rgl.deleteFramebuffer(fb);
				gl.texImage2D(TARGET, LEVEL, INTERNALFORMAT, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			}
		},
		{
			opcode: "texImage2D4",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.texImage2D [TARGET] [LEVEL] [INTERNALFORMAT] [WIDTH] [HEIGHT] [BORDER] [FORMAT] [TYPE] [PBOOFFSET]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "textureTarget2"
				},
				LEVEL: {
					type: ArgumentType.NUMBER
				},
				INTERNALFORMAT: {
					type: ArgumentType.NUMBER,
					menu: "internalFormat",
					defaultValue: gl.RGBA
				},
				WIDTH: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				HEIGHT: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				BORDER: {
					type: ArgumentType.NUMBER,
				},
				FORMAT: {
					type: ArgumentType.NUMBER,
					menu: "format",
					defaultValue: gl.RGBA
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "textureDataType",
					defaultValue: gl.UNSIGNED_BYTE
				},
				PBOOFFSET: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				},
			},
			def: function({TARGET, LEVEL, INTERNALFORMAT, WIDTH, HEIGHT, BORDER, FORMAT, TYPE, PBOOFFSET},{target}) {
				gl.texImage2D(TARGET, LEVEL, INTERNALFORMAT, WIDTH, HEIGHT, BORDER, FORMAT, TYPE, PBOOFFSET);
			}
		},
		{
			opcode: "texImage2D5",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.texImage2D [TARGET] [LEVEL] [INTERNALFORMAT] [WIDTH] [HEIGHT] [BORDER] [FORMAT] [TYPE] [ARRAY] [OFFSET]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "textureTarget2"
				},
				LEVEL: {
					type: ArgumentType.NUMBER
				},
				INTERNALFORMAT: {
					type: ArgumentType.NUMBER,
					menu: "internalFormat",
					defaultValue: gl.RGBA
				},
				WIDTH: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				HEIGHT: {
					type: ArgumentType.NUMBER,
					defaultValue: 10
				},
				BORDER: {
					type: ArgumentType.NUMBER,
				},
				FORMAT: {
					type: ArgumentType.NUMBER,
					menu: "format",
					defaultValue: gl.RGBA
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "textureDataType",
					defaultValue: gl.UNSIGNED_BYTE
				},
				ARRAY: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: "my list"
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({TARGET, LEVEL, INTERNALFORMAT, WIDTH, HEIGHT, BORDER, FORMAT, TYPE, ARRAY, OFFSET},{target}) {
				const list = target.lookupVariableByNameAndType(ARRAY, "list");
				console.log("list", list, ARRAY);
				if(!list) return;
				let array = new (gl2typed[num(TYPE)])(list.value);
				gl.texImage2D(num(TARGET), num(LEVEL), num(INTERNALFORMAT), num(WIDTH), num(HEIGHT), num(BORDER), num(FORMAT), num(TYPE), array, num(OFFSET));
			}
		},
//texImage2D(target, level, internalformat, width, height, border, format, type);
//texImage2D(target, level, internalformat, width, height, border, format, type, TexImageSource source);
//texImage2D(target, level, internalformat,                        format, type, TexImageSource source); // May throw DOMException
//texImage2D(target, level, internalformat, width, height, border, format, type, GLintptr pboOffset);
//texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView srcData, srcOffset);

//texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
//texImage2D(target, level, internalformat,                        format, type, TexImageSource source); // May throw DOMException
//texImage2D(target, level, internalformat, width, height, border, format, type, GLintptr pboOffset);
//texImage2D(target, level, internalformat, width, height, border, format, type, TexImageSource source); // May throw DOMException
//texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView srcData, srcOffset);

/*
texImage2D
texImage3D*/
		{
			opcode: "texParameterf",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.texParameterf [TARGET] [PNAME] [PARAM]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "texParamTarget",
					defaultValue: gl.TEXTURE_2D
				},
				PNAME: {
					type: ArgumentType.NUMBER,
					menu: "texParamPnameF",
					defaultValue: gl.TEXTURE_MAX_LOD
				},
				PARAM: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				}
			},
			def: function({TARGET,PNAME,PARAM}) {
				gl.texParameterf(num(TARGET),num(PNAME),num(PARAM));
			}
		},
		{
			opcode: "texParameteri",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.texParameteri [TARGET] [PNAME] [PARAM]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "texParamTarget",
					defaultValue: gl.TEXTURE_2D
				},
				PNAME: {
					type: ArgumentType.NUMBER,
					menu: "texParamPnameI",
					defaultValue: gl.TEXTURE_MAG_FILTER
				},
				PARAM: {
					type: ArgumentType.NUMBER,
					defaultValue: 0
				}
			},
			def: function({TARGET,PNAME,PARAM}) {
				gl.texParameteri(num(TARGET),num(PNAME),num(PARAM));
			}
		},
/*
texStorage2D
texStorage3D
texSubImage2D
texSubImage3D*/
		{
			opcode: "transformFeedbackVaryings",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.transformFeedbackVaryings [PROGRAM] [VARYINGS] [BUFFERMODE]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
				VARYINGS: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
				BUFFERMODE: {
					type: ArgumentType.STRING,
					menu: "bufferMode",
					defaultValue: gl.SEPARATE_ATTRIBS
				}
			},
			def: function({PROGRAM, VARYINGS, BUFFERMODE}) {
				let program = objectStorage.get(PROGRAM);
				if(!program || program[1] !== "program") return;

				const list = target.lookupVariableByNameAndType(VARYINGS, "list");
				if(!list) return;
				gl.transformFeedbackVaryings(program[0], list, BUFFERMODE);
			}
		},
/*uniformBlockBinding*/
		{
			opcode: "useProgram",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.useProgram [PROGRAM]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY
				},
			},
			def: function({PROGRAM}) {
				let program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				gl.useProgram(program[0]);
			}
		},
		{
			opcode: "validateProgram",
			category: Category.PROGRAMS,
			blockType: BlockType.COMMAND,
			text: "gl.validateProgram [PROGRAM]",
			arguments: {
				PROGRAM: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({PROGRAM, SHADER}) {
				const program = objectStorage.get(num(PROGRAM));
				if(!program || program[1] !== "program") return;
				gl.validateProgram(program[0]);
			}
		},
/*vertexAttribDivisor
vertexAttribIPointer*/
		{
			opcode: "waitSync",
			category: Category.SYNC,
			blockType: BlockType.REPORTER,
			text: "gl.waitSync [SYNC] [FLAGS] [TIMEOUT]",
			arguments: {
				SYNC: {
					type: ArgumentType.EMPTY
				},
				FLAGS: {
					type: ArgumentType.NUMBER
				},
				TIMEOUT: {
					type: ArgumentType.NUMBER,
					defaultValue: -1
				},
			},
			def: function({SYNC, FLAGS, TIMEOUT}) {
				let sync = objectStorage.get(num(SYNC));
				if(!sync || sync[1] !== "sync") return;
				return gl.waitSync(sync[0], num(FLAGS), num(TIMEOUT));
			}
		},
		{
			opcode: "bindBuffer",
			category: Category.BUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bindBuffer [TARGET] [BUFFER]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "bufferTarget"
				},
				BUFFER: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({TARGET, BUFFER}) {
				let buffer = objectStorage.get(num(BUFFER));
				if(!buffer || buffer[1] !== "buffer") return;
				gl.bindBuffer(TARGET, buffer[0]);
			}
		},
		{
			opcode: "bindFramebuffer",
			category: Category.FRAMEBUFFERS,
			blockType: BlockType.COMMAND,
			text: "gl.bindFramebuffer [TARGET] [FRAMEBUFFER]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "framebufferTarget"
				},
				FRAMEBUFFER: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({TARGET, BUFFER}) {
				let framebuffer = objectStorage.get(num(FRAMEBUFFER));
				if(!framebuffer || framebuffer[1] !== "framebuffer") return;
				gl.bindFramebuffer(TARGET, framebuffer[0]);
			}
		},
		{
			opcode: "bindTexture",
			category: Category.TEXTURES,
			blockType: BlockType.COMMAND,
			text: "gl.bindTexture [TARGET] [TEXTURE]",
			arguments: {
				TARGET: {
					type: ArgumentType.NUMBER,
					menu: "textureTarget"
				},
				TEXTURE: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({TARGET, TEXTURE}) {
				let texture = objectStorage.get(num(TEXTURE));
				if(!texture || texture[1] !== "texture") return;
				gl.bindTexture(TARGET, texture[0]);
			}
		},
		{
			opcode: "clear",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.clear [BITS]",
			arguments: {
				BITS: {
					type: ArgumentType.NUMBER,
					menu: "clearBufferBits"
				},
			},
			def: function({BITS}) {
				gl.clear(BITS);
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
/*clearBufferfi
clearBufferfv
clearBufferiv
clearBufferuiv*/
		{
			opcode: "clearColor",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.clearColor [RED] [GREEN] [BLUE] [ALPHA]",
			arguments: {
				RED: {
					type: ArgumentType.NUMBER,
					defaultValue: 0,
				},
				GREEN: {
					type: ArgumentType.NUMBER,
					defaultValue: 0,
				},
				BLUE: {
					type: ArgumentType.NUMBER,
					defaultValue: 0,
				},
				ALPHA: {
					type: ArgumentType.NUMBER,
					defaultValue: 1,
				},
			},
			def: function({RED, GREEN, BLUE, ALPHA}) {
				gl.clearColor(num(RED), num(GREEN), num(BLUE), num(ALPHA));
			}
		},
		{
			opcode: "clearDepth",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.clearDepth [DEPTH]",
			arguments: {
				DEPTH: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({DEPTH}) {
				gl.clearDepth(num(DEPTH));
			}
		},
		{
			opcode: "clearStencil",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.clearStencil [INDEX]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX}) {
				gl.clearStencil(num(INDEX));
			}
		},
		{
			opcode: "colorMask",
			category: Category.WRITEOPTIONS,
			blockType: BlockType.COMMAND,
			text: "gl.colorMask [RED] [GREEN] [BLUE] [ALPHA]",
			arguments: {
				RED: {
					type: ArgumentType.BOOLEAN,
				},
				GREEN: {
					type: ArgumentType.BOOLEAN,
				},
				BLUE: {
					type: ArgumentType.BOOLEAN,
				},
				ALPHA: {
					type: ArgumentType.BOOLEAN,
				},
			},
			def: function({RED, GREEN, BLUE, ALPHA}) {
				gl.colorMask(bool(RED), bool(GREEN), bool(BLUE), bool(ALPHA));
			}
		},
		{
			opcode: "disableVertexAttribArray",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.disableVertexAttribArray [LOCATION]",
			arguments: {
				LOCATION: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({LOCATION}) {
				gl.disableVertexAttribArray(num(LOCATION));
			}
		},
		{
			opcode: "drawArrays",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.drawArrays [PRIMITIVE] [OFFSET] [COUNT]",
			arguments: {
				PRIMITIVE: {
					type: ArgumentType.NUMBER,
					menu: "primitiveType",
					defaultValue: gl.TRIANGLES
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
				COUNT: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({PRIMITIVE, OFFSET, COUNT}) {
				gl.drawArrays(num(PRIMITIVE),num(OFFSET),num(COUNT));
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
/* drawBuffers */
/* HOW TO PASS LIST OF FEW SPECIFIC VALUES??? */
		{
			opcode: "drawElements",
			category: Category.RENDERING,
			blockType: BlockType.COMMAND,
			text: "gl.drawElements [PRIMITIVE] [COUNT] [TYPE] [OFFSET]",
			arguments: {
				PRIMITIVE: {
					type: ArgumentType.NUMBER,
					menu: "primitiveType",
					defaultValue: gl.TRIANGLES
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
				COUNT: {
					type: ArgumentType.NUMBER,
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "unsignedInts",
					defaultValue: gl.UNSIGNED_SHORT
				}
			},
			def: function({PRIMITIVE, COUNT, TYPE, OFFSET}) {
				gl.drawElements(num(PRIMITIVE),num(COUNT),num(TYPE),num(OFFSET));
				renderer.dirty = true;   //TODO: only if canvas (framebuffer is null)
				runtime.requestRedraw(); //TODO
			}
		},
		{
			opcode: "enableVertexAttribArray",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.enableVertexAttribArray [LOCATION]",
			arguments: {
				LOCATION: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({LOCATION}) {
				gl.enableVertexAttribArray(num(LOCATION));
			}
		},
		{
			opcode: "scissor",
			blockType: BlockType.COMMAND,
			text: "gl.scissor [X] [Y] [WIDTH] [HEIGHT]",
			arguments: {
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				WIDTH: {
					type: ArgumentType.NUMBER,
				},
				HEIGHT: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({X,Y,WIDTH,HEIGHT}) {
				gl.scissor(num(X),num(Y),num(WIDTH),num(HEIGHT));
			}
		},
		{
			opcode: "uniform1",
			category: Category.UNIFORMS,
			blockType: BlockType.COMMAND,
			text: "gl.uniform1[UNIFORM] [LOCATION] [X]",
			arguments: {
				X: {
					type: ArgumentType.NUMBER,
				},
				UNIFORM: {
					type: ArgumentType.STRING,
					menu: "uniform",
					defaultValue: "f"
				},
				LOCATION: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({X,Y,Z,W,UNIFORM,LOCATION}) {
				let location = objectStorage.get(num(LOCATION));
				if(!location || location[1] !== "uniform location") return;
				gl["uniform1"+UNIFORM](location[0], num(X));
			}
		},
		{
			opcode: "uniform2",
			category: Category.UNIFORMS,
			blockType: BlockType.COMMAND,
			text: "gl.uniform2[UNIFORM] [LOCATION] [X] [Y]",
			arguments: {
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				UNIFORM: {
					type: ArgumentType.STRING,
					menu: "uniform",
					defaultValue: "f"
				},
				LOCATION: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({X,Y,Z,W,UNIFORM,LOCATION}) {
				let location = objectStorage.get(num(LOCATION));
				if(!location || location[1] !== "uniform location") return;
				gl["uniform2"+UNIFORM](location[0], num(X), num(Y));
			}
		},
		{
			opcode: "uniform3",
			category: Category.UNIFORMS,
			blockType: BlockType.COMMAND,
			text: "gl.uniform3[UNIFORM] [LOCATION] [X] [Y] [Z]",
			arguments: {
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				Z: {
					type: ArgumentType.NUMBER,
				},
				UNIFORM: {
					type: ArgumentType.STRING,
					menu: "uniform",
					defaultValue: "f"
				},
				LOCATION: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({X,Y,Z,W,UNIFORM,LOCATION}) {
				let location = objectStorage.get(num(LOCATION));
				if(!location || location[1] !== "uniform location") return;
				gl["uniform3"+UNIFORM](location[0], num(X), num(Y), num(Z));
			}
		},
		{
			opcode: "uniform4",
			category: Category.UNIFORMS,
			blockType: BlockType.COMMAND,
			text: "gl.uniform4[UNIFORM] [LOCATION] [X] [Y] [Z] [W]",
			arguments: {
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				Z: {
					type: ArgumentType.NUMBER,
				},
				W: {
					type: ArgumentType.NUMBER,
				},
				UNIFORM: {
					type: ArgumentType.STRING,
					menu: "uniform",
					defaultValue: "f"
				},
				LOCATION: {
					type: ArgumentType.EMPTY,
				},
			},
			def: function({X,Y,Z,W,UNIFORM,LOCATION}) {
				let location = objectStorage.get(num(LOCATION));
				if(!location || location[1] !== "uniform location") return;
				gl["uniform4"+UNIFORM](location[0], num(X), num(Y), num(Z), num(W));
			}
		},
		{
			opcode: "uniformMatrixfv",
			category: Category.UNIFORMS,
			blockType: BlockType.COMMAND,
			text: "gl.uniformMatrix[SIZE]fv [LOCATION] [TRANSPOSE] [DATA]",
			arguments: {
				SIZE: {
					type: ArgumentType.STRING,
					menu: "uniformMatrix",
					defaultValue: "4"
				},
				LOCATION: {
					type: ArgumentType.EMPTY,
				},
				TRANSPOSE: {
					type: ArgumentType.BOOLEAN
				},
				DATA: {
					type: ArgumentType.STRING,
					menu: "lists",
					defaultValue: ""
				},
			},
			def: function({SIZE, LOCATION, TRANSPOSE, DATA}) {
				let location = objectStorage.get(num(LOCATION));
				if(!location || location[1] !== "uniform location") return;
				const list = target.lookupVariableByNameAndType(DATA, "list")
				if(!list) return;
				gl["uniformMatrix"+SIZE+"fv"](location[0], TRANSPOSE, list.value);
			}
		},
		{
			opcode: "vertexAttrib1f",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttrib1f [INDEX] [X]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				X: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX,X}) {
				gl.vertexAttrib1f(INDEX, X);
			}
		},
		{
			opcode: "vertexAttrib2f",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttrib2f [INDEX] [X] [Y]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX,X,Y}) {
				gl.vertexAttrib2f(INDEX, X, Y);
			}
		},
		{
			opcode: "vertexAttrib3f",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttrib3f [INDEX] [X] [Y] [Z]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				Z: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX,X,Y,Z}) {
				gl.vertexAttrib3f(INDEX, X, Y, Z);
			}
		},
		{
			opcode: "vertexAttrib4f",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttrib4f [INDEX] [X] [Y] [Z] [W]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				Z: {
					type: ArgumentType.NUMBER,
				},
				W: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX,X,Y,Z,W}) {
				gl.vertexAttrib4f(INDEX, X, Y, Z, W);
			}
		},
		{
			opcode: "vertexAttribI4i",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttribI4i [INDEX] [X] [Y] [Z] [W]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				Z: {
					type: ArgumentType.NUMBER,
				},
				W: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX,X,Y,Z,W}) {
				gl.vertexAttribI4i(INDEX, X, Y, Z, W);
			}
		},
		{
			opcode: "vertexAttribI4ui",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttribI4ui [INDEX] [X] [Y] [Z] [W]",
			arguments: {
				INDEX: {
					type: ArgumentType.NUMBER,
				},
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				Z: {
					type: ArgumentType.NUMBER,
				},
				W: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({INDEX,X,Y,Z,W}) {
				gl.vertexAttribI4ui(INDEX, X, Y, Z, W);
			}
		},
		{
			opcode: "vertexAttribPointer",
			category: Category.ATTRIBUTES,
			blockType: BlockType.COMMAND,
			text: "gl.vertexAttribPointer [LOCATION] [SIZE] [TYPE] [NORMALIZED] [STRIDE] [OFFSET]",
			arguments: {
				LOCATION: {
					type: ArgumentType.NUMBER,
				},
				SIZE: {
					type: ArgumentType.NUMBER,
					defaultvalue: 2
				},
				TYPE: {
					type: ArgumentType.NUMBER,
					menu: "dataType",
					defaultValue: gl.FLOAT
				},
				NORMALIZED: {
					type: ArgumentType.BOOLEAN,
				},
				STRIDE: {
					type: ArgumentType.NUMBER,
				},
				OFFSET: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({LOCATION,SIZE,TYPE,NORMALIZED,STRIDE,OFFSET}) {
				gl.vertexAttribPointer(num(LOCATION),num(SIZE),num(TYPE),bool(NORMALIZED),num(STRIDE),num(OFFSET));
			}
		},
		{
			opcode: "viewport",
			blockType: BlockType.COMMAND,
			text: "gl.viewport [X] [Y] [WIDTH] [HEIGHT]",
			arguments: {
				X: {
					type: ArgumentType.NUMBER,
				},
				Y: {
					type: ArgumentType.NUMBER,
				},
				WIDTH: {
					type: ArgumentType.NUMBER,
				},
				HEIGHT: {
					type: ArgumentType.NUMBER,
				},
			},
			def: function({X,Y,WIDTH,HEIGHT}) {
				gl.viewport(num(X),num(Y),num(WIDTH),num(HEIGHT));
			}
		},
	]

	function alertUnimplemented() {
		let def = {
			makeXRCompatible: true,
			uniform1f: true,
			uniform1fv: true,
			uniform1i: true,
			uniform1iv: true,
			uniform1uiv: true,
			uniform2f: true,
			uniform2fv: true,
			uniform2i: true,
			uniform2iv: true,
			uniform2uiv: true,
			uniform3f: true,
			uniform3fv: true,
			uniform3i: true,
			uniform3iv: true,
			uniform3uiv: true,
			uniform4f: true,
			uniform4fv: true,
			uniform4i: true,
			uniform4iv: true,
			uniform4uiv: true,
			uniformMatrix2fv: true,
			uniformMatrix2x3fv: true,
			uniformMatrix2x4fv: true,
			uniformMatrix3fv: true,
			uniformMatrix3x2fv: true,
			uniformMatrix3x4fv: true,
			uniformMatrix4fv: true,
			uniformMatrix4x2fv: true,
			uniformMatrix4x3fv: true,
			vertexAttrib1fv: true,
			vertexAttrib2fv: true,
			vertexAttrib3fv: true,
			vertexAttrib4fv: true,
			vertexAttribI4iv: true,
			vertexAttribI4uiv: true,
			uniform1ui: true,
			uniform2ui: true,
			uniform3ui: true,
			uniform4ui: true,
			isBuffer: true,
			isFramebuffer: true,
			isProgram: true,
			isQuery: true,
			isRenderbuffer: true,
			isSampler: true,
			isShader: true,
			isSync: true,
			isTexture: true,
			isTransformFeedback: true,
			isVertexArray: true,
			bufferData: true,
		};
		for(let i=0; i<definitions.length; i++) {
			def[definitions[i].opcode] = true;
		}
		let out = [];
		for(let i in gl) {
			if(!def[i] && typeof gl[i] == "function") out.push(i);
		}
		console.warn(out.join("\n")+"\nleft: "+out.length+"\ndone: "+definitions.length);
	}
	alertUnimplemented();




	function subset(array) {
		array.forEach(name => { //TODO: remove this
			if(gl[name] === undefined) throw new Error(`gl.${name} not found`);
		});
		return {
			acceptReporters: true,
			items: array.map(name => ({
				text: `gl.${name}`,
				value: ""+gl[name]
			}))
		}
	}

	let extInfo = {
				id: "webgl2",
				name: "WebGL 2 bindings",
				color1: "#d10000",
				color2: "#bd0000",
				color3: "#af0100",
				blocks: [
					...definitions
				],
				menus: {
					lists: {
						acceptReporters: false,
						items: "listsMenu"
					},
					costumes: {
						acceptReporters: true,
						items: "costumes"
					},
					listsCostume: {
						acceptReporters: false,
						items: "listsMenuCostume"
					},
					typedArrays: {
						acceptReporters: false,
						items: Object.keys(TypedArrays)
					},
					uniform: ["f","i","ui"],
					uniformMatrix: ["2", "2x3", "2x4", "3", "3x2", "3x4", "4", "4x2", "4x3"],
					activeInfo: ["name", "size", "type"],
					allConsts: {
						acceptReporters: false,
						items: allConsts
					},
					textureUnits: {
						acceptReporters: true,
						items: allConsts.filter(e => {let v=e.value-gl.TEXTURE0; return v>=0 && v<32;})
					},
					clearBufferBits: {
						acceptReporters: true,
						items: [
							["gl.COLOR_BUFFER_BIT", gl.COLOR_BUFFER_BIT],
							["gl.DEPTH_BUFFER_BIT", gl.DEPTH_BUFFER_BIT],
							["gl.STENCIL_BUFFER_BIT", gl.STENCIL_BUFFER_BIT],
							["gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT", gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT],
							["gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT", gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT],
							["gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT", gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT],
							["gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT", gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT],
						].map(e => ({text: e[0], value: ""+e[1]}))
					},
					shaderType: subset(["VERTEX_SHADER", "FRAGMENT_SHADER"]),
					shaderParameter: subset(["SHADER_TYPE", "DELETE_STATUS", "COMPILE_STATUS"]),
					programParameter: subset(["DELETE_STATUS", "LINK_STATUS", "VALIDATE_STATUS", "ATTACHED_SHADERS", "ACTIVE_ATTRIBUTES", "ACTIVE_UNIFORMS", "TRANSFORM_FEEDBACK_BUFFER_MODE", "TRANSFORM_FEEDBACK_VARYINGS", "ACTIVE_UNIFORM_BLOCKS"]),
					bufferTarget: subset(["ARRAY_BUFFER", "ELEMENT_ARRAY_BUFFER", "COPY_READ_BUFFER", "COPY_WRITE_BUFFER", "TRANSFORM_FEEDBACK_BUFFER", "UNIFORM_BUFFER", "PIXEL_PACK_BUFFER", "PIXEL_UNPACK_BUFFER"]),
					bufferUsage: subset(["STATIC_DRAW", "DYNAMIC_DRAW", "STREAM_DRAW", "STATIC_READ", "DYNAMIC_READ", "STREAM_READ", "STATIC_COPY", "DYNAMIC_COPY", "STREAM_COPY"]),
					dataType: subset(["FLOAT", "HALF_FLOAT", "BYTE", "UNSIGNED_BYTE", "SHORT", "UNSIGNED_SHORT", "INT", "UNSIGNED_INT", "INT_2_10_10_10_REV", "UNSIGNED_INT_2_10_10_10_REV"]),
					primitiveType: subset(["POINTS", "LINE_STRIP", "LINE_LOOP", "LINES", "TRIANGLE_STRIP", "TRIANGLE_FAN", "TRIANGLES"]),
					primitiveTypeMain: subset(["POINTS", "LINES", "TRIANGLES"]),
					capability: subset(["BLEND", "CULL_FACE", "DEPTH_TEST", "DITHER", "POLYGON_OFFSET_FILL", "SAMPLE_ALPHA_TO_COVERAGE", "SAMPLE_COVERAGE", "SCISSOR_TEST", "STENCIL_TEST"]),
					unsignedInts: subset(["UNSIGNED_BYTE", "UNSIGNED_SHORT", "UNSIGNED_INT"]),
					faces: subset(["FRONT", "BACK", "FRONT_AND_BACK"]),
					framebufferTarget: subset(["FRAMEBUFFER", "DRAW_FRAMEBUFFER", "READ_FRAMEBUFFER"]),
					textureTarget: subset(["TEXTURE_2D", "TEXTURE_CUBE_MAP", "TEXTURE_3D", "TEXTURE_2D_ARRAY"]),
					textureTarget2: subset(["TEXTURE_2D", "TEXTURE_CUBE_MAP_POSITIVE_X", "TEXTURE_CUBE_MAP_NEGATIVE_X", "TEXTURE_CUBE_MAP_POSITIVE_Y", "TEXTURE_CUBE_MAP_NEGATIVE_Y", "TEXTURE_CUBE_MAP_POSITIVE_Z", "TEXTURE_CUBE_MAP_NEGATIVE_Z"]),
					internalFormat: subset(["RGBA", "RGB", "LUMINANCE_ALPHA", "LUMINANCE", "ALPHA", "R8", "R8_SNORM", "RG8", "RG8_SNORM", "RGB8", "RGB8_SNORM", "RGB565", "RGBA4", "RGB5_A1", "RGBA8", "RGBA8_SNORM", "RGB10_A2", "RGB10_A2UI", "SRGB8", "SRGB8_ALPHA8", "R16F", "RG16F", "RGB16F", "RGBA16F", "R32F", "RG32F", "RGB32F", "RGBA32F", "R11F_G11F_B10F", "RGB9_E5", "R8I", "R8UI", "R16I", "R16UI", "R32I", "R32UI", "RG8I", "RG8UI", "RG16I","RG16UI", "RG32I", "RG32UI", "RGB8I", "RGB8UI", "RGB16I", "RGB16UI", "RGB32I", "RGB32UI", "RGBA8I", "RGBA8UI", "RGBA16I", "RGBA16UI", "RGBA32I", "RGBA32UI"]),
					format: subset(["RED", "RED_INTEGER", "RG", "RG_INTEGER", "RGB", "RGB_INTEGER", "RGBA", "RGBA_INTEGER", "LUMINANCE_ALPHA", "LUMINANCE", "ALPHA"]),
					textureDataType: subset(["UNSIGNED_BYTE", "BYTE", "UNSIGNED_SHORT", "SHORT", "UNSIGNED_INT", "INT", "HALF_FLOAT", "FLOAT", "UNSIGNED_INT_2_10_10_10_REV", "UNSIGNED_INT_10F_11F_11F_REV", "UNSIGNED_INT_5_9_9_9_REV", "UNSIGNED_INT_24_8", "UNSIGNED_SHORT_5_6_5", "UNSIGNED_SHORT_4_4_4_4", "UNSIGNED_SHORT_5_5_5_1", "FLOAT_32_UNSIGNED_INT_24_8_REV"]),
					frontFace: subset(["CW", "CCW"]),
					hintTarget: subset(["GENERATE_MIPMAP_HINT", "FRAGMENT_SHADER_DERIVATIVE_HINT"]),
					hintMode: subset(["FASTEST", "NICEST", "DONT_CARE"]),
					texParamTarget: subset(["TEXTURE_2D", "TEXTURE_3D", "TEXTURE_CUBE_MAP", "TEXTURE_2D_ARRAY"]),
					texParamPnameI: subset(["TEXTURE_MAG_FILTER", "TEXTURE_MIN_FILTER", "TEXTURE_WRAP_S", "TEXTURE_WRAP_T", "TEXTURE_WRAP_R", "TEXTURE_BASE_LEVEL", "TEXTURE_COMPARE_FUNC", "TEXTURE_COMPARE_MODE", "TEXTURE_MAX_LEVEL"]),
					texParamPnameF: subset(["TEXTURE_MIN_LOD", "TEXTURE_MAX_LOD"]),
					syncCondition: subset(["SYNC_GPU_COMMANDS_COMPLETE"]),
					syncParameter: subset(["OBJECT_TYPE", "SYNC_STATUS", "SYNC_CONDITION", "SYNC_FLAGS"]),
					shaderPrecisionType: subset(["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"]),
					shaderPrecisionComponent: ["rangeMin", "rangeMax", "precision"],
					textureFiltering: subset(["NEAREST", "LINEAR"]),
					compareFunc: subset(["NEVER", "LESS", "EQUAL", "LEQUAL", "GREATER", "NOTEQUAL", "GEQUAL", "ALWAYS"]),
					stencilOp: subset(["KEEP", "ZERO", "REPLACE", "INCR", "INCR_WRAP", "DECR", "DECR_WRAP", "INVERT"]),
					blendEquation: subset(["FUNC_ADD", "FUNC_SUBTRACT", "FUNC_REVERSE_SUBTRACT", "MIN", "MAX"]),
					blendFunc: subset(["ZERO", "ONE", "SRC_COLOR", "ONE_MINUS_SRC_COLOR", "DST_COLOR", "ONE_MINUS_DST_COLOR", "SRC_ALPHA", "ONE_MINUS_SRC_ALPHA", "DST_ALPHA", "ONE_MINUS_DST_ALPHA", "CONSTANT_COLOR", "ONE_MINUS_CONSTANT_COLOR", "CONSTANT_ALPHA", "ONE_MINUS_CONSTANT_ALPHA", "SRC_ALPHA_SATURATE"]),
					pixelstorei: subset(["PACK_ALIGNMENT", "UNPACK_ALIGNMENT", "UNPACK_FLIP_Y_WEBGL", "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "UNPACK_COLORSPACE_CONVERSION_WEBGL", "PACK_ROW_LENGTH", "PACK_SKIP_PIXELS", "PACK_SKIP_ROWS", "UNPACK_ROW_LENGTH", "UNPACK_IMAGE_HEIGHT", "UNPACK_SKIP_PIXELS", "UNPACK_SKIP_ROWS", "UNPACK_SKIP_IMAGES"]),
					transformFeedbackTarget: subset(["TRANSFORM_FEEDBACK"]),
					bufferMode: subset(["SEPARATE_ATTRIBS", "INTERLEAVED_ATTRIBS"]),
					queryTarget: subset(["ANY_SAMPLES_PASSED", "ANY_SAMPLES_PASSED_CONSERVATIVE", "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN"]),
					queryPname1: subset(["CURRENT_QUERY"]),
					queryPname2: subset(["QUERY_RESULT", "QUERY_RESULT_AVAILABLE"]),
				}
			};

	class Extension {
		getInfo() {
			return extInfo;
		}
		listsMenu() {
			let stage = vm.runtime.getTargetForStage();
			let editingTarget = vm.editingTarget;
			let local = editingTarget ? Object.values(editingTarget.variables).filter(v => v.type == "list").map(v => v.name) : [];
			let global = stage ? Object.values(stage.variables).filter(v => v.type == "list").map(v => v.name) : [];
			let all = [...local, ...global];
			all.sort();
			if(all.length == 0) return ["my list"];
			console.log(all);
			return all;
		}
		costumes() {
			let all = ["current", "svgs not supported"];
			let editingTarget = vm.editingTarget;
			if(editingTarget) {
				editingTarget.getCostumes().forEach(e => all.push(e.name));
			}
			return all;
		}
	}

	for(let block of definitions) {
		if(block == "---") continue;
		Extension.prototype[block.opcode] = block.def;
		if(block.category) block.hideFromPalette = true;
/*		function(...args) {   TODO: Uncomment
			try {
				return block.def.apply(this, ...args);
			} catch(e) {
				console.error(e);
				return "";
			}
		}*/ 
	}


//*
	const ogl = gl;
	gl = {}
	for(let i in ogl) {
		if(typeof ogl[i] == "function") {
			gl[i] = function(...args) {
				let res = ogl[i](...args);
				if(res === undefined) {
					console.log("gl."+i+"(",...args,")");
				} else {
					console.log("gl."+i+"(",...args,") =>",res);
				}
				return res;
			}
		}
		if(typeof ogl[i] == "number") {
			gl[i] = ogl[i];
		}
	}
	gl.__proto__ = ogl;
	//*/
	

	// TODO: precalc!
	const gbx = vm.runtime.getBlocksXML;
	vm.runtime.getBlocksXML = function(target) {
		const res = gbx.call(this, target);
		try {
		const blocks = this._blockInfo.find(categoryInfo => categoryInfo.id == "webgl2").blocks;
		for(let name in Category) {
			const paletteBlocks = blocks.filter(block => (block.info && block.info.category == Category[name]));
			res.push({
				id: Category[name],
				xml: `<category name="${Category[name]}" id="gl_${Category[name].toLowerCase()}" colour="#d10000" secondaryColour="#bd0000">${
						paletteBlocks.map(block => block.xml).join('')}</category>`
			});
		}
		} catch(e) { console.error(e); }
		return res;
	}
	Scratch.extensions.register(new Extension());
})(Scratch);
