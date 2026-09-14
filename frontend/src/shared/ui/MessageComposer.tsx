import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { brut, colors, drop, radii } from "../theme/tokens";

import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { InlineInput } from "./InlineInput";

interface MessageComposerProps {
  placeholder: string;
  onSend: (text: string) => void;
  /** Adds the yellow photo button before the field. */
  onAddPhoto?: () => void;
}

/** Thread input bar: optional photo action, pill field and send button. */
export function MessageComposer({
  placeholder,
  onSend,
  onAddPhoto,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  function send(): void {
    if (!canSend) {
      return;
    }
    onSend(text.trim());
    setText("");
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.bar}>
      <View style={styles.row}>
        {onAddPhoto ? (
          <IconButton
            accessibilityLabel="Add photo"
            onPress={onAddPhoto}
            rounded="circle"
            variant="yellow"
          >
            <Icon name="Camera" size={20} />
          </IconButton>
        ) : null}
        <InlineInput
          accessibilityLabel={placeholder}
          fill={brut.paper}
          onChangeText={setText}
          onSubmitEditing={send}
          placeholder={placeholder}
          returnKeyType="send"
          shape="pill"
          style={styles.field}
          value={text}
        />
        <Pressable
          accessibilityLabel="Send"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          onPress={send}
          style={[
            styles.send,
            {
              backgroundColor: canSend ? colors.primary : brut.disabled,
              boxShadow: drop(canSend ? 3 : 0),
            },
          ]}
        >
          <Icon name="Send" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: brut.white,
    borderTopWidth: brut.border,
    borderTopColor: brut.ink,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  field: {
    flex: 1,
    minWidth: 0,
  },
  send: {
    width: 46,
    height: 46,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    alignItems: "center",
    justifyContent: "center",
  },
});
