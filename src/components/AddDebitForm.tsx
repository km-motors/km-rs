import { supabase } from "@/lib/supabaseClient";
import { Box, TextInput, NumberInput, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

export function AddDebitForm() {
  const form = useForm({
    initialValues: {
      username: '',
      phone: '',
      email: '',
      amount: 0,
      date: new Date(),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await supabase.from('debit').insert({
      ...values,
      date: values.date.toISOString().split('T')[0],
    });
    form.reset();
  };

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Name" {...form.getInputProps('username')} />
        <TextInput label="Phone" mt="sm" {...form.getInputProps('phone')} />
        <TextInput label="Email" mt="sm" {...form.getInputProps('email')} />
        <NumberInput label="Amount" mt="sm" {...form.getInputProps('amount')} />
        <DateInput label="Date" mt="sm" {...form.getInputProps('date')} />
        <Button mt="md" fullWidth type="submit">Add Debit</Button>
      </form>
    </Box>
  );
}
