import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "green",
          tabBarStyle: {
            height: 100,
            borderWidth: 1,
            borderRadius: 50,
            borderColor: "white",
            borderTopColor: "white",
            backgroundColor: "white",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 10,
          },
          headerStyle: {
            backgroundColor: "green",
          },
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTintColor: "white",
            title: "Overview",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="send"
          options={{
            headerTintColor: "white",
            title: "Send",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="send" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="receive"
          options={{
            headerTintColor: "white",
            title: "Receive",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="google-wallet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerTintColor: "white",
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="gear" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
