import {
  Text,
  Stack,
  Card,
  Flex,
  ActionIcon,
  Divider,
  Loader,
  Modal,
  Button,
  rem,
  Box,
} from '@mantine/core';
import { ReactComponent as IconEdit } from "@/icons/align-left.svg?react";
import { ReactComponent as IconTrash } from "@/icons/align-left.svg?react";

import { useIntersection, useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { fetchIncomePaginated, deleteIncomeById } from '@/api/income';
import { groupByDate } from '@/utils/groupByDate';
import { FormsEnum } from './Forms';
import { Income } from './AddIncomeForm';

export function IncomeList() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [, setFormLS] = useLocalStorage({ key: "--opened-form" });
  const [, setIncome] = useLocalStorage<Income | undefined>({ key: "--income", defaultValue: undefined });
  const [refreshFlag] = useLocalStorage({ key: '--income-refresh', defaultValue: 0 });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    // Reset everything and reload page 0
    setPage(0);
    setHasMore(true);
    setItems([]);
  }, [refreshFlag]);

  useEffect(() => {
    if (page === 0 && !loading) {
      loadMore(); // Load fresh data
    }
  }, [page]);

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
    const newItems = await fetchIncomePaginated(page);
    if (newItems.length === 0) setHasMore(false);
    setItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));
      return [...prev, ...uniqueNewItems];
    });
    setPage((p) => p + 1);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await deleteIncomeById(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setConfirmId(null);
  }

  function handleEdit(item: Income) {
    setIncome(item);
    setFormLS(FormsEnum.ADD_INCOME);
  }

  const grouped = groupByDate(items);

  return (
    <>
      <Stack gap="sm" style={{ marginBottom: "20px", paddingBottom: "50vh" }}>
        {Object.entries(grouped).map(([date, entries], index, array) => {
          const isLast = index === array.length - 1;
          const isFirst = index === 0;
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
                backgroundColor: 'var(--mantine-primary-color-0)',
                paddingBlock: '0.25rem',
                zIndex: 1,
                opacity: 0.8,
                borderBottom: "0.1rem solid var(--mantine-primary-color-4)"
              }}
                mt={isFirst ? 0 : "md"}
                mb="md"
                px="xs"
              >
                <Text
                  size="sm"
                  fw={700}
                >
                  {date}
                </Text>
              </Box>

              {/* Cards */}
              <Stack gap="xs" px="xs">
                {entries.map((item) => (
                  <Card key={item.id} shadow="sm" radius="md" padding="sm" withBorder>
                    <Flex justify="space-between" align="center">
                      <div>
                        <Text fw={500}>{item.label}</Text>
                        <Text size="sm" c="dimmed">
                          ${item.amount.toFixed(2)}
                        </Text>
                      </div>
                      <Flex gap="xs">
                        <ActionIcon variant="light" onClick={() => handleEdit(item)}>
                          <IconEdit width={18} height={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => setConfirmId(item.id)}
                        >
                          <IconTrash width={18} height={18} />
                        </ActionIcon>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
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
        <Text mb="md">Are you sure you want to delete this income entry?</Text>
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
