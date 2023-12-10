var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChatHistory } from "./ChatHistory.js";
import { me } from "./Login.js";
import { requestChatpartner, requestInfoObj, socket } from "./SocketConnection.js";
import { User } from "./User.js";
import { UserCard } from "./UserCard.js";
export let chatID;
export let chatPartnerName;
export function onStartOverview() {
    buildUsers();
    console.log(me.Name);
}
function buildUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield User.fetchUsers();
        User.usersDB.forEach((user) => {
            if (user.isActive && me.Name != user.Name) {
                createUserCard(user);
            }
            if (me.Name == user.Name) {
                requestChatpartner(me.Name);
            }
        });
    });
}
function createUserCard(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userCard = new UserCard(`chat_page.html?user=${user.Name}`, user.Name);
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
            userCardDiv.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                // Handle click event for the user card (e.g., redirect to chat page)
                chatID = Math.floor((Date.now() + Math.random())).toString();
                ;
                let chatHistory = ChatHistory.createNew(chatID, user.Name);
                chatPartnerName = user.Name;
                //create a JSON Format for meUsername, chatID and userName and the whole URL 
                let infoStream = {
                    myUsername: user.Name,
                    chatID: chatID,
                    partnerUsername: me.Name,
                    acceptedChatInvite: false
                };
                socket.emit("infoStream", JSON.stringify(infoStream));
                let time_out = 50000000;
                yield new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (requestInfoObj.acceptedChatInvite || time_out <= 0) {
                            clearInterval(interval);
                            resolve();
                        }
                        time_out -= 20;
                        console.log(time_out);
                    }, 20);
                });
                chatHistory.createChat(userCard, me.Name);
            }));
            userCardsContainer.appendChild(userCardDiv);
        }
    });
}
