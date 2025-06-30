import { Button, Container, Title, Box, ActionIcon, Flex, Stack, Center } from '@mantine/core';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FloatingMenu } from '@/components/FloatingMenu';

export function HomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Stack w="100vw" h="100vh" bg={"var(--mantine-primary-color-0)"} p="xl" gap="xl">
      <Box>
        <Title>Welcome to the App</Title>
        <Button mt="lg" color="red" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box className='data-block' flex={1} />
      <Center>
        <FloatingMenu />
      </Center>
    </Stack>
  );
}

