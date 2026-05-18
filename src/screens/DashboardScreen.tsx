import React, { useState, useEffect } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getTodayDay } from "../lib/timeUtils";
import { ClassSchedule, UserProfile, WellnessLog } from "../lib/types";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import LeaveAlertBanner from "../components/dashboard/LeaveAlertBanner";
import TodayCommutePlan from "../components/dashboard/TodayCommutePlan";
import GapOptimizer from "../components/dashboard/GapOptimizer";
import WellnessTracker from "../components/dashboard/WellnessTracker";
import TransitAlerts from "../components/dashboard/TransitAlerts";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [wellnessLogs, setWellnessLogs] = useState<WellnessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@commuteu_user");
      const storedClasses = await AsyncStorage.getItem("@commuteu_classes");
      const storedLogs = await AsyncStorage.getItem("@commuteu_wellness_logs");

      const userData = storedUser ? JSON.parse(storedUser) : null;

      if (!userData || !userData.onboarding_complete) {
        navigation.replace("Onboarding");
        return;
      }

      setUser(userData);
      setClasses(storedClasses ? JSON.parse(storedClasses) : []);
      setWellnessLogs(storedLogs ? JSON.parse(storedLogs) : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0f1a" }}>
        <ActivityIndicator color="#004C9B" size="large" />
      </View>
    );
  }

  const today = getTodayDay();
  const todayClasses = classes
    .filter((c) => (c.days || []).includes(today))
    .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));

  const now = new Date();
  const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const nextClass = todayClasses.find((c) => c.start_time > currentTimeStr) || null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0f1a" }} showsVerticalScrollIndicator={false}>
      <DashboardHeader
        userName={user.preferred_name || user.full_name}
        onNotificationPress={() => {}}
      />
      <LeaveAlertBanner
        nextClass={nextClass}
        commuteDuration={user.average_commute_duration}
        arrivalBuffer={user.arrival_buffer}
      />
      <TodayCommutePlan todayClasses={todayClasses} userProfile={user} />
      <GapOptimizer todayClasses={todayClasses} gapPreferences={user.gap_preferences} />
      <WellnessTracker userProfile={user} latestWellnessLog={wellnessLogs[0]} />
      <TransitAlerts transitSystems={user.transit_systems} />
    </ScrollView>
  );
}
