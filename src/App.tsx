import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { DatesProvider } from '@mantine/dates';
import { IncomeProvider } from './context/IncomeContext';
import { OutcomeProvider } from './context/OutcomeContext';
import { DebitProvider } from './context/DebitContext';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 0 }}>
        <IncomeProvider>
          <OutcomeProvider>
            <DebitProvider>
              <Router />
            </DebitProvider>
          </OutcomeProvider>
        </IncomeProvider>
      </DatesProvider>
    </MantineProvider>
  );
}
