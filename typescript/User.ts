export class User {
    public static usersDB: User[] = [];
    public ioClientID: string = "";
    public isActive: boolean = true;

    private name: string = "";
    private password: string = "";
    private id: number = 0;


    constructor(_id: number, _name: string, _password: string, _isActive: boolean) {
        this.id = _id;
        this.name = _name;
        this.password = _password;
        this.isActive = _isActive;
    }
    public get Id(): number {
        return this.id;
    }
    public get Name(): string {
        return this.name;
    }
    public get Password(): string {
        return this.password;
    }

    async pushUser() {
        try {
            let response = await fetch('https://lavida-server.vercel.app/api/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this),
            });
            if (response.status === 201) {
                await response.json();
                window.location.replace("login_page.html");
                alert("You have been successfull registrated!")
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    static async fetchUsers(): Promise<void> {
        try {
            const response = await fetch('https://lavida-server.vercel.app/api/get_users');
            let usersFetched = await response.json();
            let increment: number = 0;
            usersFetched.forEach((userDB: any) => {
                User.usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive);
                increment++;
            });
        } catch (error) {
            console.error('Error fetching users:', error);

        }
    }

}
