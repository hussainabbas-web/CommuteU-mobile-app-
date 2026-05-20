import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCommuteMinutes } from "../../lib/timeUtils";
import { UserProfile, WellnessLog } from "../../lib/types";

function getWellnessColor(score: number): string {
  if (score >= 70) return "#FFDC00";
  if (score >= 40) return "#FF7200";
  return "#e74c3c";
}

function getWellnessLabel(score: number): string {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "Moderate";
  return "High risk";
}

interface WellnessTrackerProps {
  userProfile?: UserProfile | null;
  latestWellnessLog?: WellnessLog;
}

export default function WellnessTracker({ userProfile, latestWellnessLog }: WellnessTrackerProps) {
  const commuteDays = userProfile?.commute_days_per_week || 3;
  const commuteMin = getCommuteMinutes(userProfile?.average_commute_duration);
  const weeklyHours = ((commuteDays * commuteMin * 2) / 60).toFixed(1);

  const stressLevel = latestWellnessLog?.stress_rating || userProfile?.stress_level || 3;
  const fatigueLevel = latestWellnessLog?.fatigue_rating || userProfile?.fatigue_level || "sometimes";

  const stressScore = (5 - stressLevel) * 20;
  const fatigueScore: Record<string, number> = { no: 20, rarely: 15, sometimes: 10, yes_often: 0 };
  const wellnessScore = Math.min(100, stressScore + (fatigueScore[fatigueLevel] ?? 10));
  const color = getWellnessColor(wellnessScore);
  const progressPct = Math.min(100, (parseFloat(weeklyHours) / 15) * 100);

  return (
    <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,114,0,0.12)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="heart-outline" size={16} color="#FF7200" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>Wellness</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <View style={{ flex: 1, borderRadius: 16, padding: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 8, borderWidth: 4, borderColor: color }}>
            <Text style={{ fontSize: 20, fontWeight: "900", color }}>{wellnessScore}</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: "700", color }}>{getWellnessLabel(wellnessScore)}</Text>
          <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Wellness score</Text>
        </View>

        <View style={{ flex: 1, borderRadius: 16, padding: 16, justifyContent: "space-between", backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "900", color: "#004C9B" }}>{weeklyHours}h</Text>
            <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Weekly transit</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <View style={{ height: "100%", borderRadius: 3, backgroundColor: "#004C9B", width: `${progressPct}%` }} />
            </View>
            <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{commuteDays}d × {commuteMin * 2}min</Text>
          </View>
        </View>
      </View>

      <View style={{ borderRadius: 16, padding: 12, flexDirection: "row", gap: 16, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Stress</Text>
          <Text style={{ fontSize: 16, fontWeight: "900", color: "#004C9B", marginTop: 2 }}>
            {stressLevel}<Text style={{ fontSize: 12, fontWeight: "400", color: "#6b7280" }}>/5</Text>
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#374151" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Fatigue</Text>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#FF7200", marginTop: 4, textTransform: "capitalize" }}>
            {String(fatigueLevel).replace("_", " ")}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#374151" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Days</Text>
          <Text style={{ fontSize: 16, fontWeight: "900", color: "#004C9B", marginTop: 2 }}>{commuteDays}</Text>
        </View>
      </View>

      {commuteDays >= 5 && (
        <View style={{ marginTop: 12, flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 16, backgroundColor: "rgba(255,114,0,0.06)", borderWidth: 1, borderColor: "rgba(255,114,0,0.18)" }}>
          <Ionicons name="warning-outline" size={16} color="#FF7200" style={{ marginTop: 2 }} />
          <Text style={{ fontSize: 12, lineHeight: 18, flex: 1, color: "#FF7200" }}>
            5-day commute week — consider an online lecture if available.
          </Text>
        </View>
      )}
    </View>
  );
}
