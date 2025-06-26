import { Button, Container, Title } from '@mantine/core';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Container>
      <Title>Welcome to the App</Title>
      <Button mt="lg" color="red" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}
