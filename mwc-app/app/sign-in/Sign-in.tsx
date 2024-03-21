import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../modules/mwc-module/src/store/hooks";
import SignInSlice, { login } from "./SignInSlice";
import { useSession } from "../../modules/mwc-module/src/auth/ctx";

const SignIn: React.FC<Props> = ({}) => {
  // const { signIn } = useSession();
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          //SignIn();
          const password = useAppSelector(
            (state) => state.SignInSlice.password
          );
          dispatch(login(password));
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace("/");
        }}
      >
        Sign In
      </Text>
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
