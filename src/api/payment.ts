import { supabase } from '@/lib/supabaseClient';
import type { DebitPayment } from '@/types/DebitPayment';

export async function addDebitPayment(payment: Omit<DebitPayment, 'id' | 'time_stamp' | 'user_id'>) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Must be logged in');

    const { data, error } = await supabase
        .from('debit_payment')
        .insert([{ ...payment, user_id: user.id }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateDebitPayment(id: string, payment: Omit<DebitPayment, 'id' | 'user_id' | 'time_stamp'>) {
    const { data, error } = await supabase
        .from('debit_payment')
        .update(payment)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteDebitPayment(id: string) {
    const { error } = await supabase
        .from('debit_payment')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
