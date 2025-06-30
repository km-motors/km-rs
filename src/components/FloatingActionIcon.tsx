import { ActionIcon, ActionIconProps, Box } from "@mantine/core";
import { ReactComponent as IconPlus } from "@/icons/plus.svg?react";
import { iconProps } from "./FloatingMenu";

export function FloatingActionIcon(props: ActionIconProps) {
    return (
        <Box>
            <ActionIcon {...props}>
                <IconPlus {...iconProps} style={{strokeWidth:1.5}} color="var(--mantine-primary-color-0)"/>
            </ActionIcon>
        </Box>
    )
}