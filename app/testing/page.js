"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

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
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const [message, setMessage] = useState("");
  const [label, setLabel] = useState([]);
  const [correct,setCorrect] = useState('');

  socket.on("message", ({ message }) => {
    console.log(message);
    
    setLabel(prev=>[...prev,message]);
    setCorrect(message);
  });
  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
    <p>{correct}</p>
      <input
        type="text"
        value={message}
        placeholder="Karan"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={() => {
        socket.emit("message", message);
        console.log("its me",label)
        setMessage("");
      }}>Send</button>
      <div>
      {label.map((el)=>{
        return <p>{el}</p>
      })}
      </div>
    </div>
  );
}
