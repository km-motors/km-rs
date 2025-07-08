// services/payments.ts
import { supabase } from '@/lib/supabaseClient';

export async function fetchPaymentsByDebitId(debitId: string) {
  const { data, error } = await supabase
    .from('debit_payment')
    .select('*')
    .eq('debit_id', debitId)
    .order('time_stamp', { ascending: false });

  if (error) throw error;
  return data;
}
