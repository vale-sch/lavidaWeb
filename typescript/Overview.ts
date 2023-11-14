namespace lavida {
    // window.addEventListener("load", changeGradient);

    // function changeGradient(): void {
    //     document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 23%, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 51%, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 88%)`;
    // }

    let usersDB: User[] = [];

    const params = new URLSearchParams(window.location.search);
    let meUsername = params.get("user") as string;

    async function fetchUsers(): Promise<void> {
        let increment: number = 0;
        (await User.fetchUsers()).forEach((userDB: any) => {
            usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive);
            increment++;
        });
        usersDB.forEach((user: any) => {
            if (user.isactive && meUsername != user.name) {
                createUserCard(user);
            }
        });
    }

    function createUserCard(user: User): void {
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

            userCardDiv.addEventListener('click', () => {
                // Handle click event for the user card (e.g., redirect to chat page)
                let chatID: string = Math.floor((Date.now() + Math.random())).toString();
                let chatHistory: ChatHistory = ChatHistory.createNew(chatID, user.Name);
                chatHistory.createChat(userCard, meUsername);
            });

            userCardsContainer.appendChild(userCardDiv);
        }
    }

    fetchUsers();
}
