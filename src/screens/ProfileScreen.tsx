import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import TMUHeader from "../components/shared/TMUHeader";
import { UserProfile, ClassSchedule } from "../lib/types";

const TRANSIT_SYSTEMS = [
  "TTC (Toronto Transit Commission)", "GO Transit", "MiWay (Mississauga Transit)",
  "Brampton Transit (ZUM)", "YRT (York Region Transit / Viva)",
  "Durham Region Transit", "HSR (Hamilton Street Railway)",
];
const COMMUTE_MODES = ["Subway", "Bus", "GO Train", "GO Bus", "Mixed/Combination"];
const DURATIONS = ["Under 30 min", "30–60 min", "60–90 min", "90+ min"];
const BUFFER_OPTIONS = ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "30 minutes"];
const GAP_OPTIONS = [
  "Study in a quiet space (SLC, library)", "Grab food or coffee on or near campus",
  "Hit the gym or go for a walk", "Explore TMU campus events or clubs",
  "Rest or decompress", "Work on assignments or projects",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type SectionId = "personal" | "location" | "transit" | "schedule" | "commute" | "notifications";

const SelectableRow = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}
    style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: selected ? "#004C9B" : "rgba(255,255,255,0.1)", backgroundColor: selected ? "rgba(0,76,155,0.25)" : "rgba(255,255,255,0.03)" }}>
    <View style={{ width: 20, height: 20, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: selected ? "#004C9B" : "transparent", borderWidth: selected ? 0 : 1, borderColor: "#6b7280" }}>
      {selected && <Ionicons name="checkmark" size={12} color="white" />}
    </View>
    <Text style={{ fontSize: 14, color: "white", flex: 1 }}>{label}</Text>
  </TouchableOpacity>
);

