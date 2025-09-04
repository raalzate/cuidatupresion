import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const psyshigh = process.env.PSYS_HIGH;
export const pdyshigh = process.env.PDYS_HIGH;
