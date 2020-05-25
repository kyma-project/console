import bytes from 'bytes-iec';

export function normalizeMemory(memory = '') {
  if (!memory) {
    return 0;
  }
  const memoryWithBytes = memory.endsWith('B') ? memory : `${memory}B`;
  return bytes(memoryWithBytes) || 0;
}

export function correctLimitMemory(limit = '', current = '') {
  if (!limit || !current) {
    return;
  }

  const normalizedLimit = normalizeMemory(limit);
  const normalizedCurrent = normalizeMemory(current);

  return normalizedLimit <= normalizedCurrent;
}
