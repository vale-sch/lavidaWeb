export class Chat {
    constructor(id, participants, isAccepted, isRequested) {
        this.isRequested = false;
        this.isAccepted = false;
        this.id = id;
        this.participants = participants;
        this.isAccepted = isAccepted;
        this.isRequested = isRequested;
    }
}
