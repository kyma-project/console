export class SearchFormData {
  constructor(
    public query: string,
    public limit: number,
    public from: string,
    public to: string,
    public label: string,
    public direction: string,
  ) {}
}
