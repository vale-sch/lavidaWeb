export function cleanLogin(toRegistrate = false) {
    let wrapper = document.getElementsByClassName("wrapper")[0];
    let lavidalogo = document.getElementById("lavida");
    console.log("HJI");
    document.body.removeChild(wrapper);
    if (toRegistrate != true)
        document.body.removeChild(lavidalogo);
}
export function createRegistrateHTML() {
}
export function createOvervieHTML() {
    let divContent = document.createElement("div");
    let divUserCardsContainer = document.createElement("div");
    let divUserCards = document.createElement("div");
    let lavidalogo = document.createElement("img");
    lavidalogo.src = "/logo/logo_transparent.png";
    let h2 = document.createElement("h2");
    h2.innerHTML = "Active Users";
    divContent.id = "content";
    lavidalogo.id = "logo";
    divUserCardsContainer.id = "user-cards-container";
    divUserCards.id = "user-cards";
    divContent.appendChild(lavidalogo);
    divContent.appendChild(h2);
    divContent.appendChild(divUserCardsContainer);
    divUserCardsContainer.appendChild(divUserCards);
    document.body.appendChild(divContent);
}
export function createChatPage() {
    let childToRemove = document.getElementById("content");
    document.body.removeChild(childToRemove);
    let chatContainer = document.createElement("div");
    let chatPartner = document.createElement("div");
    let chatPartnerName = document.createElement("h1");
    let hrElement = document.createElement("hr");
    let chatsHandler = document.createElement("div");
    let chatBox = document.createElement("div");
    let inputText = document.createElement("span");
    let sendBtn = document.createElement("div");
    let btn = document.createElement("button");
    chatContainer.id = "chatContainer";
    chatPartner.id = "chatParter";
    chatPartnerName.id = "chatName";
    chatsHandler.id = "chatsHandler";
    chatBox.id = "chatBox";
    inputText.id = "inputText";
    sendBtn.id = "sendBtn";
    btn.className = "fa-solid fa-paper-plane";
    chatContainer.appendChild(chatPartner);
    chatContainer.appendChild(chatsHandler);
    chatContainer.appendChild(chatBox);
    chatPartner.appendChild(chatPartnerName);
    chatPartner.appendChild(hrElement);
    chatBox.appendChild(inputText);
    inputText.role = "textbox";
    inputText.contentEditable = "true";
    chatBox.appendChild(sendBtn);
    sendBtn.appendChild(btn);
    document.body.appendChild(chatContainer);
}
