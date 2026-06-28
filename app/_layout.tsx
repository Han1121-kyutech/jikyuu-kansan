import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#0ea5e9",
        headerTitleStyle: { fontWeight: "700", color: "#0f172a" },
        contentStyle: { backgroundColor: "#f0f9ff" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "手取り時給診断" }} />
      <Stack.Screen name="result" options={{ title: "診断結果" }} />
    </Stack>
  );
}
