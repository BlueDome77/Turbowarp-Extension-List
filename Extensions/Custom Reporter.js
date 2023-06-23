(function(Scratch) {
  'use strict';
  let outputVar = {};
  let CRmenu = ['1', '2', '3', '4', '5']
  class Broadcast2 {
    getInfo() {
      return {
        id: 'broadcast2example',
        name: 'Broadcast Example 2',
        blocks: [
          {
            opcode: 'addCR',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Add custom reporter',
            func: 'addCR',
            disableMonitor: true,
          },
          {
            opcode: 'removeCR',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Remove custom reporter',
            func: 'removeCR',
            disableMonitor: true,
          },
          {
            opcode: 'whenReceived',
            blockType: Scratch.BlockType.HAT,
            text: 'when I receive [EVENT_OPTION]',
            isEdgeActivated: false,
            arguments: {
              EVENT_OPTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EVENT_FIELD'
              }
            }
          },
          {
            opcode: 'broadcast',
            blockType: Scratch.BlockType.REPORTER,
            text: 'broadcast [EVENT] [INPUT] and wait [TIME]',
            arguments: {
              EVENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EVENT_FIELD'
              },
              INPUT: {
                type: Scratch.ArgumentType.STRING
              },
              TIME: {
                type: Scratch.ArgumentType.NUMBER
              }
            }
          },
          {
            opcode: 'getinput',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [EVENT]',
            arguments: {
              EVENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EVENT_FIELD'
              }
            }
          },
          {
            opcode: 'setinput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [EVENT] to [INPUT]',
            arguments: {
              EVENT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EVENT_FIELD'
              },
              INPUT: {
                type: Scratch.ArgumentType.STRING
              }
            }
          },
        ],
        menus: {
          EVENT_FIELD: {
            acceptReporters: false,
            items: CRmenu
          }
        }
      };
    }
    broadcast({ EVENT, INPUT, TIME }, util) {
      const wait = (args) => {
        return new Promise((resolve, reject) => {
          const timeInMilliseconds = TIME * 1000;
          setTimeout(() => {
            resolve();
          }, timeInMilliseconds);
        });
      };
      util.startHats('broadcast2example_whenReceived', {
        EVENT_OPTION: EVENT,
      });
      outputVar[EVENT] = INPUT;
      return wait({ TIME: 5 }).then(() => {
        return outputVar[EVENT];
      });
    }
    getinput({EVENT}) {
      return outputVar[EVENT];
    }
    setinput({EVENT, INPUT}) {
      outputVar[EVENT] = INPUT
    }
    addCR() {
      const newReporterName = prompt("Enter the name of the custom reporter");
      CRmenu.push(newReporterName);
      console.log(CRmenu);
    }
    removeCR() {
      const reporterNameToRemove = prompt("Enter the name of the custom reporter");
      CRmenu = CRmenu.filter(item => item !== reporterNameToRemove);
      console.log(CRmenu);
    }
  }
  Scratch.extensions.register(new Broadcast2());
}(Scratch));
