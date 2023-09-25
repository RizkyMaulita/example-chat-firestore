import { Image, Text, View } from "react-native";
import { convertTimestamp } from "../utils/timestamp";

export default function Message({ item = {}, loginUser = {} }) {
  const isSender = item?.sender == loginUser?.id;
  return (
    <View
      style={{
        flex: 1,
        alignItems: isSender ? "flex-end" : "flex-start",
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          marginVertical: 5,
          borderWidth: 1,
          borderRadius: 10,
          borderBottomLeftRadius: isSender ? 10 : 0,
          borderBottomRightRadius: isSender ? 0 : 10,
          borderColor: "gray",
          padding: 9,
          maxWidth: "80%",
        }}
      >
        {item?.type === "image" && item?.fileURL?.length > 0 && (
          <Image
            source={{ uri: item?.fileURL }}
            style={{
              width: 200,
              height: 200,
              marginBottom: 10,
              resizeMode: "contain",
            }}
          />
        )}
        <Text
          style={{
            textAlign: isSender ? "right" : "left",
            fontSize: 16,
          }}
        >
          {item?.text || ""}
        </Text>
        <Text
          style={{
            fontSize: 9,
            marginTop: 8,
            fontStyle: "italic",
            textAlign: "right",
          }}
        >
          {convertTimestamp(item?.timestamp)}
        </Text>
      </View>
    </View>
  );
}
