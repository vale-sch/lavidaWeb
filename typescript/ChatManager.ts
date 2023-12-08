import { ChatHistory, Message } from "./ChatHistory.js";
import { socket } from "./SocketConnection.js";

const params = new URLSearchParams(window.location.search);
let chatPartnerName = params.get("user") as string;
let chatID = params.get("chatID") as string;
let meUsername = params.get("me") as string;
(document.getElementById("chatName") as HTMLHeadingElement).innerText = chatPartnerName;

let msgField: HTMLInputElement = <HTMLInputElement>document.getElementById("inputText");
let chatsHandler: HTMLDivElement = <HTMLDivElement>document.getElementById("chatsHandler");

export let chatHistory: ChatHistory = ChatHistory.createNew(chatID, meUsername);
let oldChatHistory: ChatHistory = ChatHistory.createNew(chatID, meUsername);



async function sendMsg(senderID: string, message: string) {
    chatHistory.addMessage(senderID, message)
    try {

        let response = await fetch('https://lavida-server.vercel.app/api/send_msg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatHistory),
        });

        if (response.status === 201) {
            await response.json();
        } else {
            let data = await response.json();
            console.log(`Error: ${data.error}`);
        }
    } catch (error) {
        console.log(error);
    }
}
document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", async (e) => {
    if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
        let msgToSend: string = msgField.innerText;
        msgField.innerText = "";
        await sendMsg(meUsername, msgToSend);
    }
});

document.addEventListener('keydown', async (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
        if (!chatID) return;
        if (msgField.innerText.replace(/[\r\n]/gm, '') != "") {
            let msgToSend: string = msgField.innerText;
            msgField.innerText = "";
            await sendMsg(meUsername, msgToSend);
        }
    }
});

export function handleReceiveMsg(senderID: string, message: string, timeSent: string): void {
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
    chatsHandler.scrollTop = chatsHandler.scrollHeight;
}

function chatStream(chatHistory: ChatHistory): void {
    let oldChatHistory = chatHistory;
    console.log("JO");

    socket.on(`chat=${chatHistory.chat_id}`, (chatHistoryStream: string) => {
        let chatHistoryTemp = JSON.parse(chatHistoryStream);
        console.log(chatHistoryTemp);
        while (oldChatHistory.messages.length < chatHistoryTemp[0].messages.length) {
            let newMsg: Message = chatHistory.messages[oldChatHistory.messages.length];
            oldChatHistory.messages.push(newMsg);
            handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
        }
    });
}
//connectClient(me);

chatStream(chatHistory);
