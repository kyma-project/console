import bytes from 'bytes-iec';

export function normalizeMemory(memory = '') {
  if (!memory) {
    return 0;
  }
  const memoryWithBytes = memory.endsWith('B') ? memory : `${memory}B`;
  return bytes(memoryWithBytes) || 0;
}
