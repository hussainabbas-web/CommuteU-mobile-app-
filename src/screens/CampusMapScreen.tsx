import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import TMUHeader from "../components/shared/TMUHeader";

const TMU_BUILDINGS = [
  { name: "Student Learning Centre (SLC)", address: "341 Yonge St, Toronto", note: "Study spaces, Tim Hortons, student services", lat: 43.6561, lng: -79.3802 },
  { name: "Eric Palin Hall (EPH)", address: "87 Gerrard St E", note: "Engineering & computing labs", lat: 43.6571, lng: -79.3789 },
  { name: "Kerr Hall", address: "350 Victoria St", note: "Main campus hub, admin offices", lat: 43.6580, lng: -79.3780 },
  { name: "Rogers Communications Centre (RCC)", address: "80 Gould St", note: "Journalism & media programs", lat: 43.6578, lng: -79.3793 },
  { name: "Podium Building (POD)", address: "350 Victoria St", note: "Classrooms, lecture halls", lat: 43.6582, lng: -79.3778 },
  { name: "Mattamy Athletic Centre (MAC)", address: "60 Carlton St", note: "Gym, ice rink, recreation", lat: 43.6617, lng: -79.3807 },
  { name: "TMU Library", address: "350 Victoria St", note: "Research & quiet study", lat: 43.6579, lng: -79.3781 },
  { name: "Daphne Cockwell Complex (DCC)", address: "288 Church St", note: "Health sciences", lat: 43.6566, lng: -79.3769 },
];

const MAP_REGIONS = [
  { label: "Main Campus", lat: 43.6577, lng: -79.3788, delta: 0.008 },
  { label: "Transit Hubs", lat: 43.6544, lng: -79.3807, delta: 0.012 },
  { label: "Nearby Food", lat: 43.6577, lng: -79.3788, delta: 0.006 },
];

export default function CampusMapScreen() {
  const [activeView, setActiveView] = useState(0);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);

  const region = MAP_REGIONS[activeView];

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f1a" }}>
      <TMUHeader title="Campus Map" subtitle="Toronto Metropolitan University" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Map tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}>
          {MAP_REGIONS.map((view, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveView(i)}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: activeView === i ? "#004C9B" : "#151f2e", borderWidth: 1, borderColor: activeView === i ? "#004C9B" : "rgba(255,220,0,0.2)" }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFDC00" }}>{view.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map */}
        <View style={{ marginHorizontal: 20, borderRadius: 16, overflow: "hidden", borderWidth: 2, borderColor: "#004C9B", height: 360 }}>
          {Platform.OS === 'web' ? (
            <WebView
              source={{ uri: `https://maps.google.com/maps?q=${region.lat},${region.lng}&z=16&output=embed` }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
            />
          ) : (
            <MapView
              style={{ flex: 1 }}
              region={{
                latitude: region.lat,
                longitude: region.lng,
                latitudeDelta: region.delta,
                longitudeDelta: region.delta,
              }}
            >
              {TMU_BUILDINGS.map((b, i) => (
                <Marker
                  key={i}
                  coordinate={{ latitude: b.lat, longitude: b.lng }}
                  title={b.name}
                  description={b.address}
                  pinColor="#004C9B"
                />
              ))}
            </MapView>
          )}
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