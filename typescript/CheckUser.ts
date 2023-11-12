namespace lavida {
    let usersDB: User[] = [];


    let buttonDiv: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;
    buttonDiv.onclick = checkCredentials;


    let userLogin: HTMLInputElement = document.getElementById("loginUser") as HTMLInputElement;
    let userPassword: HTMLInputElement = document.getElementById("loginPW") as HTMLInputElement;
    fetchUsers();

    async function fetchUsers(): Promise<void> {
        try {
            const response = await fetch('https://lavida-server.vercel.app/api/get_users');
            let usersFetched = await response.json();
            let increment: number = 0;
            usersFetched.forEach((userDB: any) => {
                usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive);
                increment++;
            });
            usersFetched = null;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
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
        await new Promise(f => setTimeout(f, 100));

        if (thisUser.Id != 0) {
            window.location.replace(`overview.html?user=${encodeURIComponent(userLogin.value)}`);
        }
    }


}
