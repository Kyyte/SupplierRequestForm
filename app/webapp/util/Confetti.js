/* global sap */
/*
Copyright 2018 Kiril Vatev
(https://github.com/catdad/canvas-confetti)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/

sap.ui.define([
    "jquery.sap.global"
], function (jQuery) {
    "use strict";
    var defaults = {
        particleCount: 100,
        angle: 90,
        spread: 45,
        startVelocity: 60,
        decay: 0.9,
        ticks: 200,
        x: 0.5,
        y: 0.5,
        zIndex: Math.pow(2, 31) - 1,
        colors: [
            //     "#26ccff",
            //     "#a25afd",
            //     "#ff5e7e",
            //     "#88ff5a",
            //     "#fcff42",
            //     "#ffa62d",
            //     "#ff36ff"
            "#957DAD",
            "#FFFFBA",
            "#bae1ff",
            "#FEC8D8",
            "#D3F8E2",
            "#ffd394",
            "#C1E7E3"
        ]
    };
    var oConfetti = {};
    var animationObj;

    oConfetti.frame = (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (cb) {
            window.setTimeout(cb, 1000 / 60);
        }).bind(window);
    oConfetti.noop = function () {
    };

    // create a promise if it exists, otherwise, just
    // call the function directly
    oConfetti.promise = function (func) {
        if (window.Promise) {
            return new window.Promise(func);
        }
        func(oConfetti.noop(), oConfetti.noop());
        return null;
    };

    oConfetti.convert = function (val, transform) {
        return transform ? transform(val) : val;
    };

    oConfetti.isOk = function (val) {
        return !(val === null || val === undefined);
    };

    oConfetti.prop = function (options, name, transform) {
        return oConfetti.convert(
            options && oConfetti.isOk(options[name]) ? options[name] : defaults[name],
            transform
        );
    };

    oConfetti.toDecimal = function (str) {
        return parseInt(str, 16);
    };

    oConfetti.hexToRgb = function (str) {
        var val = String(str).replace(/[^0-9a-f]/gi, "");
        if (val.length < 6) {
            val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
        }
        return {
            r: oConfetti.toDecimal(val.substring(0, 2)),
            g: oConfetti.toDecimal(val.substring(2, 4)),
            b: oConfetti.toDecimal(val.substring(4, 6))
        };
    };

    oConfetti.getOrigin = function (options) {
        var origin = oConfetti.prop(options, "origin", Object);
        origin.x = oConfetti.prop(origin, "x", Number);
        origin.y = oConfetti.prop(origin, "y", Number);
        return origin;
    };

    oConfetti.setCanvasSize = function (canvas) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    };

    oConfetti.getCanvas = function (zIndex) {
        var canvas = document.createElement("canvas");
        oConfetti.setCanvasSize(canvas);
        canvas.style.position = "fixed";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = zIndex;
        return canvas;
    };

    oConfetti.randomPhysics = function (opts) {
        var radAngle = opts.angle * (Math.PI / 180);
        var radSpread = opts.spread * (Math.PI / 180);
        return {
            x: opts.x,
            y: opts.y,
            wobble: Math.random() * 10,
            velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
            angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
            tiltAngle: Math.random() * Math.PI,
            color: oConfetti.hexToRgb(opts.color),
            tick: 0,
            totalTicks: opts.ticks,
            decay: opts.decay,
            random: Math.random() + 5,
            tiltSin: 0,
            tiltCos: 0,
            wobbleX: 0,
            wobbleY: 0
        };
    };

    oConfetti.updateFetti = function (context, fetti) {
        fetti.x += Math.cos(fetti.angle2D) * fetti.velocity;
        fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + 3; // + gravity
        fetti.wobble += 0.1;
        fetti.velocity *= fetti.decay;
        fetti.tiltAngle += 0.1;
        fetti.tiltSin = Math.sin(fetti.tiltAngle);
        fetti.tiltCos = Math.cos(fetti.tiltAngle);
        fetti.random = Math.random() + 5;
        fetti.wobbleX = fetti.x + (10 * Math.cos(fetti.wobble));
        fetti.wobbleY = fetti.y + (10 * Math.sin(fetti.wobble));
        var progress = (fetti.tick++) / fetti.totalTicks;
        var x1 = fetti.x + (fetti.random * fetti.tiltCos);
        var y1 = fetti.y + (fetti.random * fetti.tiltSin);
        var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
        var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);
        context.fillStyle = "rgba(" + fetti.color.r + ", " + fetti.color.g + ", " + fetti.color.b + ", " + (1 - progress) + ")";
        context.beginPath();
        context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
        context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
        context.lineTo(Math.floor(x2), Math.floor(y2));
        context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
        context.closePath();
        context.fill();
        return fetti.tick < fetti.totalTicks;
    };

    oConfetti.animate = function (canvas, fettis, done) {
        var animatingFettis = fettis.slice();
        var context = canvas.getContext("2d");
        var width = canvas.width;
        var height = canvas.height;

        function onResize() {
            // don't actually query the size here, since this
            // can execute frequently and rapidly
            width = height = null;
        }

        var prom = oConfetti.promise(function (resolve) {
            function update() {
                if (!width && !height) {
                    oConfetti.setCanvasSize(canvas);
                    width = canvas.width;
                    height = canvas.height;
                }
                context.clearRect(0, 0, width, height);
                animatingFettis = animatingFettis.filter(function (fetti) {
                    return oConfetti.updateFetti(context, fetti);
                });
                if (animatingFettis.length) {
                    oConfetti.frame(update);
                } else {
                    window.removeEventListener("resize", onResize);
                    done();
                    resolve();
                }
            }

            oConfetti.frame(update);
        });
        window.addEventListener("resize", onResize, false);
        return {
            addFettis: function (fettis) {
                animatingFettis = animatingFettis.concat(fettis);
                return prom;
            },
            canvas: canvas,
            promise: prom
        };
    };

    oConfetti.confetti = function (options) {
        var particleCount = oConfetti.prop(options, "particleCount", Math.floor);
        var angle = oConfetti.prop(options, "angle", Number);
        var spread = oConfetti.prop(options, "spread", Number);
        var startVelocity = oConfetti.prop(options, "startVelocity", Number);
        var decay = oConfetti.prop(options, "decay", Number);
        var colors = oConfetti.prop(options, "colors");
        var ticks = oConfetti.prop(options, "ticks", Number);
        var zIndex = oConfetti.prop(options, "zIndex", Number);
        var origin = oConfetti.getOrigin(options);
        var temp = particleCount;
        var fettis = [];
        var canvas = animationObj ? animationObj.canvas : oConfetti.getCanvas(zIndex);
        var startX = canvas.width * origin.x;
        var startY = canvas.height * origin.y;
        while (temp--) {
            fettis.push(
                oConfetti.randomPhysics({
                    x: startX,
                    y: startY,
                    angle: angle,
                    spread: spread,
                    startVelocity: startVelocity,
                    color: colors[temp % colors.length],
                    ticks: ticks,
                    decay: decay
                })
            );
        }

        // if we have a previous canvas already animating,
        // add to it
        if (animationObj) {
            return animationObj.addFettis(fettis);
        }
        document.body.appendChild(canvas);
        animationObj = oConfetti.animate(canvas, fettis, function () {
            animationObj = null;
            document.body.removeChild(canvas);
        });
        return animationObj.promise;
    };

    return oConfetti;
});
