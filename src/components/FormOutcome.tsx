import {
  Box,
  Button,
  NumberInput,
  TextInput,
  Textarea,
  Stack,
  Alert,
  Modal,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FormsEnum } from './Forms';
import { useLocalStorage } from '@mantine/hooks';
import { Outcome, useOutcome } from '@/context/OutcomeContext';

export function FormOutcome() {
  // context
  const { setItems } = useOutcome();

  // observer pattern
  const [openedFrom, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form" });
  const [editModeItem, setEditModeItem] = useLocalStorage<Outcome | undefined>({ key: "--edit-mode-outcome-item" });

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
      image_url: ''
    },
    validate: {
      label: (value) => (!value ? 'Label is required' : null),
      amount: (value) => (value <= 0 ? 'Amount must be greater than zero' : null),
    },
  });

  // update `opened` hook
  useEffect(() => {
    if (openedFrom == FormsEnum.ADD_OUTCOME) {
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
          image_url: editModeItem?.image_url ?? ''
        });
      }
      else {
        console.log("add");
        form.setValues({
          label: '',
          amount: 0,
          note: '',
          time_stamp: new Date().toISOString().slice(0, 16),
          image_url: ''
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
          .from('outcome')
          .update({
            label: values.label,
            amount: values.amount,
            note: values.note,
            time_stamp: values.time_stamp,
            image_url: values.image_url
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
      const { data: insertedOutcome, error: insertError } = await supabase
        .from('outcome')
        .insert([
          {
            user_id: user.id,
            label: values.label,
            amount: values.amount,
            note: values.note,
            time_stamp: values.time_stamp,
            image_url: values.image_url
          },
        ])
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
      } else {
        setItems((prev) => [insertedOutcome, ...prev]);
        setSuccess(true);
      }
    }
    setLoading(false);
  };

  // onClose
  const handelOnClose = () => {
    closeForm();
    clearOutcome();
    console.log("closed");
  }

  // ..
  const closeForm = () => setOpenedForm(undefined);
  const clearOutcome = () => setEditModeItem(undefined);

  return (
    <Modal
      opened={opened}
      onClose={handelOnClose}
      title={editMode ? 'Edit Outcome' : 'Add Outcome'}
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
            <Checkbox
              label="With Document"
              checked={form.values.image_url === "true"}
              onChange={(event) =>
                form.setFieldValue("image_url", event.currentTarget.checked ? "true" : "")
              }
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
            {success && <Alert color="green">Outcome {editMode ? 'updated' : 'added'} successfully!</Alert>}
            <Button
              type="submit"
              loading={loading}
              radius={"md"}
            >
              {editMode ? 'Save Changes' : 'Add Outcome'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
