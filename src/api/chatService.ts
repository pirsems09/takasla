import { supabase } from '@lib/supabase';
import {
  mapMessage,
  mapThread,
  type Message,
  type MessageRow,
  type ProfileRow,
  type Thread,
  type ThreadRow,
} from './types';

/** Kullanıcının tüm sohbet thread'lerini getirir (diğer katılımcı profiliyle). */
export const fetchThreads = async (currentUserId: string): Promise<Thread[]> => {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .or(`participant_a.eq.${currentUserId},participant_b.eq.${currentUserId}`)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  console.log('[chatService] fetchThreads: success, count:', (data as ThreadRow[]).length);
  const rows = (data as ThreadRow[]) ?? [];
  if (rows.length === 0) return [];

  const otherIds = rows.map((r) =>
    r.participant_a === currentUserId ? r.participant_b : r.participant_a
  );
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .in('id', otherIds);
  if (pErr) throw pErr;
  console.log('[chatService] fetchThreads: profiles fetched, count:', (profiles as ProfileRow[]).length);
  const profileMap = new Map<string, ProfileRow>(
    (profiles as ProfileRow[]).map((p) => [p.id, p])
  );

  return rows
    .map((r) => {
      const otherId =
        r.participant_a === currentUserId ? r.participant_b : r.participant_a;
      const other = profileMap.get(otherId);
      if (!other) return null;
      return mapThread(r, other);
    })
    .filter((t): t is Thread => t !== null);
};

/** Bir thread'in tüm mesajlarını getirir. */
export const fetchMessages = async (
  threadId: string,
  currentUserId: string
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  console.log('[chatService] fetchMessages: success, threadId:', threadId, 'count:', (data as MessageRow[]).length);
  return (data as MessageRow[]).map((m) => mapMessage(m, currentUserId));
};

/** Bir thread'e mesaj gönderir ve thread'in last_message/updated_at günceller. */
export const sendMessage = async (
  threadId: string,
  text: string
): Promise<Message> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Mesaj göndermek için giriş yapmalısınız.');
  const { data, error } = await supabase
    .from('messages')
    .insert({ thread_id: threadId, sender_id: user.id, text })
    .select()
    .single();
  if (error) throw error;
  console.log('[chatService] sendMessage: message inserted, threadId:', threadId);
  await supabase
    .from('threads')
    .update({ last_message: text, updated_at: new Date().toISOString() })
    .eq('id', threadId);
  console.log('[chatService] sendMessage: thread updated, threadId:', threadId);
  return mapMessage(data as MessageRow, user.id);
};

/** İki kullanıcı arasında thread oluşturur; varsa mevcut id'yi döndürür. */
export const getOrCreateThread = async (
  otherUserId: string,
  listingId?: string
): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Sohbet başlatmak için giriş yapmalısınız.');

  const { data: a } = await supabase
    .from('threads')
    .select('id')
    .eq('participant_a', user.id)
    .eq('participant_b', otherUserId)
    .limit(1);
  if (a && a.length > 0) {
    console.log('[chatService] getOrCreateThread: existing thread (a-b):', (a[0] as { id: string }).id);
    return (a[0] as { id: string }).id;
  }

  const { data: b } = await supabase
    .from('threads')
    .select('id')
    .eq('participant_a', otherUserId)
    .eq('participant_b', user.id)
    .limit(1);
  if (b && b.length > 0) {
    console.log('[chatService] getOrCreateThread: existing thread (b-a):', (b[0] as { id: string }).id);
    return (b[0] as { id: string }).id;
  }

  const { data, error } = await supabase
    .from('threads')
    .insert({
      participant_a: user.id,
      participant_b: otherUserId,
      listing_id: listingId ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  console.log('[chatService] getOrCreateThread: new thread created:', (data as ThreadRow).id);
  return (data as ThreadRow).id;
};
