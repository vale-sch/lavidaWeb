
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
        let newUser = new User(_id, _name, _password, true);
        try {

            let response = await fetch('https://lavida-server.vercel.app/api/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            if (response.status === 201) {
                await response.json();
                window.location.replace("landing_page.html");
                alert("You have been successfull registrated!")
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
    sendMsg("joacchim", "joachim", "quatsch laber nicht 1");
    async function sendMsg(chatID: string, senderID: string, message: string) {
        let msg: Message = new Message(chatID, senderID, message);
        try {

            let response = await fetch('https://lavida-server.vercel.app/api/send_msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(msg),
            });

            if (response.status === 201) {
                let responseFirebase: string = await response.text() as string;
                console.log(responseFirebase);
                //  window.location.replace("landing_page.html");
                //alert("You have been successfull registrated!")
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // deleteChat("joacchim");
    async function deleteChat(_chatID: string) {
        try {
            const chatID: any = {
                chatID: _chatID
            };
            let response = await fetch('https://deletechat-mfccjlsnga-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chatID),
            });

            if (response.status === 201) {
                let responseFirebase: string = await response.text() as string;
                console.log(responseFirebase);
                //  window.location.replace("landing_page.html");
                //alert("You have been successfull registrated!")
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchChatEvery100ms(chatID: string) {
        setInterval(async () => {
            try {
                const response = await fetch(`https://receivechat-mfccjlsnga-uc.a.run.app?chatID=${chatID}`);
                let chat = await response.json();
                console.log(chat);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        }, 100); // 100 milliseconds
    }

    // Call the function to start fetching data every 100ms
    //fetchChatEvery100ms("joachim");


}

