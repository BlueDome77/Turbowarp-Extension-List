class AdmireBlocks {

    constructor() {}

    getInfo() {
      return {
        color1: "#8b7fc9",
        color2: "#8b7fc9",
        id: 'admireBlocks',
        name: 'AdmireBlocks',
        menuIconURI: 'https://drannamongtime-mtalt.github.io/Admireblocks/adl.svg',
        blockIconURI: 'https://drannamongtime-mtalt.github.io/Admireblocks/adil.svg',

        blocks: [
          {
            opcode: 'txtToBASE64',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TEXT] to BASE64',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Admireblocks'
              }
            }
          },
          {
            opcode: 'Getoperatingsystem',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Operating system',
            disableMonitor: true
          },
          {
          opcode: 'BASE64Totxt',
          blockType: Scratch.BlockType.REPORTER,
          text: 'BASE64 [B64] To text',
          arguments: {
            B64: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'QWRtaXJlYmxvY2tz'
            }
        }
    },
    {
        opcode: 'reversetext',
        blockType: Scratch.BlockType.REPORTER,
        text: '[MJSF] backwards is?',
        arguments: {
            MJSF: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: 'Admireblocks'
          }
      }
  },
  {
    opcode: 'text2bin',
    blockType: Scratch.BlockType.REPORTER,
    text: '[JEOF] to binary',
    arguments: {
        JEOF: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: 'Admireblocks'
      }
  }
},
{
    opcode: 'repeatfortimes',
    blockType: Scratch.BlockType.REPORTER,
    text: 'Repeat [PRIF] for [NUM] times',
    arguments: {
        PRIF: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: 'dr'
          },
          NUM: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 2
      }
  }
},
{
    opcode: 'string2bool',
    blockType: Scratch.BlockType.BOOLEAN,
    text: '[YOURSTRING]',
    arguments: {
        YOURSTRING: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: 'false'
      }
  }
},
{
    opcode: 'colorhex',
    blockType: Scratch.BlockType.REPORTER,
    text: '[COLOR] HEX code',
    arguments: {
        COLOR: {
        type: Scratch.ArgumentType.COLOR,
        defaultValue: '#8b7fc9'
      }
  }
},
{
    opcode: 'text2hex',
    blockType: Scratch.BlockType.REPORTER,
    text: '[HAIS] to HEX',
    arguments: {
        HAIS: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: 'Admireblocks'
      }
  }
},
{
    opcode: 'STRINGTOU',
    blockType: Scratch.BlockType.REPORTER,
    text: 'Uppercase [STRINGTOUPPERCASE]',
    arguments: {
        STRINGTOUPPERCASE: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: 'Admireblocks'
      }
  }
},
{
    opcode: 'STRINGTOL',
    blockType: Scratch.BlockType.REPORTER,
    text: 'Lowercase [STRINGTOLOWERCASE]',
    arguments: {
        STRINGTOLOWERCASE: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: 'ADMIREBLOCKS'
      }
  }
},
{
    opcode: 'bin2text',
    blockType: Scratch.BlockType.REPORTER,
    text: 'Binary [FOEJ] to text',
    arguments: {
        FOEJ: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: '1000001 1100100 1101101 1101001 1110010 1100101 1100010 1101100 1101111 1100011 1101011 1110011'
      }
  }
},
{
    //there will be no decode block for the ROT13 because that will be almost impossible to make
    opcode: 'text2rot13',
    blockType: Scratch.BlockType.REPORTER,
    text: '[MIRH] to ROT13',
    arguments: {
        MIRH: {
        type: Scratch.ArgumentType.STRING,
        defaultValue: 'Admireblocks'
      }
  }
},
      {
     opcode: 'logsomething',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Log [LOGTEXT]',
          arguments: {
            LOGTEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Admireblocks'
            }
        }
    },
    {
    opcode: 'Pickarandomnumber',
    blockType: Scratch.BlockType.REPORTER,
    text: 'Pick a random number',
    disableMonitor: true
    },
    {
        opcode: 'Pickarandomletter',
        blockType: Scratch.BlockType.REPORTER,
        text: 'Pick a random letter',
        disableMonitor: true
        },
        {
            opcode: 'Pickarandomsymbol',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Pick a random symbol',
            disableMonitor: true
            },
            {
                opcode: 'menuNum',
                blockType: Scratch.BlockType.REPORTER,
                text: 'Numbers [MENUNUM]',
                arguments: {
                    MENUNUM: {
                    type: Scratch.ArgumentType.STRING,
                    menu: 'numbersmenu',
                    disableMonitor: true
                    
                  }
                }
                },
                {
                    opcode: 'menuAlpha',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Letters in the english alphabet [INTHEALPHABET]',
                    arguments: {
                        INTHEALPHABET: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'litea',
                        disableMonitor: true
                        
                      }
                    }
                    },
            {
                opcode: 'infinity',
                blockType: Scratch.BlockType.REPORTER,
                text: 'infinity',
                disableMonitor: true
                },
                {
                    opcode: 'txtToSHA1',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[SHA1TEXT] to SHA1',
                    arguments: {
                        SHA1TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'txtToSHA256',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[SHA256TEXT] to SHA256',
                    arguments: {
                        SHA256TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'txtToSHA512',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[SHA512TEXT] to SHA512',
                    arguments: {
                        SHA512TEXT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'txtToMD5',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[TEXTMD5] to MD5',
                    arguments: {
                        TEXTMD5: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'txtToMC',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[TEXTMC] to Morse code',
                    arguments: {
                        TEXTMC: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'text2MOVE2',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[IUUI] to Move2',
                    arguments: {
                        IUUI: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'ltn',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[TRRR] to numbers (A = 1, B = 2, C = 3)',
                    arguments: {
                        TRRR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                      }
                    }
                  },
                  {
                    opcode: 'replace',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Replace [REGEX] with [NEWSTRING] in [THEINPUT]',
                    arguments: {
                        REGEX: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: ' '
                      },
                      NEWSTRING: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: ' '
                      },
                      THEINPUT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: ' '
                      }
                    }
                  },
                  {
                    opcode: 'genr',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Generate a random string with the lenght of [TER]',
                    arguments: {
                        TER: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '5'
                      }
                    }
                  },
                  {
                    opcode: 'genrsy',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '(With symbols) Generate a random string with the lenght of [MPR]',
                    arguments: {
                        MPR: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '5'
                      }
                    }
                  },
                  {
                    opcode: 'genrnum',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '(Only numbers) Generate a random string with the lenght of [TEH]',
                    arguments: {
                        TEH: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '5'
                      }
                    }
                  },
                  {
                    opcode: 'genrosy',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '(Only symbols) Generate a random string with the lenght of [LETA]',
                    arguments: {
                        LETA: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '5'
                      }
                    }
                  },
                  {
                    opcode: 'lgenral',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '(Only lowercase letters) Generate a random string with the lenght of [ETA]',
                    arguments: {
                        ETA: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '5'
                      }
                    }
                  },
                  {
                    opcode: 'ugenral',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '(Only uppercase letters) Generate a random string with the lenght of [UETA]',
                    arguments: {
                        UETA: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '5'
                      }
                    }
                  },
                  {
                    opcode: 'removews',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Remove whitespaces from [TERA]',
                    arguments: {
                        TERA: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admire blocks'
                      }
                    }
                  },
                  {
                    opcode: 'jhd',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Titlecase [ERR]',
                    arguments: {
                        ERR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'admireblocks is so cool!'
                      }
                    }
                  },
                  {
                    opcode: 'chance',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[A]% Chance',
                    arguments: {
                        A: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: '50'
                      }
                    }
                  },
                  {
                    opcode: 'startswith',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[MJR] starts with [MJRT]?',
                    arguments: {
                        MJR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks',
                        },
                        MJRT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Admire'
                        }
                    }
                  },
                  {
                    opcode: 'endswith',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[MJH] ends with [MJHT]?',
                    arguments: {
                        MJH: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Admireblocks'
                        },
                        MJHT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'blocks'
                      }
                    }
                  },
                  {
                    opcode: 'Crash',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '(DANGEROUS!) Crash the window',
                  }
    
    ],
    menus: {
        numbersmenu: {
          items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
          acceptReporters: false,
        },
          litea: {
            items: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            acceptReporters: false
    }
  }

  }
}

    txtToBASE64(args) {
        return btoa(args.TEXT)

          }
          infinity() {
            return Math.pow(200,1000)

              }
              txtToSHA1(args) {
                function SHA1(msg) {
                    function rotate_left(n,s) {
                    var t4 = ( n<<s ) | (n>>>(32-s));
                    return t4;
                    };
                    function lsb_hex(val) {
                    var str='';
                    var i;
                    var vh;
                    var vl;
                    for( i=0; i<=6; i+=2 ) {
                    vh = (val>>>(i*4+4))&0x0f;
                    vl = (val>>>(i*4))&0x0f;
                    str += vh.toString(16) + vl.toString(16);
                    }
                    return str;
                    };
                    function cvt_hex(val) {
                    var str='';
                    var i;
                    var v;
                    for( i=7; i>=0; i-- ) {
                    v = (val>>>(i*4))&0x0f;
                    str += v.toString(16);
                    }
                    return str;
                    };
                    function Utf8Encode(string) {
                    string = string.replace(/\r\n/g,'\n');
                    var utftext = '';
                    for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                    utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                    }
                    }
                    return utftext;
                    };
                    var blockstart;
                    var i, j;
                    var W = new Array(80);
                    var H0 = 0x67452301;
                    var H1 = 0xEFCDAB89;
                    var H2 = 0x98BADCFE;
                    var H3 = 0x10325476;
                    var H4 = 0xC3D2E1F0;
                    var A, B, C, D, E;
                    var temp;
                    msg = Utf8Encode(msg);
                    var msg_len = msg.length;
                    var word_array = new Array();
                    for( i=0; i<msg_len-3; i+=4 ) {
                    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
                    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
                    word_array.push( j );
                    }
                    switch( msg_len % 4 ) {
                    case 0:
                    i = 0x080000000;
                    break;
                    case 1:
                    i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
                    break;
                    case 2:
                    i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
                    break;
                    case 3:
                    i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
                    break;
                    }
                    word_array.push( i );
                    while( (word_array.length % 16) != 14 ) word_array.push( 0 );
                    word_array.push( msg_len>>>29 );
                    word_array.push( (msg_len<<3)&0x0ffffffff );
                    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
                    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
                    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
                    A = H0;
                    B = H1;
                    C = H2;
                    D = H3;
                    E = H4;
                    for( i= 0; i<=19; i++ ) {
                    temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                    }
                    for( i=20; i<=39; i++ ) {
                    temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                    }
                    for( i=40; i<=59; i++ ) {
                    temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                    }
                    for( i=60; i<=79; i++ ) {
                    temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                    }
                    H0 = (H0 + A) & 0x0ffffffff;
                    H1 = (H1 + B) & 0x0ffffffff;
                    H2 = (H2 + C) & 0x0ffffffff;
                    H3 = (H3 + D) & 0x0ffffffff;
                    H4 = (H4 + E) & 0x0ffffffff;
                    }
                    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
                   
                    return temp.toLowerCase();
                   }
        return SHA1(args.SHA1TEXT);
                  }
    BASE64Totxt(args) {
        // this returns the BASE64 in normal text.
        return atob(args.B64)

        }
        txtToSHA512(args) {
          function sha512(str) {
            return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
              return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
            });
          }
          return sha512(args.SHA512TEXT);
            }

        logsomething(args) {
        console.log(args.LOGTEXT)
        //view the console by right clicking on your browser and select "inspect" and go to console.
    }
    reversetext(args) {
        // return the reversed string
        //credits to stackoverflow for these functions
        function reverseString(str) {
            var splitString = str.split("");
         
            var reverseArray = splitString.reverse();
         
            var joinArray = reverseArray.join("");
       
            return joinArray; // "skcolberimdA"
        }
         
        return reverseString(args.MJSF);
    }
    txtToMD5(args) {
      var MD5 = function (string) {
    
        function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }
        
        function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
        if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
        } else {
        return (lResult ^ lX8 ^ lY8);
        }
        }
        
        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }
        
        function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
        };
        
        function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
        };
        
        function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
        };
        
        function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
        };
        
        function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
        lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
        };
        
        function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
        lByte = (lValue>>>(lCount*8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
        };
        
        function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        
        for (var n = 0; n < string.length; n++) {
        
        var c = string.charCodeAt(n);
        
        if (c < 128) {
        utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
        }
        
        }
        
        return utftext;
        };
        
        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;
        
        string = Utf8Encode(string);
        
        x = ConvertToWordArray(string);
        
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        
        for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
        }
        
        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
        
        return temp.toLowerCase();
        }
        return MD5(args.TEXTMD5)
    }
    text2bin(args) {
      var text = args.JEOF.toString();
      return Array.from(text).map((each)=>each.charCodeAt(0).toString(2)).join(" ");
  }
    bin2text(args) {
        var binary = args.FOEJ.toString();
        return binary.split(" ").map((x) => x = String.fromCharCode(parseInt(x, 2))).join("");
    }
    txtToMC(args) {
      const morseCode = {
        "A": ".- ",
        "B": "-... ",
        "C": "-.-. ",
        "D": "-.. ",
        "E": ". ",
        "F": "..-. ",
        "G": "--. ",
        "H": ".... ",
        "I": ".. ",
        "J": ".--- ",
        "K": "-.- ",
        "L": ".-.. ",
        "M": "-- ",
        "N": "-. ",
        "O": "--- ",
        "P": ".--. ",
        "Q": "--.- ",
        "R": ".-. ",
        "S": "... ",
        "T": "- ",
        "U": "..- ",
        "V": "...- ",
        "W": ".-- ",
        "X": "-..- ",
        "Y": "-.-- ",
        "Z": "--.. ",
        " ": " / ",
        "1": ".---- ",
        '2': '..--- ',
        '3': '...-- ',
        '4': '....- ',
        '5': '..... ',
        '6': '-.... ',
        '7': '--... ',
        '8': '---.. ',
        '9': '----. ',
        '0': '----- ',
        '.': '.-.-.- ',
        ',': '--..-- ',
        '?': '..--.. ',
        "'": '.----. ',
        '!': '-.-.-- ',
        '/': '-..-. ',
        '(': '-.--. ',
        ')': '-.--.- ',
        '&': '.-... ',
        ':': '---... ',
        ';': '-.-.-. ',
        '=': '-...-',
        '+': '.-.-. ',
        '-': '-....- ',
        '_': '..--.- ',
        '"': '.-..-. ',
        '$': '...-..- ',
        '@': '.--.-. ',
      }
      const convertToMorse = (str) => {
        return str.toUpperCase().split("").map(el => {
           return morseCode[el] ? morseCode[el] : el;
        }).join("");
      };
      return convertToMorse(args.TEXTMC);
  }
    Getoperatingsystem() {
        function getOS() {
            var userAgent = window.navigator.userAgent,
                platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
                macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
                windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
                iosPlatforms = ['iPhone', 'iPad', 'iPod'],
                os = null;
          
            if (macosPlatforms.indexOf(platform) !== -1) {
              os = 'Mac OS';
            } else if (iosPlatforms.indexOf(platform) !== -1) {
              os = 'iOS';
            } else if (windowsPlatforms.indexOf(platform) !== -1) {
              os = 'Windows';
            } else if (/Android/.test(userAgent)) {
              os = 'Android';
            } else if (/Linux/.test(platform)) {
              os = 'Linux';
            }
          
            return os;
          }
          
          return getOS();
    }
    repeatfortimes(args) {
        return args.PRIF.repeat(Math.floor(args.NUM));
    }
    string2bool({YOURSTRING}) {
        return YOURSTRING;
      }
      colorhex(args) {
        return args.COLOR;

      }
      jhd(args) {
        function titleCase(str) {
            str = str.toLowerCase().split(' ');
            for (var i = 0; i < str.length; i++) {
              str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
            }
            return str.join(' ');
          }
          return titleCase(args.ERR);

      }
      txtToSHA256(args) {
        var sha256 = function sha256(ascii) {
            function rightRotate(value, amount) {
                return (value>>>amount) | (value<<(32 - amount));
            };
            
            var mathPow = Math.pow;
            var maxWord = mathPow(2, 32);
            var lengthProperty = 'length'
            var i, j; // Used as a counter across the whole file
            var result = ''
        
            var words = [];
            var asciiBitLength = ascii[lengthProperty]*8;
            
            //* caching results is optional - remove/add slash from front of this line to toggle
            // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
            // (we actually calculate the first 64, but extra values are just ignored)
            var hash = sha256.h = sha256.h || [];
            // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
            var k = sha256.k = sha256.k || [];
            var primeCounter = k[lengthProperty];
            /*/
            var hash = [], k = [];
            var primeCounter = 0;
            //*/
        
            var isComposite = {};
            for (var candidate = 2; primeCounter < 64; candidate++) {
                if (!isComposite[candidate]) {
                    for (i = 0; i < 313; i += candidate) {
                        isComposite[i] = candidate;
                    }
                    hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
                    k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
                }
            }
            
            ascii += '\x80' // Append Ƈ' bit (plus zero padding)
            while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
            for (i = 0; i < ascii[lengthProperty]; i++) {
                j = ascii.charCodeAt(i);
                if (j>>8) return; // ASCII check: only accept characters in range 0-255
                words[i>>2] |= j << ((3 - i)%4)*8;
            }
            words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
            words[words[lengthProperty]] = (asciiBitLength)
            
            // process each chunk
            for (j = 0; j < words[lengthProperty];) {
                var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
                var oldHash = hash;
                // This is now the undefinedworking hash", often labelled as variables a...g
                // (we have to truncate as well, otherwise extra entries at the end accumulate
                hash = hash.slice(0, 8);
                
                for (i = 0; i < 64; i++) {
                    var i2 = i + j;
                    // Expand the message into 64 words
                    // Used below if 
                    var w15 = w[i - 15], w2 = w[i - 2];
        
                    // Iterate
                    var a = hash[0], e = hash[4];
                    var temp1 = hash[7]
                        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                        + ((e&hash[5])^((~e)&hash[6])) // ch
                        + k[i]
                        // Expand the message schedule if needed
                        + (w[i] = (i < 16) ? w[i] : (
                                w[i - 16]
                                + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                                + w[i - 7]
                                + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                            )|0
                        );
                    // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
                    var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                        + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
                    
                    hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
                    hash[4] = (hash[4] + temp1)|0;
                }
                
                for (i = 0; i < 8; i++) {
                    hash[i] = (hash[i] + oldHash[i])|0;
                }
            }
            
            for (i = 0; i < 8; i++) {
                for (j = 3; j + 1; j--) {
                    var b = (hash[i]>>(j*8))&255;
                    result += ((b < 16) ? 0 : '') + b.toString(16);
                }
            }
            return result;
        };
        return sha256(args.SHA256TEXT);
      }
      text2hex(args) {
        function ascii_to_hexa(str)
        {
          var arr1 = [];
          for (var n = 0, l = str.length; n < l; n ++) 
           {
              var hex = Number(str.charCodeAt(n)).toString(16);
              arr1.push(hex);
           }
          return arr1.join('');
         }
         return ascii_to_hexa(args.HAIS);
      }
      STRINGTOU(args) {
        return args.STRINGTOUPPERCASE.toUpperCase();
        
      }
      removews(args) {
        return args.TERA.replace(/\s/g, "");
        
      }
      STRINGTOL(args) {
        return args.STRINGTOLOWERCASE.toLowerCase();
        
      }
      replace({THEINPUT, REGEX, NEWSTRING}) {
        return THEINPUT.toString().replace(new RegExp(REGEX, 'gi'), NEWSTRING);
        
      }
      Pickarandomnumber() {
        let rans = Math.floor((Math.random() * 9) + 1);
        return rans
        
      }
      menuNum({MENUNUM}) {
        return MENUNUM;
        
      }
      menuAlpha({INTHEALPHABET}) {
        return INTHEALPHABET;
        
      }
      
      startswith(args) {
        let text = args.MJR;
        let result = text.startsWith(args.MJRT);
        return result
      }

      endswith(args) {
        let text = args.MJH;
        let result = text.endsWith(args.MJHT);
        return result
      }

      chance({A}) {
        return Math.random() <= A / 100;
        
      }
      genr(args) {
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return makeid(args.TER);
        
      }
      genrsy(args) {
        function makeidsy(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+}{|/?';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return makeidsy(args.MPR);
        
      }
      genrosy(args) {
        function makeidosy(length) {
            var result           = '';
            var characters       = '!@#$%^&*()_+}{|/?';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return makeidosy(args.LETA);
        
      }
      genrnum(args) {
        function makeidnum(length) {
            var result           = '';
            var characters       = '0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return makeidnum(args.TEH);
        
      }
      lgenral(args) {
        function lmakeidol(length) {
            var result           = '';
            var characters       = 'abcdefghijklmnopqrstuvwxyz';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return lmakeidol(args.ETA);
        
      }
      ugenral(args) {
        function umakeidol(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        return umakeidol(args.UETA);
        
      }
      Pickarandomletter() {
        const randomLetter = ('abcdefghijklmnopqrstuvwxyz').split('')[(Math.floor(Math.random() * 26 ))];
        return randomLetter
      }
      Pickarandomsymbol() {
        const randomSymbol = ('!@#$%^&*()_+}{|/?').split('')[(Math.floor(Math.random() * 17 ))];
        return randomSymbol
      }
      ltn(args) {
        //a = 1, b = 2, c = 3
        const tonum = {
            "A": "1",
            "B": "2",
            "C": "3",
            "D": "4",
            "E": "5",
            "F": "6",
            "G": "7",
            "H": "8",
            "I": "9",
            "J": "10",
            "K": "11",
            "L": "12",
            "M": "13",
            "N": "14",  
            "O": "15",
            "P": "16",
            "Q": "17",
            "R": "18",
            "S": "19",
            "T": "20",
            "U": "21",
            "V": "22",
            "W": "23",
            "X": "24",
            "Y": "25",
            "Z": "26",
            " ": " ",
          }
          const convertToNum = (str) => {
            return str.toUpperCase().split("").map(el => {
               return tonum[el] ? tonum[el] : el;
            }).join("");
          };
          return convertToNum(args.TRRR);
      }
    text2rot13(args) {
        //credits to Hello dev world
        //this does not work with numbers!, this will only work for text!
        const rot13 = (message) => {
            const alpha = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';
            return message.replace(/[a-z]/gi, letter => alpha[alpha.indexOf(letter) + 13]);
          }
          return rot13(args.MIRH);
        }
        text2MOVE2(args) {
          //credits to Hello dev world
          //this does not work with numbers!, this will only work for text!
          const move2 = (message) => {
              const alpha = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';
              return message.replace(/[a-z]/gi, letter => alpha[alpha.indexOf(letter) + 2]);
            }
            return move2(args.IUUI);
          }
        Crash() {
          while(true) {
            // The loop will cause the crash.
          }
          
        
    }
  }
  Scratch.extensions.register(new AdmireBlocks());

  //extension made by drannamongtime/ohman_soonsoon/creator of RenaYa.
