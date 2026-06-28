import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { calcHoursFor } from "../lib/calc";

interface CostItem { name: string; amount: number }

interface Props {
  costs: CostItem[];
  hourlyWage: number;
  workHours: number;
}

const CUTS = [10, 20, 30, 50];

export default function SavingsSimulator({ costs, hourlyWage, workHours }: Props) {
  const [cutPct, setCutPct] = useState(20);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const targetCosts = selectedIdx !== null ? [costs[selectedIdx]] : costs;
  const savedAmount = targetCosts.reduce((s, c) => s + c.amount * (cutPct / 100), 0);
  const savedHours = calcHoursFor(savedAmount, hourlyWage);
  const savedDays = savedHours / 8;
  const annualSaving = savedAmount * 12;

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#0ea5e9", shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
      <Text style={{ fontWeight: "800", fontSize: 16, color: "#0f172a", marginBottom: 4 }}>節約シミュレーター</Text>
      <Text style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>固定費を削ったら何時間分節約できる？</Text>

      {/* Cost selector */}
      <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10 }}>対象項目</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setSelectedIdx(null)}
          style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedIdx === null ? "#0ea5e9" : "#f0f9ff", borderWidth: 1, borderColor: selectedIdx === null ? "#0ea5e9" : "#e0f2fe" }}
        >
          <Text style={{ color: selectedIdx === null ? "#fff" : "#0ea5e9", fontSize: 13, fontWeight: "600" }}>全項目</Text>
        </TouchableOpacity>
        {costs.map((c, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedIdx(i)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedIdx === i ? "#0ea5e9" : "#f0f9ff", borderWidth: 1, borderColor: selectedIdx === i ? "#0ea5e9" : "#e0f2fe" }}
          >
            <Text style={{ color: selectedIdx === i ? "#fff" : "#0ea5e9", fontSize: 13, fontWeight: "600" }}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cut % selector */}
      <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10 }}>削減率</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
        {CUTS.map((pct) => (
          <TouchableOpacity
            key={pct}
            onPress={() => setCutPct(pct)}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: cutPct === pct ? "#0ea5e9" : "#f0f9ff", alignItems: "center", borderWidth: 1, borderColor: cutPct === pct ? "#0ea5e9" : "#e0f2fe" }}
          >
            <Text style={{ color: cutPct === pct ? "#fff" : "#0ea5e9", fontWeight: "700", fontSize: 14 }}>{pct}%</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Result */}
      <View style={{ backgroundColor: "#f0f9ff", borderRadius: 16, padding: 20 }}>
        <Text style={{ color: "#64748b", fontSize: 13, textAlign: "center", marginBottom: 8 }}>
          {selectedIdx !== null ? costs[selectedIdx].name : "全固定費"}を{cutPct}%削ると…
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 12 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>月の節約額</Text>
            <Text style={{ color: "#0ea5e9", fontSize: 24, fontWeight: "800" }}>¥{Math.round(savedAmount).toLocaleString()}</Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#e0f2fe" }} />
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>労働時間換算</Text>
            <Text style={{ color: "#0ea5e9", fontSize: 24, fontWeight: "800" }}>{savedHours.toFixed(1)}h</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "#0ea5e9", borderRadius: 10, padding: 12, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
            年間で ¥{Math.round(annualSaving).toLocaleString()} ・{(savedDays * 12).toFixed(0)}日分 の節約に
          </Text>
        </View>
      </View>
    </View>
  );
}
