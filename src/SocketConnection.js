var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
//@ts-ignore
deployed one
const socket: Socket = io("wss://lavidasocket.onrender.com");


*/
/*localOne
*/
//@ts-ignore
export const socket = io("ws://localhost:8080");
export let requestInfoObj;
export function connectClientID(userID) {
    socket.emit("onconnect", JSON.stringify(userID));
}
export function requestChatpartner(meUsername) {
    socket.on("infoStream", (requestInfo) => {
        requestInfoObj = JSON.parse(requestInfo);
        if (requestInfoObj.myUsername == meUsername) {
            document.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
                if (e.key === 'Enter') {
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
            }));
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
