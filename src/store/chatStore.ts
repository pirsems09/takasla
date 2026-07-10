import { create } from "zustand";
import {
  fetchThreads as apiFetchThreads,
  fetchMessages as apiFetchMessages,
  sendMessage as apiSendMessage,
  getOrCreateThread as apiGetOrCreateThread,
} from "@api/chatService";
import { mapMessage, type Message, type MessageRow, type Thread } from "@api/types";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "./authStore";

/**
 * Chat store — async + realtime.
 *
 * `fetchThreads` / `fetchMessages` service'i çağırır; `subscribeToThread`
 * Supabase Realtime channel kurarak yeni mesajları canlı ekler (optimistik
 * gönderme + gelen mesajı dedupe eder). `currentUserId` authStore'dan okunur.
 */
type ChatState = {
  threads: Thread[];
  threadsLoading: boolean;
  threadsError: string | null;
  messages: Record<string, Message[]>;
  messagesLoading: boolean;
  messagesError: string | null;
  activeThread: string | null;
  fetchThreads: () => Promise<void>;
  fetchMessages: (threadId: string) => Promise<void>;
  sendMessage: (threadId: string, text: string) => Promise<void>;
  setActiveThread: (threadId: string | null) => void;
  subscribeToThread: (threadId: string) => () => void;
  startChat: (otherUserId: string, listingId?: string) => Promise<string | null>;
  reset: () => void;
};

const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Beklenmeyen bir hata oluştu.";

export const useChatStore = create<ChatState>((set) => ({
  threads: [],
  threadsLoading: false,
  threadsError: null,
  messages: {},
  messagesLoading: false,
  messagesError: null,
  activeThread: null,

  fetchThreads: async () => {
    const me = useAuthStore.getState().userId;
    if (!me) {
      set({ threads: [] });
      return;
    }
    set({ threadsLoading: true, threadsError: null });
    try {
      const threads = await apiFetchThreads(me);
      console.log('[chatStore] fetchThreads: success, count:', threads.length);
      set({ threads, threadsLoading: false });
    } catch (e) {
      set({ threadsLoading: false, threadsError: toMessage(e) });
    }
  },

  fetchMessages: async (threadId) => {
    const me = useAuthStore.getState().userId;
    if (!me) return;
    set({ messagesLoading: true, messagesError: null });
    try {
      const msgs = await apiFetchMessages(threadId, me);
      console.log('[chatStore] fetchMessages: success, threadId:', threadId, 'count:', msgs.length);
      set((state) => ({
        messages: { ...state.messages, [threadId]: msgs },
        messagesLoading: false,
      }));
    } catch (e) {
      set({ messagesLoading: false, messagesError: toMessage(e) });
    }
  },

  sendMessage: async (threadId, text) => {
    const me = useAuthStore.getState().userId;
    if (!me) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    // optimistik: hemen ekle
    const optimistic: Message = {
      id: `local-${Date.now()}`,
      from: "me",
      text: trimmed,
      time: "",
      threadId,
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [threadId]: [...(state.messages[threadId] ?? []), optimistic],
      },
    }));
    try {
      const real = await apiSendMessage(threadId, trimmed);
      console.log('[chatStore] sendMessage: success, threadId:', threadId);
      set((state) => {
        const list = (state.messages[threadId] ?? []).filter(
          (m) => m.id !== optimistic.id
        );
        return { messages: { ...state.messages, [threadId]: [...list, real] } };
      });
    } catch (e) {
      // optimistik mesajı geri al
      set((state) => {
        const list = (state.messages[threadId] ?? []).filter(
          (m) => m.id !== optimistic.id
        );
        return {
          messages: { ...state.messages, [threadId]: list },
          messagesError: toMessage(e),
        };
      });
    }
  },

  setActiveThread: (threadId) => set({ activeThread: threadId }),

  startChat: async (otherUserId, listingId) => {
    if (!useAuthStore.getState().isAuthenticated) return null;
    try {
      const threadId = await apiGetOrCreateThread(otherUserId, listingId);
      console.log('[chatStore] startChat: success, threadId:', threadId);
      return threadId;
    } catch (e) {
      set({ messagesError: toMessage(e) });
      return null;
    }
  },

  subscribeToThread: (threadId) => {
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const me = useAuthStore.getState().userId;
          if (!me) return;
          const row = payload.new as MessageRow;
          const msg = mapMessage(row, me);
          console.log('[chatStore] subscribeToThread: new message received, threadId:', threadId);
          set((state) => {
            const existing = state.messages[threadId] ?? [];
            if (existing.some((m) => m.id === msg.id)) return {};
            return {
              messages: { ...state.messages, [threadId]: [...existing, msg] },
            };
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },

  reset: () =>
    set({
      threads: [],
      messages: {},
      threadsError: null,
      messagesError: null,
      activeThread: null,
    }),
}));