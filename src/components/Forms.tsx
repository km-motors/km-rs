import { useLocalStorage } from "@mantine/hooks"
import { FormIncome } from "./FormIncome";
import { PAGES } from "./FloatingMenu";
import { FormOutcome } from "./FormOutcome";

export enum FormsEnum {
    NONE = "none",
    ADD_INCOME = "add-income",
    ADD_OUTCOME = "add-outcome",
    ADD_DEBIT = "add-debit",
    ADD_DEBIT_PAYMENT = "add-debit-payment"
}

export function Forms() {
    const [form, setForm] = useLocalStorage<PAGES | undefined>({ key: "--opened-form", defaultValue: undefined });
    return (
        <>
            <FormIncome />
            <FormOutcome />
        </>
    )
}