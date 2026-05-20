import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../../lib/timeUtils";
import { ClassSchedule } from "../../lib/types";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const GAP_ICONS: Record<string, IoniconName> = {
  "Study in a quiet space (SLC, library)": "book-outline",
  "Grab food or coffee on or near campus": "cafe-outline",
  "Hit the gym or go for a walk": "barbell-outline",
  "Explore TMU campus events or clubs": "calendar-outline",
  "Rest or decompress": "moon-outline",
  "Work on assignments or projects": "create-outline",
};

const GAP_SUGGESTIONS: Record<string, string[]> = {
  "Study in a quiet space (SLC, library)": ["SLC 4th floor quiet zone", "TMU Library 8th floor — individual study carrels"],
  "Grab food or coffee on or near campus": ["The Hub Café at Student Campus Centre", "Tim Hortons on Gould Street"],
  "Hit the gym or go for a walk": ["Mattamy Athletic Centre — drop-in sessions", "Walk to Allan Gardens (10 min round trip)"],
  "Explore TMU campus events or clubs": ["Check TMU Student Life events board", "Drop by the Student Campus Centre clubs fair"],
  "Rest or decompress": ["Quiet room at SLC Level 2", "Meditation space at Tri-Mentoring area"],
  "Work on assignments or projects": ["Computer lab at EPH Building", "SLC collaborative workspace"],
};

interface GapOptimizerProps {
  todayClasses: ClassSchedule[];
  gapPreferences?: string[];
}

export default function GapOptimizer({ todayClasses, gapPreferences }: GapOptimizerProps) {
  if (!todayClasses || todayClasses.length < 2) return null;

  const sorted = [...todayClasses].sort((a, b) => a.start_time.localeCompare(b.start_time));
  const gaps: { minutes: number; after: ClassSchedule; before: ClassSchedule }[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const [eh, em] = sorted[i].end_time.split(":").map(Number);
    const [sh, sm] = sorted[i + 1].start_time.split(":").map(Number);
    const gapMinutes = sh * 60 + sm - (eh * 60 + em);
    if (gapMinutes >= 30) {
      gaps.push({ minutes: gapMinutes, after: sorted[i], before: sorted[i + 1] });
    }
  }

  if (gaps.length === 0) return null;

  const prefs = gapPreferences || [];

  return (
    <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,220,0,0.12)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="bulb-outline" size={16} color="#FFDC00" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>Gap Optimizer</Text>
      </View>
      <View style={{ gap: 12 }}>
        {gaps.map((gap, i) => (
          <View key={i} style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,220,0,0.07)" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: "900", color: "#FFDC00" }}>{gap.minutes} min</Text>
                <Text style={{ fontSize: 12, color: "#9ca3af" }}>free between {gap.after.course_code} & {gap.before.course_code}</Text>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, backgroundColor: "#FFDC00" }}>
                <Text style={{ fontSize: 10, fontWeight: "500", color: "#004C9B" }}>
                  {formatTime(gap.after.end_time)} – {formatTime(gap.before.start_time)}
                </Text>
              </View>
            </View>
            <View style={{ padding: 12, gap: 8 }}>
              {prefs.slice(0, 3).map((pref) => {
                const iconName = GAP_ICONS[pref] || "bulb-outline";
                const suggestions = GAP_SUGGESTIONS[pref] || [];
                return (
                  <View key={pref} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name={iconName} size={16} color="#004C9B" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#004C9B" }} numberOfLines={1}>{pref}</Text>
                      {suggestions[0] && <Text style={{ fontSize: 11, color: "rgba(0,76,155,0.6)", marginTop: 2 }} numberOfLines={1}>{suggestions[0]}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
