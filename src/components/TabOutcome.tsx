import {
  Text,
  Stack,
  Card,
  Flex,
  ActionIcon,
  Loader,
  Modal,
  Button,
  Box,
  Divider,
  Group,
  Pill,
} from '@mantine/core';
import { ReactComponent as IconEdit } from "@/icons/align-left.svg?react";
import { ReactComponent as IconTrash } from "@/icons/align-left.svg?react";

import { useIntersection, useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { fetchOutcomePaginated, deleteOutcomeById } from '@/api/outcome';
import { groupByDate } from '@/utils/groupByDate';
import { FormsEnum } from './Forms';
import { Outcome, useOutcome } from '@/context/OutcomeContext';
import dayjs from 'dayjs';

export function OutcomeList() {
  // observer pattern
  const [, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form", defaultValue: undefined });
  const [, setEditModeItem] = useLocalStorage<Outcome | undefined>({ key: "--edit-mode-outcome-item", defaultValue: undefined });

  // context
  const { items, setItems } = useOutcome();

  // hooks
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  // init
  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [entry, hasMore, loading]);

  async function loadMore() {
    setLoading(true);
    const newItems = await fetchOutcomePaginated(page);
    if (newItems.length === 0) setHasMore(false);
    // avoid repeating items
    setItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));
      return [...prev, ...uniqueNewItems];
    });
    setPage((p) => p + 1);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await deleteOutcomeById(id);
    setItems((prev) => prev.filter((item) => item.id !== id)); // update ui without fetching
    setConfirmId(null);
  }

  function handleEdit(item: Outcome) {
    setEditModeItem(item);
    openForm();
  }

  const grouped = groupByDate(items);

  // ..
  const openForm = () => setOpenedForm(FormsEnum.ADD_OUTCOME);

  return (
    <>
      <Stack gap="0" style={{ marginBottom: "20px", paddingBottom: "50vh" }}>
        {grouped.map(({ label: date, entries }, index, array) => {
          const isFirst = index === 0;
          const isLast = index === array.length - 1;
          return (
            <div
              key={date}
              style={{
                position: 'relative'
              }}
            >
              {/* Sticky Label */}
              <Box style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--mantine-primary-color-1)',
                paddingBlock: '0.25rem',
                zIndex: 1,
                opacity: 0.8,
                borderTop: "0.1rem solid var(--mantine-primary-color-0)",
                borderBottom: "0.1rem solid var(--mantine-primary-color-0)"
              }}
                px="xs"
              >
                <Text
                  size="sm"
                  fw={700}
                  c={"var(--mantine-primary-color-8)"}
                >
                  {date}
                </Text>
              </Box>
              <Box pt="md" />

              {/* Cards */}
              <Stack gap="md" px="xs">
                {entries.map((item: Outcome) => (
                  <Card key={item.id} shadow="sm" radius="lg" padding="sm" withBorder style={{ overflow: "visible", border: "1px solid var(--mantine-primary-color-1)" }}>
                    <Pill fw={500} style={{ translate: "0% -50%", border: "1px solid var(--mantine-primary-color-1)" }} pos={"absolute"} top={0} right={0} mr={"sm"} px={"md"} c={"var(--mantine-primary-color-6)"}>{dayjs(item.time_stamp).format('hh:mm A')}</Pill>
                    <Flex justify="space-between" align="center">
                      <Stack gap={0}>
                        <Group>
                          <Text fw={500}>{item.label}</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                          ${item.amount.toFixed(2)}
                        </Text>
                      </Stack>
                      <Flex gap="xs">
                        <ActionIcon variant="light" onClick={() => handleEdit(item)}>
                          <IconEdit width={18} height={18} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="red" onClick={() => setConfirmId(item.id)}>
                          <IconTrash width={18} height={18} />
                        </ActionIcon>
                      </Flex>
                    </Flex>
                    {
                      item.note &&
                      <Box pt={"xs"}>
                        <Divider pb={"xs"} color='var(--mantine-primary-color-9)' size="xs" opacity={.2} />
                        <Flex c={"var(--mantine-primary-color-9)"} opacity={.5}>
                          {item.note}
                        </Flex>
                      </Box>

                    }
                  </Card>
                ))}
                <Box pt="xl" />
              </Stack>
            </div>
          );
        })}



        {loading &&
          <Flex justify={"center"}>
            <Loader mt="sm" />
          </Flex>
        }
        {hasMore &&
          <Flex ref={(el) => ref(el)} h={30}
            w="100%"
            bg="transparent" />
        }
        {!hasMore && !loading && (
          <Text c="dimmed" mt="md" size="sm" style={{ textAlign: "center" }}>
            No more records
          </Text>
        )}
      </Stack>

      <Modal
        opened={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Confirm Deletion"
        centered
      >
        <Text mb="md">Are you sure you want to delete this outcome entry?</Text>
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
