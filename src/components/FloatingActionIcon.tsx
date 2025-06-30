import { ActionIcon, ActionIconProps, Box } from "@mantine/core";
import { ReactComponent as IconPlus } from "@/icons/plus.svg?react";

export function FloatingActionIcon(props: ActionIconProps) {
    return (
        <Box>
            <ActionIcon {...props}>
                <IconPlus />
            </ActionIcon>
        </Box>
    )
}