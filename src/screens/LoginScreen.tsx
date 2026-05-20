import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TMU_CAS_URL =
  "https://cas.torontomu.ca/login?service=https://my.torontomu.ca/uPortal/Login%3FrefUrl%3D%2FuPortal%2Ff%2Fmyservicehub%2Fnormal%2Frender.uP";

const SUCCESS_URL_PATTERN = "my.torontomu.ca/uPortal";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationChange = (navState: any) => {
    const { url } = navState;
    if (url && url.includes(SUCCESS_URL_PATTERN)) {
      const emailMatch = url.match(/[a-zA-Z0-9._%+-]+@torontomu\.ca/);
      const extractedEmail = emailMatch ? emailMatch[0] : "";
      setShowWebView(false);
      navigation.replace("Welcome", { extractedEmail });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#004C9B" }}>
      <StatusBar barStyle="light-content" backgroundColor="#004C9B" />

      <View style={{ position: "absolute", width: 300, height: 300, top: -80, right: -80, borderRadius: 150, backgroundColor: "#FFDC00", opacity: 0.1 }} />
      <View style={{ position: "absolute", width: 200, height: 200, bottom: 100, left: -60, borderRadius: 100, backgroundColor: "#FFDC00", opacity: 0.05 }} />

      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: "space-between", paddingVertical: 48 }}>
        {/* Logo */}
        <View style={{ alignItems: "center", marginTop: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Ionicons name="train" size={40} color="#004C9B" />
          </View>
          <Text style={{ fontSize: 36, fontWeight: "900", color: "white", letterSpacing: -1 }}>CommuteU</Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginTop: 8, textAlign: "center" }}>
            Built for TMU commuters like you
          </Text>
        </View>

        {/* Features */}
        <View style={{ gap: 16 }}>
          {[
            { icon: "time-outline", text: "Know exactly when to leave for class" },
            { icon: "map-outline", text: "Navigate TMU campus with ease" },
            { icon: "heart-outline", text: "Track your commute wellness" },
            { icon: "notifications-outline", text: "Get real-time transit alerts" },
          ].map(({ icon, text }) => (
            <View key={text} style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,220,0,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={icon as any} size={20} color="#FFDC00" />
              </View>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, flex: 1 }}>{text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            onPress={() => setShowWebView(true)}
            style={{ height: 56, borderRadius: 16, backgroundColor: "#FFDC00", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 12 }}
          >
            <Ionicons name="school" size={20} color="#004C9B" />
            <Text style={{ fontWeight: "900", fontSize: 16, color: "#004C9B" }}>Sign in with TMU Account</Text>
          </TouchableOpacity>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", lineHeight: 18 }}>
            Uses your official TMU credentials via{"\n"}Toronto Metropolitan University SSO
          </Text>
        </View>
      </View>

      {/* TMU CAS WebView Modal */}
      <Modal visible={showWebView} animationType="slide" onRequestClose={() => setShowWebView(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#004C9B" }}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12, backgroundColor: "#004C9B" }}>
            <TouchableOpacity onPress={() => setShowWebView(false)} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="close" size={22} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>TMU Sign In</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>cas.torontomu.ca — Secure login</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="lock-closed" size={12} color="#FFDC00" />
              <Text style={{ fontSize: 12, color: "#FFDC00" }}>Secure</Text>
            </View>
          </View>

          {webViewLoading && (
            <View style={{ position: "absolute", top: 60, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0f1a", zIndex: 10 }}>
              <ActivityIndicator size="large" color="#004C9B" />
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 12 }}>Loading TMU login...</Text>
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ uri: TMU_CAS_URL }}
            onNavigationStateChange={handleNavigationChange}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
