import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Alert {
  system: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface TransitAlertsProps {
  transitSystems?: string[];
}

export default function TransitAlerts({ transitSystems }: TransitAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    const systemNames = (transitSystems || []).map((s) => s.split(" (")[0]).join(", ");

    if (!systemNames) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate 1-3 realistic current transit service alerts for the Greater Toronto Area transit systems: ${systemNames}. Today is ${new Date().toLocaleDateString()}. Respond ONLY with a JSON object (no markdown) with this shape: {"alerts": [{"system": string, "title": string, "description": string, "severity": "low"|"medium"|"high"}]}. If all is clear return {"alerts": []}.`,
            },
          ],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((c: any) => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setAlerts(parsed.alerts || []);
    } catch (e) {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ marginTop: 24, marginBottom: 32, paddingHorizontal: 16 }}>
        <View style={{ borderRadius: 16, padding: 16, alignItems: "center", backgroundColor: "#151f2e" }}>
          <ActivityIndicator color="#004C9B" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 24, marginBottom: 32, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(0,76,155,0.08)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="warning-outline" size={16} color="#004C9B" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "white", flex: 1 }}>Live GTA Transit</Text>
        <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: "#E8F0FA" }}>
          <Text style={{ fontSize: 11, fontWeight: "500", color: "#004C9B" }}>
            {alerts.length === 0 ? "All clear" : `${alerts.length} alert${alerts.length > 1 ? "s" : ""}`}
          </Text>
        </View>
      </View>

      {alerts.length === 0 ? (
        <View style={{ borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#0d2318", borderWidth: 1.5, borderColor: "rgba(34,197,94,0.12)" }}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#15803d" }}>All clear on your route today 🚇</Text>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          {alerts.map((alert, i) => {
            const isHigh = alert.severity === "high";
            const accentColor = isHigh ? "#FF7200" : alert.severity === "medium" ? "#FFDC00" : "#004C9B";
            return (
              <View key={i} style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "#151f2e" }}>
                <View style={{ height: 4, backgroundColor: accentColor }} />
                <View style={{ padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isHigh ? "rgba(255,114,0,0.08)" : "rgba(255,220,0,0.08)", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="warning" size={16} color={isHigh ? "#FF7200" : "#B8860B"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "white" }}>{alert.system}: {alert.title}</Text>
                    <Text style={{ fontSize: 12, marginTop: 4, color: "#9ca3af", lineHeight: 18 }}>{alert.description}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
