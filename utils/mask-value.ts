export const maskValue = (value: string): string => {
  if (value.length <= 2) {
    return value;
  }

  const firstChar = value.charAt(0);
  const lastChar = value.charAt(value.length - 1);
  const middleLength = value.length - 2;
  const asterisks = "*".repeat(middleLength);

  return `${firstChar}${asterisks}${lastChar}`;
};
