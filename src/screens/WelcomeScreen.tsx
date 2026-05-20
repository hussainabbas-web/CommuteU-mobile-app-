import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const extractedEmail = route.params?.extractedEmail || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(extractedEmail);
  const [loading, setLoading] = useState(false);

  const isValidTMUEmail = (e: string) =>
    /^[^\s@]+@torontomu\.ca$/.test(e) || /^[^\s@]+@ryerson\.ca$/.test(e);

  const handleContinue = async () => {
    if (!fullName.trim()) {
      Alert.alert("Missing name", "Please enter your name.");
      return;
    }
    if (!isValidTMUEmail(email)) {
      Alert.alert("Invalid email", "Please enter your TMU email ending in @torontomu.ca");
      return;
    }

    setLoading(true);
    const userData = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      onboarding_complete: false,
    };
    await AsyncStorage.setItem("@commuteu_user", JSON.stringify(userData));
    setLoading(false);
    navigation.replace("Onboarding");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#004C9B" }}>
      <StatusBar barStyle="light-content" backgroundColor="#004C9B" />

      <View style={{ position: "absolute", width: 250, height: 250, top: -60, right: -60, borderRadius: 125, backgroundColor: "#FFDC00", opacity: 0.1 }} />
      <View style={{ position: "absolute", width: 160, height: 160, bottom: 80, left: -40, borderRadius: 80, backgroundColor: "#FFDC00", opacity: 0.05 }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>

            {/* Header */}
            <View style={{ alignItems: "center", marginBottom: 40 }}>
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Ionicons name="person-add" size={32} color="#004C9B" />
              </View>
              <Text style={{ fontSize: 28, fontWeight: "900", color: "white", textAlign: "center" }}>
                Welcome to CommuteU! 🎉
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textAlign: "center", marginTop: 12, lineHeight: 22 }}>
                You're signed in with TMU. Let's set up your profile before we get started.
              </Text>
            </View>

            {/* Full name */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>Your full name</Text>
              <View style={{ flexDirection: "row", alignItems: "center", borderRadius: 16, paddingHorizontal: 16, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1.5, borderColor: fullName ? "#FFDC00" : "rgba(255,255,255,0.2)" }}>
                <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Hussain Abbas"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  style={{ flex: 1, paddingVertical: 16, paddingLeft: 12, color: "white", fontSize: 14 }}
                  autoCapitalize="words"
                />
              </View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 6, marginLeft: 4 }}>
                This is how you'll appear in the app
              </Text>
            </View>

            {/* TMU Email */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600", marginBottom: 8 }}>TMU student email</Text>
              <View style={{ flexDirection: "row", alignItems: "center", borderRadius: 16, paddingHorizontal: 16, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1.5, borderColor: email && isValidTMUEmail(email) ? "#FFDC00" : email && !isValidTMUEmail(email) ? "#ef4444" : "rgba(255,255,255,0.2)" }}>
                <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.5)" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@torontomu.ca"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  style={{ flex: 1, paddingVertical: 16, paddingLeft: 12, color: "white", fontSize: 14 }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {email && isValidTMUEmail(email) && (
                  <Ionicons name="checkmark-circle" size={18} color="#FFDC00" />
                )}
              </View>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 6, marginLeft: 4 }}>
                Must end in @torontomu.ca
              </Text>
            </View>

            {/* Info box */}
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, backgroundColor: "rgba(255,220,0,0.1)", borderWidth: 1, borderColor: "rgba(255,220,0,0.2)", marginBottom: 32 }}>
              <Ionicons name="information-circle-outline" size={18} color="#FFDC00" style={{ marginTop: 1 }} />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 20, flex: 1 }}>
                Your name and email are stored locally on your device and used only to personalize your CommuteU experience.
              </Text>
            </View>

            {/* Continue button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={loading || !fullName.trim() || !isValidTMUEmail(email)}
              style={{ height: 56, borderRadius: 16, backgroundColor: !fullName.trim() || !isValidTMUEmail(email) ? "rgba(255,220,0,0.4)" : "#FFDC00", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
            >
              <Text style={{ fontWeight: "900", fontSize: 16, color: "#004C9B" }}>
                {loading ? "Setting up..." : "Let's get started"}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={18} color="#004C9B" />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
