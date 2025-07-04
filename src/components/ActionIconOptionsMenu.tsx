import { ActionIcon, ActionIconProps } from "@mantine/core";
import { ReactComponent as MenuIcon } from "@/icons/align-left.svg?react"
import { iconProps } from "./FloatingMenu";

export function ActionIconOptionsMenu(props: ActionIconProps) {
    return (
        <ActionIcon {...props}>
            <MenuIcon />
        </ActionIcon>
    )
}