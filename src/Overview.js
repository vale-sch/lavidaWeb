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
    // window.addEventListener("load", changeGradient);
    // function changeGradient(): void {
    //     document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 23%, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 51%, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 88%)`;
    // }
    let usersDB = [];
    const params = new URLSearchParams(window.location.search);
    let meUsername = params.get("user");
    function fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let increment = 0;
            (yield lavida.User.fetchUsers()).forEach((userDB) => {
                usersDB[increment] = new lavida.User(userDB.id, userDB.name, userDB.password, userDB.isactive);
                increment++;
            });
            usersDB.forEach((user) => {
                if (user.isactive && meUsername != user.name) {
                    createUserCard(user);
                }
            });
        });
    }
    function createUserCard(user) {
        let userCard = new lavida.UserCard(`chat_page.html?user=${user.Name}`, user.Name);
        const userCardsContainer = document.getElementById('user-cards');
        if (userCardsContainer) {
            const userCardDiv = document.createElement('div');
            userCardDiv.classList.add('user-card');
            // You can customize this part based on your user data structure
            const userImage = document.createElement('img');
            userImage.src = "../../avatars/1.png";
            //`url/to/user/image/${user.Id}`;
            userCardDiv.appendChild(userImage);
            const userName = document.createElement('h3');
            userName.textContent = user.Name;
            userCardDiv.appendChild(userName);
            userCardDiv.addEventListener('click', () => {
                // Handle click event for the user card (e.g., redirect to chat page)
                let chatID = Math.floor((Date.now() + Math.random())).toString();
                let chatHistory = lavida.ChatHistory.createNew(chatID, user.Name);
                chatHistory.createChat(userCard, meUsername);
            });
            userCardsContainer.appendChild(userCardDiv);
        }
    }
    fetchUsers();
})(lavida || (lavida = {}));
