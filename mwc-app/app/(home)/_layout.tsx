import { Slot, Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <>
       <Stack
       screenOptions={{
        headerStyle: {
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LegalDisclaimer"
        options={{
          title: 'Home',
          headerBackTitle: 'Back',
          headerBackVisible: true,
          headerShown: true
        }}
      />
      <Stack.Screen
        name="NewPassword"
        options={{
          title: 'Password',
          headerBackTitle: '',
        }}
      />
       <Stack.Screen
        name="ViewPaperKey"
        // initialParams={{ fromSettings: false }}
        options={{
          title: 'Paper Key',
          headerBackTitle: '',
        }}
      />
     <Stack.Screen
        name="VerifyPaperKey"
        options={{
          //title: route.params?.title,
        }}
        />
        <Stack.Screen
        name="Password"
        options={{
          //title: route.params?.title,
        }}
      />
    </Stack>
 
    </>
  );
}