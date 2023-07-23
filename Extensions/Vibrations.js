(function(Scratch) {
  "use strict";
  
  class VibrationsExtension {
    getInfo() {
      return {
        id: 'vibrationsextension',
        name: 'Vibrations',
        color1: '#e0a000',
        color2: '#d09000',
        color3: '#d09000',
        blocks: [
          {
            opcode: 'isAvail',
            text: 'is vibrations available?',
            blockType: Scratch.BlockType.BOOLEAN
          },
          {
            opcode: 'vibrate',
            text: 'vibrate for [LEN] milliseconds',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              LEN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30
              }
            }
          }
        ]
      };
    }
    isAvail() {
      return Scratch.extensions.unsandboxed && typeof navigator.vibrate == "function";
    }
    vibrate(args) {
      if (this.isAvail()) navigator.vibrate(Math.min(args.LEN, 300));
    }
  }
  Scratch.extensions.register(new VibrationsExtension());
})(Scratch);
