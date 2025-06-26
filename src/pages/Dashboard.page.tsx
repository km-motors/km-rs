import {
  Container,
  Tabs,
  Title,
  rem,
  Center,
} from '@mantine/core';
import { ReactComponent as IconCash } from '../icons/cash.svg?react';
import { ReactComponent as IconCreditCard } from '../icons/credit-card.svg?react';
import { ReactComponent as IconUser } from '../icons/user.svg?react';
import { ReactComponent as IconCoin } from '../icons/coin.svg?react';
import { AddIncomeForm } from '../components/AddIncomeForm';
import { AddDebitForm } from '../components/AddDebitForm';
import { AddDebitPaymentForm } from '../components/AddDebitPaymentForm';

export function DashboardPage() {
  // Replace with selected debitId when implementing payment tracking
  const fakeDebitId = '00000000-0000-0000-0000-000000000000';

  return (
    <Container p="sm">
      <Title order={3} ta="center" mb="md">
        Dashboard
      </Title>

      <Tabs variant="outline" radius="md" defaultValue="income">
        <Tabs.List grow>
          <Tabs.Tab value="income" leftSection={<IconCash style={{ width: rem(16), height: rem(16) }} />}>
            Income
          </Tabs.Tab>
          <Tabs.Tab value="outcome" leftSection={<IconCreditCard style={{ width: rem(16), height: rem(16) }} />}>
            Outcome
          </Tabs.Tab>
          <Tabs.Tab value="debit" leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}>
            Debit
          </Tabs.Tab>
          <Tabs.Tab value="payment" leftSection={<IconCoin style={{ width: rem(16), height: rem(16) }} />}>
            Payment
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="income" pt="md">
          <AddIncomeForm table="income" />
        </Tabs.Panel>

        <Tabs.Panel value="outcome" pt="md">
          <AddIncomeForm table="outcome" />
        </Tabs.Panel>

        <Tabs.Panel value="debit" pt="md">
          <AddDebitForm />
        </Tabs.Panel>

        <Tabs.Panel value="payment" pt="md">
          <AddDebitPaymentForm debitId={fakeDebitId} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
