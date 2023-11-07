namespace lavida {
    class Circle {
        public x: number = 0;
        public y: number = 0;
        public radius: number = 0;
        public href: string = "";
        constructor(_x: number = 0, _y: number = 0, _radius: number = 0, _href: string = "") {
            this.x = _x;
            this.y = _y;
            this.radius = _radius;
            this.href = _href;
        }

    }

    window.addEventListener("load", changeGradient);

    function changeGradient(): void {
        document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 23%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 51%,
     rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()}) 88%)`;
    }


    let users: User[] = [];
    let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.95;
    const params = new URLSearchParams(window.location.search);
    const data = params.get("user");
    async function fetchUsers(): Promise<void> {
        try {

            const response = await fetch('https://lavida-server.vercel.app/api/get_users');
            users = await response.json();
            users.forEach(user => {
                if (user.isactive && data != user.name)
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
                    ((window.innerWidth * window.innerHeight) * 0.00033) / users.length, `chat_page.html?user=${username}`);
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
                for (const circle of circles) {
                    const distance = Math.hypot(clickX - circle.x, clickY - circle.y);
                    if (distance <= circle.radius) {
                        window.location.href = circle.href;
                    }
                }
            });
        }
    }

    function isOverlapping(circle: Circle): boolean {
        for (const prevCircle of circles) {
            let distance = Math.hypot(circle.x - prevCircle.x, circle.y - prevCircle.y);
            if (distance < (circle.radius + window.innerWidth * 0.75 / users.length)) {
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
