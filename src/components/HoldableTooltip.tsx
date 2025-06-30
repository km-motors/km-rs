import { useState, useRef, ReactElement, cloneElement } from 'react';
import { Tooltip, TooltipProps } from '@mantine/core';
import type { HTMLAttributes } from 'react';

export function HoldableTooltip(props: TooltipProps & { children: ReactElement<HTMLAttributes<HTMLElement>> }) {
    const [opened, setOpened] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTouchStart = () => {
        timeoutRef.current = setTimeout(() => {
            setOpened(true);
        }, props.openDelay);
    };

    const handleTouchEnd = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setOpened(false);
    };

    const childWithProps = cloneElement(props.children, {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchEnd,
        onMouseEnter: handleTouchStart,
        onMouseLeave: handleTouchEnd,
    });

    return (
        <Tooltip
            opened={opened}
            {...props}
        >
            {childWithProps}
        </Tooltip>
    );
}
