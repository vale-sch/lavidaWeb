import { onStartOverview } from "./Overview.js";
import { cleanLogin, createOvervieHTML } from "./SiteChanger.js";
import { connectClientID } from "./SocketConnection.js";
import { User } from "./User.js";


let buttonDiv: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;

let userLogin: HTMLInputElement = document.getElementById("loginUser") as HTMLInputElement;
let userPassword: HTMLInputElement = document.getElementById("loginPW") as HTMLInputElement;
export let me: User;
let eventOnEnter: any;
let hasCleaned: boolean = false;
onStartLogin();
function onStartLogin() {
    addEvents();
}



async function addEvents(): Promise<void> {
    if (buttonDiv == null) return;
    await User.fetchUsers();
    console.log("hasFetched");
    if (User.usersDB != null) {
        buttonDiv.onclick = checkCredentials;
        eventOnEnter = document.addEventListener('keydown', async (e) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                await checkCredentials();
            }
        });
    }
}

async function checkCredentials() {
    if (!userLogin.value || !userPassword.value || hasCleaned) return;
    User.usersDB.forEach((userDB: User) => {
        if (userLogin.value == userDB.Name) {
            if (userPassword.value == userDB.Password) {
                me = userDB;
                console.log(me);
            }
        }
    });
    document.removeEventListener('keydown', eventOnEnter);
    cleanLogin();
    createOvervieHTML();
    onStartOverview();
    connectClientID(me.Id);

    hasCleaned = true;
}
