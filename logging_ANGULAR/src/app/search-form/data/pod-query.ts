export interface IPod {
  name: string;
  labels: any;
}
export interface IPodQueryResponse {
  data: {
    pods: IPod[];
  };
}
