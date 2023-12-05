import { ChatHistory } from "./ChatHistory.js";
import { InfoStream } from "./InfoStream.js";
import { User } from "./User.js";
import { UserCard } from "./UserCard.js";


//@ts-ignore
const socket: Socket = io("ws://localhost:8080");




let infoStreamObj: InfoStream

const params = new URLSearchParams(window.location.search);
let meUsername = params.get("user") as string;
async function buildUsers(): Promise<void> {
    await User.fetchUsers();
    User.usersDB.forEach((user: User) => {
        if (user.isActive && meUsername != user.Name) {
            createUserCard(user);
        }
    });
}
function startSocket(): void {
    socket.on("message", (infoStream: string) => {
        infoStreamObj = JSON.parse(infoStream) as InfoStream;
        if (infoStreamObj.myUsername == meUsername) {
            if (confirm(`You got a new Chat Request from ${infoStreamObj.partnerUsername}`) == true) {
                window.location.href = infoStreamObj.url + `&chatID=${infoStreamObj.chatID}` + `&me=${infoStreamObj.myUsername}`;
            } else {
                infoStreamObj.acceptedChatInvite = false;
                socket.emit("message", JSON.stringify(infoStream));;
            }
            ;
            ;

        }
    });
}


async function createUserCard(user: User): Promise<void> {
    let userCard: UserCard = new UserCard(`chat_page.html?user=${user.Name}`, user.Name);

    const userCardsContainer = document.getElementById('user-cards');

    if (userCardsContainer) {
        const userCardDiv = document.createElement('div');
        userCardDiv.classList.add('user-card');

        // You can customize this part based on your user data structure
        const userImage = document.createElement('img');
        userImage.src = "../../avatars/1.png"
        //`url/to/user/image/${user.Id}`;
        userCardDiv.appendChild(userImage);

        const userName = document.createElement('h3');
        userName.textContent = user.Name;
        userCardDiv.appendChild(userName);

        userCardDiv.addEventListener('click', async () => {
            // Handle click event for the user card (e.g., redirect to chat page)
            let chatID: string = Math.floor((Date.now() + Math.random())).toString();
            let chatHistory: ChatHistory = ChatHistory.createNew(chatID, user.Name);
            //create a JSON Format for meUsername, chatID and userName and the whole URL 
            let infoStream: InfoStream = {
                url: `chat_page.html?user=${meUsername}` + `&chatID=${chatID}` + `&me=${user.Name}`, // Replace with your URL
                myUsername: user.Name,
                chatID: chatID, // Replace with your chat ID
                partnerUsername: meUsername,
                acceptedChatInvite: false
            };

            socket.emit("message", JSON.stringify(infoStream));
            let time_out: number = 5000;

            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (infoStream.acceptedChatInvite || time_out <= 0) {
                        clearInterval(interval);
                        resolve();
                    }
                    time_out -= 20;
                    console.log(time_out);
                }, 20);
            });
            chatHistory.createChat(userCard, meUsername);


        });

        userCardsContainer.appendChild(userCardDiv);
    }
}

buildUsers();
startSocket();
