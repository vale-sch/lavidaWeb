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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let nameValue = document.getElementById("name").value;
        let passwordValue = document.getElementById("password").value;
        let imgURL = document.getElementById("fileInput").value;
        if (!nameValue || !passwordValue || !imgURL) {
            alert("You have to fill out all fields.");
            return;
        }
        const fileInput = document.getElementById('fileInput');
        let userID = Math.floor((Date.now() + Math.random()) / 10000);
        try {
            let imgURL = yield uploadFileToGitHub(((_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0]) || new File([], ""), userID.toString());
            let newUser = new User(userID, nameValue, passwordValue, false, imgURL, new Array());
            newUser.pushUser();
            document.getElementsByClassName("container")[0].innerHTML = "You have been successfull registrated!";
        }
        catch (error) {
            console.error('Error uploading image:', error);
            // Handle error, such as informing the user about the issue
        }
    });
}
function uploadFileToGitHub(file, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = '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';
        const repoOwner = 'vale-sch';
        const repoName = 'lavidaWeb';
        const branchName = 'main'; // Branch, in den du hochladen möchtest
        const filePath = `images/${userID + file.name}`; // Dateipfad im Repository
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const base64Data = (_a = reader.result) === null || _a === void 0 ? void 0 : _a.toString().split(',')[1];
                const data = {
                    message: 'Upload Image',
                    content: base64Data,
                    branch: branchName,
                };
                try {
                    const response = yield fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `token ${token}`,
                        },
                        body: JSON.stringify(data),
                    });
                    if (response.status === 201) {
                        const responseData = yield response.json();
                        const imageUrl = responseData.content.download_url;
                        resolve(imageUrl);
                    }
                    else {
                        console.error('Fehler beim Hochladen:', response.statusText);
                        reject(response.statusText);
                    }
                }
                catch (error) {
                    console.error('Fehler beim Hochladen:', error);
                    reject(error.toString());
                }
            });
            reader.readAsDataURL(file);
        });
    });
}
