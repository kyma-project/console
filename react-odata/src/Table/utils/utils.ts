export function makeUnique(value: any, index: number, self: any): boolean {
  return self.indexOf(value) === index;
}
