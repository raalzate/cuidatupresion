export const PSYS_HIGH = Number(process.env.NEXT_PUBLIC_PSYS_HIGH) || 180;
export const PDYS_HIGH = Number(process.env.NEXT_PUBLIC_PDYS_HIGH) || 120;

export const PSYS_LOW = Number(process.env.NEXT_PUBLIC_PSYS_LOW) || 90;
export const PDYS_LOW = Number(process.env.NEXT_PUBLIC_PDYS_LOW) || 60;

export const PSYS_MIN = Number(process.env.NEXT_PUBLIC_PSYS_MIN) || 40;
export const PDYS_MIN = Number(process.env.NEXT_PUBLIC_PDYS_MIN) || 30;

export const PSYS_MAX = Number(process.env.NEXT_PUBLIC_PSYS_MAX) || 300;
export const PDYS_MAX = Number(process.env.NEXT_PUBLIC_PDYS_MAX) || 200;

export const PULSE_MIN = Number(process.env.NEXT_PUBLIC_PULSE_MIN) || 25;
export const PULSE_MAX = Number(process.env.NEXT_PUBLIC_PULSE_MAX) || 300;

export const ADDITIONAL_TAGS = (
  process.env.NEXT_PUBLIC_ADDITIONAL_TAGS ?? ""
).split(",");
