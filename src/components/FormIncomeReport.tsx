import {
    Box,
    Button,
    Stack,
    SegmentedControl,
    Alert,
    TextInput,
    Modal,
    Text
} from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { fetchIncomeByRange } from '@/api/income';
import { decodeVin } from '@/utils/vinApi';
import { useLocalStorage } from '@mantine/hooks';
import { FormsEnum } from './Forms';

export enum ReportRangeTypeEnum {
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}

export function IncomeReportForm() {
    const [date, setDate] = useLocalStorage<string>({ key: "--income-report-date", defaultValue: new Date().toISOString().slice(0, 16) });
    const [rangeType, setRangeType] = useLocalStorage<ReportRangeTypeEnum>({ key: "--income-report-range-type", defaultValue: ReportRangeTypeEnum.DAY });

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<any[] | null>(null);
    const [error, setError] = useState('');
    const [rangeTypeLabel, setRangeTypeLabel] = useState('');

    const handleFetch = async () => {
        if (!date) return;

        setLoading(true);
        setError('');
        try {
            const start = dayjs(date).startOf(rangeType).toISOString();
            const end = dayjs(date).endOf(rangeType).toISOString();

            const result = await fetchIncomeByRange(start, end);
            setReport(result);
        } catch (err: any) {
            setError(err.message || 'Error fetching report');
        } finally {
            setLoading(false);
        }
    };

    // Calculate total amount if report exists
    const total = report?.reduce((acc, item) => acc + Number(item.amount), 0) ?? 0;

    // auto fetch on range-type
    useEffect(() => {
        if (!loading) {
            handleFetch();
        }
    }, [rangeType, date]);

    useEffect(() => {
        const parsed = dayjs(date);
        setRangeTypeLabel('');

        if (rangeType === 'day') {
            setRangeTypeLabel(parsed.format('dddd, MMMM D, YYYY')); // e.g., "Tuesday, July 2, 2025"
        } else if (rangeType === 'week') {
            const start = parsed.startOf('week');
            const end = parsed.endOf('week');
            setRangeTypeLabel(`${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`); // "Jun 30 – Jul 6, 2025"
        } else if (rangeType === 'month') {
            setRangeTypeLabel(parsed.format('MMMM YYYY')); // "July 2025"
        }
    }, [rangeType]);
    return (
        <Box maw={400} mx="auto">
            <Stack>
                <SegmentedControl
                    value={rangeType}
                    onChange={(value) => setRangeType(value as ReportRangeTypeEnum)}
                    data={[
                        { label: 'Day', value: 'day' },
                        { label: 'Week', value: 'week' },
                        { label: 'Month', value: 'month' },
                    ]}
                />
                <Stack gap={0}>
                    <TextInput
                        label="Select Date & Time"
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.currentTarget.value)}
                        required
                        mb={0}
                        radius={"sm"}
                    />
                    <Text c="dimmed" size="xs" mt={0} ml={"0"}>
                        Range: {rangeTypeLabel}
                    </Text>
                </Stack>


                <Button onClick={handleFetch} loading={loading}>
                    Refresh
                </Button>

                {error && <Alert color="red">{error}</Alert>}

                {report && (
                    <Text size="lg" fw={700} mt="md">
                        Total: ${total.toFixed(2)}
                    </Text>
                )}
            </Stack>
        </Box>
    );
}


export function FromIncomeReport() {
    // observer pattern
    const [openedFrom, setOpenedForm] = useLocalStorage<FormsEnum | undefined>({ key: "--opened-form" });

    // states
    const [opened, setOpened] = useState(false);
    const [vin, setVin] = useState('');
    const [result, setResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDetected = async (vin: string) => {
        setError('');
        setLoading(true);
        try {
            const data = await decodeVin(vin);
            setResult(data);
        } catch (e) {
            setError('Failed to decode VIN');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (vin.length === 17) handleDetected(vin);
        else setError("VIN must be 17 characters");
    };

    const handelOnClose = () => {
        closeForm();
        setVin('');
        setResult(null);
    }

    useEffect(() => {
        if (openedFrom == FormsEnum.INCOME_REPORT) {
            setOpened(true);
        } else {
            setOpened(false);
        }
    }, [openedFrom]);

    // .. clearity
    const closeForm = () => setOpenedForm(undefined);

    return (
        <Modal
            opened={opened}
            onClose={handelOnClose}
            title={'Income Report'}
            radius={"md"}
            styles={{ title: { fontSize: "1.1rem", fontWeight: "bold", color: "var(--mantine-primary-color-8)" } }}
        >
            <IncomeReportForm />
        </Modal>
    )
}