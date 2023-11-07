"use strict";
var lavida;
(function (lavida) {
    class User {
        constructor(_id, _name, __password, _isactive) {
            this.id = 0;
            this.name = "";
            this._password = "";
            this.isactive = false;
            this.id = _id;
            this.name = _name;
            this._password = __password;
            this.isactive = _isactive;
        }
        get password() {
            return this._password;
        }
    }
    lavida.User = User;
})(lavida || (lavida = {}));
