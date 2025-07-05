import { Debit } from '@/types/Debit';
import { createContext, useContext, useState, ReactNode } from 'react';

type DebitContextType = {
  items: Debit[];
  setItems: React.Dispatch<React.SetStateAction<Debit[]>>;
};

const DebitContext = createContext<DebitContextType | undefined>(undefined);

export function DebitProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Debit[]>([]);

  return (
    <DebitContext.Provider value={{ items, setItems }}>
      {children}
    </DebitContext.Provider>
  );
}

export function useDebit() {
  const context = useContext(DebitContext);
  if (!context) {
    throw new Error('useDebit must be used within an DebitProvider');
  }
  return context;
}
