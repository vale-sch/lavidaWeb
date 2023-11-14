"use strict";
var lavida;
(function (lavida) {
    class Circle {
        constructor(_x = 0, _y = 0, _radius = 0, _href = "", _chatName) {
            this.x = 0;
            this.y = 0;
            this.radius = 0;
            this.href = "";
            this.chatName = "";
            this.x = _x;
            this.y = _y;
            this.radius = _radius;
            this.href = _href;
            this.chatName = _chatName;
        }
    }
    lavida.Circle = Circle;
})(lavida || (lavida = {}));
