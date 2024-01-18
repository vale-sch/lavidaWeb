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
    constructor(_id, _name, _password, _isActive, _profileImgURL, _chats) {
        this.isActive = true;
        this.name = "";
        this.password = "";
        this.id = 0;
        this.profileImgURL = "";
        this.id = _id;
        this.name = _name;
        this.password = _password;
        this.isActive = _isActive;
        this.profileImgURL = _profileImgURL;
        this.chats = _chats;
    }
    static updateChatsInUser(chat, userID) {
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
                    yield response.json();
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
    static removeChatFromUser(chatId, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/remove_chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chatId, userID }),
                });
                if (response.status === 200) {
                    yield response.json();
                }
                else {
                    let data = yield response.json();
                    console.log(`Error: ${data.error}`);
                }
            }
            catch (error) {
                console.error('Error removing chat:', error);
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
                    alert("Registration successfull! Redirecting to login page");
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
    static updateMe() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = User.me.id;
            try {
                let response = yield fetch('https://lavida-server.vercel.app/api/get_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }), // Wrap the id in an object
                });
                if (response.status === 201) {
                    let me = yield response.json();
                    User.me = new User(me.id, me.name, me.password, me.isactive, me.profileimageurl, me.chats);
                }
                else {
                    yield response.json();
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
                    User.usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive, userDB.profileimageurl, userDB.chats);
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
