import {
  Box,
  Button,
  NumberInput,
  TextInput,
  Textarea,
  Stack,
  Alert,
  Modal,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FormsEnum } from './Forms';
import { useLocalStorage } from '@mantine/hooks';

export type Income = {
  id: string;
  label: string;
  amount: number;
  note?: string;
  time_stamp: string;
};

export function AddIncomeForm() {
  const [formLS, setFormLS] = useLocalStorage({ key: "--opened-form", defaultValue: FormsEnum.NONE });
  const [income, setIncome] = useLocalStorage<Income | undefined>({ key: "--income", defaultValue: undefined });

  const form = useForm({
    initialValues: {
      label: '',
      amount: 0,
      note: '',
      time_stamp: new Date().toISOString().slice(0, 16),
    },

    validate: {
      label: (value) => (!value ? 'Label is required' : null),
      amount: (value) => (value <= 0 ? 'Amount must be greater than zero' : null),
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 👇 If editing, load data into form
  useEffect(() => {
    if (income) {
      form.setValues({
        label: income?.label,
        amount: income?.amount,
        note: income?.note ?? '',
        time_stamp: income?.time_stamp?.slice(0, 16),
      });
    }
  }, [income]);

  useEffect(()=>{
    if(success){
      setFormLS(FormsEnum.NONE);
    }
  },[success]);

  const handleSubmit = async (values: typeof form.values) => {
    setError('');
    setSuccess(false);
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    if (income) {
      // ✏️ Update existing income
      const { error: updateError } = await supabase
        .from('income')
        .update({
          label: values.label,
          amount: values.amount,
          note: values.note,
          time_stamp: values.time_stamp,
        })
        .eq('id', income.id);

      if (updateError) setError(updateError.message);
      else setSuccess(true);
    } else {
      // ➕ Insert new income
      const { error: insertError } = await supabase.from('income').insert([
        {
          user_id: user.id,
          label: values.label,
          amount: values.amount,
          note: values.note,
          time_stamp: values.time_stamp,
        },
      ]);

      if (insertError) setError(insertError.message);
      else {
        setSuccess(true);
        form.reset();
        form.setFieldValue('time_stamp', new Date().toISOString().slice(0, 16));
      }
    }

    setLoading(false);
  };

  const handelOnClose = () => {
    setFormLS(FormsEnum.NONE)
    setIncome(undefined);
    form.reset();
    // fill with date.now
    form.setFieldValue('time_stamp', new Date().toISOString().slice(0, 16));
  }

  return (
    <Modal
      opened={formLS !== FormsEnum.NONE}
      onClose={handelOnClose}
      title={income ? 'Edit Income' : 'Add Income'}
    >
      <Box maw={400} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Label" required {...form.getInputProps('label')} />
            <NumberInput label="Amount" prefix="$" min={0} decimalScale={2} required {...form.getInputProps('amount')} />
            <TextInput label="Date & Time" type="datetime-local" required {...form.getInputProps('time_stamp')} />
            <Textarea label="Note" placeholder="Optional note" autosize minRows={2} {...form.getInputProps('note')} />
            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Income {income ? 'updated' : 'added'} successfully!</Alert>}
            <Button type="submit" loading={loading}>{income ? 'Save Changes' : 'Add Income'}</Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
