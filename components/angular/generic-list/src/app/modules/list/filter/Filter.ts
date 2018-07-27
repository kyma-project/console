export class Filter {
  property: string;
  value: string;
  fullMatch: boolean;

  constructor(property, value, fullMatch) {
    this.property = property;
    this.value = value;
    this.fullMatch = fullMatch;
  }
}
