export interface Children {
  attributes: { [key: string]: string };
  name: string;
  value: string;
  children: Children[];
}
