import { supabase } from '@/lib/supabaseClient';
import type { Debit } from '@/types/Debit';

export async function fetchDebitPaginated(page = 0, pageSize = 10, search = '') {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('debit')
        .select('*')
        .order('time_stamp', { ascending: false })
        .range(from, to);

    if (search) {
        query = query.or(
            `name.ilike.*${search}*,car.ilike.*${search}*,phone.ilike.*${search}*,email.ilike.*${search}*`
        );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function addDebit(deb: Omit<Debit, 'id' | 'time_stamp' | 'user_id'>) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Must be logged in');

    const { data, error } = await supabase
        .from('debit')
        .insert([{ ...deb, user_id: user.id }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateDebit(id: string, form: Omit<Debit, 'id' | 'user_id' | 'time_stamp'>): Promise<Debit> {
    const { data, error } = await supabase
        .from('debit')
        .update(form)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}


export async function deleteDebit(id: string) {
    const { error } = await supabase.from('debit').delete().eq('id', id);
    if (error) throw error;
}
