import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Show from "../../modules/mwc-module/src/screens/PaperKey/Show";

const LegalDisclaimer: React.FC<any> = ({}) => {


  return (
    <View style={styles.container}>
        <Show/>
    </View>
  );
};

export default LegalDisclaimer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

