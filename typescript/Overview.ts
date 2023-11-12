namespace lavida {
    class Circle {
        public x: number = 0;
        public y: number = 0;
        public radius: number = 0;
        public href: string = "";
        public chatName: string = "";
        constructor(_x: number = 0, _y: number = 0, _radius: number = 0, _href: string = "", _chatName: string) {
            this.x = _x;
            this.y = _y;
            this.radius = _radius;
            this.href = _href;
            this.chatName = _chatName;
        }

    }

    window.addEventListener("load", changeGradient);

    function changeGradient(): void {
        document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 23%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 51%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 88%)`;
    }


    let usersDB: User[] = [];
    let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.95;
    const params = new URLSearchParams(window.location.search);
    const meUsername = params.get("user");


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
            usersDB.forEach((user: any) => {
                if (user.isactive && meUsername != user.name)
                    draw(user.name);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }


    let circles: Circle[] = [];
    let previousCircle: Circle | null = null;

    function draw(username: string) {
        if (canvas.getContext) {
            let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;


            // Radius of the entire circle.
            let circle: Circle;
            console.log();
            do {
                circle = new Circle(getRandomNumber(80, window.innerWidth * 0.75), getRandomNumber(80, window.innerHeight * 0.75),
                    ((window.innerWidth * window.innerHeight) * 0.00033) / usersDB.length, `chat_page.html?user=${username}`, username);
            } while (previousCircle && isOverlapping(circle));

            circles.push(circle);
            previousCircle = circle;

            // Radii of the white glow.
            let innerRadius: number = 30;
            let outerRadius: number = 125;
            var gradient = ctx.createRadialGradient(circle.x, circle.y, innerRadius, circle.x, circle.y, outerRadius);
            gradient.addColorStop(0, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 1.5})`);
            gradient.addColorStop(1, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 2.5})`);

            ctx.beginPath();  // Start a new path for each circle
            ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            ctx.fillStyle = gradient;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fill();

            let fontSize: number = 30;
            if (username.length > 10)
                fontSize = 15;

            ctx.font = `${fontSize}pt Calibri`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(username, circle.x, circle.y + 10);

            canvas.addEventListener('click', (event: MouseEvent) => {
                const canvasBounds = canvas.getBoundingClientRect();
                const clickX = event.clientX - canvasBounds.left;
                const clickY = event.clientY - canvasBounds.top;

                // Check if the click is inside any of the circles

                const distance = Math.hypot(clickX - circle.x, clickY - circle.y);
                if (distance <= circle.radius) {
                    let chatID: string = Math.floor((Date.now() + Math.random())).toString();
                    createChat(chatID, circle);

                }

            });
        }
    }
    async function createChat(chatID: string, circle: Circle) {
        console.log(chatID);
        let newMsgArray: Message[] = [];
        let chat: Chat = new Chat(chatID, newMsgArray);


        try {

            let response = await fetch('https://lavida-server.vercel.app/api/send_msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chat),
            });

            if (response.status === 201) {
                let rspTxt: string = await response.text() as string;
                console.log(rspTxt);
                window.location.href = circle.href + `&chatID=${chatID}` + `&me=${meUsername}`;
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function isOverlapping(circle: Circle): boolean {
        for (const prevCircle of circles) {
            let distance = Math.hypot(circle.x - prevCircle.x, circle.y - prevCircle.y);
            if (distance < (circle.radius + window.innerWidth * 0.75 / usersDB.length)) {
                return true;
            }
        }

        // Check if the circle is too close to the screen edges
        if (
            circle.x - circle.radius < 0 ||
            circle.x + circle.radius > window.innerWidth ||
            circle.y - circle.radius < 0 ||
            circle.y + circle.radius > window.innerHeight
        ) {
            return true;
        }

        return false;
    }





    function getRandomNumber(min: number, max: number) {
        return Math.floor((Math.random() * (max - min)) + min);
    }




    fetchUsers();


}
