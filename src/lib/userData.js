import { supabase } from './supabase';

export const loadUserData = async (key) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('user_data')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
};

export const saveUserData = async (key, value) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('user_data').upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,key' },
  );
  if (error) throw error;
};