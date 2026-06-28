import React, { forwardRef } from "react";
import { View, Text } from "react-native";
import { calcHoursFor, getCopyText } from "../lib/calc";
import AnimatedNumber from "./AnimatedNumber";

export interface ResultData {
  hourlyWage: number;
  workHours: number;
  income: number;
  costs: { name: string; amount: number }[];
  totalCost: number;
  totalHours: number;
  rate: number;
}

function getRankLabel(rate: number) {
  if (rate < 20) return { label: "S", color: "#0ea5e9" };
  if (rate < 30) return { label: "A", color: "#06b6d4" };
  if (rate < 40) return { label: "B", color: "#6366f1" };
  if (rate < 50) return { label: "C", color: "#f59e0b" };
  return { label: "D", color: "#ef4444" };
}

interface Props { data: ResultData }

const ResultCard = forwardRef<View, Props>(({ data }, ref) => {
  const { hourlyWage, workHours, costs, totalCost, totalHours, rate } = data;
  const copy = getCopyText(rate);
  const rank = getRankLabel(rate);
  const tadaDays = Math.ceil(totalHours / 8);

  return (
    <View ref={ref} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, marginHorizontal: 4, shadowColor: "#0ea5e9", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
      {/* Top row: rank + headline */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <View>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 2 }}>実質時給</Text>
          <AnimatedNumber
            value={Math.round(hourlyWage)}
            prefix="¥"
            suffix=" / h"
            style={{ color: "#0ea5e9", fontSize: 36, fontWeight: "900", letterSpacing: -1 }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#f0f9ff", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: rank.color }}>
            <Text style={{ fontSize: 26, fontWeight: "900", color: rank.color }}>{rank.label}</Text>
          </View>
          <Text style={{ color: "#94a3b8", fontSize: 10, marginTop: 4 }}>固定費ランク</Text>
        </View>
      </View>

      {/* Emotional hook */}
      <View style={{ backgroundColor: "#f0f9ff", borderRadius: 12, padding: 14, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 28 }}>📅</Text>
        <View>
          <Text style={{ color: "#0f172a", fontSize: 14, fontWeight: "700" }}>
            毎月 <Text style={{ color: "#0ea5e9", fontSize: 20 }}>{tadaDays}日間</Text> タダ働き
          </Text>
          <Text style={{ color: "#64748b", fontSize: 12 }}>その後やっと自分のための労働になります</Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: "#e0f2fe", marginBottom: 16 }} />

      {/* Cost breakdown */}
      <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 10, letterSpacing: 1 }}>固定費の内訳</Text>
      {costs.map((c, i) => {
        const hours = calcHoursFor(c.amount, hourlyWage);
        return (
          <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ color: "#334155", fontSize: 14 }}>{c.name}</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "#0f172a", fontSize: 14, fontWeight: "600" }}>¥{c.amount.toLocaleString()}</Text>
              <Text style={{ color: "#0ea5e9", fontSize: 11 }}>{hours.toFixed(1)}時間分</Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: 1, backgroundColor: "#e0f2fe", marginVertical: 14 }} />

      {/* Total + rate */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <View>
          <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>合計固定費</Text>
          <Text style={{ color: "#0f172a", fontSize: 20, fontWeight: "800" }}>¥{totalCost.toLocaleString()}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>{totalHours.toFixed(1)}時間分</Text>
          <AnimatedNumber
            value={parseFloat(rate.toFixed(1))}
            suffix="%"
            decimals={1}
            style={{ color: "#0ea5e9", fontSize: 28, fontWeight: "900" }}
          />
        </View>
      </View>

      {/* Copy */}
      <View style={{ backgroundColor: "#0ea5e9", borderRadius: 12, padding: 14, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 13, marginBottom: 2 }}>月{workHours}時間働いて</Text>
        <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>{copy}</Text>
      </View>

      <Text style={{ color: "#cbd5e1", fontSize: 10, textAlign: "center", marginTop: 14 }}>
        #手取り診断 #個人開発
      </Text>
    </View>
  );
});

ResultCard.displayName = "ResultCard";
export default ResultCard;
