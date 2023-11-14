"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        static fromDatabase(data) {
            return new ChatHistory(data.chat_id, data.messages);
        }
        addMessage(sender_id, message) {
            const newMessage = {
                sender_id: sender_id,
                message: message,
                time_sent: new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' }),
            };
            this.messages.push(newMessage);
        }
        getChatHistory(_chatID) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`https://lavida-server.vercel.app/api/receive_chat?chatID=${_chatID}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 200) {
                        return ChatHistory.fromDatabase(yield response.json());
                        ;
                        // Process the messages as needed
                    }
                    else {
                        const data = yield response.json();
                        console.log(`Error: ${data.error}`);
                        return data;
                    }
                }
                catch (error) {
                    console.error(error);
                    return null;
                }
            });
        }
        sendMsg(chatID, senderID, message) {
            return __awaiter(this, void 0, void 0, function* () {
                this.addMessage(senderID, message);
                try {
                    let response = yield fetch('https://lavida-server.vercel.app/api/send_msg', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this),
                    });
                    if (response.status === 201) {
                        yield response.json();
                    }
                    else {
                        let data = yield response.json();
                        console.log(`Error: ${data.error}`);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
        deleteChat(_chatID) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let response = yield fetch(`https://lavida-server.vercel.app/api/delete_chat?chatID=${_chatID}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.status === 201) {
                        let deleted_chat = yield response.json();
                        console.log(deleted_chat);
                    }
                    else {
                        let data = yield response.json();
                        console.log(`Error: ${data.error}`);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
        createChat(circle, _meUsername) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let response = yield fetch('https://lavida-server.vercel.app/api/create_chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this),
                    });
                    if (response.status === 201) {
                        let rspTxt = yield response.text();
                        console.log(rspTxt);
                        window.location.href = circle.href + `&chatID=${this.chat_id}` + `&me=${_meUsername}`;
                    }
                    else {
                        let data = yield response.json();
                        console.log(`Error: ${data.error}`);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
    }
    lavida.ChatHistory = ChatHistory;
})(lavida || (lavida = {}));
