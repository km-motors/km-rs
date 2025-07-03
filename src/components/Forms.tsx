import { useLocalStorage } from "@mantine/hooks"
import { FormIncome } from "./FormIncome";
import { Box, Modal } from "@mantine/core";

export enum FormsEnum {
    NONE = "none",
    ADD_INCOME = "add-income",
    ADD_OUTCOME = "add-outcome",
    ADD_DEBIT = "add-debit",
    ADD_DEBIT_PAYMENT = "add-debit-payment"
}

export function Forms() {
    const [form, setForm] = useLocalStorage({ key: "--opened-form", defaultValue: FormsEnum.NONE });
    return (
        <>
            <FormIncome />
        </>
    )
}