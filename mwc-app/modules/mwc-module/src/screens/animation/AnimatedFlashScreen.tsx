import Constants from "expo-constants";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
export default function AnimatedSplashScreen({
  children,
  image,
  splashScreen,
}) {
  // Instruct SplashScreen not to hide yet, we want to do this manually
  splashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
  });

  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Medium": require("../../../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Bold": require("../../../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("../../../../../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-Regular": require("../../../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await splashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await splashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.expoConfig?.splash?.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}
