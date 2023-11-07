"use strict";
var lavida;
(function (lavida) {
    class User {
        constructor(_id, _name, _password, _isActive) {
            this.id = 0;
            this.name = "";
            this.password = "";
            this.isActive = false;
            this.id = _id;
            this.name = _name;
            this.password = _password;
            this.isActive = _isActive;
        }
    }
    lavida.User = User;
})(lavida || (lavida = {}));
