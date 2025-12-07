import React from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

type ThemedTextProps = TextProps & { style?: StyleProp<TextStyle> };
type ThemedTextInputProps = TextInputProps & { style?: StyleProp<TextStyle> };

export const ThemedText = ({ style, ...props }: ThemedTextProps) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[{ color: colors.text }, style]}
      {...props}
    />
  );
};

export const ThemedTextInput = ({ style, ...props }: ThemedTextInputProps) => {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        {
          color: colors.text,
          backgroundColor: colors.background,
          borderColor: colors.primary,
          borderWidth: 1,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 12,
        },
        style,
      ]}
      placeholderTextColor={colors.text}
      {...props}
    />
  );
};
