import { supabase } from "@/lib/supabaseClient";
import { Box, NumberInput, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

export function AddDebitPaymentForm({ debitId }: { debitId: string }) {
  const form = useForm({
    initialValues: {
      amount: 0,
      date: new Date(),
    },
  });

  const handleSubmit = async () => {
    await supabase.from('debit_payment').insert({
      debit_id: debitId,
      amount: form.values.amount,
      date: form.values.date.toISOString().split('T')[0],
    });
    form.reset();
  };

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput label="Amount" {...form.getInputProps('amount')} />
        <DateInput label="Date" mt="sm" {...form.getInputProps('date')} />
        <Button mt="md" fullWidth type="submit">Add Payment</Button>
      </form>
    </Box>
  );
}
