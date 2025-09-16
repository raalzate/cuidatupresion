import { PSYS_LOW, PDYS_LOW, PSYS_HIGH, PDYS_HIGH } from "../config/config";

export function isHypertensiveCrisis(
  systolic: number | null | undefined,
  diastolic: number | null | undefined
): boolean {
  // Validate inputs
  if (
    typeof systolic !== "number" ||
    typeof diastolic !== "number" ||
    isNaN(systolic) ||
    isNaN(diastolic)
  ) {
    return false;
  }

  const sysHigh: number = PSYS_HIGH || 180;
  const diasHigh: number = PDYS_HIGH || 120;

  return systolic >= sysHigh || diastolic >= diasHigh;
}

export function isHypotensiveCrisis(
  systolic: number | null | undefined,
  diastolic: number | null | undefined
): boolean {
  const sysLow: number = PSYS_LOW || 90;
  const diasLow: number = PDYS_LOW || 60;

  // Validación segura
  const validSystolic: boolean =
    typeof systolic === "number" && !isNaN(systolic);
  const validDiastolic: boolean =
    typeof diastolic === "number" && !isNaN(diastolic);

  if (!validSystolic || !validDiastolic) return false;

  // Type assertion after validation
  return (systolic as number) <= sysLow || (diastolic as number) <= diasLow;
}
