import { User } from "./User.js";


let buttonDiv: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;

let userLogin: HTMLInputElement = document.getElementById("loginUser") as HTMLInputElement;
let userPassword: HTMLInputElement = document.getElementById("loginPW") as HTMLInputElement;

addEvents();


async function addEvents(): Promise<void> {
    if (buttonDiv == null) return;
    await User.fetchUsers();
    if (User.usersDB != null) {
        buttonDiv.onclick = checkCredentials;
        document.addEventListener('keydown', async (e) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                await checkCredentials();
            }
        });
    }
}

async function checkCredentials() {
    console.log((!userLogin.value || !userPassword.value));
    if (!userLogin.value || !userPassword.value) return;

    let thisUser: User = new User(0, "", "", false);
    User.usersDB.forEach((userDB: User) => {
        if (userLogin.value == userDB.Name) {
            console.log(userDB.Name);
            if (userPassword.value == userDB.Password) {
                thisUser = userDB;
            }
        }
    });
    await new Promise(f => setTimeout(f, 50));

    if (thisUser.Id != 0) {
        window.location.replace(`overview_page.html?user=${encodeURIComponent(userLogin.value)}`);
    }
}
