import { useEffect, useState } from 'react';
import { ActionIcon, Alert, Box, Button, Card, Center, Divider, Flex, Group, Modal, Pill, Stack, Text, Title } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { fetchPaymentsByDebitId } from '@/api/payments';
import dayjs from 'dayjs';
import { Debit } from '@/types/Debit';
import { ContactIconsRow } from './TabDebit';
import { ReactComponent as IconOptions } from "@/icons/dots-vertical.svg?react"
import { ReactComponent as IconEdit } from "@/icons/align-left.svg?react";
import { ReactComponent as IconTrash } from "@/icons/align-left.svg?react";
import { ReactComponent as IconClose } from "@/icons/x.svg?react";
import { ReactComponent as IconNotes } from "@/icons/quote.svg?react";
import { ReactComponent as IconDebits } from "@/icons/clipboard-text.svg?react";
import { serialize } from '@/utils/des';
import { DebitPayment } from '@/types/DebitPayment';
import { DebitPaymentForm } from './FormDebitPayment';
import { deleteDebitPayment } from '@/api/payment';

export function DebitPaymentsList() {
    const [paymentsItem, setPaymentsItem] = useLocalStorage<Debit | undefined>({
        key: '--debit-payments-item',
        defaultValue: undefined,
        serialize: serialize
    });

    const [payments, setPayments] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNotes, { toggle: toggleShowNotes }] = useDisclosure(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<DebitPayment | undefined>(undefined);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    useEffect(() => {
        if (!paymentsItem || paymentsItem.amount === undefined) return;

        setLoading(true);
        fetchPaymentsByDebitId(paymentsItem.id)
            .then(setPayments)
            .catch((err) => setError(err.message || 'Failed to fetch payments'))
            .finally(() => setLoading(false));
    }, [paymentsItem]);

    async function handleDelete(id: string) {
        await deleteDebitPayment(id);
        setPayments((prev) => prev.filter(item => item.id !== id));
        setConfirmId(null);
    }
    return (
        <Box>
            <Box pt="lg" pb="xs" px="xs" style={{ backgroundColor: "var(--mantine-primary-color-1)" }}>
                {(paymentsItem && paymentsItem.amount !== undefined) ?
                    <>
                        <Card key={paymentsItem.id} shadow="sm" radius="lg" padding="sm" withBorder style={{ overflow: "visible", border: "1px solid var(--mantine-primary-color-1)" }}>
                            {/* absolute:top */}
                            <Group pos={"absolute"} top={0} right={0} gap="xs" style={{ translate: "0% -50%" }} mr={-8}>
                                <ActionIcon variant='light' size={22} radius="xl" aria-label='debit options menu'>
                                    <IconEdit width={15} height={15} />
                                </ActionIcon>
                                <ActionIcon variant='light' size={22} radius="xl" aria-label='debit options menu' color='red'>
                                    <IconTrash width={15} height={15} />
                                </ActionIcon>
                                <Pill fw={500} c={"var(--mantine-primary-color-6)"} style={{ border: "1px solid var(--mantine-primary-color-1)" }}>{dayjs(paymentsItem.time_stamp).format('MM/DD/YYYY')}</Pill>
                                <ActionIcon variant='filled' size={22} radius="xl" color="red" style={{ border: "1px solid var(--mantine-primary-color-1)" }} onClick={() => setPaymentsItem(undefined)}>
                                    <IconClose width={15} height={15} />
                                </ActionIcon>
                            </Group>
                            {/* absolute:bottom */}
                            <Group gap={0} justify="space-between">
                                <Stack gap="0">
                                    <Flex justify="space-between">
                                        <Text fw={500}>{paymentsItem.name}</Text>
                                    </Flex>
                                    <Text size="sm" c="dimmed">
                                        ${paymentsItem.amount.toFixed(2)}
                                    </Text>
                                </Stack>
                                <Stack gap="xs">
                                    <Group gap="xs" pos="relative" style={{ border: "1px solid #bbb0" }}>
                                        <ActionIcon variant='light' size={24} w={100} radius="xl" aria-label='add payment to this debit' color='yellow' onClick={() => {
                                            setEditItem(undefined);
                                            setFormOpen(true);
                                        }}>
                                            <Text style={{ textWrap: "nowrap" }} fz="xs">New Payment</Text>
                                        </ActionIcon>
                                        <ActionIcon variant='light' size={24} radius="xl" aria-label='toggle debit notes' onClick={toggleShowNotes}>
                                            <IconNotes width={12} height={12} />
                                        </ActionIcon>
                                        <ActionIcon variant='light' size={24} radius="xl" aria-label='choose another debit'>
                                            <IconDebits width={12} height={12} />
                                        </ActionIcon>
                                    </Group>
                                </Stack>
                            </Group>
                            {(showNotes && paymentsItem.note) &&
                                <Box pt={"xs"}>
                                    <Divider pb={"xs"} color='var(--mantine-primary-color-9)' size="xs" opacity={.2} />
                                    <Flex c={"var(--mantine-primary-color-9)"} opacity={.5}>
                                        {paymentsItem.note}
                                    </Flex>
                                </Box>
                            }
                            {
                                (paymentsItem.car || paymentsItem.phone || paymentsItem.email || paymentsItem.address) &&
                                <>
                                    <Divider mt={"xs"} />
                                    <ContactIconsRow d={paymentsItem} />
                                </>

                            }
                        </Card>
                        <DebitPaymentForm
                            opened={formOpen}
                            onClose={() => setFormOpen(false)}
                            onSave={(saved) => {
                                setPayments((prev) =>
                                    editItem
                                        ? prev.map(p => p.id === saved.id ? saved : p)
                                        : [saved, ...prev]
                                );
                            }}
                            debitId={paymentsItem!.id}
                            editItem={editItem}
                        />
                    </> :
                    <Center pb={"xs"} c={"dimmed"}>No Debit Selected!</Center>
                }
            </Box>
            <Stack gap="sm" mt="md" mx={"sm"}>
                {error && <Alert color="red">{error}</Alert>}

                {payments.length === 0 ? (
                    <Text>No payments recorded.</Text>
                ) : (
                    payments.map((p) => (
                        <Card key={p.id}>
                            <Group justify="space-between">
                                <div>
                                    <Text>${p.amount.toFixed(2)}</Text>
                                    <Text size="xs" c="dimmed">{dayjs(p.time_stamp).format('YYYY-MM-DD hh:mm A')}</Text>
                                    {p.note && <Text size="sm">{p.note}</Text>}
                                </div>
                                <Group>
                                    <ActionIcon size="md" variant='light' onClick={() => {
                                        setEditItem(p);
                                        setFormOpen(true);
                                    }}>
                                        <IconEdit width={18} height={18} />
                                    </ActionIcon>
                                    <ActionIcon size="md" color="red" variant='light' onClick={() => setConfirmId(p.id)}>
                                        <IconTrash width={18} height={18} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Card>
                    ))
                )}
            </Stack>
            <Modal
                opened={!!confirmId}
                onClose={() => setConfirmId(null)}
                title="Confirm Deletion"
                centered
            >
                <Text mb="md">Are you sure you want to delete this payment entry?</Text>
                <Flex justify="flex-end" gap="sm">
                    <Button variant="default" onClick={() => setConfirmId(null)}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={() => handleDelete(confirmId!)}>
                        Delete
                    </Button>
                </Flex>
            </Modal>
        </Box>
    );
}
