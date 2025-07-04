import {
  Box,
  Button,
  NumberInput,
  TextInput,
  Textarea,
  Stack,
  Alert,
  Modal,
  Pill,
  Text,
  Flex,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FormsEnum } from './Forms';
import { useLocalStorage } from '@mantine/hooks';
import { Income, useIncome } from '@/context/IncomeContext';

export function FormIncome() {
  // context
  const { setItems } = useIncome();

  // observer pattern
  const [openedFrom, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form" });
  const [editModeItem, setEditModeItem] = useLocalStorage<Income | undefined>({ key: "--edit-mode-income-item" });

  // states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // form
  const form = useForm({
    mode: 'uncontrolled',
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

  // update `opened` hook
  useEffect(() => {
    if (openedFrom == FormsEnum.ADD_INCOME) {
      setOpened(true);
    } else {
      setOpened(false);
    }
  }, [openedFrom]);

  // update `editMode` hook
  useEffect(() => {
    if (!(typeof editModeItem === "string" && editModeItem === "undefined") && typeof editModeItem !== "undefined") {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  }, [editModeItem, opened]); // opened: is important

  // onOpen
  useEffect(() => {
    if (opened) {
      console.log("opened");

      form.reset();
      if (editMode) {
        console.log("edit");
        form.setValues({
          label: editModeItem?.label,
          amount: editModeItem?.amount,
          note: editModeItem?.note ?? '',
          time_stamp: editModeItem?.time_stamp?.slice(0, 16),
        });
      }
      else {
        console.log("add");
        form.setValues({
          label: '',
          amount: 0,
          note: '',
          time_stamp: new Date().toISOString().slice(0, 16),
        });
      }
      // always clear states
      setSuccess(false);
      setError('');
    }
  }, [opened]);

  // onSuccess
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

    if (editMode) {
      if (editModeItem) {
        const { error: updateError } = await supabase
          .from('income')
          .update({
            label: values.label,
            amount: values.amount,
            note: values.note,
            time_stamp: values.time_stamp,
          })
          .eq('id', editModeItem.id);

        if (updateError) {
          setError(updateError.message);
        } else {
          setItems((prev) =>
            prev.map((item) =>
              item.id === editModeItem.id
                ? { ...item, ...values }
                : item
            )
          );
          setSuccess(true);
        };
      } else {
        setError("Invalid Record!");
      }
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

  // onClose
  const handelOnClose = () => {
    closeForm();
    clearIncome();
    console.log("closed");
  }

  // ..
  const closeForm = () => setOpenedForm(undefined);
  const clearIncome = () => setEditModeItem(undefined);

  return (
    <Modal
      opened={opened}
      onClose={handelOnClose}
      title={editMode ? 'Edit Income' : 'Add Income'}
      radius={"md"}
      styles={{ title: { fontSize: "1.1rem", fontWeight: "bold", color: "var(--mantine-primary-color-8)" } }}
    >
      <Box maw={400} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Label"
              required
              radius={"sm"}
              {...form.getInputProps('label')}
            />
            <NumberInput
              label="Amount"
              prefix="$"
              min={0}
              decimalScale={2}
              required
              radius={"sm"}
              {...form.getInputProps('amount')}
            />
            <TextInput
              label="Date & Time"
              type="datetime-local"
              required
              radius={"sm"}
              {...form.getInputProps('time_stamp')}
            />
            <Textarea
              label="Note"
              placeholder="Optional note"
              autosize
              minRows={6}
              radius={"sm"}
              {...form.getInputProps('note')}
            />
            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">Income {editMode ? 'updated' : 'added'} successfully!</Alert>}
            <Button
              type="submit"
              loading={loading}
              radius={"md"}
            >
              {editMode ? 'Save Changes' : 'Add Income'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
