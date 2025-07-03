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
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { FormsEnum } from './Forms';
import { useLocalStorage } from '@mantine/hooks';

export function AddIncomeForm() {
  const form = useForm({
    initialValues: {
      label: '',
      amount: 0,
      note: '',
      time_stamp: new Date().toISOString().slice(0, 16), // default to now
    },

    validate: {
      label: (value) => (!value ? 'Label is required' : null),
      amount: (value) => (value <= 0 ? 'Amount must be greater than zero' : null),
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formLS, setFormLS] = useLocalStorage({ key: "--opened-form", defaultValue: FormsEnum.NONE });

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

    const { error: insertError } = await supabase.from('income').insert([
      {
        user_id: user.id,
        label: values.label,
        amount: values.amount,
        note: values.note,
        time_stamp: values.time_stamp,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true);
      form.reset();
      form.setFieldValue('time_stamp', new Date().toISOString().slice(0, 16)); // reset time
    }

    setLoading(false);
  };

  return (
    <Modal opened={formLS != FormsEnum.NONE} onClose={() => setFormLS(FormsEnum.NONE)} title="Authentication">
      <Box maw={400} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Label"
              placeholder="Income Record Name"
              required
              {...form.getInputProps('label')}
            />

            <NumberInput
              label="Amount"
              prefix="$"
              min={0}
              decimalScale={2}
              required
              {...form.getInputProps('amount')}
            />

            <TextInput
              label="Date & Time"
              type="datetime-local"
              required
              {...form.getInputProps('time_stamp')}
            />

            <Textarea
              label="Note"
              placeholder="Optional note"
              autosize
              minRows={2}
              {...form.getInputProps('note')}
            />

            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Income added successfully!</Alert>}

            <Button type="submit" loading={loading}>
              Add Income
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
