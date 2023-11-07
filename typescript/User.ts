namespace lavida {
    export class User {
        public id: number = 0;
        public name: string = "";
        private _password: string = "";
        public isactive: boolean = false;
        constructor(_id: number, _name: string, __password: string, _isactive: boolean) {
            this.id = _id;
            this.name = _name;
            this._password = __password;
            this.isactive = _isactive;
        }
        public get password(): string {
            return this._password;
        }
    }
}