export interface Node {
  attributes: { [key: string]: string };
  name: string;
  value: string;
  children: Node[];
}
