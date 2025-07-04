import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { DatesProvider } from '@mantine/dates';
import { IncomeProvider } from './context/IncomeContext';
import { OutcomeProvider } from './context/OutcomeContext';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 0 }}>
        <IncomeProvider>
          <OutcomeProvider>
            <Router />
          </OutcomeProvider>
        </IncomeProvider>
      </DatesProvider>
    </MantineProvider>
  );
}
