import { Button, Container, Title, Box, ActionIcon, Flex, Stack, Center, Group } from '@mantine/core';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FloatingMenu } from '@/components/FloatingMenu';
import { OptionsMenu } from '@/components/OptinsMenu';
import { UserMenu } from '@/components/UserMenu';

export function HomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
    </Stack>
  );
}

