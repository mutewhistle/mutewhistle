import { useEffect, useState } from "react";
import { NativeModules, StyleSheet, Text, View } from "react-native";
import { hello } from "../../../modules/mwc-module";


export default function TabOneScreen() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Hello {hello()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
