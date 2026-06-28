import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  totalHours: number;
  fixedCostHours: number;
  dailyHours?: number;
}

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function WorkCalendar({ totalHours, fixedCostHours, dailyHours = 8 }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const fixedDays = Math.ceil(fixedCostHours / dailyHours);
  const workDays = Math.ceil(totalHours / dailyHours);

  let workDayCount = 0;
  const dayStatus: ("fixed" | "free" | "weekend" | "off")[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 0 || dow === 6) {
      dayStatus.push("weekend");
    } else {
      workDayCount++;
      if (workDayCount <= fixedDays) dayStatus.push("fixed");
      else if (workDayCount <= workDays) dayStatus.push("free");
      else dayStatus.push("off");
    }
  }

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#bae6fd" }} />
          <Text style={{ fontSize: 12, color: "#64748b" }}>固定費のための労働（{fixedDays}日）</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: "#bbf7d0" }} />
          <Text style={{ fontSize: 12, color: "#64748b" }}>自分のための労働</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <TouchableOpacity onPress={prevMonth} style={{ padding: 8 }}>
          <Text style={{ color: "#0ea5e9", fontSize: 18 }}>‹</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: "700", fontSize: 16, color: "#0f172a" }}>{year}年{month + 1}月</Text>
        <TouchableOpacity onPress={nextMonth} style={{ padding: 8 }}>
          <Text style={{ color: "#0ea5e9", fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        {DAYS.map((d, i) => (
          <View key={d} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: i === 0 ? "#ef4444" : i === 6 ? "#0ea5e9" : "#94a3b8", fontWeight: "600" }}>{d}</Text>
          </View>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }, (_, week) => (
        <View key={week} style={{ flexDirection: "row", marginBottom: 2 }}>
          {cells.slice(week * 7, week * 7 + 7).map((day, col) => {
            if (day === null) return <View key={col} style={{ flex: 1, height: 34 }} />;
            const status = dayStatus[day - 1];
            const isToday = year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
            const bg = status === "fixed" ? "#bae6fd" : status === "free" ? "#bbf7d0" : "transparent";
            const textColor = col === 0 ? "#ef4444" : col === 6 ? "#0ea5e9" : "#334155";
            return (
              <View key={col} style={{ flex: 1, height: 34, alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: bg, alignItems: "center", justifyContent: "center", borderWidth: isToday ? 2 : 0, borderColor: "#0ea5e9" }}>
                  <Text style={{ fontSize: 13, color: textColor, fontWeight: isToday ? "700" : "400" }}>{day}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      <Text style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 12 }}>※平日8時間労働として計算</Text>
    </View>
  );
}
