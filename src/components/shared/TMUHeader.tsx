import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TMUHeaderProps {
  title: string;
  subtitle?: string;
}

export default function TMUHeader({ title, subtitle }: TMUHeaderProps) {
  return (
    <View style={{ backgroundColor: "#004C9B" }}>
      <View
        className="absolute rounded-full opacity-10"
        style={{ width: 128, height: 128, top: -32, right: -32, backgroundColor: "#FFDC00" }}
      />
      <View
        className="absolute rounded-full opacity-10"
        style={{ width: 80, height: 80, bottom: -16, left: -16, backgroundColor: "#FFDC00" }}
      />
      <SafeAreaView>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
              <Ionicons name="train" size={16} color="#004C9B" />
            </View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 2, textTransform: "uppercase" }}>
              CommuteU
            </Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>{title}</Text>
          {subtitle && (
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>{subtitle}</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}