import { ActionIcon, Menu } from "@mantine/core";
import { iconProps } from "./FloatingMenu";
import { ReactComponent as IconUser } from "@/icons/user(1).svg?react";
import { ReactComponent as IconLogout } from "@/icons/logout.svg?react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export function UserMenu() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon variant="transparent" size={60}>
                    <IconUser {...iconProps} style={{ strokeWidth: 1.5 }} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item color="red" leftSection={<IconLogout width={14} height={14} />} onClick={handleLogout}>
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}