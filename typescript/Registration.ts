import { User } from "./User.js";

let buttonDiv: HTMLInputElement = document.getElementById("registration") as HTMLInputElement;
if (buttonDiv != null) {
    buttonDiv.addEventListener("click", registrateMe);
    document.addEventListener('keydown', async (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            registrateMe();
        }
    });
}


function registrateMe(): void {
    let nameValue: string = (document.getElementById("name") as HTMLInputElement).value;
    let passwordValue: string = (document.getElementById("password") as HTMLInputElement).value;

    if (!nameValue || !passwordValue) return;
    let newUser = new User(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue, false);
    newUser.pushUser();

}




