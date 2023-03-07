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

export const sendMessage = async (socket, message) => {
    console.log(message);
    await waitForOpenSocket(socket);
    socket?.send(message);
}
