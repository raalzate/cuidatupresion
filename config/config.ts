export const PSYS_HIGH = process.env.NEXT_PUBLIC_PSYS_HIGH;
export const PDYS_HIGH = process.env.NEXT_PUBLIC_PDYS_HIGH;

export const PSYS_LOW = process.env.NEXT_PUBLIC_PSYS_LOW;
export const PDYS_LOW = process.env.NEXT_PUBLIC_PDYS_LOW;

export const ADDITIONAL_TAGS = (
  process.env.NEXT_PUBLIC_ADDITIONAL_TAGS ?? ""
).split(",");
