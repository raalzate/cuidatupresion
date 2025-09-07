import { psys_low, pdys_low, psyshigh, pdyshigh } from "../config/config";

export function isHypertensiveCrisis(systolic: number | null | undefined, diastolic: number | null | undefined): boolean {
  // Validate inputs
  if (typeof systolic !== "number" || typeof diastolic !== "number" || isNaN(systolic) || isNaN(diastolic)) {
    return false;
  }

  const sysHigh: number = parseInt(psyshigh || "180") || 180;
  const diasHigh: number = parseInt(pdyshigh || "120") || 120;

  return systolic >= sysHigh || diastolic >= diasHigh;
}

export function isHypotensiveCrisis(systolic: number | null | undefined, diastolic: number | null | undefined): boolean {
  const sysLow: number = parseInt(psys_low || "90") || 90;
  const diasLow: number = parseInt(pdys_low || "60") || 60;

  // Validación segura
  const validSystolic: boolean = typeof systolic === "number" && !isNaN(systolic);
  const validDiastolic: boolean = typeof diastolic === "number" && !isNaN(diastolic);

  if (!validSystolic || !validDiastolic) return false;

  // Type assertion after validation
  return (systolic as number) <= sysLow || (diastolic as number) <= diasLow;
}
