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

export function StringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return {
    sx: {
      bgcolor: color,
      width: 50,
      height: 50,
    },
  };
}
