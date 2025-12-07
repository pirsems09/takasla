import React from "react";
import { Button } from "@ant-design/react-native";
import { useTheme } from "../hooks/useTheme";

type ThemedButtonProps = { children: React.ReactNode, onPress: () => void };

export const ThemedButton = ({ children, onPress }: ThemedButtonProps) => {
  const { colors } = useTheme();

  return (
    <Button
      type="primary"
      style={{
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        marginTop: 20,
      }}
      onPress={onPress}
    >
      {children}
    </Button>
  );
};
