class LoremIpsumGenerator {
    getInfo() {
        return {
            id: 'loremipsumgenerator',
            name: 'Lorem Ipsum Generator',
            blocks: [
                {
                    opcode: 'generateLoremIpsumParagraphs',
                    blockType: 'reporter',
                    text: 'generate Lorem Ipsum paragraphs [numOfParagraphs]',
                    arguments: {
                        numOfParagraphs: {
                            type: 'number',
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'generateLoremIpsumWords',
                    blockType: 'reporter',
                    text: 'generate Lorem Ipsum words [numOfWords]',
                    arguments: {
                        numOfWords: {
                            type: 'number',
                            defaultValue: 10
                        }
                    }
                }
            ]
        };
    }

    generateLoremIpsumParagraphs(args) {
        const numOfParagraphs = Math.max(1, Math.min(args.numOfParagraphs, 10));
        const paragraphs = [];
        
        for (let i = 0; i < numOfParagraphs; i++) {
            paragraphs.push(this.generateLoremIpsumParagraph());
        }
        
        return paragraphs.join('\n\n');
    }

    generateLoremIpsumParagraph() {
        const sentences = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Praesent luctus odio at facilisis fringilla.',
            'Morbi fringilla neque ut lacus pellentesque, in finibus est eleifend.',
            'Nunc ultricies massa a felis dignissim, a facilisis elit dapibus.',
            'Sed ullamcorper mauris ac cursus gravida.',
            'Proin a mauris vitae nisi tempus fermentum.',
            'Fusce vestibulum semper lectus, sit amet viverra purus efficitur at.',
            'Integer sit amet leo nec mauris facilisis ultrices.',
            'Vestibulum rhoncus erat sed efficitur aliquam.',
            'Maecenas tincidunt ligula a eleifend congue.',
            'Nam ac felis sed arcu laoreet consectetur.',
            'Vivamus ut orci et mauris posuere pretium sed at tortor.',
            'Nullam ac ante vitae odio fermentum scelerisque.',
            'Suspendisse potenti. In ac elit eget sapien varius tristique.',
            'Vestibulum sed velit ultricies, rutrum ipsum id, venenatis mauris.'
        ];
        
        const paragraphLength = Math.floor(Math.random() * 4) + 3; // Random paragraph length between 3 and 6 sentences
        const paragraphSentences = [];
        
        for (let i = 0; i < paragraphLength; i++) {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            paragraphSentences.push(sentences[randomIndex]);
        }
        
        return paragraphSentences.join(' ');
    }

    generateLoremIpsumWords(args) {
        const numOfWords = Math.max(1, Math.min(args.numOfWords, 100));
        const words = [
            'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'Praesent', 'luctus', 'odio', 'at', 'facilisis', 'fringilla',
            'Morbi', 'fringilla', 'neque', 'ut', 'lacus', 'pellentesque', 'in', 'finibus', 'est', 'eleifend',
            'Nunc', 'ultricies', 'massa', 'a', 'felis', 'dignissim', 'a', 'facilisis', 'elit', 'dapibus',
            'Sed', 'ullamcorper', 'mauris', 'ac', 'cursus', 'gravida',
            'Proin', 'a', 'mauris', 'vitae', 'nisi', 'tempus', 'fermentum',
            'Fusce', 'vestibulum', 'semper', 'lectus', 'sit', 'amet', 'viverra', 'purus', 'efficitur', 'at',
            'Integer', 'sit', 'amet', 'leo', 'nec', 'mauris', 'facilisis', 'ultrices',
            'Vestibulum', 'rhoncus', 'erat', 'sed', 'efficitur', 'aliquam',
            'Maecenas', 'tincidunt', 'ligula', 'a', 'eleifend', 'congue',
            'Nam', 'ac', 'felis', 'sed', 'arcu', 'laoreet', 'consectetur',
            'Vivamus', 'ut', 'orci', 'et', 'mauris', 'posuere', 'pretium', 'sed', 'at', 'tortor',
            'Nullam', 'ac', 'ante', 'vitae', 'odio', 'fermentum', 'scelerisque',
            'Suspendisse', 'potenti', 'In', 'ac', 'elit', 'eget', 'sapien', 'varius', 'tristique',
            'Vestibulum', 'sed', 'velit', 'ultricies', 'rutrum', 'ipsum', 'id', 'venenatis', 'mauris'
        ];
        
        const loremIpsumWords = [];
        
        for (let i = 0; i < numOfWords; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            loremIpsumWords.push(words[randomIndex]);
        }
        
        return loremIpsumWords.join(' ');
    }
}

Scratch.extensions.register(new LoremIpsumGenerator());
