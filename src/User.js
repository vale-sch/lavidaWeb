"use strict";
var lavida;
(function (lavida) {
    class User {
        constructor(_id, _name, __password, _isactive) {
            this.id = 0;
            this.name = "";
            this.password = "";
            this.isactive = false;
            this.id = _id;
            this.name = _name;
            this.password = __password;
            this.isactive = _isactive;
        }
        get Id() {
            return this.id;
        }
        get Name() {
            return this.name;
        }
        get Password() {
            return this.password;
        }
    }
    lavida.User = User;
})(lavida || (lavida = {}));
