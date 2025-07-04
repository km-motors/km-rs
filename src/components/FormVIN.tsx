import { Paper, Grid, Text, Title, Stack, Divider, Button, Modal, TextInput, Alert, Group } from '@mantine/core';
import { ReactComponent as ManualIcon } from '@/icons/forms.svg?react';
import { ReactComponent as InfoIcon } from '@/icons/info-circle.svg?react';
import { decodeVin } from '@/utils/vinApi';
import { useEffect, useState } from 'react';
import { FormsEnum } from './Forms';
import { useLocalStorage } from '@mantine/hooks';

type VinResult = {
    "Make": string;
    "Model": string;
    "Model Year": string;
    "Trim": string;
    "Vehicle Type": string;
    "Body Class": string;
    "Doors": string;
    "Plant City": string;
    "Plant State": string;
    "Plant Country": string;
    "Engine Model": string;
    'Engine Number of Cylinders': string;
    'Displacement (L)': string;
    'Engine Brake (hp) From': string;
    'Fuel Type - Primary': string;
    'Transmission Style': string;
    'Transmission Speeds': string;
    'Seat Belt Type': string;
    'Curtain Air Bag Locations': string;
    'Front Air Bag Locations': string;
    'Side Air Bag Locations': string;
    [key: string]: string; // allow additional keys
};

export function VinResultForm({ data }: { data: VinResult }) {
    const field = (label: string, value: string | undefined) => (
        <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed">{label}</Text>
            <Text fw={500}>{value || '—'}</Text>
        </Grid.Col>
    );

    return (
        <Paper shadow="xs" p="md" withBorder mt={"lg"}>
            <Stack>
                <Title order={4}>Vehicle Info</Title>
                <Grid>
                    {field('Make', data["Make"])}
                    {field('Model', data["Model"])}
                    {field('Year', data["Model Year"])}
                    {field('Trim', data["Trim"])}
                    {field('Type', data["Vehicle Type"])}
                </Grid>

                <Divider label="Manufacturing" labelPosition="center" />
                <Grid>
                    {field('Plant City', data["Plant City"])}
                    {field('Plant State', data["Plant State"])}
                    {field('Plant Country', data["Plant Country"])}
                </Grid>

                <Divider label="Body & Chassis" labelPosition="center" />
                <Grid>
                    {field('Body Class', data["Body Class"])}
                    {field('Doors', data["Doors"])}
                </Grid>

                <Divider label="Engine" labelPosition="center" />
                <Grid>
                    {field('Engine Model', data["Engine Model"])}
                    {field('Cylinders', data['Engine Number of Cylinders'])}
                    {field('Displacement (L)', data['Displacement (L)'])}
                    {field('Horsepower (hp)', data['Engine Brake (hp) From'])}
                    {field('Fuel Type', data['Fuel Type - Primary'])}
                </Grid>

                <Divider label="Transmission" labelPosition="center" />
                <Grid>
                    {field('Style', data['Transmission Style'])}
                    {field('Speeds', data['Transmission Speeds'])}
                </Grid>

                <Divider label="Safety" labelPosition="center" />
                <Grid>
                    {field('Seat Belts', data['Seat Belt Type'])}
                    {field('Curtain Airbags', data['Curtain Air Bag Locations'])}
                    {field('Front Airbags', data['Front Air Bag Locations'])}
                    {field('Side Airbags', data['Side Air Bag Locations'])}
                </Grid>
            </Stack>
        </Paper>
    );
}

export function FormVIN() {
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
        if (openedFrom == FormsEnum.VIN) {
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
            title={'VIN Lookup'}
            radius={"md"}
            styles={{ title: { fontSize: "1.1rem", fontWeight: "bold", color: "var(--mantine-primary-color-8)" } }}
        >
            <Stack gap="xs">
                <TextInput
                    label="Enter Vehicle VIN"
                    placeholder="17-character VIN"
                    value={vin}
                    onChange={(e) => setVin(e.currentTarget.value.toUpperCase())}
                    error={vin.length > 0 && vin.length !== 17 ? 'VIN must be 17 characters' : false}
                    radius={"sm"}
                />
                <Button
                    leftSection={<ManualIcon />}
                    onClick={handleSubmit}
                    disabled={vin.length !== 17}
                    loading={loading}
                >
                    Submit VIN
                </Button>
            </Stack>
            {error &&
                <Alert color="red" mt={"lg"} styles={{ message: { color: "var(--mantine-color-red-9)" } }} variant="light" style={{ color: "red" }} radius={"lg"}>
                    <Group gap={6}>
                        <InfoIcon strokeWidth={1.2}/>
                        {error}
                    </Group>
                </Alert>
            }
            {result && <VinResultForm data={result} />}
        </Modal>
    )
}