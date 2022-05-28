export default function isAFutureDate(selectedDate: string) {
  return (Date.parse(selectedDate) - Date.now()) / (60 * 1000 * 60 * 24) >= 1;
}
