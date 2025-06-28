import { Box, Center, Stack, Title } from '@mantine/core';
import LoginForm from '../components/LoginForm';
import { useMediaQuery } from '@mantine/hooks';

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    // window
    <Box h="100vh" w="100vw" bg="#f00">
      {/* cnter form-body */}
      <Center h="100%" bg="var(--mantine-color-blue-4)" style={{ border: "1px soild #000" }}>
        {/* form-body */}
        <Stack align='center' justify='end' pb={30} pt={100} pos={"relative"} w="500" maw="90vw"  bg="var(--mantine-color-blue-0)" style={{borderRadius:"var(--mantine-radius-lg)"}}>
          <Box pos={"absolute"} bg={"var(--mantine-color-blue-6)"} w="90%" p={30} style={{top:-30, borderRadius:"var(--mantine-radius-lg)", textAlign:"center"}}>
            <Title order={3} c={"var(--mantine-color-blue-0)"}>Login</Title>
          </Box>
          <LoginForm />
        </Stack>
      </Center>
    </Box>
  );
}
