import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
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
import * as ImagePicker from "expo-image-picker";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config/cloudinary";
import { useHeaderHeight } from "@react-navigation/elements";

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
  const [inputImg, setInputImg] = useState(null);
  const height = useHeaderHeight();

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
    await uploadChat({});
  };

  const uploadChat = async ({ fileURL = "", type = "", isFile = false }) => {
    const payload = {
      messages: [
        {
          text: inputMsg,
          sender: loginUser?.id,
          timestamp: Timestamp.now(),
          fileURL,
          type,
        },
      ],
      users: [loginUser, receiverUser],
      lastText: inputMsg
        ? inputMsg
        : `${loginUser?.name || "User"} has send a ${type}`,
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
      setInputImg(null);

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

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        // aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const { base64, uri } = result.assets[0];
        const mimeType = uri.split(".").at(-1);
        await uploadImage(base64, mimeType);
      }
    } catch (error) {
      console.log(error, "<<< error");
    }
  };

  const uploadImage = (base64Uri, mimeType) => {
    fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: `data:image/${mimeType};base64,${base64Uri}`,
          api_key: CLOUDINARY_API_KEY,
          upload_preset: CLOUDINARY_UPLOAD_PRESET,
        }),
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.secure_url) {
          const url = data?.secure_url;
          setInputImg(data?.secure_url);
          return uploadChat({
            fileURL: url,
            type: "image",
            isFile: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <BaseLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1 }]}
        keyboardVerticalOffset={height + 10}
      >
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
          <TouchableOpacity style={{ marginRight: 15 }} onPress={pickImage}>
            <FontAwesome name={"image"} size={25} color={"gray"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={_onSendMessage}>
            <FontAwesome name={"send-o"} size={25} color={"gray"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
