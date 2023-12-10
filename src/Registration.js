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
let buttonDiv = document.getElementById("registration");
if (buttonDiv != null) {
    buttonDiv.addEventListener("click", registrateMe);
    document.addEventListener('keydown', (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.key === 'Enter') {
            registrateMe();
        }
    }));
}
function registrateMe() {
    let nameValue = document.getElementById("name").value;
    let passwordValue = document.getElementById("password").value;
    if (!nameValue || !passwordValue)
        return;
    let newUser = new User(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue, false);
    newUser.pushUser();
}
