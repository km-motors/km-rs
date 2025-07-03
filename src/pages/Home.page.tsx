import { Box, Stack, Center, Group } from '@mantine/core';

import { FloatingMenu, PAGES } from '@/components/FloatingMenu';
import { OptionsMenu } from '@/components/OptinsMenu';
import { UserMenu } from '@/components/UserMenu';
import { Forms } from '@/components/Forms';
import { IncomeList } from '@/components/IncomeTab';
import { useLocalStorage } from '@mantine/hooks';

export function HomePage() {
  const [currentPage] = useLocalStorage({ key: "--current-page" });

  return (
    <Stack w="100vw" h="100vh" bg={"var(--mantine-primary-color-0)"} pb="xl" px="0" pt="0" gap="0">
      <Group justify="space-between">
        <OptionsMenu />
        <UserMenu />
      </Group>
      <Box className='data-block' flex={1} style={{ overflow: "scroll", borderTop: "1px solid #bbb" }}>
        {currentPage == PAGES.INCOME && <IncomeList />}
      </Box>
      <Center style={{ position: "fixed", bottom: "0", left: "50%", translate: "-50% 0" }} mb={"lg"}>
        <FloatingMenu />
      </Center>
      <Forms />
    </Stack>
  );
}

