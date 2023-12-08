import { InfoStream } from "./InfoStream";


/*
//@ts-ignore
deployed one
const socket: Socket = io("wss://lavidasocket.onrender.com");


*/
/*localOne
*/
//@ts-ignore
export const socket: Socket = io("ws://localhost:8080");
export let requestInfoObj: InfoStream


export function connectClientID(userID: number): void {
    socket.emit("onconnect", JSON.stringify(userID));
}

export function requestChatpartner(meUsername: string): void {
    socket.on("infoStream", (requestInfo: string) => {
        requestInfoObj = JSON.parse(requestInfo) as InfoStream;
        if (requestInfoObj.myUsername == meUsername) {
            document.addEventListener('keydown', async (e) => {
                if ((e as KeyboardEvent).key === 'Enter') {
                    requestInfoObj.acceptedChatInvite = true;
                    socket.emit("infoStream", JSON.stringify(requestInfoObj));
                    // document.write(newHTML);
                    // document.close();
                    // window.location.href = requestInfoObj.url;
                }
                // if ((e as KeyboardEvent).key === 'ESC') {
                //     infoStreamObj.acceptedChatInvite = false;
                //     socket.emit("infoStream", JSON.stringify(infoStream));;
                // }
            });


            // if (confirm(`You got a new Chat Request from ${infoStreamObj.partnerUsername}`) == true) {
            //     window.location.href = infoStreamObj.url + `&chatID=${infoStreamObj.chatID}` + `&me=${infoStreamObj.myUsername}`;
            // } else {
            //     infoStreamObj.acceptedChatInvite = false;
            //     socket.emit("infoStream", JSON.stringify(infoStream));;
            // }
            // ;
            // ;

        }
    });
}

