export async function decodeVin(vin: string) {
  const res = await fetch(`${import.meta.env.VITE_VIN_API_URL}/${vin}?format=json`);
  if (!res.ok) throw new Error('VIN decode failed');

  const data = await res.json();

  if (!data.Results || !Array.isArray(data.Results)) {
    throw new Error('Invalid VIN API response');
  }

  // Map Results array into object { Variable: Value }
  const parsed = Object.fromEntries(
    data.Results
      .filter((item: any) => item.Variable && item.Value != null)
      .map((item: any) => [item.Variable, item.Value])
  );

  return parsed;
}
