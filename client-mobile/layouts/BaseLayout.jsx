import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function BaseLayout({ children }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
