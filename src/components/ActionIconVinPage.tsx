import { ReactComponent as IconVIN } from "@/icons/scan.svg?react";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { iconProps as defaultIconProps } from "./FloatingMenu";
import { SVGProps } from "react";

export function ActionIconVinPage({ ...props }: ActionIconProps) {
    return (
        <ActionIcon {...props}>
            <IconVIN />
        </ActionIcon>
    )
}