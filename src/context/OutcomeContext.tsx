import { createContext, useContext, useState, ReactNode } from 'react';

export type Outcome = {
  id: string;
  label: string;
  amount: number;
  note?: string;
  image_url?:string;
  time_stamp: string;
};

type OutcomeContextType = {
  items: Outcome[];
  setItems: React.Dispatch<React.SetStateAction<Outcome[]>>;
};

const OutcomeContext = createContext<OutcomeContextType | undefined>(undefined);

export function OutcomeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Outcome[]>([]);

  return (
    <OutcomeContext.Provider value={{ items, setItems }}>
      {children}
    </OutcomeContext.Provider>
  );
}

export function useOutcome() {
  const context = useContext(OutcomeContext);
  if (!context) {
    throw new Error('useOutcome must be used within an OutcomeProvider');
  }
  return context;
}
