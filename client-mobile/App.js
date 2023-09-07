import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoomChatScreen from "./screens/RoomChatScreen";
import CreateMessageScreen from "./screens/CreateMessageScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        setLoginUser(JSON.parse(data));
      }
    }

    checkLogin();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={loginUser ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="RoomChat"
          component={RoomChatScreen}
          options={{ headerShown: true, title: "" }}
        />
        <Stack.Screen
          name={"CreateMessage"}
          component={CreateMessageScreen}
          options={{ headerShown: true, title: "New Message" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
