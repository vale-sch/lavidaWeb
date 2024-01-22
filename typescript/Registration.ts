import { Chat } from "./Chat.js";
import { User } from "./User.js";

import { showLoadingOverlay } from "./SiteChanger.js";

let buttonDiv: HTMLInputElement = document.getElementById("registration") as HTMLInputElement;
let shuffleButton: HTMLButtonElement = document.getElementById("shuffle") as HTMLButtonElement;
let profile_img: HTMLImageElement = document.getElementById("profile_image") as HTMLImageElement;

if (buttonDiv != null) {
    buttonDiv.addEventListener("click", registrateMe);
    document.addEventListener('keydown', async (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            registrateMe();
        }
    });
    if (shuffleButton != null) {
        shuffleButton.addEventListener("click", shuffleImages);
        shuffleImages();
    }
}




// Example usage:
// Call showLoadingOverlay() when you want to start loading.
// Call hideLoadingOverlay() when your loading process is complete.


async function registrateMe(): Promise<void> {
    let nameValue: string = (document.getElementById("name") as HTMLInputElement).value;
    let passwordValue: string = (document.getElementById("password") as HTMLInputElement).value;
    if (!nameValue || !passwordValue) {
        alert("You have to fill out all fields.")
        return;
    }
    try {
        let newUser = new User(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue, false, profile_img.src, new Array<Chat>());
        showLoadingOverlay();
        await newUser.pushUser();
    } catch (error: string | any) {
        alert('Error pushing user:' + (error.toString() as string));
        // Handle error, such as informing the user about the issue
    }
}

function shuffleImages(): void {
    profile_img.src = `https://raw.githubusercontent.com/vale-sch/lavidaWeb/main/avatars/p%20(${Math.floor(Math.random() * 30)}).jpg`;
}

