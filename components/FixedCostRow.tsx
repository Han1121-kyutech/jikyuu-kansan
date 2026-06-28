import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

export interface CostItem {
  id: string;
  name: string;
  amount: string;
}

interface Props {
  item: CostItem;
  onChange: (id: string, field: "name" | "amount", value: string) => void;
  onRemove: (id: string) => void;
}

export default function FixedCostRow({ item, onChange, onRemove }: Props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 }}>
      <TextInput
        value={item.name}
        onChangeText={(v) => onChange(item.id, "name", v)}
        placeholder="項目名"
        placeholderTextColor="#bae6fd"
        style={{ flex: 1, backgroundColor: "#fff", color: "#0f172a", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, borderWidth: 1.5, borderColor: "#e0f2fe" }}
      />
      <TextInput
        value={item.amount}
        onChangeText={(v) => onChange(item.id, "amount", v)}
        placeholder="金額"
        placeholderTextColor="#bae6fd"
        keyboardType="numeric"
        style={{ width: 110, backgroundColor: "#fff", color: "#0f172a", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, borderWidth: 1.5, borderColor: "#e0f2fe" }}
      />
      <TouchableOpacity onPress={() => onRemove(item.id)} style={{ padding: 8 }}>
        <Text style={{ color: "#0ea5e9", fontSize: 20, lineHeight: 22 }}>×</Text>
      </TouchableOpacity>
    </View>
  );
}
