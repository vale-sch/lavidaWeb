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
    const params = new URLSearchParams(window.location.search);
    let chatPartnerName = params.get("user");
    let chatID = params.get("chatID");
    let meUsername = params.get("me");
    document.getElementById("chatName").innerText = chatPartnerName;
    let msgField = document.getElementById("inputText");
    let chatsHandler = document.getElementById("chatsHandler");
    window.addEventListener("load", changeGradient);
    function changeGradient() {
        document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 23%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 51%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 88%)`;
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    }
    let chatHistory = lavida.ChatHistory.createNew(chatID, meUsername);
    let oldChatHistory = lavida.ChatHistory.createNew(chatID, meUsername);
    document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
            let msgToSend = msgField.innerText;
            msgField.innerText = "";
            yield chatHistory.sendMsg(chatID, meUsername, msgToSend);
            getNewMessages(chatID);
        }
    }));
    document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.key === 'Enter') {
            if (!chatID)
                return;
            if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
                let msgToSend = msgField.innerText;
                msgField.innerText = "";
                yield chatHistory.sendMsg(chatID, meUsername, msgToSend);
                getNewMessages(chatID);
            }
        }
    }));
    function handleReceiveMsg(senderID, message, timeSent) {
        if (chatPartnerName == senderID)
            console.log("mymessage");
        let msg = document.createElement("p");
        msg.className = "txt";
        msg.innerText = message;
        let sentDiv = document.createElement("div");
        sentDiv.className = "messageDiv received";
        let imgMe = document.createElement("img");
        imgMe.src = "/avatars/2.png";
        let span = document.createElement("span");
        span.className = "time-left";
        span.innerHTML = timeSent;
        sentDiv.appendChild(imgMe);
        sentDiv.appendChild(msg);
        sentDiv.appendChild(span);
        chatsHandler.appendChild(sentDiv);
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    }
    function getNewMessages(_chatID) {
        return __awaiter(this, void 0, void 0, function* () {
            chatHistory = (yield chatHistory.getChatHistory(chatID));
            while (oldChatHistory.messages.length < chatHistory.messages.length) {
                let newMsg = chatHistory.messages[oldChatHistory.messages.length];
                oldChatHistory.messages.push(newMsg);
                handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
            }
        });
    }
    // Example usage
    getNewMessages(chatID);
})(lavida || (lavida = {}));
