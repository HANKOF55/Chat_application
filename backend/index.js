// import http from "http";
// import app from "./src/app.js";
// import { initSocket } from "./src/socket/socket.js";
import { server } from "./src/socket/socket.js";


// const server = http.createServer(app);

// Initialize Socket.IO
// initSocket(server);

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
