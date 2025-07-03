import { ActionIcon, ActionIconProps, CSSProperties, Group, Tooltip } from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
// + icons
import { ReactComponent as IconIncome } from "@/icons/briefcase.svg?react";
import { ReactComponent as IconIncomeFilled } from "@/icons/briefcase(1).svg?react";
import { ReactComponent as IconOutcome } from "@/icons/trolley.svg?react";
import { ReactComponent as IconOutcomeFilled } from "@/icons/trolley(1).svg?react";
import { ReactComponent as IconDebit } from "@/icons/clipboard-text.svg?react";
import { ReactComponent as IconDebitFilled } from "@/icons/clipboard-text(1).svg?react";
import { ReactComponent as IconDebitPayment } from "@/icons/receipt.svg?react";
import { ReactComponent as IconDebitPaymentFilled } from "@/icons/receipt(1).svg?react";
// - icons
import { FloatingActionIcon } from "./FloatingActionIcon";

const actionIconProps = {
    size: 60,
    radius: "xl",
    color: "var(--mantine-primary-color-0)",
    variant: "subtle",
    style: {} as CSSProperties,
} as ActionIconProps;

export const iconProps = {
    color: "var(--mantine-primary-color-6)",
    style: { strokeWidth: "1" } as CSSProperties,
    width: 30,
    height: 30
}

const actionIconGroupSectionProps = {
    w: 85,
    h: 50,
    color: "var(--mantine-primary-color-0)",
}

const tooltipProps = {
    openDelay: 1000,
    closeDelay: 100
}

enum PAGES {
    INCOME = "INCOME",
    OUTCOME = "OUTCOME",
    DEBIT = "DEBIT",
    PAYMENT = "PAYMENT"
}

export function FloatingMenu() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [currentPage, setCurrentPage] = useLocalStorage({ key: "--current-page", defaultValue: PAGES.INCOME });
    return (
        <Group style={{ border: "0.05rem solid var(--mantine-primary-color-6)", borderRadius: "var(--mantine-radius-xl)", flexWrap: "nowrap" }} pos="relative" gap={0} px={10} py={3}>
            <Tooltip label="Income" {...tooltipProps}>
                <ActionIcon {...actionIconProps} onClick={() => setCurrentPage(PAGES.INCOME)}>
                    {currentPage == PAGES.INCOME ? <IconIncomeFilled  {...iconProps} /> : <IconIncome {...iconProps} />}
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Outcome" {...tooltipProps}>
                <ActionIcon {...actionIconProps} onClick={() => setCurrentPage(PAGES.OUTCOME)}>
                    {currentPage == PAGES.OUTCOME ? < IconOutcomeFilled {...iconProps} /> : <IconOutcome {...iconProps} />}
                </ActionIcon>
            </Tooltip>
            <ActionIcon.GroupSection {...actionIconGroupSectionProps} />
            <Tooltip label="Debit" {...tooltipProps}>
                <ActionIcon {...actionIconProps} onClick={() => setCurrentPage(PAGES.DEBIT)}>
                    {currentPage == PAGES.DEBIT ? < IconDebitFilled {...iconProps} /> : <IconDebit {...iconProps} />}
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Payment" {...tooltipProps}>
                <ActionIcon {...actionIconProps} onClick={() => setCurrentPage(PAGES.PAYMENT)}>
                    {currentPage == PAGES.PAYMENT ? < IconDebitPaymentFilled {...iconProps} /> : <IconDebitPayment {...iconProps} />}
                </ActionIcon>
            </Tooltip>
            {/* postion:absolute */}
            <FloatingActionIcon {...actionIconProps} color="var(--mantine-primary-color-6)" variant="filled" />
        </Group>
    )
}