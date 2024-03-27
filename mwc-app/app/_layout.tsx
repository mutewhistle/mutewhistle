import React, { useCallback, useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StyleSheet, View, useColorScheme } from "react-native";

import { Slot, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import * as Font from "expo-font";

import AnimatedAppLoader from "../modules/mwc-module/src/screens/animation/AnimatedAppLoader";
import Constants from "expo-constants";
import { SessionProvider } from "../modules/mwc-module/src/auth/ctx";
import { Provider } from "react-redux";
import { persistor, store } from "../modules/mwc-module/src/store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Medium": require("./../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Bold": require("./../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("./../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("./../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-Regular": require("./../assets/fonts/Poppins/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || appIsReady || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <AnimatedAppLoader image={{ uri: Constants.expoConfig?.splash?.image }}>
        <React.StrictMode>
          <Provider store={store}>
            <SessionProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <PersistGate loading={null} persistor={persistor}>
                  <View style={styles.container} onLayout={onLayoutRootView}>
                    <Slot />
                  </View>
                </PersistGate>
              </ThemeProvider>
            </SessionProvider>
          </Provider>
        </React.StrictMode>
      </AnimatedAppLoader>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
