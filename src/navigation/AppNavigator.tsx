import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import CampusMapScreen from "../screens/CampusMapScreen";
import WellnessScreen from "../screens/WellnessScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#FFDC00",
        tabBarInactiveTintColor: "#8B8BA3",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, { active: any; inactive: any }> = {
            Home: { active: "home", inactive: "home-outline" },
            Schedule: { active: "calendar", inactive: "calendar-outline" },
            Map: { active: "map", inactive: "map-outline" },
            Wellness: { active: "bar-chart", inactive: "bar-chart-outline" },
            Profile: { active: "person", inactive: "person-outline" },
          };
          const icon = icons[route.name];
          return <Ionicons name={focused ? icon?.active : icon?.inactive} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Map" component={CampusMapScreen} />
      <Tab.Screen name="Wellness" component={WellnessScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
