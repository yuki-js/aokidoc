// function formatDate(date: string, formatPreference?: string): string {
//   const dt = new Date(date);
//   const format = formatPreference || "en-US";
//   return dt.toLocaleDateString(format);
// }

import { ConfigFunction } from "@markdoc/markdoc";

const formatDate: ConfigFunction = {
  transform(parameters) {
    const [date, formatPreference] = Object.values(parameters);
    const dt = new Date(date);
    const format = formatPreference || "en-US";
    return dt.toLocaleDateString(format);
  },
};

export default { formatDate };
