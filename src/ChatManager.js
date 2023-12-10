var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Chat } from "./Chat.js";
import { ChatHistory } from "./ChatHistory.js";
import { me } from "./Login.js";
import { socket } from "./SocketConnection.js";
import { User } from "./User.js";
let msgField;
let chatsHandler;
let sendButton;
let activeUsers;
let savedChats;
let chatNameField;
let chatHistory;
let chatID;
let chatPartnerName;
let oldChatHistory;
export function onStartChatManager() {
    chatNameField = document.getElementsByClassName("chat-header")[0];
    chatsHandler = document.getElementById("chatsHandler");
    sendButton = document.getElementById("sendButton");
    msgField = document.getElementsByClassName("message-input")[0].getElementsByTagName("textarea")[0];
    activeUsers = document.getElementById("activeUsers");
    savedChats = document.getElementById("savedChats");
    createPossibleChats();
    sendButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (msgField.value.trim() !== "") {
            let msgToSend = msgField.value;
            msgField.value = "";
            yield chatHistory.sendMsg(me.Name, msgToSend);
        }
    }));
    document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.key === 'Enter') {
            if (msgField.value.trim() !== "") {
                let msgToSend = msgField.value;
                msgField.value = ""; // Clear the message field
                e.preventDefault(); // Prevent the default behavior (line break)
                yield chatHistory.sendMsg(me.Name, msgToSend);
            }
        }
    }));
}
function createPossibleChats() {
    return __awaiter(this, void 0, void 0, function* () {
        yield User.fetchUsers();
        User.usersDB.forEach((user) => {
            let isSavedChat = false;
            if (me.Name != user.Name) {
                if (Object.keys(me.chats).length > 0) {
                    Object.entries(me.chats).forEach(([chatID, participants]) => {
                        //@ts-ignore
                        if (participants.includes(me.Name)) {
                            isSavedChat = true;
                            let liElement = document.createElement("li");
                            let profileImage = document.createElement("img");
                            profileImage.src = "../../avatars/1.png";
                            let nameOfChatPartner = document.createElement("span");
                            nameOfChatPartner.innerHTML = user.Name;
                            savedChats.appendChild(liElement);
                            liElement.appendChild(profileImage);
                            liElement.appendChild(nameOfChatPartner);
                            makeSavedChatsInteractable(liElement, chatID);
                        }
                    });
                }
                if (!isSavedChat) {
                    let liElement = document.createElement("li");
                    let profileImage = document.createElement("img");
                    profileImage.src = "../../avatars/1.png";
                    let nameOfChatPartner = document.createElement("span");
                    nameOfChatPartner.innerHTML = user.Name;
                    activeUsers.appendChild(liElement);
                    liElement.appendChild(profileImage);
                    liElement.appendChild(nameOfChatPartner);
                    makeActiveChatsInteractable(liElement, user);
                }
            }
        });
        //@ts-ignore
    });
}
function makeActiveChatsInteractable(userLiElement, user) {
    userLiElement.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        // Handle click event for the user card (e.g., redirect to chat page)
        chatID = Math.floor((Date.now() + Math.random())).toString();
        let participants = new Array;
        participants.push(me.Name);
        participants.push(user.Name);
        chatHistory = ChatHistory.createNew(chatID, me.Name, participants);
        oldChatHistory = chatHistory;
        chatHistory.createChat();
        chatPartnerName = user.Name;
        chatNameField.innerHTML = user.Name;
        socket.emit("startChat", chatID);
        chatStream(chatHistory);
        me.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants), me.Id);
    }));
}
function makeSavedChatsInteractable(userLiElement, chatID) {
    userLiElement.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        // Handle click event for the user card (e.g., redirect to chat page)
        //@ts-ignore
        chatHistory = yield ChatHistory.getChatHistory(chatID);
        oldChatHistory = chatHistory;
        console.log(chatHistory);
        chatHistory.participants.forEach(participant => {
            if (participant != me.Name)
                chatNameField.innerHTML = participant;
        });
        socket.emit("startChat", chatHistory.chat_id);
        chatStream(chatHistory);
        me.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants), me.Id);
    }));
}
export function handleReceiveMsg(senderID, message, timeSent) {
    let msg = document.createElement("p");
    msg.className = "txtMsg";
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
    socket.on(`chat=${chatHistory.chat_id}`, (chatHistoryStream) => {
        let chatHistoryTemp = JSON.parse(chatHistoryStream);
        while (oldChatHistory.messages.length < chatHistoryTemp[0].messages.length) {
            let newMsg = chatHistory.messages[oldChatHistory.messages.length];
            oldChatHistory.messages.push(newMsg);
            handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
    });
}
