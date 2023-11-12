class Message {
    public chatID: string;
    public senderID: string;
    public message: string;
    public time: string = "";

    constructor(_chatID: string, _senderID: string, _message: string) {
        this.chatID = _chatID;
        this.senderID = _senderID;
        this.message = _message;
    }

}