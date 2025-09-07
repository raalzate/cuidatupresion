import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const psyshigh: string | undefined = process.env.PSYS_HIGH;
export const pdyshigh: string | undefined = process.env.PDYS_HIGH;

export const psys_low: string | undefined = process.env.PSYS_LOW;
export const pdys_low: string | undefined = process.env.PDYS_LOW;
