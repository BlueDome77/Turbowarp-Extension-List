class RandomNumber {
    getInfo() {
        return {
            id: 'randomnumber',
            name: 'Random Number',
            blocks: [
                {
                    opcode: 'randomInteger',
                    blockType: 'reporter',
                    text: 'pick random integer from [min] to [max]',
                    arguments: {
                        min: {
                            type: 'number',
                            defaultValue: 1
                        },
                        max: {
                            type: 'number',
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'randomDecimal',
                    blockType: 'reporter',
                    text: 'pick random decimal from [min] to [max]',
                    arguments: {
                        min: {
                            type: 'number',
                            defaultValue: 0
                        },
                        max: {
                            type: 'number',
                            defaultValue: 1
                        }
                    }
                }
            ]
        };
    }

    randomInteger(args) {
        const min = Math.floor(args.min);
        const max = Math.floor(args.max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomDecimal(args) {
        const min = args.min;
        const max = args.max;
        return Math.random() * (max - min) + min;
    }
}

Scratch.extensions.register(new RandomNumber());
