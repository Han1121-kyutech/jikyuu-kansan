import React, { useState } from "react";
import { View, Text } from "react-native";

interface Slice { label: string; value: number; color: string }
interface Props { slices: Slice[] }

export default function PieChart({ slices }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return null;

  // Build conic-gradient stops
  let cumPct = 0;
  const stops = slices
    .map((s) => {
      const pct = (s.value / total) * 100;
      const stop = `${s.color} ${cumPct.toFixed(2)}% ${(cumPct + pct).toFixed(2)}%`;
      cumPct += pct;
      return stop;
    })
    .join(", ");

  const gradient = `conic-gradient(${stops})`;

  return (
    <View style={{ alignItems: "center" }}>
      {/* Donut chart via conic-gradient */}
      <View style={{ position: "relative", width: 180, height: 180, marginBottom: 20 }}>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: gradient,
            position: "relative",
          }}
        />
        {/* Center hole */}
        <View
          style={{
            position: "absolute",
            top: 36, left: 36,
            width: 108, height: 108,
            borderRadius: 54,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hovered !== null ? (
            <>
              <Text style={{ color: slices[hovered].color, fontSize: 18, fontWeight: "800" }}>
                {((slices[hovered].value / total) * 100).toFixed(1)}%
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 11, textAlign: "center" }}>{slices[hovered].label}</Text>
            </>
          ) : (
            <>
              <Text style={{ color: "#0ea5e9", fontSize: 18, fontWeight: "800" }}>
                {((slices[0].value / total) * 100).toFixed(1)}%
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 11 }}>{slices[0].label}</Text>
            </>
          )}
        </View>
      </View>

      {/* Legend */}
      <View style={{ width: "100%", gap: 10 }}>
        {slices.map((s, i) => {
          const pct = (s.value / total) * 100;
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: hovered === i ? "#f0f9ff" : "transparent" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: s.color }} />
                  <Text style={{ fontSize: 14, color: "#334155" }}>{s.label}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Text style={{ fontSize: 14, color: "#0f172a", fontWeight: "600" }}>¥{s.value.toLocaleString()}</Text>
                  <Text style={{ fontSize: 13, color: s.color, fontWeight: "700", minWidth: 48, textAlign: "right" }}>{pct.toFixed(1)}%</Text>
                </View>
              </View>
            </div>
          );
        })}
      </View>
    </View>
  );
}
