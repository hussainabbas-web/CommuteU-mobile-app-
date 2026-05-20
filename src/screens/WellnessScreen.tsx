import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import TMUHeader from "../components/shared/TMUHeader";
import { getCommuteMinutes } from "../lib/timeUtils";
import { UserProfile, WellnessLog } from "../lib/types";

export default function WellnessScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [checkInStress, setCheckInStress] = useState(3);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const storedUser = await AsyncStorage.getItem("@commuteu_user");
    const storedLogs = await AsyncStorage.getItem("@commuteu_wellness_logs");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedLogs) setLogs(JSON.parse(storedLogs));
  };

  const submitCheckIn = async () => {
    setSaving(true);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const newLog: WellnessLog = {
      id: Date.now().toString(),
      week_start: weekStart.toISOString().split("T")[0],
      stress_rating: checkInStress,
      fatigue_rating: (user?.fatigue_level as any) || "sometimes",
      created_date: new Date().toISOString(),
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    await AsyncStorage.setItem("@commuteu_wellness_logs", JSON.stringify(updated));
    setShowCheckIn(false);
    setSaving(false);
    Alert.alert("✅ Check-in saved!");
  };

  const commuteDays = user?.commute_days_per_week || 3;
  const commuteMin = getCommuteMinutes(user?.average_commute_duration);
  const weeklyHours = ((commuteDays * commuteMin * 2) / 60).toFixed(1);
  const progressPct = Math.min(100, (parseFloat(weeklyHours) / 15) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f1a" }}>
      <TMUHeader title="Wellness" subtitle="Track your commute wellbeing" />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>

        {/* Weekly summary */}
        <View style={{ borderRadius: 16, padding: 20, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
          <Text style={{ fontWeight: "700", fontSize: 14, color: "white", marginBottom: 12 }}>Weekly Commute Load</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 40, fontWeight: "900", color: "#004C9B" }}>{weeklyHours}</Text>
            <Text style={{ fontSize: 14, color: "#9ca3af", marginBottom: 6 }}>hours in transit per week</Text>
          </View>
          <View style={{ height: 12, borderRadius: 6, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.08)" }}>
            <View style={{ height: "100%", borderRadius: 6, backgroundColor: "#004C9B", width: `${progressPct}%` }} />
          </View>
          <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>{commuteDays} days × ~{commuteMin * 2} min round trip</Text>
        </View>

        {/* Check-in button or form */}
        {!showCheckIn ? (
          <TouchableOpacity onPress={() => setShowCheckIn(true)}
            style={{ height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "#004C9B" }}>
            <Ionicons name="heart-outline" size={18} color="white" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>Weekly Stress Check-in</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ borderRadius: 16, padding: 20, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
            <Text style={{ fontWeight: "700", fontSize: 14, color: "white", marginBottom: 12 }}>How's your commute stress this week?</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map(level => (
                <TouchableOpacity key={level} onPress={() => setCheckInStress(level)}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", backgroundColor: checkInStress === level ? "#FFDC00" : "rgba(255,255,255,0.06)" }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: checkInStress === level ? "#004C9B" : "#9ca3af" }}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
              <Text style={{ fontSize: 11, color: "#6b7280" }}>Very Low</Text>
              <Text style={{ fontSize: 11, color: "#6b7280" }}>Very High</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => setShowCheckIn(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#374151" }}>
                <Text style={{ fontSize: 14, color: "#d1d5db" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitCheckIn} disabled={saving}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", backgroundColor: "#004C9B" }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>{saving ? "Saving..." : "Submit"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* History */}
        <View style={{ borderRadius: 16, padding: 20, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
          <Text style={{ fontWeight: "700", fontSize: 14, color: "white", marginBottom: 12 }}>Check-in History</Text>
          {logs.length === 0 ? (
            <Text style={{ fontSize: 14, color: "#6b7280" }}>No check-ins yet.</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {logs.map((log, i) => {
                const stressColor = log.stress_rating <= 2 ? "#FFDC00" : log.stress_rating <= 3 ? "#FF7200" : "#e74c3c";
                const textColor = log.stress_rating <= 2 ? "#004C9B" : "white";
                return (
                  <View key={log.id || i} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                      <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                      <View>
                        <Text style={{ fontSize: 14, fontWeight: "500", color: "white" }}>{format(new Date(log.created_date), "MMM d, yyyy")}</Text>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>Week of {log.week_start}</Text>
                      </View>
                    </View>
                    <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: stressColor }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: textColor }}>{log.stress_rating}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
