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
    let generatedChatContainer = generateChatContainer();
    document.body.appendChild(generatedChatContainer);
}
// Function to create an element with specified attributes
function createElement(tag, attributes) {
    let element = document.createElement(tag);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}
function createElementWithClasses(tag, attributes, classes) {
    let element = createElement(tag, attributes);
    element.classList.add(...classes);
    return element;
}
// Function to generate the chat container
function generateChatContainer() {
    let chatContainer = createElement('div', { class: 'chat-container' });
    // Sidebar
    let sidebar = createElementWithClasses('div', { class: 'sidebar' }, ['full-height']);
    let requestChats = createElement('div', { class: 'requested-chats' });
    //requestChats.style.display = 'hidden';
    requestChats.innerHTML = `
    <h3>Requested</h3>
    <ul id="requestChats">
      
    </ul>`;
    let savedChats = createElement('div', { class: 'saved-chats' });
    savedChats.innerHTML = `
    <h3>Chats</h3>
    <ul id="savedChats">
      
    </ul>`;
    let activeUsers = createElement('div', { class: 'active-users' });
    activeUsers.innerHTML = `
    <h3>Users</h3>
    <ul id="activeUsers">
      
    </ul>`;
    sidebar.appendChild(requestChats);
    sidebar.appendChild(savedChats);
    sidebar.appendChild(activeUsers);
    // Chat window
    let chatWindow = createElementWithClasses('div', { class: 'chat-window' }, ['full-height']);
    let chatHeader = createElement('div', { class: 'chat-header' });
    let chatHeaderH2 = createElement('h2', { id: 'chatHeaderH2' });
    chatHeaderH2.innerHTML = 'La Vida Chats';
    chatHeader.appendChild(chatHeaderH2);
    let deleteChatButton = createElement('button', { id: 'deleteBtn' });
    deleteChatButton.innerHTML = 'Delete Chat';
    let messages = createElement('div', { class: 'messages' });
    let chatsHandler = createElement('div', { id: 'chatsHandler' });
    messages.appendChild(chatsHandler);
    let messageInput = createElement('div', { class: 'message-input' });
    messageInput.innerHTML = `
    <textarea placeholder="Type your message..." class="txt"></textarea>
    <button id = "sendButton">Send</button>`;
    chatWindow.appendChild(chatHeader);
    chatHeader.appendChild(deleteChatButton);
    chatWindow.appendChild(messages);
    chatWindow.appendChild(messageInput);
    chatContainer.appendChild(sidebar);
    chatContainer.appendChild(chatWindow);
    return chatContainer;
}
