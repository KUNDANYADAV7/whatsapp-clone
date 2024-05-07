import React, { useEffect, useState } from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import db from "./firebase";
import { Avatar, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import firebase from "firebase/compat/app";
import { useStateValue } from "./StateProvider";

const Chat = () => {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  console.log(messages);

  useEffect(() => {
    if (roomId) {
      const roomRef = doc(db, "rooms", roomId);
      const messagesRef = collection(roomRef, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

      const roomUnsubscribe = onSnapshot(
        roomRef,
        (snapshot) => {
          setRoomName(snapshot.data()?.name);
        },
        (error) => {
          console.error("Error fetching room:", error);
        }
      );

      const messagesUnsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );

      return () => {
        roomUnsubscribe();
        messagesUnsubscribe();
      };
    }
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("you typed >>> ", input);
    try {
      const roomRef = doc(db, "rooms", roomId);
      const messagesRef = collection(roomRef, "messages");
      await setDoc(doc(messagesRef), {
        // Specify document ID here
        message: input,
        name: user.displayName,
        timestamp: serverTimestamp(),
      });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    <>
      <div className="chat">
        <div className="chat_header">
          <Avatar
            src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`}
          />
          <div className="chat_headerInfo">
            <h3>{roomName}</h3>
            <p>
              Last seen at{" "}
              {messages.length > 0
                ? new Date(
                    messages[messages.length - 1]?.timestamp?.toDate()
                  ).toUTCString()
                : "N/A"}
            </p>
          </div>

          <div className="chat_headerRight">
            <IconButton>
              <SearchOutlined />
            </IconButton>
            <IconButton>
              <AttachFile />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </div>
        </div>

        <div className="chat_body">
          {messages.map((message, index) => (
            <p
              key={index}
              className={`chat_message ${
                message.name === user.displayName && "chat_reciever"
              }`}
            >
              <span className="chat_name">{message.name}</span>
              {message.message}
              <span className="chat_timestamp">
                {message.timestamp
                  ? new Date(message.timestamp.toDate()).toUTCString()
                  : ""}
              </span>
            </p>
          ))}
        </div>

        <div className="chat_footer">
          <InsertEmoticon />
          <form onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              type="text"
            />
            <button type="submit">Send a message</button>
          </form>
          <MicIcon />
        </div>
      </div>
    </>
  );
};

export default Chat;
