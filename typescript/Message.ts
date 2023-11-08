class Message {
    public chatID: string = "";
    public message: string = "";
    public time: string = "";

    constructor(_chatID: string, _message: string, _time: string) {
        this.chatID = _chatID;
        this.message = _message;
        this.time = _time;
    }

}