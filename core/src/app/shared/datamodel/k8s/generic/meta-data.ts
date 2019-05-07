export interface IMetaData {
  name: string;
  namespace?: string;
  selfLink?: string;
  uid?: string;
  creationTimestamp?: string;
  labels?: { [key: string]: string };
  annotations?: object;
}
