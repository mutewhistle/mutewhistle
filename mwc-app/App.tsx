// import Constants from "expo-constants";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Animated,
//   Button,
//   Image,
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   useColorScheme,
// } from "react-native";

// import {
//   ThemeProvider,
//   DarkTheme,
//   DefaultTheme,
//   useTheme,
// } from "@react-navigation/native";

// import MainScreen from "./modules/mwc-module/src/screens/MainScreen";
// import AnimatedAppLoader from "./modules/mwc-module/src/screens/animation/AnimatedAppLoader";

// export default function App() {
//   const colorScheme = useColorScheme();

//   return (
//     <AnimatedAppLoader image={{ uri: Constants.expoConfig?.splash?.image }}>
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <View style={{ flex: 1 }}>
//           <MainScreen />
//         </View>
//       </ThemeProvider>
//     </AnimatedAppLoader>
//   );
// }
