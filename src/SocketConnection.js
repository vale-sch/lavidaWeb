//@ts-ignore
export let socket;
export let requestInfoObj;
export function connectClientID(userID) {
    //@ts-ignore
    socket = io("wss://lavidasocket.onrender.com"); //
    socket.emit("onconnect", JSON.stringify(userID));
}
