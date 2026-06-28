import React from "react";
import { View, Text } from "react-native";

// 日本の平均的な固定費率は約35%（総務省家計調査ベース）
const AVG_RATE = 35;

interface Props {
  rate: number;       // ユーザーの固定費率
  totalHours: number; // 固定費に消える時間
  workHours: number;
}

function getRank(rate: number): { label: string; color: string; bg: string; comment: string } {
  if (rate < 20) return { label: "S", color: "#0ea5e9", bg: "#e0f2fe", comment: "固定費の管理が非常に優秀です" };
  if (rate < 30) return { label: "A", color: "#06b6d4", bg: "#cffafe", comment: "平均より良い固定費率です" };
  if (rate < 40) return { label: "B", color: "#6366f1", bg: "#e0e7ff", comment: "日本の平均水準です" };
  if (rate < 50) return { label: "C", color: "#f59e0b", bg: "#fef3c7", comment: "固定費の見直しを検討しましょう" };
  return { label: "D", color: "#ef4444", bg: "#fee2e2", comment: "固定費が収入の半分を超えています" };
}

export default function ScoreBadge({ rate, totalHours, workHours }: Props) {
  const rank = getRank(rate);
  const diff = rate - AVG_RATE;
  const tadaWorkingDays = Math.ceil(totalHours / 8);

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
      {/* Rank */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: rank.bg, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "900", color: rank.color }}>{rank.label}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>固定費ランク</Text>
          <Text style={{ color: "#0f172a", fontSize: 16, fontWeight: "700", marginBottom: 2 }}>{rank.comment}</Text>
          <Text style={{ color: diff > 0 ? "#ef4444" : "#10b981", fontSize: 13, fontWeight: "600" }}>
            {diff > 0 ? `平均より ${diff.toFixed(1)}% 高い` : `平均より ${Math.abs(diff).toFixed(1)}% 低い`}
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: "#f0f9ff", marginBottom: 16 }} />

      {/* Stats */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: "#f0f9ff", borderRadius: 12, padding: 14, alignItems: "center" }}>
          <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>タダ働き日数</Text>
          <Text style={{ color: "#0ea5e9", fontSize: 24, fontWeight: "800" }}>{tadaWorkingDays}日</Text>
          <Text style={{ color: "#94a3b8", fontSize: 10, marginTop: 2, textAlign: "center" }}>毎月固定費のために</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#f0f9ff", borderRadius: 12, padding: 14, alignItems: "center" }}>
          <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>日本人平均</Text>
          <Text style={{ color: "#6b7280", fontSize: 24, fontWeight: "800" }}>{AVG_RATE}%</Text>
          <Text style={{ color: "#94a3b8", fontSize: 10, marginTop: 2, textAlign: "center" }}>固定費率（参考値）</Text>
        </View>
      </View>

      {/* Progress bar: user vs average */}
      <View style={{ marginTop: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ fontSize: 12, color: "#64748b" }}>あなた: {rate.toFixed(1)}%</Text>
          <Text style={{ fontSize: 12, color: "#94a3b8" }}>平均: {AVG_RATE}%</Text>
        </View>
        <View style={{ height: 10, backgroundColor: "#f0f9ff", borderRadius: 5, overflow: "hidden", position: "relative" }}>
          {/* Average marker */}
          <View style={{ position: "absolute", left: `${Math.min(AVG_RATE, 100)}%` as any, top: 0, bottom: 0, width: 2, backgroundColor: "#94a3b8", zIndex: 2 }} />
          {/* User bar */}
          <View style={{ height: "100%", width: `${Math.min(rate, 100)}%` as any, backgroundColor: rank.color, borderRadius: 5 }} />
        </View>
        <Text style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>
          ※総務省家計調査をもとにした参考値
        </Text>
      </View>
    </View>
  );
}
