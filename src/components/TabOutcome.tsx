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
  CopyButton,
} from '@mantine/core';
import { ReactComponent as IconEdit } from "@/icons/align-left.svg?react";
import { ReactComponent as IconTrash } from "@/icons/align-left.svg?react";
import { ReactComponent as IconCheck } from "@/icons/check.svg?react";
import { ReactComponent as IconCopy } from "@/icons/copy.svg?react";

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
                        <ReceiptIdentifier item={item} />
                        <ActionIcon variant="light" onClick={() => handleEdit(item)}>
                          <IconEdit width={18} height={18} />
                        </ActionIcon>
                        <ActionIcon variant="light" onClick={() => setConfirmId(item.id)} color="red">
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


export function ReceiptIdentifier({ item }: { item: Outcome }) {
  const [opened, setOpened] = useState(false);

  // Format timestamp into ID: dd-mm-yyyy-hh-mm-ss-ms
  const identifier = dayjs(item.time_stamp).format('DD-MM-YYYY-HH-mm-ss-SSS');

  return (
    <>
      {(item.image_url === 'true') && (
        <ActionIcon
          variant="light"
          color="yellow"
          onClick={() => setOpened(true)}
        >
          <IconEdit width={18} height={18} />
        </ActionIcon>
      )}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Receipt Identifier"
        radius="md"
        centered
      >
        <Stack align="center" gap="md">
          <Text size="sm" ta="center" c="dimmed">
            Write this identifier on the back of the document to easily look it up later:
          </Text>
          <Text fw={700} size="lg" ta="center">
            {identifier}
          </Text>

          <CopyButton value={identifier}>
            {({ copied, copy }) => (
              <Button
                onClick={copy}
                leftSection={copied ? <IconCheck width={16} height={16} /> : <IconCopy width={16} height={16} />}
                color={copied ? 'teal' : 'blue'}
                variant="light"
              >
                {copied ? 'Copied' : 'Copy Identifier'}
              </Button>
            )}
          </CopyButton>
        </Stack>
      </Modal>
    </>
  );
}
