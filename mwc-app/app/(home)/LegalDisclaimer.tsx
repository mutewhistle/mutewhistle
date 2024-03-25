import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import LegalDisclaimerComponent from "../../modules/mwc-module/src/screens/LegalDisclaimerComponent";

const LegalDisclaimer: React.FC<any> = ({}) => {


  return (
    <View style={styles.container}>
        <LegalDisclaimerComponent/>
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

export default LegalDisclaimer