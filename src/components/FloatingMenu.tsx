import { ActionIcon, ActionIconProps, CSSProperties, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactComponent as IconOutcome } from "@/icons/credit-card-pay.svg?react";
import { ReactComponent as IconIncome } from "@/icons/credit-card-refund.svg?react";
import { ReactComponent as IconDebit } from "@/icons/wallet.svg?react";
import { ReactComponent as IconDebitPayment } from "@/icons/receipt.svg?react";
import { FloatingActionIcon } from "./FloatingActionIcon";

const actionIconProps = {
    size: 60,
    radius: "xl",
    color: "var(--mantine-primary-color-0)",
    variant:"subtle",
    style: {} as CSSProperties,
} as ActionIconProps;

const iconProps = {
    color: "var(--mantine-primary-color-6)",
    style: {strokeWidth:"1"} as CSSProperties,
    width:30,
    height:30
}

const actionIconGroupSectionProps = {
    w: 85,
    h: 50,
    color: "var(--mantine-primary-color-0)",
}

export function FloatingMenu() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    return (
        <Group style={{ border: "0.05rem solid var(--mantine-primary-color-6)", borderRadius: "var(--mantine-radius-xl)", flexWrap:"nowrap" }} pos="relative" gap={0} px={10} py={3}>
            <ActionIcon {...actionIconProps}>
                <IconIncome {...iconProps} />
            </ActionIcon>
            <ActionIcon {...actionIconProps}>
                <IconOutcome {...iconProps} />
            </ActionIcon>
            <ActionIcon.GroupSection {...actionIconGroupSectionProps} />
            <ActionIcon {...actionIconProps}>
                <IconDebit {...iconProps} />
            </ActionIcon>
            <ActionIcon {...actionIconProps}>
                <IconDebitPayment {...iconProps} />
            </ActionIcon>
            {/* postion:absolute */}
            <FloatingActionIcon {...actionIconProps} style={{ left: "50%", translate: "-50% -100%", position: "absolute" }} color="var(--mantine-primary-color-6)" variant="filled"/>
        </Group>
    )
}