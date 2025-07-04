import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, Alert } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    const { email, password } = form.values;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    else {
      navigate('/home');
    }

    setLoading(false);
  };

  return (
    <Box mx="auto" w="80%">
      <form onSubmit={form.onSubmit(handleLogin)}>
        <TextInput
          label="Email"
          type="email"
          {...form.getInputProps('email')}
          style={{color:"var(--mantine-color-blue-3)"}}
        />
        <PasswordInput
          mt="sm"
          label="Password"
          {...form.getInputProps('password')}
          style={{color:"var(--mantine-color-blue-3)"}}
        />
        {error && <Alert color="red" styles={{message:{color:"var(--mantine-color-red-6)"}}} mt="sm">{error}</Alert>}
        <Button fullWidth mt="lg" type="submit" loading={loading} variant="subtle" color="var(--mantine-color-blue-6)">
          GET STARTED
        </Button>
      </form>
    </Box>
  );
}
