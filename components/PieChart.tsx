import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

interface Slice { label: string; value: number; color: string }
interface Props { slices: Slice[] }

export default function PieChart({ slices }: Props) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return null;

  const size = 180;
  const r = 62;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = slices.map((s) => {
    const dash = (s.value / total) * circumference;
    const seg = { ...s, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${cx},${cy}`}>
          {segments.map((seg, i) => (
            <Circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
              strokeWidth={36}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset} />
          ))}
        </G>
        <SvgText x={cx} y={cy - 8} textAnchor="middle" fontSize="12" fill="#94a3b8">
          {slices[0]?.label}
        </SvgText>
        <SvgText x={cx} y={cy + 14} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0ea5e9">
          {((slices[0]?.value / total) * 100).toFixed(1)}%
        </SvgText>
      </Svg>

      <View style={{ width: "100%", gap: 8, marginTop: 4 }}>
        {slices.map((s, i) => {
          const pct = (s.value / total) * 100;
          return (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4, paddingHorizontal: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: s.color }} />
                <Text style={{ fontSize: 14, color: "#334155" }}>{s.label}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Text style={{ fontSize: 14, color: "#0f172a", fontWeight: "600" }}>¥{s.value.toLocaleString()}</Text>
                <Text style={{ fontSize: 13, color: s.color, fontWeight: "700", minWidth: 48, textAlign: "right" }}>{pct.toFixed(1)}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
