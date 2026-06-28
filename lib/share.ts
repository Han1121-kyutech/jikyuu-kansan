import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { RefObject } from "react";
import { View } from "react-native";

export const shareResultCard = async (
  ref: RefObject<View>,
  text: string
): Promise<void> => {
  try {
    const uri = await captureRef(ref, {
      format: "png",
      quality: 1,
    });
    const available = await Sharing.isAvailableAsync();
    if (available) {
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: text,
      });
    }
  } catch (e) {
    console.error("Share failed", e);
  }
};
