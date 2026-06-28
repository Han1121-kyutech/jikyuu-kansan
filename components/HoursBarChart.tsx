import React from "react";
import { View, Text } from "react-native";

interface Bar { label: string; hours: number; color: string }
interface Props { bars: Bar[]; totalHours: number }

export default function HoursBarChart({ bars, totalHours }: Props) {
  return (
    <View>
      <Text style={{ color: "#64748b", fontSize: 12, marginBottom: 12, letterSpacing: 0.5 }}>
        月{totalHours}時間のうち何時間が固定費？
      </Text>
      {bars.map((bar, i) => {
        const pct = Math.min(bar.hours / totalHours, 1);
        return (
          <View key={i} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 13, color: "#334155" }}>{bar.label}</Text>
              <Text style={{ fontSize: 13, color: bar.color, fontWeight: "600" }}>{bar.hours.toFixed(1)}h</Text>
            </View>
            <View style={{ height: 10, backgroundColor: "#f0f9ff", borderRadius: 5, overflow: "hidden" }}>
              <View style={{ height: "100%", width: `${pct * 100}%`, backgroundColor: bar.color, borderRadius: 5 }} />
            </View>
          </View>
        );
      })}
      {(() => {
        const usedHours = bars.reduce((s, b) => s + b.hours, 0);
        const freeHours = Math.max(totalHours - usedHours, 0);
        return (
          <View style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 13, color: "#334155" }}>残り（自分のため）</Text>
              <Text style={{ fontSize: 13, color: "#10b981", fontWeight: "600" }}>{freeHours.toFixed(1)}h</Text>
            </View>
            <View style={{ height: 10, backgroundColor: "#f0f9ff", borderRadius: 5, overflow: "hidden" }}>
              <View style={{ height: "100%", width: `${(freeHours / totalHours) * 100}%`, backgroundColor: "#10b981", borderRadius: 5 }} />
            </View>
          </View>
        );
      })()}
    </View>
  );
}
