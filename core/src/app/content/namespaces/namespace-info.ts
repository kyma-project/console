export class NamespaceInfo {
  private id: string;
  private label: string;
  private uid: string;

  constructor(uid: string, name: string) {
    this.id = name;
    this.label = name;
    this.uid = uid;
  }

  public getId() {
    return this.id;
  }

  public getUid() {
    return this.uid;
  }

  public getLabel() {
    return this.label;
  }
}
