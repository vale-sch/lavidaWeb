namespace lavida {
    export class UserCard {

        public href: string = "";
        public chatName: string = "";
        constructor(_href: string = "", _chatName: string) {

            this.href = _href;
            this.chatName = _chatName;
        }

    }
}
