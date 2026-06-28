import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import InputField from "../components/InputField";
import FixedCostRow, { CostItem } from "../components/FixedCostRow";
import { capture } from "../lib/posthog";

const DEFAULT_COSTS: CostItem[] = [
  { id: "1", name: "家賃", amount: "" },
  { id: "2", name: "スマホ代", amount: "" },
  { id: "3", name: "サブスク", amount: "" },
  { id: "4", name: "その他", amount: "" },
];

type Mode = "monthly" | "hourly";

const FEATURES = [
  { icon: "⏱", text: "固定費が何時間分の労働か一目でわかる" },
  { icon: "🥧", text: "収入の内訳を円グラフで可視化" },
  { icon: "📅", text: "何日まで固定費のために働くかカレンダーで確認" },
  { icon: "📊", text: "項目ごとの労働時間を棒グラフで比較" },
];

export default function IndexScreen() {
  const [mode, setMode] = useState<Mode>("monthly");
  const [income, setIncome] = useState("");
  const [workHours, setWorkHours] = useState("160");
  const [costs, setCosts] = useState<CostItem[]>(DEFAULT_COSTS);

  const incomeNum = parseFloat(income) || 0;
  const isValid = incomeNum > 0;

  const handleCostChange = (id: string, field: "name" | "amount", value: string) => {
    setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const handleRemove = (id: string) => setCosts((prev) => prev.filter((c) => c.id !== id));
  const handleAdd = () => setCosts((prev) => [...prev, { id: Date.now().toString(), name: "", amount: "" }]);

  const handleDiagnose = () => {
    capture("diagnosis_started", { mode });
    const hours = parseFloat(workHours) || 160;
    const hourlyWage = mode === "monthly" ? incomeNum / hours : incomeNum;
    const monthlyIncome = mode === "monthly" ? incomeNum : incomeNum * hours;
    const costData = costs
      .filter((c) => parseFloat(c.amount) > 0)
      .map((c) => ({ name: c.name || "未設定", amount: parseFloat(c.amount) }));
    router.push({
      pathname: "/result",
      params: {
        hourlyWage: hourlyWage.toString(),
        workHours: hours.toString(),
        income: monthlyIncome.toString(),
        costs: JSON.stringify(costData),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

        {/* Hero */}
        <View style={{ backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 32, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: "#0ea5e9", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}>
          <View style={{ backgroundColor: "#e0f2fe", alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 }}>
            <Text style={{ color: "#0284c7", fontSize: 12, fontWeight: "700" }}>あなたの時給、知ってますか？</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#0f172a", lineHeight: 34, marginBottom: 8 }}>
            手取りと固定費を入れるだけ{"\n"}
            <Text style={{ color: "#0ea5e9" }}>労働の価値</Text>を可視化
          </Text>
          <Text style={{ color: "#64748b", fontSize: 14, lineHeight: 22, marginBottom: 20 }}>
            毎月の固定費が「何時間分の労働」に相当するか。グラフとカレンダーで直感的に確認できます。
          </Text>
          <View style={{ gap: 10 }}>
            {FEATURES.map((f, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 16 }}>{f.icon}</Text>
                <Text style={{ color: "#334155", fontSize: 13 }}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 16, marginTop: 4 }}>収入を入力</Text>

          {/* Mode Toggle */}
          <View style={{ flexDirection: "row", backgroundColor: "#e0f2fe", borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {(["monthly", "hourly"] as Mode[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 10,
                  backgroundColor: mode === m ? "#0ea5e9" : "transparent",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: mode === m ? "#fff" : "#0284c7", fontWeight: "600", fontSize: 15 }}>
                  {m === "monthly" ? "月給制" : "時給制"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputField label={mode === "monthly" ? "月手取り（円）" : "時給（円）"} value={income} onChangeText={setIncome} placeholder={mode === "monthly" ? "250000" : "1500"} suffix="円" />
          <InputField label="月労働時間" value={workHours} onChangeText={setWorkHours} placeholder="160" suffix="時間" />

          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a", marginBottom: 12, marginTop: 8 }}>固定費を入力</Text>
          {costs.map((item) => (
            <FixedCostRow key={item.id} item={item} onChange={handleCostChange} onRemove={handleRemove} />
          ))}

          <TouchableOpacity
            onPress={handleAdd}
            style={{ borderWidth: 1.5, borderColor: "#0ea5e9", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginBottom: 28 }}
          >
            <Text style={{ color: "#0ea5e9", fontSize: 15, fontWeight: "600" }}>＋ 項目を追加</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDiagnose}
            disabled={!isValid}
            style={{ backgroundColor: isValid ? "#0ea5e9" : "#cbd5e1", borderRadius: 14, paddingVertical: 18, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
              {isValid ? "診断する →" : "手取りを入力してください"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
