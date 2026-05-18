import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getGreeting } from "../../lib/timeUtils";
import { format } from "date-fns";

interface DashboardHeaderProps {
  userName?: string;
  onNotificationPress?: () => void;
}

export default function DashboardHeader({ userName, onNotificationPress }: DashboardHeaderProps) {
  const greeting = getGreeting();
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <View style={{ backgroundColor: "#004C9B" }}>
      <View style={{ position: "absolute", width: 208, height: 208, top: -64, right: -64, borderRadius: 104, backgroundColor: "#FFDC00", opacity: 0.1 }} />
      <View style={{ position: "absolute", width: 112, height: 112, top: 32, right: -32, borderRadius: 56, backgroundColor: "#FFDC00", opacity: 0.05 }} />
      <SafeAreaView>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="train" size={18} color="#004C9B" />
              </View>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" }}>
                CommuteU
              </Text>
            </View>
            <TouchableOpacity onPress={onNotificationPress}
              style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="notifications-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            {today}
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "900", color: "white", lineHeight: 36 }}>
            {greeting},{"\n"}{userName?.split(" ")[0] || "Student"} 👋
          </Text>
          <View style={{ marginTop: 16, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.12)" }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#4ade80" }} />
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "500" }}>TMU campus active</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
