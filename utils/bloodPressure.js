import { psys_low, pdys_low } from "../config/config";

export function isHypotensiveCrisis(systolic, diastolic) {
  const sysLow = parseInt(psys_low) || 90;
  const diasLow = parseInt(pdys_low) || 60;

  // Validación segura
  const validSystolic = typeof systolic === "number" && !isNaN(systolic);
  const validDiastolic = typeof diastolic === "number" && !isNaN(diastolic);

  if (!validSystolic || !validDiastolic) return false;

  return systolic <= sysLow || diastolic <= diasLow;
}
