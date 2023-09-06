import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BaseLayout from "../layouts/BaseLayout";
import useAuthMe from "../hooks/useAuthMe";
import axios from "axios";
import { API_URL } from "../config/api";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Contact from "../components/Contact";

export default function CreateMessageScreen() {
  const [allUsers, setAllUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const { loginUser } = useAuthMe();

  useFocusEffect(
    React.useCallback(() => {
      if (loginUser) {
        fetchUsers();
      }
    }, [loginUser])
  );

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/users`);
      const users = data.filter((user) => user.id != loginUser?.id);
      setAllUsers(users);
      setFilterUsers(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchUser) {
      const currUsers = allUsers.filter((user) => {
        return user?.name?.toLowerCase()?.includes(searchUser.toLowerCase());
      });
      setFilterUsers(currUsers);
    } else {
      setFilterUsers(allUsers);
    }
  }, [searchUser]);

  const _onPressContact = (user) => {
    console.log(user, "<<< contact user");
  };

  return (
    <BaseLayout>
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          marginBottom: 10,
        }}
      >
        <Text>To :</Text>
        <View
          style={{
            height: 50,
            borderWidth: 1,
            marginVertical: 10,
            borderRadius: 10,
            borderColor: "gray",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <TextInput value={searchUser} onChangeText={setSearchUser} />
        </View>
      </View>
      <View>
        <FlatList
          data={filterUsers}
          key={(item) => item?.id}
          renderItem={({ item }) => (
            <Contact item={item} onPress={_onPressContact} />
          )}
        />
      </View>
    </BaseLayout>
  );
}
