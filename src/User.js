"use strict";
var lavida;
(function (lavida) {
    class User {
        constructor() {
            this.id = 0;
            this.name = "";
            this.password = "";
            this.isActive = false;
        }
    }
    lavida.User = User;
})(lavida || (lavida = {}));
