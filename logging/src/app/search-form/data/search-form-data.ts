export interface ISearchFormData {
  from: string;
  to: string;
  query: string;
  extraQuery: string;
  limit: number;
  direction: string;
  label: string;
  showOutdatedLogs: boolean;
  showHealthChecks: boolean;
  showIstioLogs: false;
}
