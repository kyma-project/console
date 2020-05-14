const microCpuRegexp = /^\d+(\.\d+)?u$/;
const nanoCpuRegexp = /^\d+(\.\d+)?n$/;

export function parseCpu(cpu) {
  if (microCpuRegexp.test(cpu)) {
    const numberPart = parseFloat(cpu.slice(0, cpu.length - 1));
    return `${numberPart / 1000}m`;
  }
  if (nanoCpuRegexp.test(cpu)) {
    const numberPart = parseFloat(cpu.slice(0, cpu.length - 1));
    return `${numberPart / 10 ** 6}m`;
  }
  return cpu;
}
