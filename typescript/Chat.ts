class Chat {
    public chatID: string;
    public messages: Message[];

    constructor(_chatID: string, _message: Message[]) {
        this.chatID = _chatID;
        this.messages = _message;
    }

}