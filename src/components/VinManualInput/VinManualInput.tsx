import { TextInput, Button, Stack } from '@mantine/core';
import { useState } from 'react';
import { ReactComponent as ManualIcon} from '@/icons/forms.svg?react';

type Props = {
  onSubmit: (vin: string) => void;
};

export default function VinManualInput({ onSubmit }: Props) {
  const [vin, setVin] = useState('');

  const handleSubmit = () => {
    if (vin.length === 17) onSubmit(vin);
  };

  return (
    <Stack gap="xs">
      <TextInput
        label="Enter VIN manually"
        placeholder="17-character VIN"
        value={vin}
        onChange={(e) => setVin(e.currentTarget.value.toUpperCase())}
      />
      <Button leftSection={<ManualIcon />} onClick={handleSubmit}>
        Submit VIN
      </Button>
    </Stack>
  );
}
