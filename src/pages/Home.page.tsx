import { Box, Stack, Center, Group } from '@mantine/core';

import { FloatingMenu } from '@/components/FloatingMenu';
import { OptionsMenu } from '@/components/OptinsMenu';
import { UserMenu } from '@/components/UserMenu';
import { Forms } from '@/components/Forms';

export function HomePage() {


  return (
    <Stack w="100vw" h="100vh" bg={"var(--mantine-primary-color-0)"} pb="xl" px="0" pt="0" gap="xl">
      <Group justify="space-between">
        <OptionsMenu />
        <UserMenu />
      </Group>
      <Box className='data-block' flex={1} />
      <Center>
        <FloatingMenu />
      </Center>
      <Forms />
    </Stack>
  );
}

