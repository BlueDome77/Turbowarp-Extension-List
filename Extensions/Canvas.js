/**
 * @typedef {object} PenState - the pen state associated with a particular target.
 * @property {Boolean} penDown - tracks whether the pen should draw for this target.
 * @property {number} color - the current color (hue) of the pen.
 * @property {PenAttributes} penAttributes - cached pen attributes for the renderer. This is the authoritative value for
 *   diameter but not for pen color.
 */

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

class canvas {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'canvas',
            name: 'Canvas',
            color1: '#000000',
            color2: '#AAAAAA',
            blocks: [{
                    opcode: 'beginPath',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'beginPath',
                    arguments: {}
                },
                {
                    opcode: 'closePath',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'closePath',
                    arguments: {}
                },
                {
                    opcode: 'moveTo',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'moveTo([X],[Y])',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'lineTo',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'lineTo([X],[Y])',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'arc',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'arc([X],[Y],[RADIUS],[START_ANGLE],[END_ANGLE])',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        RADIUS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '100'
                        },
                        START_ANGLE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        END_ANGLE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '3.1415926'
                        }
                    }
                },
                {
                    opcode: 'rect',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'rect([X],[Y],[W],[H])',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '100'
                        },
                        H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '100'
                        }
                    }
                },
                {
                    opcode: 'clip',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clip'
                },
                {
                    opcode: 'setLineWidth',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setLineWidth([LINE_WIDTH])',
                    arguments: {
                        LINE_WIDTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'setLineCap',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setLineCap([LINE_CAP])',
                    arguments: {
                        LINE_CAP: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'round'
                        }
                    }
                },
                {
                    opcode: 'setStrokeStyle',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setStrokeStyle([STROKE_STYLE])',
                    arguments: {
                        STROKE_STYLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '#000000'
                        }
                    }
                },
                {
                    opcode: 'setFillStyle',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setFillStyle([FILL_STYLE])',
                    arguments: {
                        FILL_STYLE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '#000000'
                        }
                    }
                },
                {
                    opcode: 'stroke',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stroke'
                },
                {
                    opcode: 'fill',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'fill'
                },
                {
                    opcode: 'clearRect',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clearRect([X],[Y],[W],[H])',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '480'
                        },
                        H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '360'
                        }
                    }
                },
                {
                    opcode: 'setFont',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setFont([FONT])',
                    arguments: {
                        FONT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '30px Arial'
                        }
                    }
                },
                {
                    opcode: 'strokeText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'strokeText([TEXT],[X],[Y])',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'fillText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'fillText([TEXT],[X],[Y])',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'measureText',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'measureText([TEXT])',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    }
                },
                {
                    opcode: 'loadImage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'loadImage([IMAGE_ID])',
                    arguments: {
                        IMAGE_ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'bcaaa8547a07cfe572c0967ba829e99d.svg'
                        }
                    }
                },
                {
                    opcode: 'drawImage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'drawImage([IMAGE_ID],[X],[Y])',
                    arguments: {
                        IMAGE_ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'bcaaa8547a07cfe572c0967ba829e99d.svg'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'scale',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'scale([SCALE_W],[SCALE_H])',
                    arguments: {
                        SCALE_W: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1.0'
                        },
                        SCALE_H: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1.0'
                        }
                    }
                },
                {
                    opcode: 'rotate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'rotate([ANGLE])',
                    arguments: {
                        ANGLE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'translate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'translate([X],[Y])',
                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'transform',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'transform([A],[B],[C],[D],[E],[F])',
                    arguments: {
                        A: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        B: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        C: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        D: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        E: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        F: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'clearTransform',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clearTransform'
                },
                {
                    opcode: 'save',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'save'
                },
                {
                    opcode: 'restore',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'restore'
                },
                {
                    opcode: 'setGlobalAlpha',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setGlobalAlpha([ALPHA])',
                    arguments: {
                        ALPHA: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1.0'
                        }
                    }
                },
                {
                    opcode: 'setGlobalCompositeOperation',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setGlobalCompositeOperation([CompositeOperation])',
                    arguments: {
                        CompositeOperation: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'source-over'
                        }
                    }
                },
                {
                    opcode: 'switchCanvas',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'switchCanvas([NUMBER])',
                    arguments: {
                        NUMBER: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'stampOnStage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stampOnStage'
                },
            ],
            menus: {}
        };
    }

    _createCanvas() {
        var penSkinId = this.runtime.penSkinId;
        if (penSkinId == undefined) return null;
        var penSkin = this.runtime.renderer._allSkins[penSkinId];
        var size = penSkin.size;
        var w = size[0];
        var h = size[1];
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = w;
        tmpCanvas.height = h;
        var tmpCtx = tmpCanvas.getContext("2d");
        return {
            canvas: tmpCanvas,
            ctx: tmpCtx
        };
    }

    _getContext(idx) {
        if (!this._ctx) {
            this._canvasList = [];
            for (var i = 0; i < 8; i++) this._canvasList.push(null);
            var tmpCanvas = this._createCanvas();
            if (!tmpCanvas) return null;
            this._canvasList[0] = tmpCanvas;
            this._canvas = tmpCanvas.canvas;
            this._ctx = tmpCanvas.ctx;
            this._bufferedImages = {};

            this._skinId = this.runtime.renderer.createBitmapSkin(this._createCanvas().canvas, 1);
            this._drawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableSkinId(this._drawableId, this._skinId);
            this.runtime.renderer.updateDrawableVisible(this._drawableId, false);
        }
        if (idx != null) {
            var tmpCanvas = this._canvasList[idx];
            if (!tmpCanvas) {
                tmpCanvas = this._createCanvas();
                this._canvasList[idx] = tmpCanvas;
            }
            this._canvas = tmpCanvas.canvas;
            this._ctx = tmpCanvas.ctx;
        }
        return this._ctx;
    }

    beginPath() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.beginPath();
    }

    closePath() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.closePath();
    }

    moveTo(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.moveTo(x, y);
    }

    lineTo(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.lineTo(x, y);
    }

    rect(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const w = Cast.toNumber(args.W);
        const h = Cast.toNumber(args.H);
        ctx.rect(x, y, w, h);
    }

    arc(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const radius = Cast.toNumber(args.RADIUS);
        const startAngle = Cast.toNumber(args.START_ANGLE);
        const endAngle = Cast.toNumber(args.END_ANGLE);
        ctx.arc(x, y, radius, startAngle, endAngle);
    }

    clip() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.clip();
    }

    setLineWidth(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const lineWidth = args.LINE_WIDTH;
        ctx.lineWidth = lineWidth;
    }

    setLineCap(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const lineCap = args.LINE_CAP;
        ctx.lineCap = lineCap;
    }

    setStrokeStyle(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const strokeStyle = args.STROKE_STYLE;
        ctx.strokeStyle = strokeStyle;
    }

    setFillStyle(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const fillStyle = args.FILL_STYLE;
        ctx.fillStyle = fillStyle;
    }

    stroke() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.stroke();
    }

    fill() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.fill();
    }

    setFont(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const font = args.FONT;
        ctx.font = font;
    }

    strokeText(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const text = args.TEXT;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.strokeText(text, x, y);
    }

    fillText(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const text = args.TEXT;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.fillText(text, x, y);
    }

    measureText(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const text = args.TEXT;
        return ctx.measureText(text).width;
    }

    clearRect(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const w = Cast.toNumber(args.W);
        const h = Cast.toNumber(args.H);
        ctx.clearRect(x, y, w, h);
    }

    loadImage(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const imageId = args.IMAGE_ID;
        let self = this;
        if (!this._bufferedImages[imageId]) {
            return new Promise(resolve => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    this._bufferedImages[imageId] = img;

                    if (self._totalLoadedSize == null) self._totalLoadedSize = 0;
                    self._totalLoadedSize += 128 * 1024;
                    if (self._totalLoadedSize >= 2 * 1024 * 1024) {
                        var extUtils = self.runtime.extUtils;
                        var ctx = extUtils.getContext();
                        extUtils.ajax({
                            url: '/WebApi/Log/BlobAccess',
                            loadingStyle: "none",
                            hashStr: '',
                            data: {
                                targetType: ctx.targetType,
                                targetId: ctx.target.id,
                                deltaSize: this._totalLoadedSize,
                            },
                            type: 'POST'
                        }).done(r => {
                            self._totalLoadedSize = 0;
                        }).error(r => {});
                    }

                    resolve();
                };
                img.onerror = () => {
                    resolve();
                };
                var extUtils = this.runtime.extUtils;
                img.src = extUtils.getAssetFetchUrl(imageId);
            });
        }
    }

    drawImage(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const imageId = Cast.toString(args.IMAGE_ID);
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        if (imageId.length > 10) {
            const img = this._bufferedImages[imageId];
            if (!img) return;
            ctx.drawImage(img, x, y);
        } else {
            var idx = Math.min(Math.max(0, Cast.toNumber(args.IMAGE_ID)), 7);
            var tmpCanvas = this._canvasList[idx];
            if (tmpCanvas) ctx.drawImage(tmpCanvas.canvas, x, y);
        }
    }

    scale(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const scaleW = Cast.toNumber(args.SCALE_W);
        const scaleH = Cast.toNumber(args.SCALE_H);
        ctx.scale(scaleW, scaleH);
    }

    rotate(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const angle = Cast.toNumber(args.ANGLE);
        ctx.rotate(angle);
    }

    translate(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.translate(x, y);
    }

    transform(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const a = Cast.toNumber(args.A);
        const b = Cast.toNumber(args.B);
        const c = Cast.toNumber(args.C);
        const d = Cast.toNumber(args.D);
        const e = Cast.toNumber(args.E);
        const f = Cast.toNumber(args.F);
        ctx.transform(a, b, c, d, e, f);
    }

    clearTransform(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    save() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.save();
    }

    restore() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.restore();
    }

    setGlobalAlpha(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const alpha = Cast.toNumber(args.ALPHA);
        ctx.globalAlpha = alpha;
    }

    setGlobalCompositeOperation(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const compositeOperation = args.CompositeOperation;
        ctx.globalCompositeOperation = compositeOperation;
    }

    switchCanvas(args, util) {
        const number = Math.min(Math.max(0, Cast.toNumber(args.NUMBER)), 7);
        const ctx = this._getContext(number); //使用指定编号获取ctx时会自动设置为当前ctx
    }

    stampOnStage() {
        const ctx = this._getContext();
        if (!ctx) return;

        var imageData = ctx.getImageData(0, 0, 480, 360);
        var skin = this.runtime.renderer._allSkins[this._skinId];
        skin._setTexture(imageData);
        this.runtime.renderer.penStamp(this.runtime.penSkinId, this._drawableId);
        this.runtime.requestRedraw();
    }
}

Scratch.extensions.register(new canvas());
