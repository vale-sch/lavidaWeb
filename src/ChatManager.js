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
import { ChatElement } from "./ChatElement.js";
import { ChatHistory } from "./ChatHistory.js";
import { socket } from "./SocketConnection.js";
import { User } from "./User.js";
let msgField;
let chatsHandler;
let sendButton;
let activeUsers;
let savedChats;
let chatElements = new Array();
let chatNameField;
let chatHistory;
let displayedMessages;
let currentlySelectedChat = null;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function onStartChatManager() {
    chatNameField = document.getElementsByClassName("chat-header")[0];
    chatsHandler = document.getElementById("chatsHandler");
    sendButton = document.getElementById("sendButton");
    msgField = document.getElementsByClassName("message-input")[0].getElementsByTagName("textarea")[0];
    activeUsers = document.getElementById("activeUsers");
    savedChats = document.getElementById("savedChats");
    socket.emit("newChatPartner", User.me);
    generateAllPossibleChats();
    sendButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (msgField.value.trim() !== "") {
            let msgToSend = msgField.value;
            msgField.value = "";
            yield chatHistory.sendMsg(User.me.name, msgToSend);
        }
    }));
    document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.key === 'Enter') {
            if (msgField.value.trim() !== "") {
                let msgToSend = msgField.value;
                msgField.value = ""; // Clear the message field
                e.preventDefault(); // Prevent the default behavior (line break)
                yield chatHistory.sendMsg(User.me.name, msgToSend);
            }
        }
    }));
    socket.on("newChat", (user) => __awaiter(this, void 0, void 0, function* () {
        let newUser = user;
        let isNewUser = true;
        User.usersDB.forEach(user => {
            if (user.id == newUser.id) {
                isNewUser = false;
                User.fetchUsers();
            }
        });
        if (isNewUser) {
            let liElement = document.createElement("li");
            let profileImage = document.createElement("img");
            profileImage.src = "../../avatars/2.png";
            let nameOfChatPartner = document.createElement("span");
            nameOfChatPartner.innerHTML = user.name;
            activeUsers.appendChild(liElement);
            liElement.appendChild(profileImage);
            liElement.appendChild(nameOfChatPartner);
            liElement.addEventListener('click', () => activeChatListener(liElement, user));
            let chatElement = new ChatElement(liElement, user.name);
            chatElements.push(chatElement);
        }
        yield User.fetchUsers();
    }));
    socket.on(`${User.me.name}`, (chatRequestUser) => __awaiter(this, void 0, void 0, function* () {
        chatElements.forEach((chatElement) => __awaiter(this, void 0, void 0, function* () {
            if (chatElement.name == chatRequestUser) {
                let userToFind = User.usersDB.find(user => user.name == chatRequestUser);
                if (userToFind) {
                    chatElement.HTMLLIElement.removeEventListener('click', () => activeChatListener(chatElement.HTMLLIElement, userToFind));
                }
                activeUsers.removeChild(chatElement.HTMLLIElement);
                savedChats.appendChild(chatElement.HTMLLIElement);
                User.updateMe();
                yield delay(500);
                User.updateMe();
                yield delay(500);
                User.updateMe();
                if (Object.keys(User.me.chats).length > 0) {
                    Object.entries(User.me.chats).forEach(([chatID, participants]) => {
                        //@ts-ignore
                        if (participants.includes(userToFind.name)) {
                            chatElement.HTMLLIElement.addEventListener('click', () => savedChatListener(chatElement.HTMLLIElement, chatID));
                        }
                    });
                }
            }
        }));
    }));
}
let activeChatListener = function (userLiElement, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!savedChats.contains(userLiElement)) {
            return;
        }
        if (currentlySelectedChat) {
            currentlySelectedChat.classList.remove('highlight');
        }
        yield User.updateMe();
        let isAlreadyChatting = false;
        if (Object.keys(User.me.chats).length > 0) {
            Object.entries(User.me.chats).forEach(([chatID, participants]) => {
                //@ts-ignore
                if (participants.includes(user.name)) {
                    userLiElement.removeEventListener('click', () => activeChatListener(userLiElement, user));
                    activeUsers.removeChild(userLiElement);
                    savedChats.appendChild(userLiElement);
                    savedChatListener(userLiElement, chatID);
                    isAlreadyChatting = true;
                }
            });
        }
        if (isAlreadyChatting)
            return;
        // Handle click event for the user card (e.g., redirect to chat page)
        let chatID = Math.floor((Date.now() + Math.random())).toString();
        let participants = new Array;
        participants.push(User.me.name);
        participants.push(user.name);
        chatHistory = ChatHistory.createNew(chatID, User.me.name, participants);
        yield chatHistory.createChat();
        userLiElement.removeEventListener('click', () => activeChatListener(userLiElement, user));
        activeUsers.removeChild(userLiElement);
        savedChats.appendChild(userLiElement);
        userLiElement.addEventListener('click', () => savedChatListener(userLiElement, chatID));
        userLiElement.classList.add('highlight');
        currentlySelectedChat = userLiElement;
        if (displayedMessages != undefined) {
            chatsHandler.innerHTML = "";
        }
        displayedMessages = ChatHistory.createNew(chatHistory.chat_id, User.me.name, chatHistory.participants);
        chatNameField.innerHTML = user.name;
        socket.emit("startChat", chatID, User.me.id);
        let usersInfo = new Array();
        usersInfo.push(User.me.name);
        usersInfo.push(user.name);
        socket.emit("newChatRequest", usersInfo);
        chatStream(chatHistory.chat_id);
        console.log(User.me.id, user.id);
        yield User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants), User.me.id);
        yield User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants), user.id);
    });
};
let savedChatListener = function (userLiElement, chatID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentlySelectedChat) {
            currentlySelectedChat.classList.remove('highlight');
        }
        // Handle click event for the user card (e.g., redirect to chat page)
        //@ts-ignore
        chatHistory = yield ChatHistory.getChatHistory(chatID);
        if (displayedMessages != undefined) {
            chatsHandler.innerHTML = "";
        }
        displayedMessages = ChatHistory.createNew(chatHistory.chat_id, User.me.name, chatHistory.participants);
        userLiElement.classList.add('highlight');
        currentlySelectedChat = userLiElement;
        while (displayedMessages.messages.length < chatHistory.messages.length) {
            let newMsg = chatHistory.messages[displayedMessages.messages.length];
            displayedMessages.messages.push(newMsg);
            handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
        chatHistory.participants.find(participant => {
            if (participant != User.me.name)
                chatNameField.innerHTML = participant;
        });
        socket.emit("startChat", chatHistory.chat_id, User.me.id);
        chatStream(chatHistory.chat_id);
    });
};
function generateAllPossibleChats() {
    return __awaiter(this, void 0, void 0, function* () {
        let savedChatsInfo = new Array();
        if (Object.keys(User.me.chats).length > 0) {
            Object.entries(User.me.chats).forEach(([chatID, participants]) => {
                //@ts-ignore
                if (participants.includes(User.me.name)) {
                    //@ts-ignore
                    const partnerName = participants.find(name => name !== User.me.name);
                    savedChatsInfo.push(partnerName);
                    let liElement = document.createElement("li");
                    let profileImage = document.createElement("img");
                    profileImage.src = "../../avatars/1.png";
                    let nameOfChatPartner = document.createElement("span");
                    nameOfChatPartner.innerHTML = partnerName;
                    savedChats.appendChild(liElement);
                    liElement.appendChild(profileImage);
                    liElement.appendChild(nameOfChatPartner);
                    liElement.addEventListener('click', () => savedChatListener(liElement, chatID));
                }
            });
        }
        yield User.fetchUsers();
        User.usersDB.forEach((user) => {
            if (User.me.name != user.name && !savedChatsInfo.includes(user.name)) {
                let liElement = document.createElement("li");
                let profileImage = document.createElement("img");
                profileImage.src = "../../avatars/2.png";
                let nameOfChatPartner = document.createElement("span");
                nameOfChatPartner.innerHTML = user.name;
                activeUsers.appendChild(liElement);
                liElement.appendChild(profileImage);
                liElement.appendChild(nameOfChatPartner);
                liElement.addEventListener('click', () => activeChatListener(liElement, user));
                let chatElement = new ChatElement(liElement, user.name);
                chatElements.push(chatElement);
            }
        });
    });
}
export function handleReceiveMsg(senderID, message, timeSent) {
    let msg = document.createElement("p");
    msg.className = "txtMsg";
    msg.innerText = message;
    if (User.me.name != senderID) {
        let receivedDiv = document.createElement("div");
        receivedDiv.className = "messageDiv received";
        let imgPartner = document.createElement("img");
        imgPartner.src = "../../avatars/2.png";
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
        imgMe.src = "../../avatars/1.png";
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
let oldChatID = "";
function chatStream(chatID) {
    const chatListener = (newMsgStream) => {
        let newMsg = JSON.parse(newMsgStream);
        handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
    };
    // Add the event listener
    socket.on(`chat=${chatID}`, chatListener);
    // Later, to remove the specific listener
    if (oldChatID != "")
        socket.off(`chat=${oldChatID}`, chatListener);
    oldChatID = chatID;
}
