namespace lavida {
    export class Overview {
        constructor(users: User[], thisUser: User) {
            this.draw(users, thisUser)
        }
        private draw(users: User[], thisUser: User) {
            let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

            if (canvas.getContext) {

                let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
                var x = 150,
                    y = 125,
                    // Radii of the white glow.
                    innerRadius = 15,
                    outerRadius = 125,
                    // Radius of the entire circle.
                    radius = 75;

                var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
                gradient.addColorStop(0, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 1.5}) `);
                gradient.addColorStop(1, `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 2.5})`);

                ctx.arc(x, y, radius, 0, 2 * Math.PI);

                ctx.fillStyle = gradient;

                ctx.fill();

                ctx.font = '30pt Calibri';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                //@ts-ignore
                ctx.fillText("oeter", x, y + 10);
            }
        }
    }

}
