import { Text, TextProps } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { PAGES } from "./FloatingMenu";

export function LabelTabName(props: TextProps) {
    const [currentPage] = useLocalStorage({ key: "--current-page", defaultValue:PAGES.INCOME });
    const [tabName, setTabName] = useState<string>('');
    useEffect(() => {
        switch (currentPage) {
            case PAGES.INCOME:
                setTabName("income")
                break;
            case PAGES.OUTCOME:
                setTabName("outcome")
                break;
            case PAGES.DEBIT:
                setTabName("debit")
                break;
            case PAGES.PAYMENT:
                setTabName("debit payments")
                break;
            default:
                break;
        }
    }, [currentPage])
    return (
        <Text {...props}>{tabName}</Text>
    )
}