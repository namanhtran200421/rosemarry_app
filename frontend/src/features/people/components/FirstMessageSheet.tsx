import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { brut } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { BottomSheet } from "../../../shared/ui/BottomSheet";
import { Icon } from "../../../shared/ui/Icon";
import { InlineInput } from "../../../shared/ui/InlineInput";

interface FirstMessageSheetProps {
  visible: boolean;
  firstName: string;
  onClose: () => void;
  onSend: (text: string) => void;
}

/** Compose a first impression before the two people have matched. */
export function FirstMessageSheet({
  visible,
  firstName,
  onClose,
  onSend,
}: FirstMessageSheetProps) {
  const [text, setText] = useState("");
  const trimmed = text.trim();

  function close(): void {
    setText("");
    onClose();
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      title="Send your message"
      subtitle={`Make a great first impression with ${firstName}.`}
    >
      <View style={styles.body}>
        <InlineInput
          accessibilityLabel={`Message to ${firstName}`}
          autoFocus
          fill={brut.white}
          multiline
          onChangeText={setText}
          placeholder="Say something nice…"
          value={text}
        />
        <AppButton
          disabled={!trimmed}
          label="Send"
          leadingIcon={<Icon name="Send" size={18} />}
          onPress={() => {
            onSend(trimmed);
            setText("");
          }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 14,
  },
});
