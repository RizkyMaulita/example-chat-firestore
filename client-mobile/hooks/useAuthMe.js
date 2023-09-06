import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function useAuthMe() {
  const [loginUser, setLoginUser] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    try {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        setLoginUser(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function _onLogout() {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  }

  return {
    loginUser,
    handleLogout: _onLogout,
  };
}
