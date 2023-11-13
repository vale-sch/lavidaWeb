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
    let chatHistory;
    let oldChatHistory = lavida.ChatHistory.createNew(chatID, meUsername);
    window.addEventListener("load", changeGradient);
    document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", (e) => {
        let checkWithoutLineBreaks = msgField.innerText.replace(/[\r\n]/gm, '');
        if (checkWithoutLineBreaks != "")
            sendMsg(chatID, meUsername, msgField.innerText);
        msgField.innerText = "";
    });
    let msgField = document.getElementById("inputText");
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            let checkWithoutLineBreaks = msgField.innerText.replace(/[\r\n]/gm, '');
            if (!chatID)
                return;
            if (checkWithoutLineBreaks != "")
                sendMsg(chatID, meUsername, msgField.innerText);
            msgField.innerText = "";
        }
    });
    let chatsHandler = document.getElementById("chatsHandler");
    function changeGradient() {
        document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 23%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 51%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 88%)`;
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    }
    document.getElementById("chatName").innerText = chatPartnerName;
    // function handleSendMsg(): void {
    //     let msg: HTMLParagraphElement = document.createElement("p");
    //     msg.className = "txt"
    //     msg.innerText = msgField.innerText;
    //     msgField.innerText = "";
    //     let sentDiv: HTMLDivElement = document.createElement("div");
    //     sentDiv.className = "messageDiv sent"
    //     let imgMe: HTMLImageElement = document.createElement("img");
    //     imgMe.src = "/avatars/1.png";
    //     let span: HTMLSpanElement = document.createElement("span");
    //     span.className = "time-right"
    //     let dateTime = new Date()
    //     span.innerHTML = dateTime.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
    //     sentDiv.appendChild(imgMe);
    //     sentDiv.appendChild(msg);
    //     sentDiv.appendChild(span);
    //     chatsHandler.appendChild(sentDiv);
    //     chatsHandler.scrollTop = chatsHandler.scrollHeight;
    // }
    function handleReceiveMsg(senderID, message, timeSent) {
        // let checkWithoutLineBreaks: string = msgField.innerText.replace(/[\r\n]/gm, '');
        // if (checkWithoutLineBreaks == "") return;
        if (chatPartnerName == senderID)
            console.log("mymessage");
        let msg = document.createElement("p");
        msg.className = "txt";
        msg.innerText = message;
        msgField.innerText = "";
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
    //sendMsg("asdasd", "joachim", "ich mag brezeln");
    function sendMsg(chatID, senderID, message) {
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
                    //let rspTxt: string = await response.text() as string;
                    getChatHistory(chatID);
                    //  window.location.replace("landing_page.html");
                    //alert("You have been successfull registrated!")
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
    // deleteChat("joacchim");
    // async function deleteChat(_chatID: string) {
    //     try {
    //         const chatID: any = {
    //             chatID: _chatID
    //         };
    //         let response = await fetch('https://deletechat-mfccjlsnga-uc.a.run.app', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(chatID),
    //         });
    //         if (response.status === 201) {
    //             let responseFirebase: string = await response.text() as string;
    //             console.log(responseFirebase);
    //             //  window.location.replace("landing_page.html");
    //             //alert("You have been successfull registrated!")
    //         } else {
    //             let data = await response.json();
    //             console.log(`Error: ${data.error}`);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    function getChatHistory(chatID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://lavida-server.vercel.app/api/receive_chat?chatID=${chatID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    chatHistory = lavida.ChatHistory.fromDatabase(yield response.json());
                    while (oldChatHistory.messages.length < chatHistory.messages.length) {
                        let newMsg = chatHistory.messages[oldChatHistory.messages.length];
                        oldChatHistory.messages.push(newMsg);
                        handleReceiveMsg(newMsg.sender_id, newMsg.message, newMsg.time_sent);
                    }
                    // Process the messages as needed
                }
                else {
                    const data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    // Example usage
    getChatHistory(chatID);
})(lavida || (lavida = {}));
