import { ActionIcon, ActionIconProps } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactComponent as IconOutcome } from "@/icons/credit-card-pay.svg?react";
import { ReactComponent as IconIncome } from "@/icons/credit-card-refund.svg?react";
import { ReactComponent as IconDebit } from "@/icons/wallet.svg?react";
import { ReactComponent as IconDebitPayment } from "@/icons/receipt.svg?react";

const actionIconProps = {
    size: 60,
    radius: "xl"
} as ActionIconProps;

export function FloatingMenu() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    return (
        <ActionIcon.Group>
            <ActionIcon {...actionIconProps}>
                <IconIncome />
            </ActionIcon>
            <ActionIcon {...actionIconProps}>
                <IconOutcome />
            </ActionIcon>
            <ActionIcon.GroupSection w={60} h={60}/>
            <ActionIcon.GroupSection w={60} h={60}/>
            <ActionIcon {...actionIconProps}>
                <IconDebit />
            </ActionIcon>
            <ActionIcon {...actionIconProps}>
                <IconDebitPayment />
            </ActionIcon>
        </ActionIcon.Group>
    )
}