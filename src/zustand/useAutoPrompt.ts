import { create } from "zustand";

interface AutoPromptStore {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const useAutoPrompt = create<AutoPromptStore>((set) => ({
  prompt: "",

  setPrompt: (prompt: string) =>
    set({
      prompt,
    }),
}));