import dayjs from 'dayjs';

export function groupByDate(items: any[]) {
    const groupMap = new Map<string, { label: string; rawDate: string; entries: any[] }>();

    for (const item of items) {
        const date = dayjs(item.time_stamp);
        const rawDate = item.time_stamp; // for raw usage
        const label =
            date.isSame(dayjs(), 'day')
                ? 'Today'
                : date.isSame(dayjs().subtract(1, 'day'), 'day')
                    ? 'Yesterday'
                    : date.format(date.year() === dayjs().year() ? 'MM/DD' : 'YYYY/MM/DD');

        if (!groupMap.has(label)) {
            groupMap.set(label, { label, rawDate, entries: [] });
        }

        groupMap.get(label)!.entries.push(item);
    }

    return Array.from(groupMap.values());
}

