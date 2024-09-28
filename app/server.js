import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { connectMongo } from "../libs/mongodb.js";
import { NextResponse } from "next/server.js";
import { TeamModel } from "../models/team.model.js";
import { BondBidding } from "../models/bondBidding.model.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connect",async (socket)=>{
    await connectMongo();

    const team = await TeamModel.findOne({ teamName: "Testing-1" });
    if (!team) {
        return NextResponse.json({ message: "Team Not found" });
    }

    const bondBidding = await BondBidding.findById('66f84084d39aba9ca3f14ba5');
    if (!bondBidding) {
        return NextResponse.json({ message: "Bond Bidding Not found" });
    }

    // const message = bondBidding.highestBids[0];
    io.emit("message", {message: bondBidding.highestBids[0]});

    socket.on("message", async(message)=>{
      console.log(message);
      if (message>bondBidding.highestBids[0]) {
        bondBidding.highestBids[0] = message;
        await bondBidding.save();
        console.log("highestBid: ", bondBidding.highestBids[0]);
      } else {
        console.log("Bid is less than highest bid");
      }
      io.emit("message", {message});
    })
  })

  io.on("disconnect", (socket)=>{
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