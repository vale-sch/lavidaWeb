import { Chat } from "./Chat.js";
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


async function registrateMe(): Promise<void> {
    let nameValue: string = (document.getElementById("name") as HTMLInputElement).value;
    let passwordValue: string = (document.getElementById("password") as HTMLInputElement).value;

    if (!nameValue || !passwordValue) return;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    let userID: number = Math.floor((Date.now() + Math.random()) / 10000);
    try {
        let imgURL = await uploadFileToGitHub(fileInput.files?.[0] || new File([], ""), userID.toString()) as string;
        console.log(imgURL);
        let newUser = new User(userID, nameValue, passwordValue, false, imgURL, new Array<Chat>());
        newUser.pushUser();
    } catch (error) {
        console.error('Error uploading image:', error);
        // Handle error, such as informing the user about the issue
    }
}
async function uploadFileToGitHub(file: File, userID: string): Promise<string> {
    const token = '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';
    const repoOwner = 'vale-sch';
    const repoName = 'lavidaWeb';
    const branchName = 'main'; // Branch, in den du hochladen möchtest
    const filePath = `images/${userID + file.name}`; // Dateipfad im Repository

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            const base64Data = reader.result?.toString().split(',')[1];

            const data = {
                message: 'Upload Image',
                content: base64Data,
                branch: branchName,
            };

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `token ${token}`,
                    },
                    body: JSON.stringify(data),
                });

                if (response.status === 201) {
                    const responseData = await response.json();
                    const imageUrl = responseData.content.download_url;
                    resolve(imageUrl);
                } else {
                    console.error('Fehler beim Hochladen:', response.statusText);
                    reject(response.statusText);
                }
            } catch (error: any) {
                console.error('Fehler beim Hochladen:', error);
                reject(error.toString());
            }
        };

        reader.readAsDataURL(file);
    });
}
