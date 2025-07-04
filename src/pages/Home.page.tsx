import { Box, Stack, Center, Group } from '@mantine/core';

import { FloatingMenu, iconProps, PAGES } from '@/components/FloatingMenu';
import { ActionIconOptionsMenu } from '@/components/ActionIconOptionsMenu';
import { ActionIconUserMenu } from '@/components/ActionIconUserMenu';
import { Forms } from '@/components/Forms';
import { IncomeList } from '@/components/TabIncome';
import { useLocalStorage } from '@mantine/hooks';
import { TabName } from '@/components/TabName';
import { ActionIconVinPage } from '@/components/ActionIconVinPage';
import { OutcomeList } from '@/components/TabOutcome';


export function HomePage() {
  const [currentPage] = useLocalStorage({ key: "--current-page", defaultValue:PAGES.INCOME });

  return (
    <Stack w="100vw" h="100vh" bg={"var(--mantine-primary-color-0)"} gap="0">
      <Group justify="space-between" px="md" py="sm">
        <Group gap='xs'>
          <ActionIconOptionsMenu variant="transparent" size={30} styles={{ icon: { strokeWidth: 2 } }} />
          <TabName style={{ textTransform: "capitalize" }} fz={"h3"} c={"var(--mantine-primary-color-6)"} pt={2} />
        </Group>
        <Group gap="xs">
          <ActionIconVinPage variant="transparent" size={30} styles={{ icon: { strokeWidth: 2 } }} />
          <ActionIconUserMenu variant="transparent" size={30} styles={{ icon: { strokeWidth: 3 } }} />
        </Group>
      </Group>
      <Box className='data-block' flex={1} style={{ overflow: "scroll", borderTop: "0.1rem solid var(--mantine-primary-color-4)" }}>
        {currentPage == PAGES.INCOME && <IncomeList />}
        {currentPage == PAGES.OUTCOME && <OutcomeList />}
      </Box>
      <Center style={{ position: "fixed", bottom: "0", left: "50%", translate: "-50% 0", zIndex: 2 }} mb={"lg"}>
        <FloatingMenu />
      </Center>
      <Forms />
    </Stack>
  );
}

