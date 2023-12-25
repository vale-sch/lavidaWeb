//@ts-ignore
export let socket;
export let requestInfoObj;
export function connectClientID(userID) {
    //@ts-ignore
    socket = io("wss://lavidasocket.onrender.com "); //ws://localhost:8080
    socket.emit("onconnect", JSON.stringify(userID));
}
