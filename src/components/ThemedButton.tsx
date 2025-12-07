import React from "react";
import { useTheme } from "../hooks/useTheme";
import { Button } from 'react-native-paper';

type ThemedButtonProps = { children: React.ReactNode, onPress: () => void };

export const ThemedButton = ({ children, onPress }: ThemedButtonProps) => {
  const { colors } = useTheme();

  return (
    <Button
      mode="contained"
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
