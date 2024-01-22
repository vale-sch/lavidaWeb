import { Chat } from "./Chat.js";
import { ChatElement } from "./ChatElement.js";
import { ChatHistory, Message } from "./ChatHistory.js";
import { hideLoadingOverlay, showLoadingOverlay } from "./SiteChanger.js";
import { socket } from "./SocketConnection.js";
import { User } from "./User.js";





let msgField: HTMLTextAreaElement;
let chatsHandler: HTMLDivElement;
let sendButton: HTMLButtonElement
let activeUsers: HTMLUListElement;
let savedChats: HTMLUListElement;
let requestChats: HTMLUListElement;

let chatElements: Array<ChatElement> = new Array<ChatElement>();
let chatNameField: HTMLHeadElement;

let chatHistory: ChatHistory;
let deleteChatButton: HTMLButtonElement;
let displayedMessages: ChatHistory;
let currentlySelectedChat: HTMLLIElement | null = null;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function onStartChatManager() {
    chatNameField = document.getElementById("chatHeaderH2") as HTMLHeadingElement;
    deleteChatButton = document.getElementById("deleteBtn") as HTMLButtonElement;
    chatsHandler = <HTMLDivElement>document.getElementById("chatsHandler");
    sendButton = document.getElementById("sendButton") as HTMLButtonElement;
    msgField = <HTMLTextAreaElement>document.getElementsByClassName("message-input")[0].getElementsByTagName("textarea")[0];

    activeUsers = <HTMLUListElement>document.getElementById("activeUsers");
    savedChats = <HTMLUListElement>document.getElementById("savedChats");
    requestChats = <HTMLUListElement>document.getElementById("requestChats");
    socket.emit("newChatPartner", User.me);
    generateAllPossibleChats();
    appendDeleteButtonToEvent();

    sendButton.addEventListener("click", async () => {
        if (msgField.value.trim() !== "") {
            let msgToSend: string = msgField.value;
            if (chatHistory)
                if (chatHistory.chat_id != "") {
                    msgField.value = "";
                    await chatHistory.sendMsg(User.me.name, msgToSend);
                }

        }
    });

    document.addEventListener('keydown', async (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            if (msgField.value.trim() !== "") {
                let msgToSend: string = msgField.value;
                if (chatHistory)
                    if (chatHistory.chat_id != "") {
                        e.preventDefault(); // Prevent the default behavior (line break)
                        msgField.value = "";
                        await chatHistory.sendMsg(User.me.name, msgToSend);
                    }

            }
        }
    });
    socket.on("newChat", async (user: User) => {
        let newUser: User = user;
        let isNewUser: boolean = true;
        User.usersDB.forEach(user => {
            if (user.id == newUser.id) {
                isNewUser = false;

            }
        });
        if (isNewUser) {
            await User.fetchUsers();
            await delay(1000);
            await User.updateMe();
            await delay(500);

            requestChats.innerHTML = "";
            savedChats.innerHTML = "";
            activeUsers.innerHTML = "";
            generateAllPossibleChats();
        }
    });
    socket.on(`${User.me.name}`, async (chatRequestUser: string) => {
        await User.updateMe();
        await delay(1500);
        await User.updateMe();
        requestChats.innerHTML = "";
        savedChats.innerHTML = "";
        activeUsers.innerHTML = "";
        generateAllPossibleChats();
    });

    socket.on(`${User.me.name}toDelete`, async (chatToDelete: string) => {
        if (chatHistory)
            if (chatToDelete == chatHistory.chat_id)
                showLoadingOverlay();
        await User.updateMe();
        await delay(1200);
        await User.updateMe();
        requestChats.innerHTML = "";
        savedChats.innerHTML = "";
        activeUsers.innerHTML = "";
        if (chatHistory)
            if (chatToDelete == chatHistory.chat_id) {

                chatsHandler.innerHTML = "";
                chatNameField.innerHTML = "LaVida Chat";
                deleteChatButton.style.visibility = "hidden";
            }
        generateAllPossibleChats();
        hideLoadingOverlay();

    });
    hideLoadingOverlay();
}
function generateAllPossibleChats(): void {
    let activeChats: string[] = new Array<string>();
    if (Object.keys(User.me.chats).length > 0) {
        Object.entries(User.me.chats).forEach(([chatID, chat]) => {
            //@ts-ignore
            if (chat.participants.includes(User.me.name)) {
                let partnerName = chat.participants.find(name => name !== User.me.name);
                let chatPartner: User | undefined = User.usersDB.find(user => user.name == partnerName);
                activeChats.push(partnerName ?? '');

                let liElement: HTMLLIElement = document.createElement("li");
                let profileImage: HTMLImageElement = document.createElement("img");
                profileImage.src = chatPartner?.profileImgURL ?? "";
                let nameOfChatPartner: HTMLSpanElement = document.createElement("span");
                //@ts-ignore
                if (chat.isRequested) {
                    nameOfChatPartner.innerHTML = partnerName ?? '';
                    requestChats.appendChild(liElement);
                    liElement.appendChild(profileImage);
                    liElement.appendChild(nameOfChatPartner);
                    if (chatPartner) {
                        let chatElement: ChatElement = new ChatElement(liElement, chatPartner.name); // Fix: Added nullish coalescing operator
                        chatElements.push(chatElement);
                    }

                    User.usersDB.find(user => {
                        if (user.name == partnerName) {
                            liElement.addEventListener('click', () => requestedChatListener(liElement, chatID, chat, user));
                        }
                    });
                } else {
                    if (chatPartner) {
                        nameOfChatPartner.innerHTML = partnerName ?? '';
                        savedChats.appendChild(liElement);
                        liElement.appendChild(profileImage);
                        liElement.appendChild(nameOfChatPartner);
                        liElement.addEventListener('click', () => savedChatListener(liElement, chatID));
                        let chatElement: ChatElement = new ChatElement(liElement, chatPartner.name);
                        chatElements.push(chatElement);
                    }
                }
            }
        });
    }
    User.usersDB.forEach((user: User) => {
        if (User.me.name != user.name && !activeChats.includes(user.name)) {
            let liElement: HTMLLIElement = document.createElement("li");
            let profileImage: HTMLImageElement = document.createElement("img");
            profileImage.src = user.profileImgURL;
            let nameOfChatPartner: HTMLSpanElement = document.createElement("span");
            nameOfChatPartner.innerHTML = user.name;
            activeUsers.appendChild(liElement);
            liElement.appendChild(profileImage);
            liElement.appendChild(nameOfChatPartner);
            liElement.addEventListener('click', () => activeChatListener(liElement, user));
            let chatElement: ChatElement = new ChatElement(liElement, user.name);
            chatElements.push(chatElement);
        }
    });
}

