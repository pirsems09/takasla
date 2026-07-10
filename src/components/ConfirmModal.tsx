import React from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Button } from "react-native-paper";
import { useTheme } from "../hooks/useTheme";
import { useModalStore, type ModalButton } from "../store/modalStore";
import { ThemedText } from "./ThemedText";

/**
 * ConfirmModal — global, theme-aware confirmation modal.
 *
 * Mounted once at the app root (see `App.tsx`); any screen can trigger it
 * via `useModalStore().showModal({ ... })`. Supports a title, an optional
 * description, and up to two optional buttons.
 */
const ConfirmModal = () => {
  const { colors } = useTheme();
  const visible = useModalStore((s) => s.visible);
  const title = useModalStore((s) => s.title);
  const description = useModalStore((s) => s.description);
  const buttons = useModalStore((s) => s.buttons);
  const hideModal = useModalStore((s) => s.hideModal);

  const handlePress = (btn: ModalButton) => {
    btn.onPress?.();
    hideModal();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.surface },
        ]}
        dismissable
      >
        <ThemedText style={styles.title}>{title}</ThemedText>

        {description ? (
          <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </ThemedText>
        ) : null}

        {buttons && buttons.length > 0 ? (
          <View style={styles.buttonRow}>
            {buttons.map((btn, index) => {
              const mode = btn.mode ?? "contained";
              return (
                <Button
                  key={index}
                  mode={mode}
                  onPress={() => handlePress(btn)}
                  textColor={mode === "outlined" ? colors.text : undefined}
                  style={[
                    styles.button,
                    mode === "contained"
                      ? { backgroundColor: colors.primary }
                      : { borderColor: colors.border },
                  ]}
                >
                  {btn.text}
                </Button>
              );
            })}
          </View>
        ) : null}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
  },
  button: {
    minWidth: 96,
  },
});

export default ConfirmModal;