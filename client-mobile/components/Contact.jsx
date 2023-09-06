import { View, TouchableOpacity, Image, Text } from "react-native";

export default function Contact({ item, onPress }) {
  const _onPress = () => onPress(item);
  return (
    <TouchableOpacity onPress={_onPress}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: 60,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "gray",
          marginVertical: 5,
          marginHorizontal: 10,
        }}
      >
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
              width: 40,
              height: 40,
            }}
          />
        </View>
        <View
          style={{
            flex: 4,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {item?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
