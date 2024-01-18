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
let requestChats;
let chatElements = new Array();
let chatNameField;
let chatHistory;
let deleteChatButton;
let displayedMessages;
let currentlySelectedChat = null;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function onStartChatManager() {
    chatNameField = document.getElementById("chatHeaderH2");
    deleteChatButton = document.getElementById("deleteBtn");
    chatsHandler = document.getElementById("chatsHandler");
    sendButton = document.getElementById("sendButton");
    msgField = document.getElementsByClassName("message-input")[0].getElementsByTagName("textarea")[0];
    activeUsers = document.getElementById("activeUsers");
    savedChats = document.getElementById("savedChats");
    requestChats = document.getElementById("requestChats");
    socket.emit("newChatPartner", User.me);
    generateAllPossibleChats();
    addDeleteButton();
    sendButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (msgField.value.trim() !== "") {
            let msgToSend = msgField.value;
            if (chatHistory)
                if (chatHistory.chat_id != "") {
                    msgField.value = "";
                    yield chatHistory.sendMsg(User.me.name, msgToSend);
                }
        }
    }));
    document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.key === 'Enter') {
            if (msgField.value.trim() !== "") {
                let msgToSend = msgField.value;
                if (chatHistory)
                    if (chatHistory.chat_id != "") {
                        e.preventDefault(); // Prevent the default behavior (line break)
                        msgField.value = "";
                        yield chatHistory.sendMsg(User.me.name, msgToSend);
                    }
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
            yield delay(1000);
            yield User.updateMe();
            requestChats.innerHTML = "";
            savedChats.innerHTML = "";
            activeUsers.innerHTML = "";
            generateAllPossibleChats();
        }
    }));
    socket.on(`${User.me.name}`, (chatRequestUser) => __awaiter(this, void 0, void 0, function* () {
        yield delay(1500);
        yield User.updateMe();
        requestChats.innerHTML = "";
        savedChats.innerHTML = "";
        activeUsers.innerHTML = "";
        generateAllPossibleChats();
    }));
    socket.on(`${User.me.name}toDelete`, (chatToDelete) => __awaiter(this, void 0, void 0, function* () {
        yield delay(1000);
        yield User.updateMe();
        requestChats.innerHTML = "";
        savedChats.innerHTML = "";
        activeUsers.innerHTML = "";
        if (chatToDelete == chatHistory.chat_id) {
            chatsHandler.innerHTML = "";
            chatNameField.innerHTML = "LaVida Chat";
            deleteChatButton.style.visibility = "hidden";
        }
        generateAllPossibleChats();
    }));
}
function generateAllPossibleChats() {
    let activeChats = new Array();
    if (Object.keys(User.me.chats).length > 0) {
        Object.entries(User.me.chats).forEach(([chatID, chat]) => {
            var _a;
            //@ts-ignore
            if (chat.participants.includes(User.me.name)) {
                let partnerName = chat.participants.find(name => name !== User.me.name);
                let chatPartner = User.usersDB.find(user => user.name == partnerName);
                activeChats.push(partnerName !== null && partnerName !== void 0 ? partnerName : '');
                let liElement = document.createElement("li");
                let profileImage = document.createElement("img");
                profileImage.src = (_a = chatPartner === null || chatPartner === void 0 ? void 0 : chatPartner.profileImgURL) !== null && _a !== void 0 ? _a : "";
                let nameOfChatPartner = document.createElement("span");
                //@ts-ignore
                if (chat.isRequested) {
                    nameOfChatPartner.innerHTML = partnerName !== null && partnerName !== void 0 ? partnerName : '';
                    requestChats.appendChild(liElement);
                    liElement.appendChild(profileImage);
                    liElement.appendChild(nameOfChatPartner);
                    if (chatPartner) {
                        let chatElement = new ChatElement(liElement, chatPartner.name); // Fix: Added nullish coalescing operator
                        chatElements.push(chatElement);
                    }
                    User.usersDB.find(user => {
                        if (user.name == partnerName) {
                            liElement.addEventListener('click', () => requestedChatListener(liElement, chatID, chat, user));
                        }
                    });
                }
                else {
                    if (chatPartner) {
                        nameOfChatPartner.innerHTML = partnerName !== null && partnerName !== void 0 ? partnerName : '';
                        savedChats.appendChild(liElement);
                        liElement.appendChild(profileImage);
                        liElement.appendChild(nameOfChatPartner);
                        liElement.addEventListener('click', () => savedChatListener(liElement, chatID));
                        let chatElement = new ChatElement(liElement, chatPartner.name);
                        chatElements.push(chatElement);
                    }
                }
            }
        });
    }
    User.usersDB.forEach((user) => {
        if (User.me.name != user.name && !activeChats.includes(user.name)) {
            let liElement = document.createElement("li");
            let profileImage = document.createElement("img");
            profileImage.src = user.profileImgURL;
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
}
let activeChatListener = function (userLiElement, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentlySelectedChat)
            currentlySelectedChat.classList.remove('highlight');
        yield User.updateMe();
        let isAlreadyChatting = false;
        if (Object.keys(User.me.chats).length > 0) {
            Object.entries(User.me.chats).forEach(([chatID, chat]) => {
                //@ts-ignore
                if (chat.participants.includes(user.name)) {
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
        //check if activeusers akready removed the userLiElement
        if (activeUsers.contains(userLiElement)) {
            activeUsers.removeChild(userLiElement);
        }
        savedChats.appendChild(userLiElement);
        userLiElement.addEventListener('click', () => savedChatListener(userLiElement, chatID));
        userLiElement.classList.add('highlight');
        currentlySelectedChat = userLiElement;
        if (displayedMessages != undefined) {
            chatsHandler.innerHTML = "";
        }
        displayedMessages = ChatHistory.createNew(chatHistory.chat_id, User.me.name, chatHistory.participants);
        chatNameField.innerHTML = user.name;
        let usersInfo = new Array();
        usersInfo.push(User.me.name);
        usersInfo.push(user.name);
        socket.emit("startChat", chatID, User.me.id);
        socket.emit("newChatRequest", usersInfo);
        chatStream(chatHistory.chat_id);
        yield User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants, false, false), User.me.id);
        yield User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants, false, true), user.id);
        makeDeleteButtonVisible();
    });
};
let savedChatListener = function (userLiElement, chatID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentlySelectedChat) {
            currentlySelectedChat.classList.remove('highlight');
        }
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
            displayReceivedMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
        chatHistory.participants.find(participant => {
            if (participant != User.me.name)
                chatNameField.innerHTML = participant;
        });
        socket.emit("startChat", chatHistory.chat_id, User.me.id);
        chatStream(chatHistory.chat_id);
        makeDeleteButtonVisible();
    });
};
let requestedChatListener = function (userLiElement, chatID, chat, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentlySelectedChat) {
            currentlySelectedChat.classList.remove('highlight');
        }
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
            displayReceivedMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
        userLiElement.removeEventListener('click', () => requestedChatListener(userLiElement, chatID, chat, user));
        requestChats.removeChild(userLiElement);
        savedChats.appendChild(userLiElement);
        userLiElement.addEventListener('click', () => savedChatListener(userLiElement, chatID));
        chatHistory.participants.find(participant => {
            if (participant != User.me.name)
                chatNameField.innerHTML = participant;
        });
        socket.emit("startChat", chatHistory.chat_id, User.me.id);
        chatStream(chatHistory.chat_id);
        chat.isAccepted = true;
        chat.isRequested = false;
        yield User.updateChatsInUser(chat, User.me.id);
        yield User.updateChatsInUser(chat, user.id);
        yield User.updateMe();
        makeDeleteButtonVisible();
    });
};
function makeDeleteButtonVisible() {
    deleteChatButton.style.visibility = "visible";
}
function addDeleteButton() {
    deleteChatButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let user;
        if (chatHistory) {
            user = User.usersDB.find(user => user.name == chatHistory.participants.find(participant => participant != User.me.name));
        }
        //delete the chat from the database
        yield chatHistory.deleteChat(chatHistory.chat_id);
        //update the user and his participant in the database
        if (user)
            socket.emit("deleteChat", user.name, chatHistory.chat_id);
        requestChats.innerHTML = "";
        savedChats.innerHTML = "";
        activeUsers.innerHTML = "";
        //get the user of the currently selected chat
        yield User.removeChatFromUser(chatHistory.chat_id, (_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : 0);
        yield User.removeChatFromUser(chatHistory.chat_id, User.me.id);
        chatsHandler.innerHTML = "";
        chatNameField.innerHTML = "LaVida Chat";
        deleteChatButton.style.visibility = "hidden";
        yield User.fetchUsers();
        yield delay(200);
        yield User.updateMe();
        generateAllPossibleChats();
    }));
}
export function displayReceivedMsg(senderID, message, timeSent) {
    return __awaiter(this, void 0, void 0, function* () {
        let msg = document.createElement("p");
        msg.className = "txtMsg";
        msg.innerText = message;
        if (User.me.name != senderID) {
            let userToFind = User.usersDB.find(user => user.name == senderID);
            let receivedDiv = document.createElement("div");
            receivedDiv.className = "messageDiv received";
            let imgPartner = document.createElement("img");
            imgPartner.src = userToFind.profileImgURL;
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
            imgMe.src = User.me.profileImgURL;
            let span = document.createElement("span");
            span.className = "time-right";
            span.innerHTML = timeSent;
            sentDiv.appendChild(imgMe);
            sentDiv.appendChild(msg);
            sentDiv.appendChild(span);
            chatsHandler.appendChild(sentDiv);
        }
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    });
}
let oldChatID;
let oldListener = null;
function chatStream(chatID) {
    const chatListener = (newMsgStream) => {
        let newMsg = JSON.parse(newMsgStream);
        if (newMsg.sender_id != User.me.name)
            chatHistory.messages.push(newMsg);
        displayReceivedMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
    };
    // Remove old chat listener
    if (oldChatID && oldListener) {
        socket.off(oldChatID, oldListener);
    }
    // Add new chat listener
    socket.on(chatID, chatListener);
    oldChatID = chatID;
    oldListener = chatListener;
}
