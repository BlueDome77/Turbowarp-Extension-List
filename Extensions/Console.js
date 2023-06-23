class ConsoleExtension {
  getInfo() {
    return {
      id: 'oeildlconsole',
      name: 'Console',
        color1: '#e60f0f', //couleur des blocs
        color2: '#a20404', //bordure de l'icone dans la catÃ©gorie
        color3: '#a20404', //contour des blocs

      blocks: [
        {
          opcode: 'error',
          blockType: Scratch.BlockType.COMMAND,
          text: 'error [ONE]',
          arguments: {
            ONE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'ã…¤'
            }
          }
        },

        {
          opcode: 'warning',
          blockType: Scratch.BlockType.COMMAND,
          text: 'warning [TWO]',
          arguments: {
            TWO: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'ã…¤'
            }
          }
        },

        {
          opcode: 'info',
          blockType: Scratch.BlockType.COMMAND,
          text: 'info [THREE]',
          arguments: {
            THREE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'ã…¤'
            }
          }
        },
        
        {
          opcode: 'log',
          blockType: Scratch.BlockType.COMMAND,
          text: 'log [FOUR]',
          arguments: {
            FOUR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'ã…¤'
            }
          }
        },

        {
          opcode: 'clear',
          blockType: Scratch.BlockType.COMMAND,
          text: 'clear console'
        },

        {
          opcode: 'newline',
          blockType: Scratch.BlockType.REPORTER,
          text: 'new line',
          disableMonitor: true
        },
        '---',
        {
          opcode: 'color',
          blockType: Scratch.BlockType.COMMAND,
          text: 'display [NINE] with color [TEN] bg-color [ELEVEN] and size [SIZE]',
          arguments: {
            NINE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'text'
            },
            TEN: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: '#ffd000'
            },
            ELEVEN: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: '#e60f0f'
            },
            SIZE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '11'
            }
          }
        },

        {
          opcode: 'css',
          blockType: Scratch.BlockType.COMMAND,
          text: 'display [TEXT] with style [CSS]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'text'
            },
            CSS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'font-family: cursive;'
            }
          }
        },

        '---',
        {
          opcode: 'group',
          blockType: Scratch.BlockType.COMMAND,
          text: 'group with title [FIVE]',
          arguments: {
            FIVE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'group'
            }
          }
        },

        {
          opcode: 'groupCollapsed',
          blockType: Scratch.BlockType.COMMAND,
          text: 'collapsed group with title [FIVE]',
          arguments: {
            FIVE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'group'
            }
          }
        },

        {
          opcode: 'ungroup',
          blockType: Scratch.BlockType.COMMAND,
          text: 'quit group'
        },
        '---',
        {
          opcode: 'timer',
          blockType: Scratch.BlockType.COMMAND,
          text: 'start timer named [SIX]',
          arguments: {
            SIX: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'timer'
            }
          }
        },
        
        {
          opcode: 'timerlog',
          blockType: Scratch.BlockType.COMMAND,
          text: 'display timer named [SEVEN]',
          arguments: {
            SEVEN: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'timer'
            }
          }
        },

        {
          opcode: 'timerstop',
          blockType: Scratch.BlockType.COMMAND,
          text: 'stop timer named [EIGHT]',
          arguments: {
            EIGHT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'timer'
            }
          }
        },

        '---',
        {
          opcode: 'eval',
          blockType: Scratch.BlockType.REPORTER,
          text: 'eval [STR]',
          arguments: {
            STR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '1 + 1'
            }
          }
        },

        {
          opcode: 'evalc',
          blockType: Scratch.BlockType.COMMAND,
          text: 'eval [STR] in console',
          arguments: {
            STR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '1 + 1'
            }
          }
        },
        
      ]
    };
  }


  error(args) {
    console.error(args.ONE);
  }

  warning(args) {
    console.warn(args.TWO);
  }

  info(args) {
    console.info(args.THREE);
  }

  log(args) {
    console.log(args.FOUR);
  }

  clear() {
    console.clear();
  }

  newline() {
    return('\n');
  }

  group(args) {
    console.group(args.FIVE);
  }

  groupCollapsed(args) {
    console.groupCollapsed(args.FIVE);
  }

  ungroup() {
    console.groupEnd();
  }

  timer(args) {
    console.time(args.SIX);
  }

  timerlog(args) {
    console.timeLog(args.SEVEN);
  }

  timerstop(args) {
    console.timeEnd(args.EIGHT);
  }

  color(args) {
    var styles = [
      'color: ' + args.TEN,
      'background-color: ' + args.ELEVEN,
      'font-size: ' + args.SIZE + "px",
    ].join(';');
    console.log('%c%s', styles, args.NINE);
  }

  css(args) {
    var styles = [
      args.CSS,
    ].join(';');
    console.log('%c%s', styles, args.TEXT);
  }

  eval(args) {
    return(eval(args.STR))
  }

  evalc(args) {
    console.log(eval(args.STR))
    return(eval(args.STR));
  }
};
Scratch.extensions.register(new ConsoleExtension());
