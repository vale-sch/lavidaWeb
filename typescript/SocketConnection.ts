
import { InfoStream } from "./InfoStream";


/*
deployed one
const socket: Socket = io("ws://lcoalhost:8000");
*/

//@ts-ignore
export let socket: Socket;
export let requestInfoObj: InfoStream;

export function connectClientID(userID: number): void {
    //@ts-ignore
    socket = io("wss://lavidasocket.onrender.com");
    socket.emit("onconnect", JSON.stringify(userID));
}


