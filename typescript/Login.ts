namespace lavida {
    let usersDB: User[] = [];


    let buttonDiv: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;
    buttonDiv.onclick = checkCredentials;


    let userLogin: HTMLInputElement = document.getElementById("loginUser") as HTMLInputElement;
    let userPassword: HTMLInputElement = document.getElementById("loginPW") as HTMLInputElement;
    fetchUsers();

    async function fetchUsers(): Promise<void> {
        let increment: number = 0;
        (await User.fetchUsers()).forEach((userDB: any) => {
            usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive);
            increment++;
        });
    }

    async function checkCredentials() {
        if (!userLogin.value || !userPassword.value) return;

        let thisUser: User = new User(0, "", "", false);
        usersDB.forEach((userDB: User) => {
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


}
