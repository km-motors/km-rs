import { useState } from 'react';
import { Container, SegmentedControl, Title, Paper } from '@mantine/core';
import VinScanner from '@/components/VinScanner/VinScanner';
import VinManualInput from '@/components/VinManualInput/VinManualInput';
import { decodeVin } from '@/utils/vinApi';
import ScanIcon from '@/icons/ScanIcon.svg?react';

export default function VinPage() {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [result, setResult] = useState<any | null>(null);

  const handleDetected = async (vin: string) => {
    try {
      const data = await decodeVin(vin);
      setResult(data);
    } catch (e) {
      alert('Failed to decode VIN');
    }
  };

  return (
    <Container>
      <Title mb="md">VIN Lookup</Title>
      <SegmentedControl
        value={mode}
        onChange={(v) => setMode(v as 'scan' | 'manual')}
        data={[
          { label: 'Scan VIN', value: 'scan' },
          { label: 'Enter Manually', value: 'manual' },
        ]}
      />
      <Paper mt="md" p="md" shadow="sm">
        {mode === 'scan' ? (
          <VinScanner onDetected={handleDetected} />
        ) : (
          <VinManualInput onSubmit={handleDetected} />
        )}
      </Paper>
      {result && (
        <Paper mt="md" p="md">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </Paper>
      )}
    </Container>
  );
}
