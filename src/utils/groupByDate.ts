import dayjs from 'dayjs';

export function groupByDate(items: any[]) {
    const groups: Record<string, any[]> = {};

    for (const item of items) {
        const date = dayjs(item.time_stamp);
        const key =
            date.isSame(dayjs(), 'day') ? 'Today'
                : date.isSame(dayjs().subtract(1, 'day'), 'day') ? 'Yesterday'
                    : date.format(date.year() === dayjs().year() ? 'MM/DD' : 'YYYY/MM/DD');

        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    }

    return groups;
}
