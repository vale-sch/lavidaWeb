
import { InfoStream } from "./InfoStream";

//@ts-ignore
export let socket: Socket;
export let requestInfoObj: InfoStream;

export function connectClientID(userID: number): void {
    //@ts-ignore
    socket = io("wss://lavidasocket.onrender.com"); //
    socket.emit("onconnect", JSON.stringify(userID));
}


