import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import TMUHeader from "../components/shared/TMUHeader";
import { formatTime } from "../lib/timeUtils";
import { ClassSchedule } from "../lib/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export default function ScheduleScreen() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [classes, setClasses] = useState<ClassSchedule[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("@commuteu_classes").then(data => {
      if (data) setClasses(JSON.parse(data));
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f1a" }}>
      <TMUHeader title="Weekly Schedule" subtitle="Your TMU semester at a glance" />
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          {(["calendar", "list"] as const).map(v => (
            <TouchableOpacity key={v} onPress={() => setView(v)}
              style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: view === v ? "#004C9B" : "transparent", borderWidth: 1, borderColor: view === v ? "#004C9B" : "rgba(255,255,255,0.15)" }}>
              <Ionicons name={v === "calendar" ? "grid-outline" : "list-outline"} size={16} color={view === v ? "white" : "#9ca3af"} />
              <Text style={{ fontSize: 14, fontWeight: "600", textTransform: "capitalize", color: view === v ? "white" : "#9ca3af" }}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {view === "calendar" ? <CalendarView classes={classes} /> : <ListView classes={classes} />}
      </View>
    </View>
  );
}

function CalendarView({ classes }: { classes: ClassSchedule[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ minWidth: 600 }}>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <View style={{ width: 40 }} />
          {DAYS.map(day => (
            <View key={day} style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#004C9B" }}>{day}</Text>
            </View>
          ))}
        </View>
        {HOURS.map(hour => (
          <View key={hour} style={{ flexDirection: "row", height: 48 }}>
            <View style={{ width: 40, justifyContent: "flex-start", paddingTop: 2 }}>
              <Text style={{ fontSize: 10, color: "#6b7280" }}>{hour > 12 ? hour - 12 : hour}{hour >= 12 ? "pm" : "am"}</Text>
            </View>
            {DAYS.map(day => {
              const classAtTime = classes.find(c => {
                if (!(c.days || []).includes(day)) return false;
                const [sh] = (c.start_time || "").split(":").map(Number);
                return sh === hour;
              });
              if (classAtTime) {
                const [sh, sm] = (classAtTime.start_time || "0:0").split(":").map(Number);
                const [eh, em] = (classAtTime.end_time || "0:0").split(":").map(Number);
                const durationHours = (eh * 60 + em - sh * 60 - sm) / 60;
                const height = Math.max(durationHours * 48, 40);
                return (
                  <View key={day} style={{ flex: 1, position: "relative" }}>
                    <View style={{ position: "absolute", left: 0, right: 0, height, backgroundColor: "#E8F0FA", borderLeftWidth: 2, borderLeftColor: "#004C9B", borderRadius: 8, padding: 6, zIndex: 10 }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: "#004C9B" }} numberOfLines={1}>{classAtTime.course_code}</Text>
                      <Text style={{ fontSize: 9, color: "#6b7280" }} numberOfLines={1}>{classAtTime.building}</Text>
                    </View>
                  </View>
                );
              }
              return <View key={day} style={{ flex: 1, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.05)" }} />;
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ListView({ classes }: { classes: ClassSchedule[] }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 12, paddingBottom: 32 }}>
        {DAYS.map(day => {
          const dayClasses = classes.filter(c => (c.days || []).includes(day)).sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
          if (dayClasses.length === 0) return null;
          return (
            <View key={day}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#004C9B", marginBottom: 8 }}>{day}</Text>
              <View style={{ gap: 8 }}>
                {dayClasses.map((cls, i) => (
                  <View key={i} style={{ borderRadius: 12, padding: 12, backgroundColor: "#151f2e", borderWidth: 1, borderColor: "rgba(0,76,155,0.15)" }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "600", fontSize: 14, color: "white" }}>{cls.course_code} — {cls.course_name}</Text>
                        {cls.building && (
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <Ionicons name="location-outline" size={12} color="#9ca3af" />
                            <Text style={{ fontSize: 12, color: "#9ca3af" }}>{cls.building}</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="time-outline" size={12} color="#004C9B" />
                        <Text style={{ fontSize: 12, fontWeight: "500", color: "#004C9B" }}>{formatTime(cls.start_time)} – {formatTime(cls.end_time)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
        {classes.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ color: "#6b7280" }}>No classes added yet.</Text>
            <Text style={{ fontSize: 14, color: "#4b5563", marginTop: 4 }}>Add your schedule in your profile.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

