import {
    Button, Modal, NumberInput, Textarea, Stack, Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import type { DebitPayment } from '@/types/DebitPayment';
import { updateDebitPayment, addDebitPayment } from '@/api/payment';
import { type } from 'os';
import { title } from 'process';

type Props = {
    opened: boolean;
    onClose: () => void;
    onSave: (p: DebitPayment) => void;
    debitId: string;
    editItem?: DebitPayment;
};

export function DebitPaymentForm({ opened, onClose, onSave, debitId, editItem }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm({
        initialValues: {
            amount: 0,
            note: '',
        },

        validate: {
            amount: (v) => (v <= 0 ? 'Amount must be greater than 0' : null),
        },
    });

    useEffect(() => {
        if (editItem) {
            form.setValues({
                amount: editItem.amount,
                note: editItem.note || '',
            });
        } else {
            form.reset();
        }
    }, [editItem]);

    const handleSubmit = async (values: typeof form.values) => {
        setError('');
        setLoading(true);
        try {
            let saved: DebitPayment;
            if (editItem) {
                saved = await updateDebitPayment(editItem.id, { ...values, debit_id: debitId });
            } else {
                saved = await addDebitPayment({ ...values, debit_id: debitId });
            }
            onSave(saved);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title={editItem ? 'Edit Payment' : 'Add Payment'} >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <NumberInput
                        label="Amount"
                        required
                        min={0}
                        decimalScale={2}
                        {...form.getInputProps('amount')}
                    />
                    < Textarea label="Note" autosize {...form.getInputProps('note')} />
                    {error && <Alert color="red" > {error} </Alert>}
                    <Button type="submit" loading={loading} >
                        {editItem ? 'Update' : 'Add'} Payment
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