let activeChatListener = async function (userLiElement: HTMLLIElement, user: User) {
    showLoadingOverlay();
    if (currentlySelectedChat)
        currentlySelectedChat.classList.remove('highlight');

    await User.updateMe();
    let isAlreadyChatting: boolean = false;

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
    if (isAlreadyChatting) return;

    // Handle click event for the user card (e.g., redirect to chat page)
    let chatID = Math.floor((Date.now() + Math.random())).toString();
    let participants: string[] = new Array<string>;
    participants.push(User.me.name);
    participants.push(user.name);
    chatHistory = ChatHistory.createNew(chatID, User.me.name, participants);
    await chatHistory.createChat();
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

    displayedMessages = ChatHistory.createNew(chatHistory.chat_id, User.me.name, chatHistory.participants); chatNameField.innerHTML = user.name;
    let usersInfo: string[] = new Array<string>();
    usersInfo.push(User.me.name);
    usersInfo.push(user.name);
    socket.emit("startChat", chatID, User.me.id);
    socket.emit("newChatRequest", usersInfo);

    chatStream(chatHistory.chat_id);
    hideLoadingOverlay();
    await User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants, false, false), User.me.id);
    await User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants, false, true), user.id);

    makeDeleteButtonVisible();

};

let savedChatListener = async function (userLiElement: HTMLLIElement, chatID: string) {
    showLoadingOverlay();
    if (currentlySelectedChat) {
        currentlySelectedChat.classList.remove('highlight');
    }

    //@ts-ignore
    chatHistory = await ChatHistory.getChatHistory(chatID);
    if (displayedMessages != undefined) {
        chatsHandler.innerHTML = "";
    }

    displayedMessages = ChatHistory.createNew(chatHistory.chat_id, User.me.name, chatHistory.participants);

    userLiElement.classList.add('highlight');
    currentlySelectedChat = userLiElement;

    while (displayedMessages.messages.length < chatHistory.messages.length) {
        let newMsg: Message = chatHistory.messages[displayedMessages.messages.length];
        displayedMessages.messages.push(newMsg);
        displayReceivedMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
    }

    chatHistory.participants.find(participant => {
        if (participant != User.me.name)
            chatNameField.innerHTML = participant;

    })
    socket.emit("startChat", chatHistory.chat_id, User.me.id);
    chatStream(chatHistory.chat_id);
    hideLoadingOverlay();
    makeDeleteButtonVisible();

};


