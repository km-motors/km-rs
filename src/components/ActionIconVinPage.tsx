import { ReactComponent as IconVIN } from "@/icons/scan.svg?react";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FormsEnum } from "./Forms";

export function ActionIconVinPage({ ...props }: ActionIconProps) {
    const [, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form" });
    return (
        <ActionIcon {...props} onClick={() => { setOpenedForm(FormsEnum.VIN) }}>
            <IconVIN />
        </ActionIcon>
    )
}