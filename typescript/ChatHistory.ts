
export interface Message {
    sender_id: string;
    message: string;
    time_sent: string;
}

export class ChatHistory {
    public chat_id: string;
    public participants: string[];
    messages: Message[];
    constructor(chat_id: string, messages: Message[], participants: string[]) {
        this.chat_id = chat_id;
        this.messages = messages;
        this.participants = participants;
    }

    static createNew(chat_id: string, sender_id: string, participants: string[]): ChatHistory {
        const newMessage: Message = {
            sender_id: sender_id,
            message: "",
            time_sent: "",
        };

        return new ChatHistory(chat_id, [newMessage], participants);
    }



    static fromDatabase(data: { chat_id: string; messages: Message[], participants: string[] }): ChatHistory {
        return new ChatHistory(data.chat_id, data.messages, data.participants);
    }

    addMessage(sender_id: string, message: string): void {
        const newMessage: Message = {
            sender_id: sender_id,
            message: message,
            time_sent: new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' }),
        };

        this.messages.push(newMessage);
    }

    static async getChatHistory(_chatID: string): Promise<ChatHistory | string> {
        try {
            const response = await fetch(`https://lavida-server.vercel.app/api/receive_chat?chatID=${_chatID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {


                return ChatHistory.fromDatabase(await response.json());;
                // Process the messages as needed
            } else {
                const data = await response.json();
                console.log(`Error: ${data.error}`);
                return data;

            }
        } catch (error) {
            console.error(error);
            return `Nothing fetched: ${error}`;

        }
    }
    async sendMsg(senderID: string, message: string) {
        this.addMessage(senderID, message);
        try {

            let response = await fetch('https://lavida-server.vercel.app/api/send_msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this),
            });

            if (response.status === 201) {
                let test = await response.json();
                console.log(test)
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteChat(_chatID: string) {
        try {
            let response = await fetch(`https://lavida-server.vercel.app/api/delete_chat?chatID=${_chatID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                await response.json();


            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async createChat(): Promise<string> {
        try {
            let response = await fetch('https://lavida-server.vercel.app/api/create_chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this),
            });

            if (response.status === 201) {
                let txt: string = await response.text() as string;
                return txt;
            } else {
                let data = await response.json();
                console.log(`Error: ${data.error}`);
                return data.error as string;

            }
        } catch (error) {
            console.log(error);
            return error as string;

        }
    }
}

