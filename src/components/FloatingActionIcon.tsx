import { ActionIcon, ActionIconProps, Box, Flex, FlexProps, MantineStyleProp, Stack, Transition, TransitionProps } from "@mantine/core";
import { ReactComponent as IconPlus } from "@/icons/plus.svg?react";
import { ReactComponent as IconIncome } from "@/icons/briefcase.svg?react";
import { ReactComponent as IconOutcome } from "@/icons/trolley.svg?react";
import { ReactComponent as IconDebit } from "@/icons/clipboard-text.svg?react";
import { ReactComponent as IconDebitPayment } from "@/icons/receipt.svg?react";
import { iconProps } from "./FloatingMenu";
import { useClickOutside, useDisclosure } from "@mantine/hooks";

const enterDelayactor = 100;

export function FloatingActionIcon(props: ActionIconProps) {
    const [opened, { close, toggle }] = useDisclosure(true);
    const ref = useClickOutside(() => close());
    return (
        <Box ref={ref} style={{ position: "absolute", top: "0%", left: "50%", translate: "-50% -50%" }} w={60} h={60}>
            <Stack style={{ position: "absolute", bottom: "100%", left: "50%", translate: "-50% 0%", pointerEvents: "none" }} mb={20} align="center">
                <PopupActionIcon mounted={opened} enterDelay={enterDelayactor * 0} Icon={IconIncome} onClick={() => close()} />
                <PopupActionIcon mounted={opened} enterDelay={enterDelayactor * 1} Icon={IconOutcome} onClick={() => close()} />
                <PopupActionIcon mounted={opened} enterDelay={enterDelayactor * 2} Icon={IconDebit} onClick={() => close()} />
                <PopupActionIcon mounted={opened} enterDelay={enterDelayactor * 3} Icon={IconDebitPayment} onClick={() => close()} />
            </Stack>
            <ActionIcon {...props} onClick={toggle}>
                <IconPlus {...iconProps} style={{ strokeWidth: 1.5 }} color="var(--mantine-primary-color-0)" />
            </ActionIcon>
        </Box>
    )
}

const defaultPopupActionIconProps = {
    size: 50,
    radius: "xl",
    pos: "absolute",
    style: { left: "50%", top: "50%", translate: "-50% -50%", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", pointerEvents: "all" }
} as ActionIconProps;


const defaultPopupFlexProps = {
    pos: "relative",
    w: defaultPopupActionIconProps.size,
    h: defaultPopupActionIconProps.size,
    style: { border: "0px solid #bbb" },
    align: "center",
    justify: "center"
} as FlexProps;

const defaultPopupTransitionProps = {
    transition: "pop",
    timingFunction: "ease",
    duration: 200,
    enterDelay: 50,
} as TransitionProps;

function PopupActionIcon({ onClick, mounted, duration, enterDelay, Icon }: { onClick?: () => any, mounted: boolean, duration?: number, enterDelay?: number, Icon?: React.FC<React.SVGProps<SVGSVGElement>> }) {
    return (
        <Flex {...defaultPopupFlexProps}>
            <Transition
                {...defaultPopupTransitionProps}
                duration={duration}
                enterDelay={enterDelay}
                mounted={mounted}
            >
                {
                    (transitionStyle) => (
                        <ActionIcon {...defaultPopupActionIconProps} style={{ ...transitionStyle, ...defaultPopupActionIconProps.style }} onClick={() => onClick?.()}>
                            {Icon && <Icon {...iconProps} style={{ strokeWidth: 1.5 }} color="var(--mantine-primary-color-0)" />}
                        </ActionIcon>
                    )
                }
            </Transition>
        </Flex>
    )
}