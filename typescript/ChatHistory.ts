namespace lavida {
    export interface Message {
        sender_id: string;
        message: string;
        time_sent: string;
    }

    export class ChatHistory {
        public chat_id: string;
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



        static fromDatabase(data: { chat_id: string; messages: Message[] }): ChatHistory {
            return new ChatHistory(data.chat_id, data.messages);
        }

        addMessage(sender_id: string, message: string): void {
            const newMessage: Message = {
                sender_id: sender_id,
                message: message,
                time_sent: new Date().toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' }),
            };

            this.messages.push(newMessage);
        }

        async getChatHistory(_chatID: string): Promise<ChatHistory | null> {
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
                return null;

            }
        }
        async sendMsg(chatID: string, senderID: string, message: string) {
            this.addMessage(senderID, message)
            try {

                let response = await fetch('https://lavida-server.vercel.app/api/send_msg', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this),
                });

                if (response.status === 201) {
                    await response.json();
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

                if (response.status === 201) {
                    let deleted_chat: string = await response.json();
                    console.log(deleted_chat);


                } else {
                    let data = await response.json();
                    console.log(`Error: ${data.error}`);
                }
            } catch (error) {
                console.log(error);
            }
        }
        async createChat(circle: Circle, _meUsername: string) {
            try {
                let response = await fetch('https://lavida-server.vercel.app/api/create_chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this),
                });

                if (response.status === 201) {
                    let rspTxt: string = await response.text() as string;
                    console.log(rspTxt);
                    window.location.href = circle.href + `&chatID=${this.chat_id}` + `&me=${_meUsername}`;
                } else {
                    let data = await response.json();
                    console.log(`Error: ${data.error}`);
                }
            } catch (error) {
                console.log(error);
            }
        }

    }
}
