import { Modal, TextInput, Textarea, Button, Stack, NumberInput, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Debit } from '@/types/Debit';
import { useLocalStorage } from '@mantine/hooks';
import { FormsEnum } from './Forms';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useDebit } from '@/context/DebitContext';
import { updateDebit, addDebit } from '@/api/debit';

export function FormDebit() {
    // context
    const { setItems } = useDebit();

    // observer pattern
    const [openedFrom, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form" });
    const [editItem, setEdiItem] = useLocalStorage<Debit | undefined>({ key: "--edit-mode-debit-item" });

    // states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [opened, setOpened] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const form = useForm({
        initialValues: {
            name: editItem?.name || '',
            phone: editItem?.phone || '',
            email: editItem?.email || '',
            car: editItem?.car || '',
            address: editItem?.address || '',
            note: editItem?.note || '',
            amount: 0,
        },
        validate: {
            name: (val) => !val ? 'Name required' : null,
            amount: (value) => (value <= 0 ? 'Amount can not be zero or less' : null),
        },
    });

    // update `opened` hook
    useEffect(() => {
        if (openedFrom == FormsEnum.ADD_DEBIT) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }, [openedFrom]);

    // update `editMode` hook
    useEffect(() => {
        if (!(typeof editItem === "string" && editItem === "undefined") && typeof editItem !== "undefined") {
            setEditMode(true);
        } else {
            setEditMode(false);
        }
    }, [editItem, opened]); // opened: is important

    // onOpen
    useEffect(() => {
        if (opened) {
            form.reset();
            if (editMode) {
                form.setValues({
                    name: editItem?.name || '',
                    phone: editItem?.phone || '',
                    email: editItem?.email || '',
                    car: editItem?.car || '',
                    address: editItem?.address || '',
                    note: editItem?.note || '',
                    amount: editItem?.amount || 0,
                });
            }
            else {
                form.setValues({
                    name: '',
                    phone: '',
                    email: '',
                    car: '',
                    address: '',
                    note: '',
                    amount: 0,
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
            const timeout = setTimeout(() => closeForm(), 1000);
            return () => clearTimeout(timeout); // Cleanup
        }
    }, [success]);

    async function handleSubmit(form: Omit<Debit, 'id' | 'user_id' | 'time_stamp'>) {
        setError('');
        setSuccess(false);
        setLoading(true);
        try {
            let updatedItem: Debit;

            if (editMode) {
                if (!editItem) throw new Error('Invalid record!');
                updatedItem = await updateDebit(editItem.id, form);
                setItems((prev) => prev.map((d) => d.id === updatedItem.id ? updatedItem : d));
            } else {
                updatedItem = await addDebit(form);
                setItems((prev) => [updatedItem, ...prev]);
            }
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    // onClose
    const handelOnClose = () => {
        closeForm();
        clearDebit();
    }

    // ..
    const closeForm = () => setOpenedForm(undefined);
    const clearDebit = () => setEdiItem(undefined);

    return (
        <Modal opened={opened} onClose={handelOnClose} title={`${editItem ? 'Edit' : 'Add'} Debit`} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput label="Name" required {...form.getInputProps('name')} radius="sm"/>
                    <TextInput label="Phone" {...form.getInputProps('phone')} radius="sm"/>
                    <TextInput label="Email" {...form.getInputProps('email')} radius="sm"/>
                    <TextInput label="Car" {...form.getInputProps('car')} radius="sm"/>
                    <Textarea label="Address" {...form.getInputProps('address')} radius="sm"/>
                    <NumberInput
                        label="Amount"
                        prefix="$"
                        min={0}
                        decimalScale={2}
                        required
                        {...form.getInputProps('amount')}
                    radius="sm"/>
                    <Textarea label="Note" {...form.getInputProps('note')} radius="sm"/>
                    {error && <Alert color="red">{error}</Alert>}
                    {success && <Alert color="green">Debit {editMode ? 'updated' : 'added'} successfully!</Alert>}
                    <Button type="submit" loading={loading} disabled={success} radius="md">{editItem ? 'Save Changes' : 'Create Debit'}</Button>
                </Stack>
            </form>
        </Modal>
    );
}
