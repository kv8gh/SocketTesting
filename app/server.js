import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a new client connected");
    socket.on('disconnect',()=>{
      console.log('client disconnected');
    })
    const hello = "WTB";
    socket.on("message", (message)=>{
      console.log(message);
      io.emit("message", {message})
    })
  });

  io.on("disconnect",(socket)=>{
    console.log('a client is disconnected');
  })

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});