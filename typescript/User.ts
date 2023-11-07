namespace lavida {
    export class User {
        public id: number = 0;
        public name: string = "";
        public password: string = "";
        public isActive: boolean = false;
        constructor(_id: number, _name: string, _password: string, _isActive: boolean) {
            this.id = _id;
            this.name = _name;
            this.password = _password;
            this.isActive = _isActive;
        }
    }
}