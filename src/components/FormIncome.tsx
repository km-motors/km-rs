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
import { Income, useIncome } from '@/context/IncomeContext';

export function FormIncome() {
  // context
  const { items, setItems } = useIncome();

  // observer pattern
  const [openedFrom, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form" });
  const [editModeIncomeItem, setEditModeIncomeItem] = useLocalStorage<Income | undefined>({ key: "--edit-mode-income-item" });

  // states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // form
  const form = useForm({
    initialValues: {
      label: '',
      amount: 0,
      note: '',
      time_stamp: '',
    },
    validate: {
      label: (value) => (!value ? 'Label is required' : null),
      amount: (value) => (value <= 0 ? 'Amount must be greater than zero' : null),
    },
  });

  // edit-mode: when income in localstorage
  useEffect(() => {
    if (editModeIncomeItem) {
      form.setValues({
        label: editModeIncomeItem?.label,
        amount: editModeIncomeItem?.amount,
        note: editModeIncomeItem?.note ?? '',
        time_stamp: editModeIncomeItem?.time_stamp?.slice(0, 16),
      });
    }
  }, [editModeIncomeItem]);

  // onOpen
  useEffect(() => {
    if (openedFrom == FormsEnum.ADD_INCOME) {
      if (!editModeIncomeItem) {
        form.reset();
        form.setFieldValue('time_stamp', new Date().toISOString().slice(0, 16));
      }
      // always clear states
      setSuccess(false);
      setError('');
    }
  }, [openedFrom]);

  useEffect(() => {
    if (success) {
      closeForm();
    }
  }, [success]);

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

    if (editModeIncomeItem) {
      const { error: updateError } = await supabase
        .from('income')
        .update({
          label: values.label,
          amount: values.amount,
          note: values.note,
          time_stamp: values.time_stamp,
        })
        .eq('id', editModeIncomeItem.id);

      if (updateError) {
        setError(updateError.message);
      } else {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editModeIncomeItem.id
              ? { ...item, ...values }
              : item
          )
        );
        setSuccess(true)
      };
    } else {
      const { data: insertedIncome, error: insertError } = await supabase
        .from('income')
        .insert([
          {
            user_id: user.id,
            label: values.label,
            amount: values.amount,
            note: values.note,
            time_stamp: values.time_stamp,
          },
        ])
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
      } else {
        setItems((prev) => [insertedIncome, ...prev]);
        setSuccess(true);
      }
    }
    setLoading(false);
  };

  const handelOnClose = () => {
    closeForm();
    clearIncome();
  }

  // ..
  const closeForm = () => setOpenedForm(undefined);
  const clearIncome = () => setEditModeIncomeItem(undefined);

  return (
    <Modal
      opened={openedFrom == FormsEnum.ADD_INCOME}
      onClose={handelOnClose}
      title={editModeIncomeItem ? 'Edit Income' : 'Add Income'}
    >
      <Box maw={400} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Label" required {...form.getInputProps('label')} />
            <NumberInput label="Amount" prefix="$" min={0} decimalScale={2} required {...form.getInputProps('amount')} />
            <TextInput label="Date & Time" type="datetime-local" required {...form.getInputProps('time_stamp')} />
            <Textarea label="Note" placeholder="Optional note" autosize minRows={2} {...form.getInputProps('note')} />
            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Income {editModeIncomeItem ? 'updated' : 'added'} successfully!</Alert>}
            <Button type="submit" loading={loading}>{editModeIncomeItem ? 'Save Changes' : 'Add Income'}</Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
