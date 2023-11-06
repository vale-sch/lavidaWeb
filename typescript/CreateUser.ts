namespace lavida {
    let buttonDiv: HTMLInputElement = document.getElementById("registration") as HTMLInputElement;

    buttonDiv.addEventListener("click", registrateMe);
    function registrateMe(): void {

        let nameValue: string = (document.getElementById("name") as HTMLInputElement).value;
        let passwordValue: string = (document.getElementById("password") as HTMLInputElement).value;

        if (!nameValue || !passwordValue) return;
        createUser(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue);

    }

    async function createUser(_id: number, _name: string, _password: string) {
        let requestData = {
            id: _id,
            name: _name,
            password: _password,
            isActive: true
        };

        try {
            let response = await fetch('https://lavida-server.vercel.app/api/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.status === 201) {
                let data = await response.json();
                window.location.replace("landing_page.html")
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
                alert("You have been successfull registrated!")
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
}
