"use strict";
var lavida;
(function (lavida) {
    class Overview {
        constructor(users, thisUser) {
            this.draw(users, thisUser);
        }
        draw(users, thisUser) {
            let canvas = document.getElementById('canvas');
            if (canvas.getContext) {
                let ctx = canvas.getContext('2d');
                var x = 150, y = 125, 
                // Radii of the white glow.
                innerRadius = 15, outerRadius = 125, 
                // Radius of the entire circle.
                radius = 75;
                var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
                gradient.addColorStop(0, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 1.5}) `);
                gradient.addColorStop(1, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 2.5})`);
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.font = '30pt Calibri';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                //@ts-ignore
                ctx.fillText("oeter", x, y + 10);
            }
        }
    }
    lavida.Overview = Overview;
})(lavida || (lavida = {}));
