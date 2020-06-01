const miliCpuRegexp = /^\d+(\.\d+)?m$/;
const microCpuRegexp = /^\d+(\.\d+)?u$/;
const nanoCpuRegexp = /^\d+(\.\d+)?n$/;

export function parseCpu(cpu) {
  if (microCpuRegexp.test(cpu)) {
    const numberPart = parseFloat(cpu.slice(0, cpu.length - 1));
    return `${numberPart / 10 ** 3}m`;
  }
  if (nanoCpuRegexp.test(cpu)) {
    const numberPart = parseFloat(cpu.slice(0, cpu.length - 1));
    return `${numberPart / 10 ** 6}m`;
  }
  return cpu;
}

export function normalizeCPU(cpu = '') {
  if (!cpu) {
    return 0;
  }

  if (miliCpuRegexp.test(cpu)) {
    return parseFloat(cpu.slice(0, cpu.length - 1)) / 1000;
  }
  return parseFloat(cpu) || 0;
}

export function compareCpu(limit = '', current = '') {
  if (!limit || !current) {
    return;
  }

  const normalizedLimit = normalizeCPU(limit);
  const normalizedCurrent = normalizeCPU(current);

  return normalizedLimit <= normalizedCurrent;
}
