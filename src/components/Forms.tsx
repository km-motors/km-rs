import { useLocalStorage } from "@mantine/hooks"
import { FormIncome } from "./FormIncome";
import { PAGES } from "./FloatingMenu";
import { FormOutcome } from "./FormOutcome";
import { FormVIN } from "./FormVIN";
import { FromIncomeReport } from "./FormIncomeReport";
import { FormDebit } from "./FormDebit";

export enum FormsEnum {
    NONE = "none",
    ADD_INCOME = "add-income",
    ADD_OUTCOME = "add-outcome",
    ADD_DEBIT = "add-debit",
    ADD_DEBIT_PAYMENT = "add-debit-payment",
    VIN = "vin",
    INCOME_REPORT = "income-report",
}

export function Forms() {
    const [form, setForm] = useLocalStorage<PAGES | undefined>({ key: "--opened-form", defaultValue: undefined });
    return (
        <>
            <FormIncome />
            <FormOutcome />
            <FormVIN />
            <FromIncomeReport />
            <FormDebit />
        </>
    )
}