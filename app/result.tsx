import React, { useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import ResultCard, { ResultData } from "../components/ResultCard";
import PieChart from "../components/PieChart";
import HoursBarChart from "../components/HoursBarChart";
import WorkCalendar from "../components/WorkCalendar";
import ScoreBadge from "../components/ScoreBadge";
import SavingsSimulator from "../components/SavingsSimulator";
import { calcHoursFor, calcRate, buildShareText } from "../lib/calc";
import { capture } from "../lib/posthog";

const COST_COLORS = ["#0ea5e9", "#38bdf8", "#06b6d4", "#22d3ee", "#6366f1", "#8b5cf6", "#10b981", "#f59e0b"];

type Tab = "summary" | "chart" | "calendar" | "advice";

export default function ResultScreen() {
  const params = useLocalSearchParams<{ hourlyWage: string; workHours: string; income: string; costs: string }>();
  const cardRef = useRef<View>(null);
  const [tab, setTab] = useState<Tab>("summary");

  const hourlyWage = parseFloat(params.hourlyWage ?? "0");
  const workHours = parseFloat(params.workHours ?? "160");
  const income = parseFloat(params.income ?? "0");
  const costs: { name: string; amount: number }[] = JSON.parse(params.costs ?? "[]");

  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);
  const totalHours = costs.reduce((sum, c) => sum + calcHoursFor(c.amount, hourlyWage), 0);
  const rate = calcRate(totalCost, income);
  const freeIncome = income - totalCost;

  const data: ResultData = { hourlyWage, workHours, income, costs, totalCost, totalHours, rate };

  React.useEffect(() => { capture("diagnosis_completed", { rate: Math.round(rate), totalCost }); }, []);

  const handleShare = async () => {
    capture("share_tapped");
    try {
      if (Platform.OS === "web") {
        const text = buildShareText(hourlyWage, totalHours, workHours, rate);
        await navigator.clipboard.writeText(text);
        alert("シェアテキストをコピーしました！\nXに貼り付けてシェアしてください。");
        return;
      }
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      const available = await Sharing.isAvailableAsync();
      if (available) await Sharing.shareAsync(uri, { mimeType: "image/png" });
    } catch (e) { console.error(e); }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "summary", label: "📋 結果" },
    { key: "chart", label: "📊 グラフ" },
    { key: "calendar", label: "📅 カレンダー" },
    { key: "advice", label: "💡 節約" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      {/* Tab bar */}
      <View style={{ flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e0f2fe" }}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={{ flex: 1, paddingVertical: 13, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: tab === t.key ? "#0ea5e9" : "transparent" }}
          >
            <Text style={{ fontSize: 12, fontWeight: tab === t.key ? "700" : "400", color: tab === t.key ? "#0ea5e9" : "#94a3b8" }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}>

        {/* ── 結果 ── */}
        {tab === "summary" && (
          <>
            <ResultCard ref={cardRef} data={data} />
            <ScoreBadge rate={rate} totalHours={totalHours} workHours={workHours} />
            {/* Quick stats */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, alignItems: "center", shadowColor: "#0ea5e9", shadowOpacity: 0.07, shadowRadius: 8, elevation: 1 }}>
                <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>自由に使えるお金</Text>
                <Text style={{ color: "#10b981", fontSize: 20, fontWeight: "800" }}>¥{Math.max(freeIncome, 0).toLocaleString()}</Text>
                <Text style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>/ 月</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, alignItems: "center", shadowColor: "#0ea5e9", shadowOpacity: 0.07, shadowRadius: 8, elevation: 1 }}>
                <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>年間固定費合計</Text>
                <Text style={{ color: "#0ea5e9", fontSize: 20, fontWeight: "800" }}>¥{(totalCost * 12).toLocaleString()}</Text>
                <Text style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>/ 年</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleShare} style={{ backgroundColor: "#0ea5e9", borderRadius: 14, paddingVertical: 16, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>𝕏 でシェアする</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/")} style={{ backgroundColor: "#fff", borderRadius: 14, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: "#e0f2fe" }}>
              <Text style={{ color: "#64748b", fontSize: 15, fontWeight: "600" }}>もう一度診断する</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── グラフ ── */}
        {tab === "chart" && (
          <>
            <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 15, color: "#0f172a", marginBottom: 16 }}>収入の内訳</Text>
              <PieChart slices={[
                { label: "固定費", value: totalCost, color: "#0ea5e9" },
                { label: "自由なお金", value: Math.max(freeIncome, 0), color: "#10b981" },
              ]} />
            </View>
            {costs.length > 0 && (
              <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 15, color: "#0f172a", marginBottom: 16 }}>固定費の内訳</Text>
                <PieChart slices={costs.map((c, i) => ({ label: c.name, value: c.amount, color: COST_COLORS[i % COST_COLORS.length] }))} />
              </View>
            )}
            <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 15, color: "#0f172a", marginBottom: 16 }}>項目別・労働時間換算</Text>
              <HoursBarChart
                bars={costs.map((c, i) => ({ label: c.name, hours: calcHoursFor(c.amount, hourlyWage), color: COST_COLORS[i % COST_COLORS.length] }))}
                totalHours={workHours}
              />
            </View>
          </>
        )}

        {/* ── カレンダー ── */}
        {tab === "calendar" && (
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
            <Text style={{ fontWeight: "700", fontSize: 15, color: "#0f172a", marginBottom: 4 }}>固定費解放カレンダー</Text>
            <Text style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>水色の日が終わるまで固定費のために働いています</Text>
            <WorkCalendar totalHours={workHours} fixedCostHours={totalHours} />
            <View style={{ backgroundColor: "#f0f9ff", borderRadius: 12, padding: 16, marginTop: 20, alignItems: "center" }}>
              <Text style={{ color: "#64748b", fontSize: 13 }}>毎月</Text>
              <Text style={{ color: "#0ea5e9", fontSize: 36, fontWeight: "900", marginVertical: 4 }}>{Math.ceil(totalHours / 8)}日間</Text>
              <Text style={{ color: "#64748b", fontSize: 13 }}>固定費のためにタダ働き</Text>
            </View>
          </View>
        )}

        {/* ── 節約アドバイス ── */}
        {tab === "advice" && (
          <>
            <SavingsSimulator costs={costs} hourlyWage={hourlyWage} workHours={workHours} />

            {/* Tips */}
            <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 15, color: "#0f172a", marginBottom: 16 }}>💡 削減ヒント</Text>
              {costs.map((c, i) => {
                const tips = getTips(c.name, c.amount);
                if (!tips) return null;
                return (
                  <View key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: i < costs.length - 1 ? 1 : 0, borderBottomColor: "#f0f9ff" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text style={{ fontWeight: "700", color: "#0f172a", fontSize: 14 }}>{c.name}</Text>
                      <Text style={{ color: "#0ea5e9", fontWeight: "600", fontSize: 13 }}>¥{c.amount.toLocaleString()}</Text>
                    </View>
                    {tips.map((tip, j) => (
                      <View key={j} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                        <Text style={{ color: "#0ea5e9", fontSize: 13 }}>→</Text>
                        <Text style={{ color: "#64748b", fontSize: 13, flex: 1 }}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
              {costs.length === 0 && (
                <Text style={{ color: "#94a3b8", fontSize: 13, textAlign: "center" }}>固定費を入力するとアドバイスが表示されます</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getTips(name: string, amount: number): string[] | null {
  const n = name;
  if (n.includes("家賃") || n.includes("住居") || n.includes("家")) {
    const tips = ["収入の30%以下が理想の家賃目安です"];
    if (amount > 80000) tips.push("郊外や築古物件への引越しで大幅削減できます");
    tips.push("シェアハウスや補助金制度も検討してみましょう");
    return tips;
  }
  if (n.includes("スマホ") || n.includes("携帯") || n.includes("通信")) {
    return [
      "格安SIM（MVNO）に乗り換えで月2,000〜5,000円削減が可能",
      "自宅Wi-FiとSIMの組み合わせで最適化しましょう",
      amount > 5000 ? "現在の金額はやや高め。プランの見直しを推奨します" : null,
    ].filter(Boolean) as string[];
  }
  if (n.includes("サブスク") || n.includes("定額") || n.includes("会員")) {
    return [
      "使用頻度が低いサービスは思い切って解約を",
      "年払いプランで10〜20%オフになるサービスも多い",
      "家族や友人とのシェアプランも活用しましょう",
    ];
  }
  if (n.includes("保険")) {
    return [
      "保険の見直しは年1回が目安です",
      "ネット生保は同等保障で保険料が割安なケースが多い",
      "会社の団体保険を活用できていますか？",
    ];
  }
  if (n.includes("光熱") || n.includes("電気") || n.includes("ガス") || n.includes("水道")) {
    return [
      "電力会社・ガス会社の切り替えで年間1〜3万円節約できる場合があります",
      "電力自由化を利用して最安値プランを比較しましょう",
    ];
  }
  if (amount > 20000) {
    return [`月¥${amount.toLocaleString()}は要注意。内訳の細分化と定期的な見直しを推奨します`];
  }
  return null;
}
