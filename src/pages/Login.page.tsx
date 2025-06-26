import { Container, Center, Title } from '@mantine/core';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <Container h="100vh" w="100vw">
      <Center h="100%">
        <div>
          <Title order={2} mb="lg">Login</Title>
          <LoginForm />
        </div>
      </Center>
    </Container>
  );
}
