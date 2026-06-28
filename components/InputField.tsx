import React from "react";
import { View, Text, TextInput } from "react-native";

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  suffix?: string;
}

export default function InputField({ label, value, onChangeText, placeholder, suffix }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1.5, borderColor: "#e0f2fe" }}>
        <TextInput
          style={{ flex: 1, color: "#0f172a", fontSize: 18 }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? "0"}
          placeholderTextColor="#bae6fd"
          keyboardType="numeric"
        />
        {suffix && <Text style={{ color: "#94a3b8", marginLeft: 8 }}>{suffix}</Text>}
      </View>
    </View>
  );
}
