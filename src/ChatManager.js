var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChatHistory } from "./ChatHistory.js";
import { socket } from "./SocketConnection.js";
const params = new URLSearchParams(window.location.search);
let chatPartnerName = params.get("user");
let chatID = params.get("chatID");
let meUsername = params.get("me");
document.getElementById("chatName").innerText = chatPartnerName;
let msgField = document.getElementById("inputText");
let chatsHandler = document.getElementById("chatsHandler");
export let chatHistory = ChatHistory.createNew(chatID, meUsername);
let oldChatHistory = ChatHistory.createNew(chatID, meUsername);
function sendMsg(senderID, message) {
    return __awaiter(this, void 0, void 0, function* () {
        chatHistory.addMessage(senderID, message);
        try {
            let response = yield fetch('https://lavida-server.vercel.app/api/send_msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chatHistory),
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
document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
        let msgToSend = msgField.innerText;
        msgField.innerText = "";
        yield sendMsg(meUsername, msgToSend);
    }
}));
document.addEventListener('keydown', (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (e.key === 'Enter') {
        if (!chatID)
            return;
        if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
            let msgToSend = msgField.innerText;
            msgField.innerText = "";
            yield sendMsg(meUsername, msgToSend);
        }
    }
}));
export function handleReceiveMsg(senderID, message, timeSent) {
    let msg = document.createElement("p");
    msg.className = "txt";
    msg.innerText = message;
    if (chatPartnerName == senderID) {
        let receivedDiv = document.createElement("div");
        receivedDiv.className = "messageDiv received";
        let imgPartner = document.createElement("img");
        imgPartner.src = "/avatars/2.png";
        let span = document.createElement("span");
        span.className = "time-left";
        span.innerHTML = timeSent;
        receivedDiv.appendChild(imgPartner);
        receivedDiv.appendChild(msg);
        receivedDiv.appendChild(span);
        chatsHandler.appendChild(receivedDiv);
    }
    else {
        let sentDiv = document.createElement("div");
        sentDiv.className = "messageDiv sent";
        let imgMe = document.createElement("img");
        imgMe.src = "/avatars/1.png";
        let span = document.createElement("span");
        span.className = "time-right";
        span.innerHTML = timeSent;
        sentDiv.appendChild(imgMe);
        sentDiv.appendChild(msg);
        sentDiv.appendChild(span);
        chatsHandler.appendChild(sentDiv);
    }
    chatsHandler.scrollTop = chatsHandler.scrollHeight;
}
function chatStream(chatHistory) {
    let oldChatHistory = chatHistory;
    console.log("JO");
    socket.on(`chat=${chatHistory.chat_id}`, (chatHistoryStream) => {
        let chatHistoryTemp = JSON.parse(chatHistoryStream);
        console.log(chatHistoryTemp);
        while (oldChatHistory.messages.length < chatHistoryTemp[0].messages.length) {
            let newMsg = chatHistory.messages[oldChatHistory.messages.length];
            oldChatHistory.messages.push(newMsg);
            handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
    });
}
//connectClient(me);
chatStream(chatHistory);
