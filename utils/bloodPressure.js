import { psyshigh, pdyshigh } from "../config/config.js";

export function isHypertensiveCrisis(systolic, diastolic) {
  const sysHigh = parseInt(psyshigh) || 180;
  const diasHigh = parseInt(pdyshigh) || 120;

  return systolic >= sysHigh || diastolic >= diasHigh;
}
