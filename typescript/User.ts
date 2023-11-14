namespace lavida {
    export class User {
        private id: number = 0;
        private name: string = "";
        private password: string = "";
        public isactive: boolean = false;

        constructor(_id: number, _name: string, _password: string, _isactive: boolean) {
            this.id = _id;
            this.name = _name;
            this.password = _password;
            this.isactive = _isactive;
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

        static async fetchUsers(): Promise<User[]> {
            try {
                const response = await fetch('https://lavida-server.vercel.app/api/get_users');
                let usersFetched = await response.json();

                return usersFetched;
            } catch (error) {
                console.error('Error fetching users:', error);
                return new Array<User>;

            }
        }

    }
}