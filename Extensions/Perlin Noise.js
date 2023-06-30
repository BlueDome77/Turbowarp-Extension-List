(function (Scratch) {
    'use strict';

    const icon = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMjUuMzU0ODEiIGhlaWdodD0iMjI1LjM1NDgiIHZpZXdCb3g9IjAsMCwyMjUuMzU0ODEsMjI1LjM1NDgiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjcuMzIyODUsLTY3LjMyMjYpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTEyNy4zMjI4NywxODBjMCwtNjIuMjMwMDEgNTAuNDQ3MzksLTExMi42Nzc0IDExMi42Nzc0LC0xMTIuNjc3NGM2Mi4yMzAwMSwwIDExMi42Nzc0LDUwLjQ0NzM5IDExMi42Nzc0LDExMi42Nzc0YzAsNjIuMjMwMDEgLTUwLjQ0NzM5LDExMi42Nzc0IC0xMTIuNjc3NCwxMTIuNjc3NGMtNjIuMjMwMDEsMCAtMTEyLjY3NzQsLTUwLjQ0NzM5IC0xMTIuNjc3NCwtMTEyLjY3NzR6IiBmaWxsPSIjZTYyODJhIiBzdHJva2U9Im5vbmUiLz48cGF0aCBkPSJNMTI3LjMyMjg2LDE4MGMwLC02Mi4yMzAwMSA1MC40NDczOSwtMTEyLjY3NzQgMTEyLjY3NzQsLTExMi42Nzc0YzYyLjIzMDAxLDAgMTEyLjY3NzQsNTAuNDQ3MzkgMTEyLjY3NzQsMTEyLjY3NzRjMCw2Mi4yMzAwMSAtNTAuNDQ3MzksMTEyLjY3NzQgLTExMi42Nzc0LDExMi42Nzc0Yy02Mi4yMzAwMSwwIC0xMTIuNjc3NCwtNTAuNDQ3MzkgLTExMi42Nzc0LC0xMTIuNjc3NHoiIGZpbGw9IiNlNjI4MmEiIHN0cm9rZT0ibm9uZSIvPjxwYXRoIGQ9Ik0zMDcuODI3MTEsMjM1LjAxMzU5Yy0xLjYxMjIzLDIuNzM3OTcgLTQuOTMyODgsMi40NjE0NyAtNy42NDkyMywxLjA4NTAzYy0yLjgzNDI1LC0xLjQzNjE5IC00MS42NTEwMSwtMjQuMDQ3NDkgLTQxLjY1MTAxLC0yNC4wNDc0OWMwLDAgLTAuMTUyMjEsMzAuMDcyMDYgLTAuMTUyMjEsNDkuMzE5ODhjMCwyLjU5NDYzIC0xLjUyNTkxLDQuNTU2MjcgLTQuMDk5NSw0Ljk1MTM5Yy0yLjU3MzYsMC4zOTUxMiAtMjQuODYyNzIsMC4wMDg2OSAtMjguMDM5MDQsLTAuMDE3MTZjLTMuMTc2MzIsLTAuMDI1ODUgLTQuNjk2NzMsLTIuOTgzNDQgLTQuNzY3MjUsLTYuMDc1NzNjLTAuMDcyMzcsLTMuMTc1NiAwLC00OC4wOTczMiAwLC00OC4wOTczMmMwLDAgLTI1Ljg4OTU3LDE1LjMxNTYxIC00Mi43ODk5OSwyNC41Mjg1N2MtMi4yNDc4MywxLjI5NDkzIC00LjcwOTY5LDAuOTYwNTEgLTYuMzM4MzYsLTEuMDcwM2MtMS42Mjg2NywtMi4wMzA4MSAtMTIuNDI4NzcsLTIxLjUzNDEgLTE0LjAwMjM2LC0yNC4yOTI5MmMtMS41NzM1OSwtMi43NTg4MSAwLjYyNTYsLTUuODUzMDQgMi44Njk2OSwtNy4xNjgxYzIuNzQwMTcsLTEuNjA1NzkgNDEuODAwNzUsLTI0LjEzNTg0IDQxLjgwMDc1LC0yNC4xMzU4NGMwLDAgLTQwLjU1NzI0LC0yMy4zMjU2NSAtNDIuOTA1NCwtMjQuNzc5Yy0yLjM0ODE2LC0xLjQ1MzM1IC0yLjc3NTY2LC0zLjk4ODI3IC0xLjc2MDEyLC02LjU2NjY0YzEuMDE1NTQsLTIuNTc4MzcgMTEuNTU0MzIsLTE5Ljk1MjM2IDEzLjY0ODg1LC0yMy42MTc4N2MyLjA5NDU0LC0zLjY2NTUxIDQuMDc3MDcsLTMuMDgwNjYgNi42MzUzNiwtMS44OTk5OWMyLjU1ODI5LDEuMTgwNjcgNDIuODM2NjgsMjQuNzMyMzEgNDIuODM2NjgsMjQuNzMyMzFjMCwwIC0wLjA2NTUyLC00Ni42MTg2NSAwLjAxNDczLC00OS4zNzg3M2MwLjA4MDI1LC0yLjc2MDA4IDIuMDYzNTUsLTQuMzk4NyA0LjgwNDA4LC00LjgwOTA0YzIuNzQwNTMsLTAuNDEwMzQgMjcuMDM5ODksMC4wMzQzNiAyNy4xMDEyNywwLjAzMTkzYzAuMDYxMzgsLTAuMDAyNDMgMC4xMTc4NSwtMC4wMTcyMSAwLjE3OTIzLC0wLjAxNzIxYzIuODA2NSwwIDQuNzAyNDksMS45OTA0MiA0Ljk1ODczLDQuNzk0MjdjMC4yNTYyNCwyLjgwMzg1IDAsNDkuNDYyMjcgMCw0OS40NjIyN2MwLDAgNDAuMzQyMTcsLTIzLjM3ODYyIDQyLjc3NTMxLC0yNC42ODU3NWMyLjQzMzE0LC0xLjMwNzEzIDQuODQyOTksLTAuNDExMDIgNi41NjkwNywxLjc1NzY4YzEuNzI2MDcsMi4xNjg3MSAxMy40OTE2OSwyMy40MzYyMSAxMy41MjM2MiwyMy40ODc3M2MwLjAzMTkzLDAuMDUxNTIgMC4wNzM2NywwLjA5MzMgMC4xMDMxMiwwLjE0NDgyYzEuNDA0NDksMi40MzM0MSAwLjYyNzksNS4wNzI2MiAtMS42NzQxOSw2LjY5OTIxYy0yLjMwMjA5LDEuNjI2NiAtNDIuNjg5MzgsMjQuNjQ2NDMgLTQyLjY4OTM4LDI0LjY0NjQzbDQyLjQwOTUsMjQuNjc4MzZjMC4wMjQ1OSwwLjAxNDcyIDAuMDU0MDQsMC4wMjIwNyAwLjA3ODU4LDAuMDM2NzljMi4xMTM1OSwxLjIyMjUxIDIuOTc1MiwzLjc2MDggMi4xNzAwNiw1Ljk3NzUxYy0wLjgwNTE0LDIuMjE2NzEgLTEyLjM0ODM0LDIxLjU4NjkyIC0xMy45NjA1OCwyNC4zMjQ4OXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2I4MjAyMiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjExMi42NzcxNDU6MTEyLjY3NzQwNS0tPg==';

    class PerlinNoise {
        constructor() {
            this.seed = Math.random();
        }

        getInfo() {
            return {
                id: 'perlinnoise',
                name: 'Perlin Noise',
                color1: '#f2c911',
                color2: '#b69507',
                menuIconURI: icon,
                blocks: [
                    {
                        opcode: 'setSeed',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set Perlin noise seed to [SEED]',
                        arguments: {
                            SEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                        },
                    },
                    {
                        opcode: 'getNoise1D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Perlin noise 1D at [X]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                        },
                    },
                    {
                        opcode: 'getNoise2D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Perlin noise 2D at x:[X] y:[Y]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                        },
                    },
                    {
                        opcode: 'getNoise3D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Perlin noise 3D at x:[X] y:[Y] z:[Z]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0',
                            },
                        },
                    },
                ],
            };
        }

        setSeed(args) {
            this.seed = args.SEED;
        }

        getNoise1D(args) {
            const x = args.X;
            return this.perlinNoise1D(x);
        }

        getNoise2D(args) {
            const x = args.X;
            const y = args.Y;
            return this.perlinNoise2D(x, y);
        }

        getNoise3D(args) {
            const x = args.X;
            const y = args.Y;
            const z = args.Z;
            return this.perlinNoise3D(x, y, z);
        }

        perlinNoise1D(x) {
            const floorX = Math.floor(x);
            const t = x - floorX;
            const tRemapSmoothstep = t * t * (3 - 2 * t);

            const xMin = floorX;
            const xMax = xMin + 1;

            const y = this.lerp(this.random(xMin), this.random(xMax), tRemapSmoothstep);

            return y;
        }

        perlinNoise2D(x, y) {
            const floorX = Math.floor(x);
            const floorY = Math.floor(y);
            const tX = x - floorX;
            const tY = y - floorY;
            const tRemapSmoothstepX = tX * tX * (3 - 2 * tX);
            const tRemapSmoothstepY = tY * tY * (3 - 2 * tY);

            const xMin = floorX;
            const xMax = xMin + 1;

            const yMin = floorY;
            const yMax = yMin + 1;

            const sx = this.lerp(this.random(xMin, yMin), this.random(xMax, yMin), tRemapSmoothstepX);
            const sy = this.lerp(this.random(xMin, yMax), this.random(xMax, yMax), tRemapSmoothstepX);

            const value = this.lerp(sx, sy, tRemapSmoothstepY);

            return value;
        }

        perlinNoise3D(x, y, z) {
            const floorX = Math.floor(x);
            const floorY = Math.floor(y);
            const floorZ = Math.floor(z);
            const tX = x - floorX;
            const tY = y - floorY;
            const tZ = z - floorZ;
            const tRemapSmoothstepX = tX * tX * (3 - 2 * tX);
            const tRemapSmoothstepY = tY * tY * (3 - 2 * tY);
            const tRemapSmoothstepZ = tZ * tZ * (3 - 2 * tZ);

            const xMin = floorX;
            const xMax = xMin + 1;

            const yMin = floorY;
            const yMax = yMin + 1;

            const zMin = floorZ;
            const zMax = zMin + 1;

            const sx = this.lerp(this.random(xMin, yMin, zMin), this.random(xMax, yMin, zMin), tRemapSmoothstepX);
            const sy = this.lerp(this.random(xMin, yMax, zMin), this.random(xMax, yMax, zMin), tRemapSmoothstepX);
            const sz = this.lerp(this.random(xMin, yMin, zMax), this.random(xMax, yMin, zMax), tRemapSmoothstepX);

            const sxy = this.lerp(sx, sy, tRemapSmoothstepY);
            const szw = this.lerp(sz, this.random(xMin, yMax, zMax), tRemapSmoothstepY);

            const value = this.lerp(sxy, szw, tRemapSmoothstepZ);

            return value;
        }

        random(...args) {
            let value = 0;
            for (const arg of args) {
                value += arg * 10000;
            }
            value += this.seed * 10000;
            value = Math.sin(value) * 10000;
            return value - Math.floor(value);
        }

        lerp(a, b, t) {
            return a + t * (b - a);
        }
    }

    Scratch.extensions.register(new PerlinNoise());
})(window.Scratch = window.Scratch || {});
