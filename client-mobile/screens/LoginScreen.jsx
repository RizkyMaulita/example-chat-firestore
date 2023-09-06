import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import BaseLayout from "../layouts/BaseLayout";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const navigation = useNavigation();

  const login = async () => {
    try {
      if (!name) throw new Error("Name is required");
      const users = await fetchUsers();
      const findUser = users.find(
        (user) => user.name.toLowerCase() === name.toLowerCase()
      );
      if (findUser) {
        await AsyncStorage.setItem("user", JSON.stringify(findUser));
        setName("");
        navigation.navigate("Home");
      } else {
        const { data } = await axios.post(`${API_URL}/users`, { name });
        await AsyncStorage.setItem("user", JSON.stringify(data));
        setName("");
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/users`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <BaseLayout>
      <Text style={styles.header}>Login</Text>
      <View style={styles.flexCenter}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, { marginBottom: 20 }]}
          value={name}
          onChangeText={setName}
        />
        <Button title="Sign In" onPress={login} />
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 20,
  },
  label: {
    marginVertical: 10,
    fontSize: 15,
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    width: "90%",
    borderRadius: 8,
  },
  flexCenter: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
});
