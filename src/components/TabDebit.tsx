import {
    Box, Stack, Card, Flex, ActionIcon, Loader, Button,
    TextInput, Text,
    Modal
} from '@mantine/core';
import { ReactComponent as IconPlus } from "@/icons/plus.svg?react";
import { ReactComponent as IconEdit } from "@/icons/plus.svg?react";
import { ReactComponent as IconTrash } from "@/icons/plus.svg?react";
import { useIntersection, useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import {
    fetchDebitPaginated, addDebit, updateDebit, deleteDebit
} from '@/api/debit';
import type { Debit } from '@/types/Debit';
import { useDebit } from '@/context/DebitContext';
import { FormsEnum } from './Forms';

export function DebitList() {
    // observer pattern
    const [, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form", defaultValue: undefined });
    const [, setEditItem] = useLocalStorage<Debit | undefined>({ key: "--edit-mode-debit-item", defaultValue: undefined });

    const { items, setItems } = useDebit();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const { ref, entry } = useIntersection({ root: null, threshold: 1 });

    useEffect(() => {
        (async () => {
            await resetAndLoad();
        })();
    }, [debouncedSearch]);
    useEffect(() => {
        if (entry?.isIntersecting && hasMore && !loading) loadMore();
    }, [entry, hasMore, loading]);

    async function resetAndLoad() {
        setItems([]); setPage(0); setHasMore(true);
        await loadMore(true);
    }

    async function loadMore(isNewSearch = false) {
        setLoading(true);
        const result = await fetchDebitPaginated(isNewSearch ? 0 : page, 10, debouncedSearch);
        if (result.length < 10) setHasMore(false);
        setItems((prev) => isNewSearch ? result : [...prev, ...result]);
        setPage((prev) => prev + 1);
        setLoading(false);
    }

    function openAdd() { setEditItem(undefined); openForm(); }
    function openEdit(item: Debit) { setEditItem(item); openForm(); }

    async function handleDelete(id: string) {
        await deleteDebit(id);
        setItems((prev) => prev.filter((d) => d.id !== id));
        setConfirmId(null);
    }

    // ..
    const openForm = () => setOpenedForm(FormsEnum.ADD_DEBIT);
    return (
        <>
            <Box>
                <Flex mb="sm">
                    <TextInput placeholder="Search..." value={search} onChange={(e) => setSearch(e.currentTarget.value)} style={{ flex: 1 }} />
                    <Button ml="sm" leftSection={<IconPlus />} onClick={openAdd}>Add Customer</Button>
                </Flex>
                <Stack>
                    {items.filter(Boolean).map((d) => (
                        <Card key={d.id} withBorder shadow="sm" radius="md">
                            <Flex justify="space-between" align="center">
                                <Box>
                                    <strong>{d.name}</strong><br />
                                    <span>{d.car} • {d.phone}</span>
                                    <Text size="sm" c="dimmed">Amount: ${d.amount}</Text>
                                </Box>
                                <Flex gap="xs">
                                    <ActionIcon onClick={() => openEdit(d)}><IconEdit width={18} height={18} /></ActionIcon>
                                    <ActionIcon color="red" onClick={() => setConfirmId(d.id)}><IconTrash width={18} height={18} /></ActionIcon>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                    {loading && <Loader />}
                    {hasMore && <div ref={(el) => ref(el)} style={{ height: 1 }} />}
                </Stack>
            </Box>

            <Modal
                opened={!!confirmId}
                onClose={() => setConfirmId(null)}
                title="Confirm Deletion"
                centered
            >
                <Text mb="md">Are you sure you want to delete this debit entry?</Text>
                <Flex justify="flex-end" gap="sm">
                    <Button variant="default" onClick={() => setConfirmId(null)}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={() => handleDelete(confirmId!)}>
                        Delete
                    </Button>
                </Flex>
            </Modal>
        </>
    );
}
