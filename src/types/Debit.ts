export type Debit = {
    id: string;
    user_id: string;
    time_stamp: string;
    name: string;
    phone?: string;
    email?: string;
    car?: string;
    address?: string;
    amount: number,
    note?: string;
};