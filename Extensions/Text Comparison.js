class TextComparisonExtension {
    getInfo() {
        return {
            id: 'textcomparison',
            name: 'Text Comparison',
            blocks: [
                {
                    opcode: 'calculateLevenshteinDistance',
                    blockType: 'reporter',
                    text: 'calculate Levenshtein distance of [text1] and [text2]',
                    arguments: {
                        text1: {
                            type: 'string',
                            defaultValue: 'Hello'
                        },
                        text2: {
                            type: 'string',
                            defaultValue: 'Helo'
                        }
                    }
                },
                {
                    opcode: 'calculateSimilarityScore',
                    blockType: 'reporter',
                    text: 'calculate similarity score of [text1] and [text2]',
                    arguments: {
                        text1: {
                            type: 'string',
                            defaultValue: 'Hello'
                        },
                        text2: {
                            type: 'string',
                            defaultValue: 'Helo'
                        }
                    }
                }
            ]
        };
    }

    calculateLevenshteinDistance(args) {
        const text1 = args.text1;
        const text2 = args.text2;
        return this.levenshteinDistance(text1, text2);
    }

    calculateSimilarityScore(args) {
        const text1 = args.text1;
        const text2 = args.text2;
        return this.similarityScore(text1, text2);
    }

    levenshteinDistance(text1, text2) {
        const m = text1.length;
        const n = text2.length;

        // Create a 2D array to store the Levenshtein distances
        const dp = new Array(m + 1);
        for (let i = 0; i <= m; i++) {
            dp[i] = new Array(n + 1);
        }

        // Initialize the first row and column of the array
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        // Compute the Levenshtein distances
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1, // Deletion
                        dp[i][j - 1] + 1, // Insertion
                        dp[i - 1][j - 1] + 1 // Substitution
                    );
                }
            }
        }

        return dp[m][n];
    }

    similarityScore(text1, text2) {
        const distance = this.levenshteinDistance(text1, text2);
        const maxLength = Math.max(text1.length, text2.length);
        return 1 - distance / maxLength;
    }
}

Scratch.extensions.register(new TextComparisonExtension());
