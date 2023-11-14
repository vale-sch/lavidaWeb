"use strict";
var lavida;
(function (lavida) {
    class UserCard {
        constructor(_href = "", _chatName) {
            this.href = "";
            this.chatName = "";
            this.href = _href;
            this.chatName = _chatName;
        }
    }
    lavida.UserCard = UserCard;
})(lavida || (lavida = {}));
