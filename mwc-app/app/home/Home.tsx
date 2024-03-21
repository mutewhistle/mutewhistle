import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const Home: React.FC<Props> = ({}) => {
  return (
    <View style={styles.container}>
      <Button title="Create new wallet"></Button>
      <Button title="Restore from paper key"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
