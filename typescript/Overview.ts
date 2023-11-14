
namespace lavida {
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
    let meUsername = params.get("user") as string;


    async function fetchUsers(): Promise<void> {
        let increment: number = 0;
        (await User.fetchUsers()).forEach((userDB: any) => {
            usersDB[increment] = new User(userDB.id, userDB.name, userDB.password, userDB.isactive);
            increment++;
        });
        usersDB.forEach((user: any) => {
            if (user.isactive && meUsername != user.name)
                draw(user.name);
        });
    }

    fetchUsers();

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

                    let chatHistory: ChatHistory = ChatHistory.createNew(chatID, username);
                    chatHistory.createChat(circle, meUsername);

                }

            });
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
}
