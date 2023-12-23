export class Chat {
    public id: string;

    public participants: string[];
    public isRequested: boolean = false;
    public isAccepted: boolean = false;
    constructor(id: string, participants: string[], isAccepted: boolean, isRequested: boolean) {
        this.id = id;
        this.participants = participants;
        this.isAccepted = isAccepted;
        this.isRequested = isRequested;
    }
}