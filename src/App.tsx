import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { DatesProvider } from '@mantine/dates';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 0 }}>
        <Router />
      </DatesProvider>
    </MantineProvider>
  );
}
