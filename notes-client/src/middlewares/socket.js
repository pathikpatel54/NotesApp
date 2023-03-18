import { encryptData } from "./crypto";

export const socket = () => {
    const ws = new WebSocket("ws://localhost:3000/api/notes/socket");

    ws.onclose = (evt) => {
        const event = JSON.parse(evt.data);
        console.log(event);
    };

    ws.onopen = (evt) => {
        ws.send(JSON.stringify({ type: "ping" }));
    };

    return ws;
};

export const waitForOpenSocket = (socket) => {
    return new Promise((resolve) => {
        if (socket?.readyState !== socket?.OPEN) {
            socket?.on("open", (_) => {
                resolve();
            });
        } else {
            resolve();
        }
    });
};

export const sendMessage = async (socket, message, password) => {
    await waitForOpenSocket(socket);
    const encryptedMessage = {
        ...message,
        new: {
            ...message.new,
            title: await encryptData(message?.new?.title, password),
            content: await encryptData(message?.new?.content, password),
        },
    };
    socket?.send(JSON.stringify(encryptedMessage));
};
