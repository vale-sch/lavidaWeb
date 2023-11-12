namespace lavida {
    export class User {
        private id: number = 0;
        private name: string = "";
        private password: string = "";
        public isactive: boolean = false;
        constructor(_id: number, _name: string, _password: string, _isactive: boolean) {
            this.id = _id;
            this.name = _name;
            this.password = _password;
            this.isactive = _isactive;
        }
        public get Id(): number {
            return this.id;
        }
        public get Name(): string {
            return this.name;
        }
        public get Password(): string {
            return this.password;
        }

    }
}