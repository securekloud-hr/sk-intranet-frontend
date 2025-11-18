import API from "@/config";

export async function ingestHolidayPdf(file: File, year?: number, region = "IN") {
  const form = new FormData();
  form.append("file", file);
  if (year) form.append("year", String(year));
  form.append("region", region.toUpperCase());

  const res = await fetch(`${API}/api/holidays/ingest-pdf`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchHolidays(year: number, region = "IN") {
  const url = new URL(`${API}/api/holidays`);
  url.searchParams.set("year", String(year));
  url.searchParams.set("region", region.toUpperCase());
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ year: number; items: any[] }>;
}
