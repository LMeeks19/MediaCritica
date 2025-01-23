export function CapitaliseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function MediaYearFormatter(year: string) {
  return year.endsWith("–") ? `${year}Present` : year;
}

export function ConvertRatingStringToFiveScale(rating: string): number {
  let numericRating: number = 0;

  // Check if the rating is in the format "X" (where X is a number)
  if (/^\d+$/.test(rating)) {
    numericRating = parseFloat(rating);
  }
  // Check if the rating is in the format "X/Y"
  else if (/^(\d+(\.\d+)?)\/(\d+)$/.test(rating)) {
    const parts = rating.split("/");
    numericRating = (parseFloat(parts[0]) / parseFloat(parts[1])) * 100;
  }
  // Check if the rating is in the format "X%"
  else if (/^\d+(\.\d+)?%$/.test(rating)) {
    numericRating = (parseFloat(rating) / 100) * 100; // Convert percentage to a number
  }
  return (numericRating / 100) * 5;
}
