import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import API_URL from "../config/api";
import RoomChat from "../components/RoomChat";
import { collection, onSnapshot, or, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const loginUserId = localStorage.getItem("userId");
  const [selectedUser, setSelectedUser] = useState(null);
  const [summaryChats, setSummaryChats] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "summary_chats"),
      or(
        where(`senderId`, "in", [loginUserId, Number(loginUserId)]),
        where(`receiverId`, "in", [loginUserId, Number(loginUserId)])
      )
    );
    const unSub = onSnapshot(q, (doc) => {
      const summary = doc.docs.map((e) => e.data()) || [];
      setSummaryChats(summary);
    });
    fetchUser();

    return () => {
      unSub();
    };
  }, []);

  const fetchUser = async () => {
    try {
      const { data = [] } = await axios.get(API_URL + "/users");
      const dataUser = data?.filter((val) => val.id != loginUserId) || [];
      setUsers(dataUser);
      setSelectedUser(dataUser[0]);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(summaryChats, "<<< summary chats");

  return (
    <div>
      <Navbar />
      <div
        className="row w-100"
        style={{
          height: "93vh",
        }}
      >
        <div className="col-2 px-3" style={{ backgroundColor: "#e3d5ca" }}>
          {users?.map((user) => (
            <div
              key={user?.id}
              className="my-3 mx-2 px-2 pt-2"
              style={{
                border: "1px solid #adb5bd",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={() => setSelectedUser(user)}
            >
              <h4>{user?.name}</h4>
              <div className="d-flex justify-content-end mt-2">
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    width: "90%",
                  }}
                  className="text-collapse"
                >
                  {summaryChats.find(
                    (chat) =>
                      chat.receiverId == user.id || chat.senderId == user.id
                  )?.text || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="col-10"
          style={{ backgroundColor: "#edede9", padding: 0 }}
        >
          {selectedUser && <RoomChat selectedUser={selectedUser} />}
        </div>
      </div>
    </div>
  );
}
