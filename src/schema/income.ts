import { supabase } from '../lib/supabaseClient';

export async function addIncome({ label, amount, note }: { label: string; amount: number; note?: string }) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('User not logged in');

  const { error } = await supabase.from('income').insert([
    {
      user_id: user.id,
      label,
      amount,
      note,
    },
  ]);

  if (error) throw error;
}

export async function getIncome() {
  const { data, error } = await supabase.from('income').select('*').order('time_stamp', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchIncomePaginated(page: number, pageSize = 20) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('income')
    .select('*')
    .order('time_stamp', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
}
