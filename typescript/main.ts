namespace lavida {

    window.addEventListener("load", changeGradient);

    document.getElementsByClassName("fa-solid fa-paper-plane")[0].addEventListener("click", sendMsg);


    let msgField: HTMLInputElement = <HTMLInputElement>document.getElementById("inputText");

    document.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            let checkWithoutLineBreaks: string = msgField.innerText.replace(/[\r\n]/gm, '');
            if (checkWithoutLineBreaks != "")
                sendMsg();
        }
    });

    let chatsHandler: HTMLDivElement = <HTMLDivElement>document.getElementById("chatsHandler");

    function changeGradient(): void {
        document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 23%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 51%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.75) 88%)`;
        chatsHandler.scrollTop = chatsHandler.scrollHeight;
    }
    const params = new URLSearchParams(window.location.search);
    const data = params.get("user") as string;
    (document.getElementById("chatName") as HTMLHeadingElement).innerText = data;

    function sendMsg(): void {
        let checkWithoutLineBreaks: string = msgField.innerText.replace(/[\r\n]/gm, '');
        if (checkWithoutLineBreaks == "") return;


        let msg: HTMLParagraphElement = document.createElement("p");
        msg.className = "txt"
        msg.innerText = msgField.innerText;
        msgField.innerText = "";

        let sentDiv: HTMLDivElement = document.createElement("div");
        sentDiv.className = "messageDiv sent"

        let imgMe: HTMLImageElement = document.createElement("img");
        imgMe.src = "/avatars/1.png";

        let span: HTMLSpanElement = document.createElement("span");
        span.className = "time-right"
        let dateTime = new Date()
        span.innerHTML = dateTime.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
        sentDiv.appendChild(imgMe);
        sentDiv.appendChild(msg);
        sentDiv.appendChild(span);

        chatsHandler.appendChild(sentDiv);
        chatsHandler.scrollTop = chatsHandler.scrollHeight;


    }
    function receiveMsg(): void {
        let checkWithoutLineBreaks: string = msgField.innerText.replace(/[\r\n]/gm, '');
        if (checkWithoutLineBreaks == "") return;


        let msg: HTMLParagraphElement = document.createElement("p");
        msg.className = "txt"
        msg.innerText = msgField.innerText;
        msgField.innerText = "";

        let sentDiv: HTMLDivElement = document.createElement("div");
        sentDiv.className = "messageDiv received"

        let imgMe: HTMLImageElement = document.createElement("img");
        imgMe.src = "/avatars/2.png";

        let span: HTMLSpanElement = document.createElement("span");
        span.className = "time-left"
        let dateTime = new Date()
        span.innerHTML = dateTime.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
        sentDiv.appendChild(imgMe);
        sentDiv.appendChild(msg);
        sentDiv.appendChild(span);

        chatsHandler.appendChild(sentDiv);
        chatsHandler.scrollTop = chatsHandler.scrollHeight;


    }
}