let requestedChatListener = async function (userLiElement: HTMLLIElement, chatID: string, chat: Chat, user: User) {
    showLoadingOverlay();
    if (currentlySelectedChat) {
        currentlySelectedChat.classList.remove('highlight');
    }
    //@ts-ignore
    chatHistory = await ChatHistory.getChatHistory(chatID);
    if (displayedMessages != undefined) {
        chatsHandler.innerHTML = "";
    }

    displayedMessages = ChatHistory.createNew(chatHistory.chat_id, User.me.name, chatHistory.participants);

    userLiElement.classList.add('highlight');
    currentlySelectedChat = userLiElement;

    while (displayedMessages.messages.length < chatHistory.messages.length) {
        let newMsg: Message = chatHistory.messages[displayedMessages.messages.length];
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

    })
    socket.emit("startChat", chatHistory.chat_id, User.me.id);
    chatStream(chatHistory.chat_id);
    hideLoadingOverlay();
    chat.isAccepted = true;
    chat.isRequested = false;
    await User.updateChatsInUser(chat, User.me.id);
    await User.updateChatsInUser(chat, user.id);
    await User.updateMe();
    makeDeleteButtonVisible();

};

function makeDeleteButtonVisible() {
    deleteChatButton.style.visibility = "visible";
}
function appendDeleteButtonToEvent() {
    deleteChatButton.addEventListener("click", async () => {
        let user: User | undefined;
        showLoadingOverlay();
        if (chatHistory) {
            user = User.usersDB.find(user => user.name == chatHistory.participants.find(participant => participant != User.me.name));
        }

        //delete the chat from the database
        await chatHistory.deleteChat(chatHistory.chat_id);



        //update the user and his participant in the database
        if (user)
            socket.emit("deleteChat", user.name, chatHistory.chat_id);


        chatsHandler.innerHTML = "";
        chatNameField.innerHTML = "LaVida Chat";
        deleteChatButton.style.visibility = "hidden";

        //get the user of the currently selected chat
        await User.removeChatFromUser(chatHistory.chat_id, user?.id ?? 0);
        await User.removeChatFromUser(chatHistory.chat_id, User.me.id);



        await User.fetchUsers();
        await delay(200);
        await User.updateMe();
        hideLoadingOverlay();
        requestChats.innerHTML = "";
        savedChats.innerHTML = "";
        activeUsers.innerHTML = "";
        generateAllPossibleChats();
    });
}







export async function displayReceivedMsg(senderID: string, message: string, timeSent: string): Promise<void> {
    let msg: HTMLParagraphElement = document.createElement("p");
    msg.className = "txtMsg"
    msg.innerText = message;
    if (User.me.name != senderID) {
        let userToFind = <User>User.usersDB.find(user => user.name == senderID);
        let receivedDiv: HTMLDivElement = document.createElement("div");
        receivedDiv.className = "messageDiv received"

        let imgPartner: HTMLImageElement = document.createElement("img");
        imgPartner.src = userToFind.profileImgURL;

        let span: HTMLSpanElement = document.createElement("span");
        span.className = "time-left";
        span.innerHTML = timeSent;
        receivedDiv.appendChild(imgPartner);
        receivedDiv.appendChild(msg);
        receivedDiv.appendChild(span);
        chatsHandler.appendChild(receivedDiv);

    } else {
        let sentDiv: HTMLDivElement = document.createElement("div");
        sentDiv.className = "messageDiv sent"

        let imgMe: HTMLImageElement = document.createElement("img");

        imgMe.src = User.me.profileImgURL;
        let span: HTMLSpanElement = document.createElement("span");
        span.className = "time-right";
        span.innerHTML = timeSent;
        sentDiv.appendChild(imgMe);
        sentDiv.appendChild(msg);
        sentDiv.appendChild(span);
        chatsHandler.appendChild(sentDiv);
    }
    chatsHandler.scrollTop = chatsHandler.scrollHeight;
}
let oldChatID: string;
let oldListener: Function | null = null;

function chatStream(chatID: string): void {
    const chatListener = (newMsgStream: string) => {
        let newMsg: Message = JSON.parse(newMsgStream);
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



