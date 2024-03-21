import { useState, useEffect } from "react";
import AnimatedSplashScreen from "./AnimatedFlashScreen";
import { Image } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function AnimatedAppLoader({ children, image }) {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //https://medium.com/swlh/how-to-obtain-a-uri-for-an-image-asset-in-react-native-with-expo-88dfbe1023b8
        Image.resolveAssetSource(image).uri;

        // await Asset.fromURI(images).downloradAsync();
      } catch (error) {
        console.warn(error);
      } finally {
        // Tell the application to render
        setSplashReady(true);
      }
    }
    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return (
    <AnimatedSplashScreen image={image} splashScreen={SplashScreen}>
      {children}
    </AnimatedSplashScreen>
  );
}
