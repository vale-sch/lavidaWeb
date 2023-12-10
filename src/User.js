var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class User {
    constructor(_id, _name, _password, _isActive, chats) {
        this.isActive = true;
        this.name = "";
        this.password = "";
        this.id = 0;
        this.id = _id;
        this.name = _name;
        this.password = _password;
        this.isActive = _isActive;
        this.chats = chats;
    }
    get Id() {
        return this.id;
    }
    get Name() {
        return this.name;
    }
    get Password() {
        return this.password;
    }
    updateChatsInUser(chat, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/push_chat_to_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chat, userID }),
                });
                if (response.status === 200) {
                    let responseJSON = yield response.json();
                    console.log(responseJSON);
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.error('Error creating user:', error);
            }
        });
    }
    pushUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/create_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this),
                });
                if (response.status === 201) {
                    yield response.json();
                    window.location.replace("laVidaChat.html");
                    alert("You have been successfull registrated!");
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.error('Error creating user:', error);
            }
        });
    }
    static fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://lavida-server.vercel.app/api/get_users');
                let usersFetched = yield response.json();
                let increment = 0;
                usersFetched.forEach((userDB) => {
                    User.usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive, userDB.chats);
                    increment++;
                });
            }
            catch (error) {
                console.error('Error fetching users:', error);
            }
        });
    }
}
User.usersDB = [];
