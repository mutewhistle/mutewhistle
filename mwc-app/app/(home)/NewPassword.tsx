import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NewPasswordComponent from "../../modules/mwc-module/src/screens/NewPasswordComponent";



const NewPassword = () => {
  return (
    <View style={styles.container}>
        <NewPasswordComponent/>
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


export default NewPassword