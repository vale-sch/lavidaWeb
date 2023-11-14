namespace lavida {
    export class Circle {
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
}
