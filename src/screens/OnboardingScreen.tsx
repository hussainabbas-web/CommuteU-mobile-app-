import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const TRANSIT_SYSTEMS = [
  "TTC (Toronto Transit Commission)",
  "GO Transit",
  "MiWay (Mississauga Transit)",
  "Brampton Transit (ZUM)",
  "YRT (York Region Transit / Viva)",
  "Durham Region Transit",
  "HSR (Hamilton Street Railway)",
];
const COMMUTE_MODES = ["Transit only", "Transit + walking", "Cycling", "Driving + transit (park & ride)", "Walking only"];
const COMMUTE_DURATIONS = ["Under 30 minutes", "30–60 minutes", "60–90 minutes", "90+ minutes"];
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const ARRIVAL_BUFFERS = ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "30 minutes"];
const GAP_ACTIVITIES = [
  "Study in a quiet space (SLC, library)",
  "Grab food or coffee on or near campus",
  "Hit the gym or go for a walk",
  "Explore TMU campus events or clubs",
  "Rest or decompress",
  "Work on assignments or projects",
];
const FATIGUE_OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Always"];
const COMMUTE_CHALLENGES = [
  "Unpredictable TTC or GO delays",
  "Long travel time each day",
  "Wasted time between classes on campus",
  "No time for meals or breaks",
  "Overcrowded transit",
  "High transit costs",
  "Weather-related disruptions",
];
const NOTIFICATIONS_CONFIG = [
  { key: "notification_leave_alerts", icon: "🕐", title: "Leave-time alerts", subtitle: "When to head to your stop" },
  { key: "notification_delay_warnings", icon: "⚠️", title: "Transit delay warnings", subtitle: "Disruptions affecting your route" },
  { key: "notification_class_reminders", icon: "📖", title: "Class reminders", subtitle: "15 minutes before class starts" },
  { key: "notification_wellness_checkins", icon: "🤍", title: "Weekly wellness check-ins", subtitle: "Rate your commute stress" },
  { key: "notification_gap_suggestions", icon: "💡", title: "Gap activity suggestions", subtitle: "Ideas for time between classes" },
];
const TOTAL_STEPS = 7;

interface ClassEntry {
  id: string;
  course_code: string;
  course_name: string;
  days: string[];
  start_time: string;
  end_time: string;
  building: string;
}

interface OnboardingData {
  preferred_name: string;
  home_location: string;
  transit_systems: string[];
  preferred_commute_mode: string;
  average_commute_duration: string;
  classes: ClassEntry[];
  arrival_buffer: string;
  gap_preferences: string[];
  stress_level: number;
  fatigue_level: string;
  commute_challenges: string[];
  notifications: Record<string, boolean>;
}

const SelectableChip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: selected ? "#FFDC00" : "rgba(255,255,255,0.15)", backgroundColor: selected ? "rgba(255,220,0,0.08)" : "rgba(255,255,255,0.04)" }}
  >
    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginRight: 12, alignItems: "center", justifyContent: "center", borderColor: selected ? "#FFDC00" : "rgba(255,255,255,0.3)" }}>
      {selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#FFDC00" }} />}
    </View>
    <Text style={{ fontSize: 14, flex: 1, color: selected ? "#FFDC00" : "rgba(255,255,255,0.8)" }}>{label}</Text>
  </TouchableOpacity>
);

