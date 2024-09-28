"use client";

import { useEffect, useState } from "react";
import { socket } from "@/app/socket.js";

export default function page() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    console.log("Inside useEffect");

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", handleMessage);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", handleMessage);
    };
  }, []);

  const handleMessage = ({ message }) => {
    // setLabel(prev=>[...prev,`${message} from ${team.leaderName}`]);
    // console.log("Received message:", message, "from user:", team.leaderName);
    setHighestBid(message);
  }

  const [message, setMessage] = useState();
  // const [label, setLabel] = useState([]);
  const [highestBid, setHighestBid] = useState(0);

  const handleSubmit = ()=>{
    if (highestBid<parseInt(message)) {
      socket.emit("message", parseInt(message));
      // console.log("its me",label)
      setHighestBid(parseInt(message))
      setMessage("");
    } else {
      alert("Your bid is lower than the current highest bid.");
      setMessage("");
    }
  }

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <input
        type="text"
        value={message}
        placeholder="0.00"
        className="text-black"
        onChange={(e) => {
          const value = e.target.value;
        
          // Check if the last character is a digit or if the input is empty
          if (/^\d*$/.test(value)) {
            setMessage(value);
          }
        }}
      />
      <button onClick={handleSubmit}>Send</button>
      <div className="text-white">
        {highestBid}
      </div>
    </div>
  );
}
