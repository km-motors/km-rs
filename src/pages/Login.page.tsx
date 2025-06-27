import { Box, Center, Title } from '@mantine/core';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <Box h="100vh" w="100vw" bg="#f00">
      <Center h="100%">
          <LoginForm />
      </Center>
    </Box>
  );
}
