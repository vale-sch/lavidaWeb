/*
deployed one
const socket: Socket = io("ws://localhost:8080");
*/
//@ts-ignore
export let socket;
export let requestInfoObj;
export function connectClientID(userID) {
    //@ts-ignore
    socket = io("wss://lavidasocket.onrender.com");
    socket.emit("onconnect", JSON.stringify(userID));
}
