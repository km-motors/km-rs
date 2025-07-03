import { createContext, useContext, useState, ReactNode } from 'react';

export type Income = {
  id: string;
  label: string;
  amount: number;
  note?: string;
  time_stamp: string;
};

type IncomeContextType = {
  items: Income[];
  setItems: React.Dispatch<React.SetStateAction<Income[]>>;
};

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Income[]>([]);

  return (
    <IncomeContext.Provider value={{ items, setItems }}>
      {children}
    </IncomeContext.Provider>
  );
}

export function useIncome() {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
}