const DropdownSelect = ({ value, options, placeholder, onSelect }: { value: string; options: string[]; placeholder: string; onSelect: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity onPress={() => setOpen(!open)}
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
        <Text style={{ fontSize: 14, color: value ? "white" : "#9ca3af" }}>{value || placeholder}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color="#9ca3af" />
      </TouchableOpacity>
      {open && (
        <View style={{ borderRadius: 12, marginTop: 4, overflow: "hidden", backgroundColor: "#1e2d45", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          {options.map(opt => (
            <TouchableOpacity key={opt} onPress={() => { onSelect(opt); setOpen(false); }}
              style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: "rgba(55,65,81,0.3)" }}>
              <Text style={{ fontSize: 14, color: "white" }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [editClasses, setEditClasses] = useState<ClassSchedule[]>([]);
  const [section, setSection] = useState<SectionId | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const storedUser = await AsyncStorage.getItem("@commuteu_user");
    const storedClasses = await AsyncStorage.getItem("@commuteu_classes");
    if (storedUser) { const u = JSON.parse(storedUser); setUser(u); setProfile(u); }
    if (storedClasses) { const c = JSON.parse(storedClasses); setClasses(c); setEditClasses(c); }
  };

  const updateProfile = (partial: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...partial }));

  const saveProfile = async () => {
    setSaving(true);
    const updated = { ...user, ...profile };
    await AsyncStorage.setItem("@commuteu_user", JSON.stringify(updated));
    setUser(updated as UserProfile);
    setSaving(false);
    setSection(null);
    Alert.alert("✅ Profile updated!");
  };

  const saveClasses = async () => {
    setSaving(true);
    const valid = editClasses.filter(c => c.course_code && c.start_time);
    await AsyncStorage.setItem("@commuteu_classes", JSON.stringify(valid));
    setClasses(valid);
    setSaving(false);
    setSection(null);
    Alert.alert("✅ Schedule updated!");
  };

  const logout = async () => {
    await AsyncStorage.clear();
    Alert.alert("Logged out", "Your data has been cleared.");
  };

  if (!user) return null;

  const sections: { id: SectionId; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
    { id: "personal", label: "Personal Info", icon: "person-outline" },
    { id: "location", label: "Home Location", icon: "location-outline" },
    { id: "transit", label: "Transit Preferences", icon: "train-outline" },
    { id: "schedule", label: "TMU Class Schedule", icon: "book-outline" },
    { id: "commute", label: "Commute Settings", icon: "settings-outline" },
    { id: "notifications", label: "Notifications", icon: "notifications-outline" },
  ];

  const inputStyle = { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "white" as const, fontSize: 14, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" };
  const saveBtn = (fn: () => void) => (
    <TouchableOpacity onPress={fn} disabled={saving}
      style={{ height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#004C9B", marginTop: 8 }}>
      <Text style={{ color: "white", fontWeight: "600" }}>{saving ? "Saving..." : "Save"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0f1a" }}>
      <TMUHeader title="My TMU Profile" subtitle={user.email} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {!section ? (
          <View style={{ gap: 12 }}>
            {/* Avatar card */}
            <View style={{ borderRadius: 16, padding: 20, alignItems: "center", backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#004C9B" }}>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "white" }}>
                  {(profile.preferred_name || profile.full_name || "S")[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>{profile.preferred_name || profile.full_name}</Text>
              <Text style={{ fontSize: 14, color: "#9ca3af", marginTop: 2 }}>{user.email}</Text>
              {profile.home_location && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
                  <Ionicons name="location-outline" size={12} color="#9ca3af" />
                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>{profile.home_location}</Text>
                </View>
              )}
            </View>

            {sections.map(({ id, label, icon }) => (
              <TouchableOpacity key={id}
                onPress={() => { setSection(id); if (id === "schedule") setEditClasses(classes.length > 0 ? [...classes] : [{ id: "1", course_code: "", course_name: "", days: [], start_time: "", end_time: "", building: "" }]); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 16, padding: 16, borderRadius: 16, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,76,155,0.4)" }}>
                  <Ionicons name={icon} size={20} color="#004C9B" />
                </View>
                <Text style={{ fontWeight: "500", fontSize: 14, color: "white", flex: 1 }}>{label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={logout}
              style={{ marginTop: 8, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, borderWidth: 1, borderColor: "rgba(239,68,68,0.3)" }}>
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#ef4444" }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={() => setSection(null)}
              style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 16 }}>
              <Ionicons name="arrow-back" size={16} color="#004C9B" />
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#004C9B" }}>Back to Profile</Text>
            </TouchableOpacity>

            {section === "personal" && (
              <View style={{ borderRadius: 16, padding: 20, gap: 12, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500" }}>Preferred Name</Text>
                <TextInput value={profile.preferred_name || ""} onChangeText={v => updateProfile({ preferred_name: v })} style={inputStyle} placeholderTextColor="#9ca3af" placeholder="Your name" />
                {saveBtn(saveProfile)}
              </View>
            )}

            {section === "location" && (
              <View style={{ borderRadius: 16, padding: 20, gap: 12, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500" }}>Home Location in GTA</Text>
                <TextInput value={profile.home_location || ""} onChangeText={v => updateProfile({ home_location: v })} style={inputStyle} placeholderTextColor="#9ca3af" placeholder="e.g. Scarborough" />
                {saveBtn(saveProfile)}
              </View>
            )}

            {section === "transit" && (
              <View style={{ borderRadius: 16, padding: 20, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500", marginBottom: 12 }}>Transit Systems</Text>
                {TRANSIT_SYSTEMS.map(sys => (
                  <SelectableRow key={sys} label={sys} selected={(profile.transit_systems || []).includes(sys)}
                    onPress={() => { const arr = profile.transit_systems || []; updateProfile({ transit_systems: arr.includes(sys) ? arr.filter(s => s !== sys) : [...arr, sys] }); }} />
                ))}
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500", marginTop: 8, marginBottom: 8 }}>Preferred Mode</Text>
                <DropdownSelect value={profile.preferred_commute_mode || ""} options={COMMUTE_MODES} placeholder="Select" onSelect={v => updateProfile({ preferred_commute_mode: v })} />
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500", marginBottom: 8 }}>Average Commute</Text>
                <DropdownSelect value={profile.average_commute_duration || ""} options={DURATIONS} placeholder="Select" onSelect={v => updateProfile({ average_commute_duration: v })} />
                {saveBtn(saveProfile)}
              </View>
            )}

            {section === "schedule" && (
              <View style={{ gap: 12 }}>
                {editClasses.map((cls, i) => (
                  <View key={i} style={{ borderRadius: 16, padding: 16, gap: 12, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#9ca3af" }}>CLASS {i + 1}</Text>
                      {editClasses.length > 1 && (
                        <TouchableOpacity onPress={() => setEditClasses(editClasses.filter((_, j) => j !== i))}>
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TextInput value={cls.course_code} placeholder="CPS 305" placeholderTextColor="#9ca3af"
                        onChangeText={v => { const u = [...editClasses]; u[i] = { ...u[i], course_code: v }; setEditClasses(u); }}
                        style={[inputStyle, { flex: 1 }]} />
                      <TextInput value={cls.course_name} placeholder="Data Structures" placeholderTextColor="#9ca3af"
                        onChangeText={v => { const u = [...editClasses]; u[i] = { ...u[i], course_name: v }; setEditClasses(u); }}
                        style={[inputStyle, { flex: 1 }]} />
                    </View>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      {DAYS.map(day => (
                        <TouchableOpacity key={day} onPress={() => { const u = [...editClasses]; const d = u[i].days || []; u[i] = { ...u[i], days: d.includes(day) ? d.filter(x => x !== day) : [...d, day] }; setEditClasses(u); }}
                          style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center", backgroundColor: (cls.days || []).includes(day) ? "#004C9B" : "rgba(255,255,255,0.06)" }}>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: (cls.days || []).includes(day) ? "white" : "#9ca3af" }}>{day}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TextInput value={cls.start_time} placeholder="09:00" placeholderTextColor="#9ca3af"
                        onChangeText={v => { const u = [...editClasses]; u[i] = { ...u[i], start_time: v }; setEditClasses(u); }}
                        style={[inputStyle, { flex: 1 }]} />
                      <TextInput value={cls.end_time} placeholder="10:50" placeholderTextColor="#9ca3af"
                        onChangeText={v => { const u = [...editClasses]; u[i] = { ...u[i], end_time: v }; setEditClasses(u); }}
                        style={[inputStyle, { flex: 1 }]} />
                    </View>
                    <TextInput value={cls.building || ""} placeholder="Building (e.g. Kerr Hall)" placeholderTextColor="#9ca3af"
                      onChangeText={v => { const u = [...editClasses]; u[i] = { ...u[i], building: v }; setEditClasses(u); }}
                      style={inputStyle} />
                  </View>
                ))}
                <TouchableOpacity onPress={() => setEditClasses([...editClasses, { id: Date.now().toString(), course_code: "", course_name: "", days: [], start_time: "", end_time: "", building: "" }])}
                  style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderStyle: "dashed", borderColor: "#6b7280" }}>
                  <Text style={{ fontSize: 14, color: "#9ca3af" }}>+ Add Class</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveClasses} disabled={saving}
                  style={{ height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#004C9B" }}>
                  <Text style={{ color: "white", fontWeight: "600" }}>{saving ? "Saving..." : "Save Schedule"}</Text>
                </TouchableOpacity>
              </View>
            )}

            {section === "commute" && (
              <View style={{ borderRadius: 16, padding: 20, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500", marginBottom: 8 }}>Arrival Buffer</Text>
                <DropdownSelect value={profile.arrival_buffer || ""} options={BUFFER_OPTIONS} placeholder="Select" onSelect={v => updateProfile({ arrival_buffer: v })} />
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500", marginBottom: 12 }}>Gap Preferences</Text>
                {GAP_OPTIONS.map(gap => (
                  <SelectableRow key={gap} label={gap} selected={(profile.gap_preferences || []).includes(gap)}
                    onPress={() => { const arr = profile.gap_preferences || []; updateProfile({ gap_preferences: arr.includes(gap) ? arr.filter(g => g !== gap) : [...arr, gap] }); }} />
                ))}
                <Text style={{ fontSize: 12, color: "#9ca3af", fontWeight: "500", marginTop: 8, marginBottom: 8 }}>
                  Days per week: <Text style={{ color: "#004C9B", fontWeight: "700" }}>{profile.commute_days_per_week || 3}</Text>
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <TouchableOpacity key={n} onPress={() => updateProfile({ commute_days_per_week: n })}
                      style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center", backgroundColor: (profile.commute_days_per_week || 3) === n ? "#004C9B" : "rgba(255,255,255,0.06)" }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: (profile.commute_days_per_week || 3) === n ? "white" : "#9ca3af" }}>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {saveBtn(saveProfile)}
              </View>
            )}

            {section === "notifications" && (
              <View style={{ borderRadius: 16, padding: 20, gap: 16, backgroundColor: "#151f2e", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.07)" }}>
                {[
                  { key: "notification_leave_alerts", label: "Leave-time alerts" },
                  { key: "notification_delay_warnings", label: "Transit delay warnings" },
                  { key: "notification_class_reminders", label: "Class reminders" },
                  { key: "notification_wellness_checkins", label: "Wellness check-ins" },
                  { key: "notification_gap_suggestions", label: "Gap suggestions" },
                ].map(({ key, label }) => (
                  <View key={key} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 14, fontWeight: "500", color: "white" }}>{label}</Text>
                    <Switch
                      value={(profile as any)[key] !== false}
                      onValueChange={v => updateProfile({ [key]: v } as any)}
                      trackColor={{ false: "#374151", true: "#1d4ed8" }}
                      thumbColor={(profile as any)[key] !== false ? "#FFDC00" : "#9ca3af"}
                    />
                  </View>
                ))}
                {saveBtn(saveProfile)}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
