export class Chat {
    public id: string;
    public participants: string[];
    constructor(id: string, participants: string[]) {
        this.id = id;
        this.participants = participants;
    }
}