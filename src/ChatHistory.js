"use strict";
var lavida;
(function (lavida) {
    class ChatHistory {
        constructor(chat_id, messages) {
            this.chat_id = chat_id;
            this.messages = messages;
        }
        static createNew(chat_id, sender_id) {
            const newMessage = {
                sender_id: sender_id,
                message: "",
                time_sent: "",
            };
            return new ChatHistory(chat_id, [newMessage]);
        }
        addMessage(sender_id, message) {
            const newMessage = {
                sender_id: sender_id,
                message: message,
                time_sent: new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' }),
            };
            this.messages.push(newMessage);
        }
        static fromDatabase(data) {
            return new ChatHistory(data.chat_id, data.messages);
        }
        toDatabase() {
            return {
                chat_id: this.chat_id,
                messages: this.messages,
            };
        }
    }
    lavida.ChatHistory = ChatHistory;
})(lavida || (lavida = {}));
