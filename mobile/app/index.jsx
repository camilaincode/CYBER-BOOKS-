import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>menu.</Text>
      <Link href="/(auth)/singup">Sing up</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}
