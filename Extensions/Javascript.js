// Original extension by @LilyMakesThings

(function (Scratch) {
  'use strict';

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const isPackaged = runtime.isPackaged;

  let allowJSCode = true;
  let ineditor = true;

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }
  
  class CustomJS {
    getInfo() {
      return {
        id: 'JavaScript',
        name: 'JavaScript',
        color1: '#AAAAAA',
        blocks: [
          {
            opcode: 'execute',
            func: 'javascript',
            blockType: Scratch.BlockType.COMMAND,
            text: 'execute [JS]',
            arguments: {
              JS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'alert("Hello World!")'
              }
            }
          },
          {
            opcode: 'evaluateReporter',
            func: 'javascript',
            blockType: Scratch.BlockType.REPORTER,
            text: 'evaluate [JS]',
            arguments: {
              JS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Math.random()'
              }
            }
          },
          {
            opcode: 'evaluateBoolean',
            func: 'javascript',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'evaluate [JS]',
            arguments: {
              JS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Math.round(Math.random()) === 1'
              }
            }
          },
        ]
      };
    }

   javascript(args, util) {
    const output = eval(args.JS);
    return (output) ? output : '';
    }
  }

  Scratch.extensions.register(new CustomJS());
})(Scratch);
