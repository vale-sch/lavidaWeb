import { ChatHistory, Message } from "./ChatHistory.js";

const params = new URLSearchParams(window.location.search);
let chatPartnerName = params.get("user") as string;
let chatID = params.get("chatID") as string;
let meUsername = params.get("me") as string;
(document.getElementById("chatName") as HTMLHeadingElement).innerText = chatPartnerName;

let msgField: HTMLInputElement = <HTMLInputElement>document.getElementById("inputText");
let chatsHandler: HTMLDivElement = <HTMLDivElement>document.getElementById("chatsHandler");

let chatHistory: ChatHistory = ChatHistory.createNew(chatID, meUsername);
let oldChatHistory: ChatHistory = ChatHistory.createNew(chatID, meUsername);



document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", async (e) => {
    if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
        let msgToSend: string = msgField.innerText;
        msgField.innerText = "";
        await chatHistory.sendMsg(chatID, meUsername, msgToSend);
    }
});

document.addEventListener('keydown', async (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
        if (!chatID) return;
        if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
            let msgToSend: string = msgField.innerText;
            msgField.innerText = "";
            await chatHistory.sendMsg(chatID, meUsername, msgToSend);
        }
    }
});

function handleReceiveMsg(senderID: string, message: string, timeSent: string): void {
    let msg: HTMLParagraphElement = document.createElement("p");
    msg.className = "txt"
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
    console.log(senderID, chatPartnerName);


    chatsHandler.scrollTop = chatsHandler.scrollHeight;


}

async function getNewMessages(_chatID: string) {
    chatHistory = await chatHistory.getChatHistory(chatID) as ChatHistory;
    while (oldChatHistory.messages.length < chatHistory.messages.length) {
        let newMsg: Message = chatHistory.messages[oldChatHistory.messages.length];
        oldChatHistory.messages.push(newMsg);
        handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
    }
    // startFetchingMessages(chatID);
}

// Function to fetch messages at intervals
function startFetchingMessages(chatID: string) {
    setInterval(async () => {
        await getNewMessages(chatID);
    }, 1000); // 100 milliseconds interval

}
startFetchingMessages(chatID);

// Example usage to start fetching messages
