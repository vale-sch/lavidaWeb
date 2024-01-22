var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "./User.js";
import { hideLoadingOverlay, showLoadingOverlay } from "./SiteChanger.js";
let buttonDiv = document.getElementById("registration");
let shuffleButton = document.getElementById("shuffle");
let profile_img = document.getElementById("profile_image");
if (buttonDiv != null) {
    buttonDiv.addEventListener("click", registrateMe);
    document.addEventListener('keydown', (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.key === 'Enter') {
            yield registrateMe();
        }
    }));
    if (shuffleButton != null) {
        shuffleButton.addEventListener("click", shuffleImages);
        shuffleImages();
    }
}
function registrateMe() {
    return __awaiter(this, void 0, void 0, function* () {
        let nameValue = document.getElementById("name").value;
        let passwordValue = document.getElementById("password").value;
        if (!nameValue || !passwordValue) {
            alert("You have to fill out all fields.");
            return;
        }
        try {
            let newUser = new User(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue, false, profile_img.src, new Array());
            showLoadingOverlay();
            let isSuccess = yield newUser.pushUser();
            if (isSuccess) {
                hideLoadingOverlay();
                let divClass = document.getElementsByClassName("content")[0];
                divClass.innerHTML = `<h1>Thank you for registering ${newUser.name}!</h1>`;
                divClass.innerHTML += `<p>You can now log in with your credentials.</p>`;
                divClass.innerHTML += `You will be redirected in 5 seconds.`;
                setTimeout(() => {
                    window.location.replace("laVidaChat.html");
                }, 5000);
            }
            else {
                hideLoadingOverlay();
                alert("Something went wrong. Please try again.");
            }
        }
        catch (error) {
            alert('Error pushing user:' + error.toString());
            // Handle error, such as informing the user about the issue
        }
    });
}
function shuffleImages() {
    profile_img.src = `https://raw.githubusercontent.com/vale-sch/lavidaWeb/main/avatars/p%20(${Math.floor(Math.random() * 30)}).jpg`;
}
