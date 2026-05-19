import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import TMUHeader from "../components/shared/TMUHeader";

const TMU_BUILDINGS = [
  { name: "Student Learning Centre (SLC)", address: "341 Yonge St, Toronto", note: "Study spaces, Tim Hortons, student services" },
  { name: "Eric Palin Hall (EPH)", address: "87 Gerrard St E", note: "Engineering & computing labs" },
  { name: "Kerr Hall", address: "350 Victoria St", note: "Main campus hub, admin offices" },
  { name: "Rogers Communications Centre (RCC)", address: "80 Gould St", note: "Journalism & media programs" },
  { name: "Podium Building (POD)", address: "350 Victoria St", note: "Classrooms, lecture halls" },
  { name: "Mattamy Athletic Centre (MAC)", address: "60 Carlton St", note: "Gym, ice rink, recreation" },
  { name: "TMU Library", address: "350 Victoria St", note: "Research & quiet study" },
  { name: "Daphne Cockwell Complex (DCC)", address: "288 Church St", note: "Health sciences" },
];

const MAP_VIEWS = [
  { label: "Main Campus", url: "https://maps.google.com/maps?q=Toronto+Metropolitan+University&output=embed&z=17" },
  { label: "Transit Hubs", url: "https://maps.google.com/maps?q=Dundas+Station+Toronto&output=embed&z=16" },
  { label: "Nearby Food", url: "https://maps.google.com/maps?q=restaurants+near+350+Victoria+St+Toronto&output=embed&z=16" },
];

export default function CampusMapScreen() {
  const [activeView, setActiveView] = useState(0);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f1a" }}>
      <TMUHeader title="Campus Map" subtitle="Toronto Metropolitan University" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Map tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}>
          {MAP_VIEWS.map((view, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveView(i)}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: activeView === i ? "#004C9B" : "#151f2e", borderWidth: 1, borderColor: activeView === i ? "#004C9B" : "rgba(255,220,0,0.2)" }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFDC00" }}>{view.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map */}
        <View style={{ marginHorizontal: 20, borderRadius: 16, overflow: "hidden", borderWidth: 2, borderColor: "#004C9B", height: 360 }}>
          <WebView source={{ uri: MAP_VIEWS[activeView].url }} style={{ flex: 1 }} scrollEnabled={false} javaScriptEnabled={true} domStorageEnabled={true} userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36" />
        </View>

        {/* Open in Google Maps */}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.google.com/maps/place/Toronto+Metropolitan+University/@43.6577,-79.3788,17z")}
          style={{ marginHorizontal: 20, marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: "#004C9B", backgroundColor: "#0d1f35" }}>
          <Ionicons name="open-outline" size={16} color="#FFDC00" />
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFDC00" }}>Open Full Map in Google Maps</Text>
        </TouchableOpacity>

        {/* Buildings */}
        <View style={{ paddingHorizontal: 20, marginTop: 20, paddingBottom: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name="business-outline" size={20} color="#004C9B" />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>TMU Buildings</Text>
          </View>
          <View style={{ gap: 8 }}>
            {TMU_BUILDINGS.map((building, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedBuilding(selectedBuilding === i ? null : i)}
                style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: selectedBuilding === i ? "#004C9B" : "rgba(255,255,255,0.06)" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: selectedBuilding === i ? "#004C9B" : "#E8F0FA" }}>
                    <Ionicons name="location" size={16} color={selectedBuilding === i ? "#FFDC00" : "#004C9B"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }} numberOfLines={1}>{building.name}</Text>
                    <Text style={{ fontSize: 12, color: "#9ca3af" }} numberOfLines={1}>{building.address}</Text>
                  </View>
                  <Ionicons name={selectedBuilding === i ? "chevron-up" : "chevron-down"} size={16} color="#6b7280" />
                </View>
                {selectedBuilding === i && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>{building.note}</Text>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(building.name + " Toronto Metropolitan University")}`)}
                      style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#FFDC00" }}>
                      <Ionicons name="navigate" size={12} color="#004C9B" />
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#004C9B" }}>Get Directions</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
