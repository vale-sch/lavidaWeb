import { Chat } from "./Chat.js";
import { ChatHistory, Message } from "./ChatHistory.js";
import { InfoStream } from "./InfoStream.js";
import { me } from "./Login.js";
import { socket } from "./SocketConnection.js";
import { User } from "./User.js";





let msgField: HTMLTextAreaElement;
let chatsHandler: HTMLDivElement;
let sendButton: HTMLButtonElement
let activeUsers: HTMLUListElement;
let savedChats: HTMLUListElement;

let chatNameField: HTMLHeadElement;

let chatHistory: ChatHistory;
let chatID: string;
let chatPartnerName: string;

let oldChatHistory: ChatHistory;


export function onStartChatManager() {
    chatNameField = document.getElementsByClassName("chat-header")[0] as HTMLHeadingElement;

    chatsHandler = <HTMLDivElement>document.getElementById("chatsHandler");
    sendButton = document.getElementById("sendButton") as HTMLButtonElement;
    msgField = <HTMLTextAreaElement>document.getElementsByClassName("message-input")[0].getElementsByTagName("textarea")[0];

    activeUsers = <HTMLUListElement>document.getElementById("activeUsers");
    savedChats = <HTMLUListElement>document.getElementById("savedChats");



    createPossibleChats();
    sendButton.addEventListener("click", async () => {
        if (msgField.value.trim() !== "") {
            let msgToSend: string = msgField.value;
            msgField.value = "";
            await chatHistory.sendMsg(me.Name, msgToSend);
        }
    });

    document.addEventListener('keydown', async (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            if (msgField.value.trim() !== "") {
                let msgToSend: string = msgField.value;
                msgField.value = ""; // Clear the message field
                e.preventDefault(); // Prevent the default behavior (line break)
                await chatHistory.sendMsg(me.Name, msgToSend);
            }
        }
    });

}


async function createPossibleChats(): Promise<void> {

    await User.fetchUsers();


    User.usersDB.forEach((user: User) => {
        let isSavedChat: boolean = false;
        if (me.Name != user.Name) {
            if (Object.keys(me.chats).length > 0) {
                Object.entries(me.chats).forEach(([chatID, participants]) => {
                    //@ts-ignore
                    if (participants.includes(me.Name)) {
                        isSavedChat = true;
                        let liElement: HTMLLIElement = document.createElement("li");
                        let profileImage: HTMLImageElement = document.createElement("img");
                        profileImage.src = "../../avatars/1.png"
                        let nameOfChatPartner: HTMLSpanElement = document.createElement("span");
                        nameOfChatPartner.innerHTML = user.Name;
                        savedChats.appendChild(liElement);
                        liElement.appendChild(profileImage);
                        liElement.appendChild(nameOfChatPartner);
                        makeSavedChatsInteractable(liElement, chatID);
                    }
                });
            }

            if (!isSavedChat) {
                let liElement: HTMLLIElement = document.createElement("li");
                let profileImage: HTMLImageElement = document.createElement("img");
                profileImage.src = "../../avatars/1.png"
                let nameOfChatPartner: HTMLSpanElement = document.createElement("span");
                nameOfChatPartner.innerHTML = user.Name;
                activeUsers.appendChild(liElement);
                liElement.appendChild(profileImage);
                liElement.appendChild(nameOfChatPartner);
                makeActiveChatsInteractable(liElement, user);

            }
        }
    });

    //@ts-ignore
}
function makeActiveChatsInteractable(userLiElement: HTMLLIElement, user: User) {

    userLiElement.addEventListener('click', async () => {
        // Handle click event for the user card (e.g., redirect to chat page)
        chatID = Math.floor((Date.now() + Math.random())).toString();
        let participants: string[] = new Array<string>;
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

    });
}
function makeSavedChatsInteractable(userLiElement: HTMLLIElement, chatID: string) {

    userLiElement.addEventListener('click', async () => {
        // Handle click event for the user card (e.g., redirect to chat page)
        //@ts-ignore
        chatHistory = await ChatHistory.getChatHistory(chatID);

        oldChatHistory = chatHistory;
        console.log(chatHistory);
        chatHistory.participants.forEach(participant => {
            if (participant != me.Name)
                chatNameField.innerHTML = participant;
        })

        socket.emit("startChat", chatHistory.chat_id);
        chatStream(chatHistory);

        me.updateChatsInUser(new Chat(chatHistory.chat_id, chatHistory.participants), me.Id);

    });
}

export function handleReceiveMsg(senderID: string, message: string, timeSent: string): void {
    let msg: HTMLParagraphElement = document.createElement("p");
    msg.className = "txtMsg"
    msg.innerText = message;

    if (chatPartnerName == senderID) {
        let receivedDiv: HTMLDivElement = document.createElement("div");
        receivedDiv.className = "messageDiv received"

        let imgPartner: HTMLImageElement = document.createElement("img");
        imgPartner.src = "/avatars/2.png";

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
        imgMe.src = "/avatars/1.png";

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

function chatStream(chatHistory: ChatHistory): void {
    socket.on(`chat=${chatHistory.chat_id}`, (chatHistoryStream: string) => {
        let chatHistoryTemp = JSON.parse(chatHistoryStream);
        while (oldChatHistory.messages.length < chatHistoryTemp[0].messages.length) {
            let newMsg: Message = chatHistory.messages[oldChatHistory.messages.length];
            oldChatHistory.messages.push(newMsg);
            handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
    });
}



