import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import NewPasswordComponent from "../../modules/mwc-module/src/screens/NewPasswordComponent";





const NewPassword: React.FC<any> = ({}) => {


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