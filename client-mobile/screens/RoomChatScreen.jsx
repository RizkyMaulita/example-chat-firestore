import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BaseLayout from "../layouts/BaseLayout";
import React, { useEffect, useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import useAuthMe from "../hooks/useAuthMe";
import { FontAwesome } from "@expo/vector-icons";
import Message from "../components/Message";
import { generateChatId } from "../utils/chat";

export default function RoomChatScreen() {
  const { loginUser } = useAuthMe();
  const [messages, setMessages] = useState([]);
  const { params = {} } = useRoute();
  const [chatId, setChatId] = useState(params?.id || "");
  const { userId, username } = params;
  // const chatId = params?.id || "";
  const [users, setUsers] = useState([]);
  const [receiverUser, setReceiverUser] = useState({});
  const navigation = useNavigation();
  const [inputMsg, setInputMsg] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      if (chatId) {
        const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
          if (doc.exists()) {
            setMessages(doc.data().messages);
            setUsers(doc.data().users);
          } else {
            setMessages([]);
          }
        });

        return () => {
          unSub();
        };
      }
    }, [chatId])
  );

  useEffect(() => {
    const receiver = users.find((user) => user?.id != loginUser?.id) || {
      id: userId,
      name: username,
    };
    setReceiverUser(receiver);
    navigation.setOptions({
      title: receiver?.name || "",
    });
  }, [users, loginUser, userId, username]);

  const _onSendMessage = async () => {
    const payload = {
      messages: [
        {
          text: inputMsg,
          sender: loginUser?.id,
          timestamp: Timestamp.now(),
        },
      ],
      users: [loginUser, receiverUser],
      lastText: inputMsg,
      lastTimestamp: Timestamp.now(),
    };
    try {
      const currChatId = chatId
        ? chatId
        : generateChatId(loginUser, receiverUser);
      const docRef = doc(db, "chats", currChatId);
      const findDoc = await getDoc(docRef);
      if (!findDoc.exists()) {
        await setDoc(docRef, payload);
        setChatId(currChatId);
      } else {
        await updateDoc(docRef, {
          messages: arrayUnion(payload.messages[0]),
          lastText: payload.lastText,
          lastTimestamp: payload.lastTimestamp,
        });
      }
      setInputMsg("");

      createSummaryChat({
        id: currChatId,
        text: payload.lastText,
        timestamp: payload.lastTimestamp,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createSummaryChat = async ({ id, text, timestamp }) => {
    try {
      const payload = {
        chatId: id,
        text,
        timestamp,
        senderId: loginUser?.id,
        senderName: loginUser?.name,
        receiverId: receiverUser?.id,
        receiverName: receiverUser?.name,
      };

      const docRef = doc(db, "summary_chats", id);
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

  return (
    <BaseLayout>
      <View style={{ flex: 11, paddingBottom: 10 }}>
        <FlatList
          inverted
          data={[...messages].reverse()}
          keyExtractor={(_, index) => chatId + index}
          renderItem={({ item }) => (
            <Message item={item} loginUser={loginUser} />
          )}
        />
      </View>
      <View style={[styles.inputMsgContainer, { flex: 1 }]}>
        <TextInput
          value={inputMsg}
          onChangeText={setInputMsg}
          style={[styles.inputMsgBox]}
          multiline
          onSubmitEditing={_onSendMessage}
        />
        <TouchableOpacity onPress={_onSendMessage}>
          <FontAwesome name={"send-o"} size={25} color={"gray"} />
        </TouchableOpacity>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  inputMsgContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10,
    marginRight: 20,
  },
  inputMsgBox: {
    minHeight: "70%",
    marginRight: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "gray",
    flex: 1,
    fontSize: 16,
  },
});
