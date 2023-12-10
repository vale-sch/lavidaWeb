export function cleanLogin(toRegistrate = false) {
    let wrapper = document.getElementsByClassName("wrapper")[0];
    let lavidalogo = document.getElementById("lavida");
    document.body.removeChild(wrapper);
    if (toRegistrate != true)
        document.body.removeChild(lavidalogo);
}
export function createRegistrateHTML() {
}
export function createChatPage() {
    // Append the generated chat container to the body
    const generatedChatContainer = generateChatContainer();
    document.body.appendChild(generatedChatContainer);
}
// Function to create an element with specified attributes
function createElement(tag, attributes) {
    const element = document.createElement(tag);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}
function createElementWithClasses(tag, attributes, classes) {
    const element = createElement(tag, attributes);
    element.classList.add(...classes);
    return element;
}
// Function to generate the chat container
function generateChatContainer() {
    const chatContainer = createElement('div', { class: 'chat-container' });
    // Sidebar
    const sidebar = createElementWithClasses('div', { class: 'sidebar' }, ['full-height']);
    const savedChats = createElement('div', { class: 'saved-chats' });
    savedChats.innerHTML = `
    <h3>Saved Chats</h3>
    <ul id="savedChats">
      
    </ul>`;
    const activeUsers = createElement('div', { class: 'active-users' });
    activeUsers.innerHTML = `
    <h3>Active Users</h3>
    <ul id="activeUsers">
      
    </ul>`;
    sidebar.appendChild(savedChats);
    sidebar.appendChild(activeUsers);
    // Chat window
    const chatWindow = createElementWithClasses('div', { class: 'chat-window' }, ['full-height']);
    const chatHeader = createElement('div', { class: 'chat-header' });
    chatHeader.innerHTML = '<h2>La Vida Chats</h2>';
    const messages = createElement('div', { class: 'messages' });
    const chatsHandler = createElement('div', { id: 'chatsHandler' });
    messages.appendChild(chatsHandler);
    const messageInput = createElement('div', { class: 'message-input' });
    messageInput.innerHTML = `
    <textarea placeholder="Type your message..." class="txt"></textarea>
    <button id = "sendButton">Send</button>`;
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(messages);
    chatWindow.appendChild(messageInput);
    chatContainer.appendChild(sidebar);
    chatContainer.appendChild(chatWindow);
    return chatContainer;
}
// export function createOvervieHTML() {
//     let divContent: HTMLDivElement = document.createElement("div");
//     let divUserCardsContainer: HTMLDivElement = document.createElement("div");
//     let divUserCards: HTMLDivElement = document.createElement("div");
//     let lavidalogo: HTMLImageElement = document.createElement("img");
//     lavidalogo.src = "/logo/logo_transparent.png";
//     let h2: HTMLHeadElement = document.createElement("h2");
//     h2.innerHTML = "Active Users";
//     divContent.id = "content";
//     lavidalogo.id = "logo";
//     divUserCardsContainer.id = "user-cards-container";
//     divUserCards.id = "user-cards";
//     divContent.appendChild(lavidalogo)
//     divContent.appendChild(h2)
//     divContent.appendChild(divUserCardsContainer);
//     divUserCardsContainer.appendChild(divUserCards);
//     document.body.appendChild(divContent);
// }
