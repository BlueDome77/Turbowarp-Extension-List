class MorseCodeTranslator {
    constructor() {
        this.morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
            'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
            'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
            ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
            ' ': '/'
        };

        this.reverseMorseCodeMap = {};
        for (const key in this.morseCodeMap) {
            if (this.morseCodeMap.hasOwnProperty(key)) {
                this.reverseMorseCodeMap[this.morseCodeMap[key]] = key;
            }
        }
    }

    getInfo() {
        return {
            id: 'morsecode',
            name: 'Morse Code Translator',
            blocks: [
                {
                    opcode: 'textToMorseCode',
                    blockType: 'reporter',
                    text: 'translate [text] to Morse code',
                    arguments: {
                        text: {
                            type: 'string',
                            defaultValue: 'Hello'
                        }
                    }
                },
                {
                    opcode: 'morseCodeToText',
                    blockType: 'reporter',
                    text: 'translate [morseCode] to text',
                    arguments: {
                        morseCode: {
                            type: 'string',
                            defaultValue: '. .-.. .-.. ---'
                        }
                    }
                }
            ]
        };
    }

    textToMorseCode(args) {
        const text = args.text.toUpperCase();
        let morseCode = '';
        for (let i = 0; i < text.length; i++) {
            const character = text[i];
            if (this.morseCodeMap.hasOwnProperty(character)) {
                morseCode += this.morseCodeMap[character] + ' ';
            }
        }
        return morseCode.trim();
    }

    morseCodeToText(args) {
        const morseCode = args.morseCode.trim();
        const morseCodeWords = morseCode.split(' / ');
        let text = '';
        for (let i = 0; i < morseCodeWords.length; i++) {
            const morseCodeWord = morseCodeWords[i];
            const morseCodeChars = morseCodeWord.split(' ');
            for (let j = 0; j < morseCodeChars.length; j++) {
                const morseCodeChar = morseCodeChars[j];
                if (this.reverseMorseCodeMap.hasOwnProperty(morseCodeChar)) {
                    text += this.reverseMorseCodeMap[morseCodeChar];
                }
            }
            text += ' ';
        }
        return text.trim();
    }
}

Scratch.extensions.register(new MorseCodeTranslator());
