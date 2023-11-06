namespace lavida {

    let users: User[] = [];
    fetchUsers();
    let buttonDiv: HTMLInputElement = document.getElementById("loginBtn") as HTMLInputElement;

    buttonDiv.addEventListener("click", checkCredentials);
    async function fetchUsers(): Promise<void> {
        try {
            const response = await fetch('https://lavida-server.vercel.app/api/get_users');
            users = await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    function checkCredentials(): void {
        users.forEach((user: User) => {
            console.log(user.id);
        });
    }
}
