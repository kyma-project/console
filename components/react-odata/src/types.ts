export interface Child {
  attributes: { [key: string]: string };
  name: string;
  value: string;
  children: Child[];
}
