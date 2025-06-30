import { ActionIcon } from "@mantine/core";
import { iconProps } from "./FloatingMenu";
import { ReactComponent as UserIcon } from "@/icons/user(1).svg?react";

export function UserMenu() {
    return (
        <ActionIcon variant="transparent" size={60}>
            <UserIcon {...iconProps} style={{ strokeWidth: 1.5 }} />
        </ActionIcon>
    )
}