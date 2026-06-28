import React, { useEffect, useRef } from "react";
import { Animated, Text, TextStyle } from "react-native";

interface Props {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: TextStyle;
}

export default function AnimatedNumber({ value, duration = 1200, prefix = "", suffix = "", decimals = 0, style }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const displayRef = useRef("0");
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  useEffect(() => {
    anim.setValue(0);
    const listener = anim.addListener(({ value: v }) => {
      displayRef.current = v.toFixed(decimals);
      forceUpdate();
    });
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(listener);
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{Number(displayRef.current).toLocaleString("ja-JP", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </Text>
  );
}
