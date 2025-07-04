import { ActionIcon } from "@mantine/core";
import { ReactComponent as MenuIcon } from "@/icons/align-left.svg?react"
import { iconProps } from "./FloatingMenu";

export function OptionsMenu() {
    return (
        <ActionIcon variant="transparent" size={60}>
            <MenuIcon {...iconProps} style={{strokeWidth:1.5}} />
        </ActionIcon>
    )
}