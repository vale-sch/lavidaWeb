"use strict";
var lavida;
(function (lavida) {
    window.addEventListener("load", changeGradient);
    document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", sendMsg);
    let msgField = document.getElementById("inputText");
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            let checkWithoutLineBreaks = msgField.innerText.replace(/[\r\n]/gm, '');
            if (checkWithoutLineBreaks != "")
                sendMsg();
        }
    });
    let chatsHandler = document.getElementById("chatsHandler");
    function changeGradient() {
        document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 23%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 51%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 88%)`;
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    }
    function sendMsg() {
        let checkWithoutLineBreaks = msgField.innerText.replace(/[\r\n]/gm, '');
        console.log(msgField.innerText);
        if (checkWithoutLineBreaks == "")
            return;
        let msg = document.createElement("p");
        msg.className = "txt";
        msg.innerText = msgField.innerText;
        msgField.innerText = "";
        let sentDiv = document.createElement("div");
        sentDiv.className = "messageDiv sent";
        let imgMe = document.createElement("img");
        imgMe.src = "/avatars/1.png";
        let span = document.createElement("span");
        span.className = "time-right";
        let dateTime = new Date();
        span.innerHTML = dateTime.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
        sentDiv.appendChild(imgMe);
        sentDiv.appendChild(msg);
        sentDiv.appendChild(span);
        chatsHandler.appendChild(sentDiv);
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    }
})(lavida || (lavida = {}));
