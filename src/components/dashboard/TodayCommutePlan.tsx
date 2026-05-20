import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, getDepartureTime, getCommuteMinutes } from "../../lib/timeUtils";
import { ClassSchedule, UserProfile } from "../../lib/types";

const ROUTE_SUGGESTIONS: Record<string, string> = {
  Scarborough: "TTC 38 → Line 2 Bloor-Danforth → Line 1 Yonge → walk 5 min",
  Mississauga: "MiWay 109 → GO Lakeshore West → Union → Line 1 Yonge → walk 5 min",
  Brampton: "ZUM 501 → GO Kitchener Line → Union → Line 1 Yonge → walk 6 min",
  "North York": "TTC Line 1 Yonge → Dundas Stn → walk 8 min",
  Etobicoke: "TTC 52 → Line 2 Bloor-Danforth → Line 1 Yonge → walk 5 min",
  "Richmond Hill": "YRT Viva Blue → Finch Stn → Line 1 Yonge → walk 5 min",
  Markham: "YRT 001 → Don Mills Stn → Line 4 → Line 1 Yonge → walk 5 min",
  Pickering: "GO Lakeshore East → Union → Line 1 Yonge → walk 5 min",
  Ajax: "GO Lakeshore East → Union → Line 1 Yonge → walk 5 min",
  Oshawa: "GO Lakeshore East → Union → Line 1 Yonge → walk 5 min",
  Hamilton: "GO Lakeshore West → Union → Line 1 Yonge → walk 5 min",
  Burlington: "GO Lakeshore West → Union → Line 1 Yonge → walk 5 min",
};

function getRouteForLocation(location?: string): string {
  if (!location) return "Check your transit app for the best route today";
  const match = Object.keys(ROUTE_SUGGESTIONS).find((k) =>
    location.toLowerCase().includes(k.toLowerCase())
  );
  return match ? ROUTE_SUGGESTIONS[match] : "TTC → Line 1 Yonge → walk to campus";
}

interface TodayCommutePlanProps {
  todayClasses: ClassSchedule[];
  userProfile?: UserProfile | null;
}

export default function TodayCommutePlan({ todayClasses, userProfile }: TodayCommutePlanProps) {
  if (!todayClasses || todayClasses.length === 0) {
    return (
      <View style={{ marginHorizontal: 20, marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "white", marginBottom: 12 }}>Today's TMU Commute</Text>
        <View style={{ padding: 24, borderRadius: 16, backgroundColor: "#0d1f35", alignItems: "center" }}>
          <Text style={{ fontWeight: "600", color: "#004C9B" }}>No classes today! 🎉</Text>
          <Text style={{ fontSize: 14, marginTop: 4, color: "rgba(0,76,155,0.6)", textAlign: "center" }}>Enjoy your day off — rest up or study from home.</Text>
        </View>
      </View>
    );
  }

  const route = getRouteForLocation(userProfile?.home_location);
  const commuteMin = getCommuteMinutes(userProfile?.average_commute_duration);

  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>Today's Commute</Text>
        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: "#E8F0FA" }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#004C9B" }}>
            {todayClasses.length} {todayClasses.length === 1 ? "class" : "classes"}
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {todayClasses.map((cls, i) => {
          const departure = getDepartureTime(cls.start_time, userProfile?.average_commute_duration, userProfile?.arrival_buffer);
          return (
            <View key={cls.id || i} style={{ width: 288, borderRadius: 16, overflow: "hidden", backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#004C9B" }}>
                <View>
                  <Text style={{ fontWeight: "900", color: "white", fontSize: 14 }}>{cls.course_code}</Text>
                  <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }} numberOfLines={1}>{cls.course_name}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 14, fontWeight: "900", color: "#FFDC00" }}>{formatTime(cls.start_time)}</Text>
                  <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{formatTime(cls.end_time)}</Text>
                </View>
              </View>
              <View style={{ padding: 16, gap: 12 }}>
                {cls.building && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="location" size={14} color="#004C9B" />
                    <Text style={{ fontSize: 12, fontWeight: "500", color: "white" }} numberOfLines={1}>{cls.building}</Text>
                  </View>
                )}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12, backgroundColor: "rgba(255,114,0,0.15)" }}>
                    <Ionicons name="time" size={12} color="#FF7200" />
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#FF7200" }}>Leave {formatTime(departure)}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12, backgroundColor: "rgba(0,76,155,0.3)" }}>
                    <Ionicons name="navigate" size={12} color="#004C9B" />
                    <Text style={{ fontSize: 11, fontWeight: "500", color: "#004C9B" }}>{commuteMin}m</Text>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <Text style={{ fontSize: 11, lineHeight: 16, color: "rgba(255,255,255,0.5)" }}>{route}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
