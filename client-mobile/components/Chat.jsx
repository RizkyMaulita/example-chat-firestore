import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Chat({ item = {}, index, onPress, loginUser = {} }) {
  const _onPress = () => onPress(item);

  return (
    <View
      style={{
        borderTopWidth: index === 0 ? 1 : 0,
        borderTopColor: "grey",
        marginHorizontal: 10,
        height: 70,
        borderRadius: 10,
      }}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={_onPress}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
              }}
              style={{
                width: "50%",
                height: "50%",
              }}
            />
          </View>
          <View
            style={{
              flex: 5,
              borderBottomWidth: 1,
              padding: 3,
              borderBottomColor: "grey",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 5,
              }}
            >
              {loginUser?.id == item?.receiverId
                ? item?.senderName
                : item?.receiverName}
            </Text>
            <Text numberOfLines={2}>{item?.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
