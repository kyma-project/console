export interface IPlainLogQuery {
  from: number;
  to: number;
  query: string;
  limit: number;
  direction: string;
  regexp: string;
}
