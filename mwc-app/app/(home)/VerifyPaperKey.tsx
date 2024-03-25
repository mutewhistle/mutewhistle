import React from "react";
import { StyleSheet, View } from "react-native";
import Verify from "../../modules/mwc-module/src/screens/PaperKey/Verify";

const VerifyPaperKey: React.FC<any> = ({}) => {


  return (
    <View style={styles.container}>
        <Verify/>
    </View>
  );
};

export default VerifyPaperKey

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

