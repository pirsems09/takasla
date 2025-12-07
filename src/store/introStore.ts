import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IntroState = {
  hasSeenIntro: boolean;
  setHasSeenIntro: (value: boolean) => Promise<void>;
  checkIntroStatus: () => Promise<void>;
};

const INTRO_STORAGE_KEY = "@takasla:hasSeenIntro";

export const useIntroStore = create<IntroState>((set) => ({
  hasSeenIntro: false,
  setHasSeenIntro: async (value: boolean) => {
    try {
      await AsyncStorage.setItem(INTRO_STORAGE_KEY, JSON.stringify(value));
      set({ hasSeenIntro: value });
    } catch (error) {
      console.error("Error saving intro status:", error);
    }
  },
  checkIntroStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(INTRO_STORAGE_KEY);
      if (value !== null) {
        set({ hasSeenIntro: JSON.parse(value) });
      }
    } catch (error) {
      console.error("Error reading intro status:", error);
    }
  },
}));

