import { useEffect } from 'react';
import VinScanner from './VinScanner';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof VinScanner> = {
  title: 'Components/VinScanner',
  component: VinScanner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof VinScanner>;

export const Default: Story = {
  args: {
    onDetected: (vin: string) => {
      alert(`Detected VIN: ${vin}`);
    },
  },
};