
export const DateToNumber = (dateObject: Date) => {
    console.log(dateObject);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
    const day = String(dateObject.getDate()).padStart(2, '0');  // Ensure two-digit day
  
    // Combine year, month, and day to form the desired integer string
    const formattedDate = `${year}${month}${day}`;
    return parseInt(formattedDate)
  }
  
export const NumberToDate = (dateInt: number) => {
  const s = dateInt.toString().padStart(8, '0');
  console.log("handle date here" , dateInt)
  // Extract year, month, and day from the integer
  const year = Math.floor(dateInt / 10000);
  const month = Math.floor((dateInt % 10000) / 100);
  const day = dateInt % 100;
  let hours = 0;
  let mins  = 0;
  if (s.length >= 12) {
    hours = parseInt(s.slice(8, 10), 10);
    mins  = parseInt(s.slice(10, 12), 10);
  }

  // Create a Date object with extracted values (adjust month for zero-based indexing)
  const dateObject = new Date(year, month - 1, day);

  console.log("handle date here" , dateObject)
  return dateObject;

};

/**
 * Parses a fixed-width date-or-datetime string into a JS Date.
 *
 * Supports:
 *  - “YYYYMMDD”       → Date at 00:00 local time
 *  - “YYYYMMDDHHmm”   → Date at HH:mm local time
 *
 * @param s  digit string (e.g. "20250620" or "202506201215")
 * @throws if s isn’t 8 or 12 digits.
 */
export const DateStringDigitToDate = (s: string): Date => {
  if (!/^\d{8}(\d{4})?$/.test(s)) {
    throw new Error(`Invalid date string "${s}", expected 8 or 12 digits`);
  }

  // year / month / day
  const year  = parseInt(s.slice(0, 4), 10);
  const month = parseInt(s.slice(4, 6), 10) - 1;  // JS month: 0–11
  const day   = parseInt(s.slice(6, 8), 10);

  // default time
  let hours = 0;
  let mins  = 0;

  // if there’s HHmm
  if (s.length === 12) {
    hours = parseInt(s.slice(8, 10), 10);
    mins  = parseInt(s.slice(10, 12), 10);
  }

  return new Date(year, month, day, hours, mins);
}
export function TimestampToDateString(timestamp: { seconds: number, nanos: number }): string {
  const milliseconds = Number(Number(timestamp.seconds) * 1000 + Math.floor(Number(timestamp.nanos) / 1_000_000));
  const date = new Date(milliseconds);
  return date.toLocaleString(); // or use toISOString(), etc.
}
