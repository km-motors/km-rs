export type DebitPayment = {
    id: string;
    time_stamp: string;      // ISO string (e.g., "2025-07-08T13:24:00Z")
    user_id: string | null;
    debit_id: string | null;
    amount: number;
    note?: string | null;
};
