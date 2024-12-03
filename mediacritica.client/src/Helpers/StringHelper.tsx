export function CapitaliseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function MediaYearFormatter(year: string) {
  return year.endsWith("–") ? `${year}Present` : year;
}
