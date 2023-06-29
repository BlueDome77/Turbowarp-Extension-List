class TextAnalyzer {
    getInfo() {
        return {
            id: 'textanalyzer',
            name: 'Text Analyzer',
            blocks: [
                {
                    opcode: 'wordCount',
                    blockType: 'reporter',
                    text: 'word count of [text]',
                    arguments: {
                        text: {
                            type: 'string',
                            defaultValue: 'Hello world'
                        }
                    }
                },
                {
                    opcode: 'characterCount',
                    blockType: 'reporter',
                    text: 'character count of [text]',
                    arguments: {
                        text: {
                            type: 'string',
                            defaultValue: 'Hello world'
                        }
                    }
                },
                {
                    opcode: 'averageWordLength',
                    blockType: 'reporter',
                    text: 'average word length of [text]',
                    arguments: {
                        text: {
                            type: 'string',
                            defaultValue: 'Hello world'
                        }
                    }
                },
                {
                    opcode: 'mostFrequentWords',
                    blockType: 'reporter',
                    text: 'most frequent words of [text] (limit: [limit])',
                    arguments: {
                        text: {
                            type: 'string',
                            defaultValue: 'Hello world'
                        },
                        limit: {
                            type: 'number',
                            defaultValue: 5
                        }
                    }
                }
            ]
        };
    }

    wordCount(args) {
        const text = args.text;
        const words = text.split(' ');
        return words.length;
    }

    characterCount(args) {
        const text = args.text;
        return text.length;
    }

    averageWordLength(args) {
        const text = args.text;
        const words = text.split(' ');
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        return totalLength / words.length;
    }

    mostFrequentWords(args) {
        const text = args.text;
        const words = text.toLowerCase().match(/\b\w+\b/g);
        const limit = Math.max(1, Math.min(args.limit, words.length));
        
        const wordCountMap = {};
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (wordCountMap[word]) {
                wordCountMap[word]++;
            } else {
                wordCountMap[word] = 1;
            }
        }
        
        const sortedWords = Object.keys(wordCountMap).sort((a, b) => wordCountMap[b] - wordCountMap[a]);
        const mostFrequent = sortedWords.slice(0, limit);
        return mostFrequent.join(', ');
    }
}

Scratch.extensions.register(new TextAnalyzer());
