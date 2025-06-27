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
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <Box mx="auto" maw={320}>
      <form onSubmit={form.onSubmit(handleLogin)}>
        <TextInput
          label="Email"
          type="email"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="sm"
          label="Password"
          {...form.getInputProps('password')}
        />
        {error && <Alert color="red" mt="sm">{error}</Alert>}
        <Button fullWidth mt="lg" type="submit" loading={loading}>
          Log In
        </Button>
      </form>
    </Box>
  );
}
