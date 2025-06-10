
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
    // Extract year, month, and day from the integer
    const year = Math.floor(dateInt / 10000);
    const month = Math.floor((dateInt % 10000) / 100);
    const day = dateInt % 100;
  
    // Create a Date object with extracted values (adjust month for zero-based indexing)
    const dateObject = new Date(year, month - 1, day);
  
    return dateObject;
  
  };
  
  export function TimestampToDateString(timestamp: { seconds: number, nanos: number }): string {
    const milliseconds = Number(Number(timestamp.seconds) * 1000 + Math.floor(Number(timestamp.nanos) / 1_000_000));
    const date = new Date(milliseconds);
    return date.toLocaleString(); // or use toISOString(), etc.
  }