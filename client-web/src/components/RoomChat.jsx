import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Message from "./Message";
import { generateChatId } from "../helpers/generatorChatId";

export default function RoomChat({ selectedUser = {} }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const loginUser = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("username"),
  };

  const chatId = generateChatId(loginUser, selectedUser);

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      messages: [
        {
          text: inputMessage,
          sender: loginUser.id,
          timestamp: Timestamp.now(),
        },
      ],
      users: [loginUser, selectedUser],
      lastText: inputMessage,
      lastTimestamp: Timestamp.now(),
    };
    try {
      const docRef = doc(db, "chats", chatId);
      const findDoc = await getDoc(docRef);
      if (!findDoc.exists()) {
        await setDoc(docRef, payload);
        setInputMessage("");
      } else {
        await updateDoc(docRef, {
          messages: arrayUnion(payload.messages[0]),
          lastText: payload.lastText,
          lastTimestamp: payload.lastTimestamp,
        });
        setInputMessage("");
      }

      // Summary chat not mandatory
      createSummaryChat({
        text: payload.lastText,
        timestamp: payload.lastTimestamp,
      });
    } catch (error) {
      console.log(error, "<<< error");
    }
  };

  const createSummaryChat = async ({ text, timestamp }) => {
    try {
      const payload = {
        // chatId,
        text,
        timestamp,
        senderId: loginUser.id,
        senderName: loginUser.name,
        receiverId: selectedUser.id,
        receiverName: selectedUser.name,
      };
      const docRef = doc(db, "summary_chats", chatId);
      const findDoc = await getDoc(docRef);
      if (!findDoc.exists()) {
        await setDoc(docRef, payload);
      } else {
        await updateDoc(docRef, payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      } else {
        setMessages([]);
      }
    });
    // unSub(); // jika menggunakan ini maka saat awal render akan blank

    return () => {
      unSub();
    };
  }, [chatId]);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
      }}
    >
      <div className="p-2" style={{ backgroundColor: "#e3d5ca" }}>
        <h1>{selectedUser?.name}</h1>
      </div>
      {/* List Message */}
      <div className="px-3">
        {messages?.map((msg, index) => (
          <Message
            key={`msg-${chatId}-${index}`}
            message={msg}
            loginUser={loginUser}
          />
        ))}
      </div>

      {/* Form Input */}
      <form
        className="row"
        style={{ bottom: "20px", position: "absolute", width: "100%" }}
      >
        <div className="col-11">
          <div className="form-check">
            <input
              type="text"
              className="form-control"
              placeholder="Input your message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target?.value)}
            />
          </div>
        </div>
        <div className="col">
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={onSubmit}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