const FakeSelect = ({ placeholder, value, options, onSelect }: { placeholder: string; value: string; options: string[]; onSelect: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}
      >
        <Text style={{ fontSize: 14, color: value ? "white" : "rgba(255,255,255,0.4)" }}>{value || placeholder}</Text>
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <View style={{ borderRadius: 12, marginTop: 4, overflow: "hidden", backgroundColor: "#0d2040", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}>
          {options.map(opt => (
            <TouchableOpacity key={opt} onPress={() => { onSelect(opt); setOpen(false); }} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.07)" }}>
              <Text style={{ color: "white", fontSize: 14 }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const StepHeader = ({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => (
  <View style={{ alignItems: "center", marginTop: 24, marginBottom: 32 }}>
    <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
    </View>
    <Text style={{ color: "white", fontSize: 22, fontWeight: "700", textAlign: "center" }}>{title}</Text>
    <Text style={{ color: "rgba(147,197,253,1)", fontSize: 14, textAlign: "center", marginTop: 8 }}>{subtitle}</Text>
  </View>
);

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(1);
  const [loggedInName, setLoggedInName] = useState("Student");
  const [data, setData] = useState<OnboardingData>({
    preferred_name: "",
    home_location: "",
    transit_systems: [],
    preferred_commute_mode: "",
    average_commute_duration: "",
    classes: [{ id: "1", course_code: "", course_name: "", days: [], start_time: "", end_time: "", building: "" }],
    arrival_buffer: "15 minutes",
    gap_preferences: [],
    stress_level: 3,
    fatigue_level: "",
    commute_challenges: [],
    notifications: {
      notification_leave_alerts: true,
      notification_delay_warnings: true,
      notification_class_reminders: true,
      notification_wellness_checkins: true,
      notification_gap_suggestions: true,
    },
  });

  React.useEffect(() => {
    AsyncStorage.getItem("@commuteu_user").then(stored => {
      if (stored) {
        const u = JSON.parse(stored);
        setLoggedInName(u.full_name || "Student");
      }
    });
  }, []);

  const goNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      const storedUser = await AsyncStorage.getItem("@commuteu_user");
      const existing = storedUser ? JSON.parse(storedUser) : {};
      const updatedUser = {
        ...existing,
        preferred_name: data.preferred_name || existing.full_name,
        home_location: data.home_location,
        transit_systems: data.transit_systems,
        preferred_commute_mode: data.preferred_commute_mode,
        average_commute_duration: data.average_commute_duration,
        arrival_buffer: data.arrival_buffer,
        gap_preferences: data.gap_preferences,
        stress_level: data.stress_level,
        fatigue_level: data.fatigue_level,
        commute_challenges: data.commute_challenges,
        ...data.notifications,
        onboarding_complete: true,
      };
      await AsyncStorage.setItem("@commuteu_user", JSON.stringify(updatedUser));
      const validClasses = data.classes.filter(c => c.course_code && c.start_time);
      await AsyncStorage.setItem("@commuteu_classes", JSON.stringify(validClasses));
      navigation.replace("MainTabs");
    }
  };

  const goBack = () => setStep(s => Math.max(1, s - 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <StepHeader icon="✨" title={`Hey, ${loggedInName.split(" ")[0]}! 👋`} subtitle="Welcome to CommuteU — built for TMU commuters like you." />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>What should we call you?</Text>
            <TextInput
              style={{ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}
              placeholder="Your preferred name or nickname"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={data.preferred_name}
              onChangeText={v => setData(d => ({ ...d, preferred_name: v }))}
            />
          </View>
        );
      case 2:
        return (
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <StepHeader icon="📍" title="Where do you commute from?" subtitle="All routes go to TMU's main campus at 350 Victoria Street." />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>Your home area in the GTA</Text>
            <TextInput
              style={{ borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}
              placeholder="e.g. Scarborough, Mississauga..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={data.home_location}
              onChangeText={v => setData(d => ({ ...d, home_location: v }))}
            />
          </View>
        );
      case 3:
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <StepHeader icon="🚌" title="Your transit preferences" subtitle="Select all the transit systems you use." />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 12 }}>Transit systems</Text>
            {TRANSIT_SYSTEMS.map(sys => (
              <SelectableChip key={sys} label={sys} selected={data.transit_systems.includes(sys)}
                onPress={() => setData(d => ({ ...d, transit_systems: d.transit_systems.includes(sys) ? d.transit_systems.filter(x => x !== sys) : [...d.transit_systems, sys] }))} />
            ))}
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginTop: 16, marginBottom: 8 }}>Preferred commute mode</Text>
            <FakeSelect placeholder="Select mode" value={data.preferred_commute_mode} options={COMMUTE_MODES} onSelect={v => setData(d => ({ ...d, preferred_commute_mode: v }))} />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>Average one-way commute time</Text>
            <FakeSelect placeholder="Select duration" value={data.average_commute_duration} options={COMMUTE_DURATIONS} onSelect={v => setData(d => ({ ...d, average_commute_duration: v }))} />
            <View style={{ height: 32 }} />
          </ScrollView>
        );
      case 4:
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <StepHeader icon="📚" title="Your TMU semester schedule" subtitle="Add your current classes so we can plan your commute." />
            {data.classes.map((cls, idx) => (
              <View key={cls.id} style={{ borderRadius: 16, padding: 16, marginBottom: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
                <Text style={{ color: "#FFDC00", fontSize: 12, fontWeight: "700", marginBottom: 12 }}>CLASS {idx + 1}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  <TextInput style={{ flex: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                    placeholder="CPS 305" placeholderTextColor="rgba(255,255,255,0.35)" value={cls.course_code}
                    onChangeText={v => setData(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? { ...c, course_code: v } : c) }))} />
                  <TextInput style={{ flex: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                    placeholder="Data Structures" placeholderTextColor="rgba(255,255,255,0.35)" value={cls.course_name}
                    onChangeText={v => setData(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? { ...c, course_name: v } : c) }))} />
                </View>
                <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12, marginBottom: 8 }}>Days</Text>
                <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
                  {DAYS_OF_WEEK.map(day => (
                    <TouchableOpacity key={day} onPress={() => setData(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? { ...c, days: c.days.includes(day) ? c.days.filter(x => x !== day) : [...c.days, day] } : c) }))}
                      style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center", backgroundColor: cls.days.includes(day) ? "#FFDC00" : "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: cls.days.includes(day) ? "#FFDC00" : "rgba(255,255,255,0.15)" }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: cls.days.includes(day) ? "#004C9B" : "rgba(255,255,255,0.5)" }}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12, marginBottom: 4 }}>Start time</Text>
                    <TextInput style={{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                      placeholder="9:00 AM" placeholderTextColor="rgba(255,255,255,0.35)" value={cls.start_time}
                      onChangeText={v => setData(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? { ...c, start_time: v } : c) }))} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12, marginBottom: 4 }}>End time</Text>
                    <TextInput style={{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                      placeholder="10:50 AM" placeholderTextColor="rgba(255,255,255,0.35)" value={cls.end_time}
                      onChangeText={v => setData(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? { ...c, end_time: v } : c) }))} />
                  </View>
                </View>
                <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12, marginBottom: 4 }}>Building</Text>
                <TextInput style={{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: "white", fontSize: 14, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}
                  placeholder="e.g. Kerr Hall, SLC" placeholderTextColor="rgba(255,255,255,0.35)" value={cls.building}
                  onChangeText={v => setData(d => ({ ...d, classes: d.classes.map(c => c.id === cls.id ? { ...c, building: v } : c) }))} />
              </View>
            ))}
            <TouchableOpacity onPress={() => setData(d => ({ ...d, classes: [...d.classes, { id: Date.now().toString(), course_code: "", course_name: "", days: [], start_time: "", end_time: "", building: "" }] }))}
              style={{ borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderStyle: "dashed" }}>
              <Text style={{ color: "rgba(147,197,253,1)", fontSize: 14 }}>+ Add another class</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        );
      case 5:
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <StepHeader icon="⚙️" title="Commute preferences" subtitle="Help us personalize your daily plan." />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>How early before class?</Text>
            <FakeSelect placeholder="Select buffer time" value={data.arrival_buffer} options={ARRIVAL_BUFFERS} onSelect={v => setData(d => ({ ...d, arrival_buffer: v }))} />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginTop: 8, marginBottom: 12 }}>How do you use gaps between classes?</Text>
            {GAP_ACTIVITIES.map(act => (
              <SelectableChip key={act} label={act} selected={data.gap_preferences.includes(act)}
                onPress={() => setData(d => ({ ...d, gap_preferences: d.gap_preferences.includes(act) ? d.gap_preferences.filter(x => x !== act) : [...d.gap_preferences, act] }))} />
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        );
      case 6:
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <StepHeader icon="🤍" title="Wellness baseline" subtitle="Help us watch out for burnout." />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 12 }}>Current commute stress level</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity key={n} onPress={() => setData(d => ({ ...d, stress_level: n }))}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", backgroundColor: data.stress_level === n ? "#FFDC00" : "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: data.stress_level === n ? "#FFDC00" : "rgba(255,255,255,0.15)" }}>
                  <Text style={{ fontWeight: "700", color: data.stress_level === n ? "#004C9B" : "white" }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12 }}>Very Low</Text>
              <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12 }}>Very High</Text>
            </View>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>Do you feel fatigued after commuting?</Text>
            <FakeSelect placeholder="Select" value={data.fatigue_level} options={FATIGUE_OPTIONS} onSelect={v => setData(d => ({ ...d, fatigue_level: v }))} />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginTop: 8, marginBottom: 12 }}>Biggest commute challenges</Text>
            {COMMUTE_CHALLENGES.map(ch => (
              <SelectableChip key={ch} label={ch} selected={data.commute_challenges.includes(ch)}
                onPress={() => setData(d => ({ ...d, commute_challenges: d.commute_challenges.includes(ch) ? d.commute_challenges.filter(x => x !== ch) : [...d.commute_challenges, ch] }))} />
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        );
      case 7:
        return (
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <StepHeader icon="🔔" title="Stay in the loop" subtitle="Choose which notifications to receive." />
            {NOTIFICATIONS_CONFIG.map(notif => (
              <View key={notif.key} style={{ flexDirection: "row", alignItems: "center", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 12, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                  <Text style={{ fontSize: 18 }}>{notif.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>{notif.title}</Text>
                  <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12, marginTop: 2 }}>{notif.subtitle}</Text>
                </View>
                <Switch
                  value={data.notifications[notif.key] ?? true}
                  onValueChange={v => setData(d => ({ ...d, notifications: { ...d.notifications, [notif.key]: v } }))}
                  trackColor={{ false: "#1e3a6e", true: "#2563eb" }}
                  thumbColor={data.notifications[notif.key] ? "#FFDC00" : "#9ca3af"}
                />
              </View>
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#004C9B" }}>
      <StatusBar barStyle="light-content" backgroundColor="#004C9B" />

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
            <Text style={{ fontSize: 12 }}>🚌</Text>
          </View>
          <Text style={{ color: "#FFDC00", fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" }}>CommuteU Setup</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < step ? "#FFDC00" : "rgba(255,255,255,0.15)" }} />
          ))}
        </View>
        <Text style={{ color: "rgba(147,197,253,1)", fontSize: 12, marginTop: 4 }}>Step {step} of {TOTAL_STEPS}</Text>
      </View>

      <View style={{ flex: 1 }}>{renderStep()}</View>

      {/* Footer */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 16 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {step > 1 && (
            <TouchableOpacity onPress={goBack}
              style={{ width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
              <Text style={{ color: "white", fontSize: 22 }}>‹</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={goNext}
            style={{ flex: 1, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: "#FFDC00" }}>
            <Text style={{ fontWeight: "700", fontSize: 16, color: "#004C9B" }}>{step === TOTAL_STEPS ? "Get Started" : "Continue"}</Text>
            {step < TOTAL_STEPS && <Text style={{ fontWeight: "700", fontSize: 20, color: "#004C9B" }}>›</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
