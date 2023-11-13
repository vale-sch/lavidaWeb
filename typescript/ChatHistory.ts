namespace lavida {
    export interface Message {
        sender_id: string;
        message: string;
        time_sent: string;
    }

    export class ChatHistory {
        chat_id: string;
        messages: Message[];

        constructor(chat_id: string, messages: Message[]) {
            this.chat_id = chat_id;
            this.messages = messages;
        }

        static createNew(chat_id: string, sender_id: string): ChatHistory {
            const newMessage: Message = {
                sender_id: sender_id,
                message: "",
                time_sent: "",
            };

            return new ChatHistory(chat_id, [newMessage]);
        }

        addMessage(sender_id: string, message: string): void {
            const newMessage: Message = {
                sender_id: sender_id,
                message: message,
                time_sent: new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' }),
            };

            this.messages.push(newMessage);
        }

        static fromDatabase(data: { chat_id: string; messages: Message[] }): ChatHistory {
            return new ChatHistory(data.chat_id, data.messages);
        }

        toDatabase(): { chat_id: string; messages: Message[] } {
            return {
                chat_id: this.chat_id,
                messages: this.messages,
            };
        }
    }
}
