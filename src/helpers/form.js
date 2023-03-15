export function removeCPFMask(cpfWithMask) {
  return cpfWithMask.replace(/[^0-9]/g, "").substring(0, 11);
}
