import { Box, Button, TextInput, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { supabase } from '../lib/supabaseClient';
import { DateInput } from '@mantine/dates';

export function AddIncomeForm({ table }: { table: 'income' | 'outcome' }) {
  const form = useForm({
    initialValues: {
      label: '',
      amount: 0,
      date: new Date(),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await supabase.from(table).insert({
      ...values,
      date: values.date.toISOString().split('T')[0],
    });
    form.reset();
  };

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Label" {...form.getInputProps('label')} />
        <NumberInput label="Amount" mt="sm" {...form.getInputProps('amount')} />
        <DateInput label="Date" mt="sm" {...form.getInputProps('date')} />
        <Button mt="md" fullWidth type="submit">Add</Button>
      </form>
    </Box>
  );
}
