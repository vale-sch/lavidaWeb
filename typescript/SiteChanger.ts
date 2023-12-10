

export function cleanLogin(toRegistrate: boolean = false) {
    let wrapper: HTMLDivElement = document.getElementsByClassName("wrapper")[0] as HTMLDivElement;
    let lavidalogo: HTMLImageElement = document.getElementById("lavida") as HTMLImageElement;
    console.log("HJI");
    document.body.removeChild(wrapper);
    if (toRegistrate != true)
        document.body.removeChild(lavidalogo)
}


export function createRegistrateHTML() {

}
export function createOvervieHTML() {
    let divContent: HTMLDivElement = document.createElement("div");
    let divUserCardsContainer: HTMLDivElement = document.createElement("div");
    let divUserCards: HTMLDivElement = document.createElement("div");

    let lavidalogo: HTMLImageElement = document.createElement("img");
    lavidalogo.src = "/logo/logo_transparent.png";

    let h2: HTMLHeadElement = document.createElement("h2");
    h2.innerHTML = "Active Users";



    divContent.id = "content";
    lavidalogo.id = "logo";
    divUserCardsContainer.id = "user-cards-container";
    divUserCards.id = "user-cards";

    divContent.appendChild(lavidalogo)
    divContent.appendChild(h2)
    divContent.appendChild(divUserCardsContainer);
    divUserCardsContainer.appendChild(divUserCards);
    document.body.appendChild(divContent);
}
export function createChatPage() {
    let childToRemove: HTMLDivElement = document.getElementById("content") as HTMLDivElement;
    document.body.removeChild(childToRemove);

    let chatContainer: HTMLDivElement = document.createElement("div");
    let chatPartner: HTMLDivElement = document.createElement("div");
    let chatPartnerName: HTMLHeadingElement = document.createElement("h1");
    let hrElement: HTMLHRElement = document.createElement("hr");
    let chatsHandler: HTMLDivElement = document.createElement("div");
    let chatBox: HTMLDivElement = document.createElement("div");
    let inputText: HTMLSpanElement = document.createElement("span");
    let sendBtn: HTMLDivElement = document.createElement("div");
    let btn: HTMLButtonElement = document.createElement("button");

    chatContainer.id = "chatContainer"
    chatPartner.id = "chatParter"
    chatPartnerName.id = "chatName"
    chatsHandler.id = "chatsHandler"
    chatBox.id = "chatBox"
    inputText.id = "inputText"
    sendBtn.id = "sendBtn"
    btn.className = "fa-solid fa-paper-plane"
    chatContainer.appendChild(chatPartner);
    chatContainer.appendChild(chatsHandler);
    chatContainer.appendChild(chatBox);
    chatPartner.appendChild(chatPartnerName);
    chatPartner.appendChild(hrElement);

    chatBox.appendChild(inputText);
    inputText.role = "textbox";
    inputText.contentEditable = "true"
    chatBox.appendChild(sendBtn);
    sendBtn.appendChild(btn);
    document.body.appendChild(chatContainer);




}