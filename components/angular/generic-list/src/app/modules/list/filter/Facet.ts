export class Facet {
  private _label: string;
  private _count: number;

  constructor(label: string, count: number) {
    this._label = label;
    this._count = count;
  }

  get label(): string {
    return this._label;
  }

  get count(): number {
    return this._count;
  }
}
