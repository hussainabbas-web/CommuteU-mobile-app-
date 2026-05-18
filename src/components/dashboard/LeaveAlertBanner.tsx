import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMinutesUntil, getDepartureTime, formatTime } from "../../lib/timeUtils";
import { ClassSchedule } from "../../lib/types";

interface LeaveAlertBannerProps {
  nextClass: ClassSchedule | null;
  commuteDuration?: string;
  arrivalBuffer?: string;
}

export default function LeaveAlertBanner({ nextClass, commuteDuration, arrivalBuffer }: LeaveAlertBannerProps) {
  if (!nextClass) return null;

  const departureTime = getDepartureTime(nextClass.start_time, commuteDuration, arrivalBuffer);
  const minutesUntilDepart = getMinutesUntil(departureTime);
  const minutesUntilClass = getMinutesUntil(nextClass.start_time);

  if (minutesUntilClass <= 0) {
    return (
      <View style={{ margin: 16, padding: 16, borderRadius: 16, backgroundColor: "#0d2318", flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(34,197,94,0.12)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
        </View>
        <View>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#15803d" }}>Class in session — you're on track!</Text>
          <Text style={{ fontSize: 12, color: "rgba(22,163,74,0.6)", marginTop: 2 }}>Enjoy your time at TMU</Text>
        </View>
      </View>
    );
  }

  const isUrgent = minutesUntilDepart <= 15;
  const isNow = minutesUntilDepart <= 0;

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: "hidden" }}>
      <View style={{ height: 4, backgroundColor: isUrgent ? "#FF7200" : "#FFDC00" }} />
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: isUrgent ? "#1f0e00" : "#0d1f35" }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: isUrgent ? "#FF7200" : "#004C9B", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name={isNow ? "flash" : "time"} size={24} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "900", color: isUrgent ? "#FF7200" : "#FFDC00" }}>
            {isNow ? "Leave NOW!" : `Leave in ${minutesUntilDepart} min`}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "500", color: isUrgent ? "rgba(255,114,0,0.6)" : "rgba(255,220,0,0.6)", marginTop: 2 }}>
            {nextClass.course_code} starts at {formatTime(nextClass.start_time)}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: isUrgent ? "#FF7200" : "#FFDC00" }}>{formatTime(departureTime)}</Text>
          <Text style={{ fontSize: 10, fontWeight: "500", color: isUrgent ? "rgba(255,114,0,0.5)" : "rgba(255,220,0,0.5)" }}>depart</Text>
        </View>
      </View>
    </View>
  );
}
