function formatDate(date: string, formatPreference?: string): string {
  const dt = new Date(date);
  const format = formatPreference || "en-US";
  return dt.toLocaleDateString(format);
}
