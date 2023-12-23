import { Chat } from "./Chat.js";
import { ChatElement } from "./ChatElement.js";
import { ChatHistory, Message } from "./ChatHistory.js";
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

let displayedMessages: ChatHistory;
let currentlySelectedChat: HTMLLIElement | null = null;
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function onStartChatManager() {
    chatNameField = document.getElementsByClassName("chat-header")[0] as HTMLHeadingElement;

    chatsHandler = <HTMLDivElement>document.getElementById("chatsHandler");
    sendButton = document.getElementById("sendButton") as HTMLButtonElement;
    msgField = <HTMLTextAreaElement>document.getElementsByClassName("message-input")[0].getElementsByTagName("textarea")[0];

    activeUsers = <HTMLUListElement>document.getElementById("activeUsers");
    savedChats = <HTMLUListElement>document.getElementById("savedChats");
    requestChats = <HTMLUListElement>document.getElementById("requestChats");
    socket.emit("newChatPartner", User.me);
    generateAllPossibleChats();

    sendButton.addEventListener("click", async () => {
        if (msgField.value.trim() !== "") {
            let msgToSend: string = msgField.value;
            msgField.value = "";
            await chatHistory.sendMsg(User.me.name, msgToSend);
        }
    });

    document.addEventListener('keydown', async (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            if (msgField.value.trim() !== "") {
                let msgToSend: string = msgField.value;
                msgField.value = ""; // Clear the message field
                e.preventDefault(); // Prevent the default behavior (line break)
                await chatHistory.sendMsg(User.me.name, msgToSend);
            }
        }
    });
    socket.on("newChat", async (user: User) => {
        let newUser: User = user;
        let isNewUser: boolean = true;
        User.usersDB.forEach(user => {
            if (user.id == newUser.id) {
                isNewUser = false;
                User.fetchUsers();
            }
        });
        if (isNewUser) {
            let liElement: HTMLLIElement = document.createElement("li");
            let profileImage: HTMLImageElement = document.createElement("img");
            profileImage.src = "../../avatars/2.png"
            let nameOfChatPartner: HTMLSpanElement = document.createElement("span");
            nameOfChatPartner.innerHTML = user.name;
            activeUsers.appendChild(liElement);
            liElement.appendChild(profileImage);
            liElement.appendChild(nameOfChatPartner);
            liElement.addEventListener('click', () => activeChatListener(liElement, user));
            let chatElement: ChatElement = new ChatElement(liElement, user.name);
            chatElements.push(chatElement);
        }
        await User.fetchUsers();
    });
    socket.on(`${User.me.name}`, async (chatRequestUser: string) => {
        chatElements.forEach(async chatElement => {
            if (chatElement.name == chatRequestUser) {
                let userToFind = <User>User.usersDB.find(user => user.name == chatRequestUser);

                if (userToFind) {
                    chatElement.HTMLLIElement.removeEventListener('click', () => activeChatListener(chatElement.HTMLLIElement, userToFind));
                }
                activeUsers.removeChild(chatElement.HTMLLIElement);
                savedChats.appendChild(chatElement.HTMLLIElement);
                User.updateMe();
                await delay(500);
                User.updateMe();
                await delay(500);
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
        });

    });
}

let activeChatListener = async function (userLiElement: HTMLLIElement, user: User) {

    if (savedChats.contains(userLiElement)) {
        return;
    }

    if (currentlySelectedChat) {
        currentlySelectedChat.classList.remove('highlight');
    }
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
    userLiElement.removeEventListener('click', () => activeChatListener(userLiElement, user));
    activeUsers.removeChild(userLiElement);

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
    await User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants, false, false), User.me.id);
    await User.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants, false, true), user.id);
};

let savedChatListener = async function (userLiElement: HTMLLIElement, chatID: string) {
    if (currentlySelectedChat) {
        currentlySelectedChat.classList.remove('highlight');
    }
    // Handle click event for the user card (e.g., redirect to chat page)
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
        handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
    }

    chatHistory.participants.find(participant => {
        if (participant != User.me.name)
            chatNameField.innerHTML = participant;

    })
    socket.emit("startChat", chatHistory.chat_id, User.me.id);
    chatStream(chatHistory.chat_id);
};

let requestedChatListener = async function (userLiElement: HTMLLIElement, chatID: string, chat: Chat, user: User) {
    if (currentlySelectedChat) {
        currentlySelectedChat.classList.remove('highlight');
    }
    if (savedChats.contains(userLiElement)) {
        return;
    }
    // Handle click event for the user card (e.g., redirect to chat page)
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
        handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
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
    chat.isAccepted = true;
    chat.isRequested = false;
    await User.updateChatsInUser(chat, User.me.id);
    await User.updateChatsInUser(chat, user.id);
};



async function generateAllPossibleChats(): Promise<void> {
    let activeChats: string[] = new Array<string>();
    await User.fetchUsers();

    if (Object.keys(User.me.chats).length > 0) {
        Object.entries(User.me.chats).forEach(([chatID, chat]) => {
            //@ts-ignore
            if (chat.participants.includes(User.me.name)) {
                const partnerName = chat.participants.find(name => name !== User.me.name);
                activeChats.push(partnerName ?? '');

                let liElement: HTMLLIElement = document.createElement("li");
                let profileImage: HTMLImageElement = document.createElement("img");
                profileImage.src = "../../avatars/2.png"
                let nameOfChatPartner: HTMLSpanElement = document.createElement("span");
                //@ts-ignore
                if (User.me.chats[chatID].isRequested) {
                    nameOfChatPartner.innerHTML = partnerName ?? '';
                    requestChats.appendChild(liElement);
                    liElement.appendChild(profileImage);
                    liElement.appendChild(nameOfChatPartner);
                    User.usersDB.find(user => {
                        if (user.name == partnerName) {
                            liElement.addEventListener('click', () => requestedChatListener(liElement, chatID, chat, user));
                        }
                    });
                } else {

                    nameOfChatPartner.innerHTML = partnerName ?? '';
                    savedChats.appendChild(liElement);
                    liElement.appendChild(profileImage);
                    liElement.appendChild(nameOfChatPartner);
                    liElement.addEventListener('click', () => savedChatListener(liElement, chatID));
                }
            }
        });
    }
    User.usersDB.forEach((user: User) => {
        if (User.me.name != user.name && !activeChats.includes(user.name)) {
            let liElement: HTMLLIElement = document.createElement("li");
            let profileImage: HTMLImageElement = document.createElement("img");
            profileImage.src = "../../avatars/2.png"
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






export function handleReceiveMsg(senderID: string, message: string, timeSent: string): void {
    let msg: HTMLParagraphElement = document.createElement("p");
    msg.className = "txtMsg"
    msg.innerText = message;
    if (User.me.name != senderID) {
        let receivedDiv: HTMLDivElement = document.createElement("div");
        receivedDiv.className = "messageDiv received"

        let imgPartner: HTMLImageElement = document.createElement("img");
        imgPartner.src = "../../avatars/2.png";

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
        imgMe.src = "../../avatars/1.png";

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
let oldChatID: string = "";
function chatStream(chatID: string): void {
    console.log(`chat=${chatID}` + " " + `chat=${oldChatID}`)
    const chatListener = (newMsgStream: string) => {
        let newMsg: Message = JSON.parse(newMsgStream);
        console.log(newMsg);
        handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
    };
    // Add the event listener
    socket.on(`chat=${chatID}`, chatListener);

    // Later, to remove the specific listener
    if (oldChatID != "")
        socket.off(`chat=${oldChatID}`, chatListener);
    oldChatID = chatID;
}



