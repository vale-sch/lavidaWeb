
import { InfoStream } from "./InfoStream";
//import { UserCard } from "./UserCard";
//import { ChatHistory } from "./ChatHistory";

/*
//@ts-ignore
deployed one
const socket: Socket = io("wss://lavidasocket.onrender.com");


*/
/*localOne
*/
//@ts-ignore
export let socket: Socket;
export let requestInfoObj: InfoStream;



export function connectClientID(userID: number): void {
    //@ts-ignore
    socket = io("ws://localhost:8080");
    socket.emit("onconnect", JSON.stringify(userID));
}

// export function requestChatpartner(meUsername: string): void {
//     socket.on("infoStream", (requestInfo: string) => {
//         requestInfoObj = JSON.parse(requestInfo) as InfoStream;
//         if (requestInfoObj.myUsername == meUsername) {
//             document.addEventListener('keydown', async (e) => {
//                 if ((e as KeyboardEvent).key === 'Enter') {
//                     requestInfoObj.acceptedChatInvite = true;

//                     socket.emit("infoStream", JSON.stringify(requestInfoObj));
//                     //@ts-ignore
//                     // let chat: ChatHistory = ChatHistory.getChatHistory(requestInfoObj.chatID) as Promise<ChatHistory>;
//                     // chat.createChat(new UserCard(undefined, chat.chat_id), meUsername);

//                     // document.write(newHTML);
//                     // document.close();
//                     // window.location.href = requestInfoObj.url;
//                 }
//                 // if ((e as KeyboardEvent).key === 'ESC') {
//                 //     infoStreamObj.acceptedChatInvite = false;
//                 //     socket.emit("infoStream", JSON.stringify(infoStream));;
//                 // }
//             });


//             // if (confirm(`You got a new Chat Request from ${infoStreamObj.partnerUsername}`) == true) {
//             //     window.location.href = infoStreamObj.url + `&chatID=${infoStreamObj.chatID}` + `&me=${infoStreamObj.myUsername}`;
//             // } else {
//             //     infoStreamObj.acceptedChatInvite = false;
//             //     socket.emit("infoStream", JSON.stringify(infoStream));;
//             // }
//             // ;
//             // ;

//         }
//     });
// }

