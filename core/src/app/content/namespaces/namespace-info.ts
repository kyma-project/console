export class NamespaceInfo {
  private id: string;
  private label: string;
  private uid: string;
  private labels: Record<string, string>;

  constructor(metadata: any) {
    this.id = metadata.name;
    this.label = metadata.name;
    this.uid = metadata.uid;
    this.labels = metadata.labels;
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

  public getLabels() {
    return this.labels;
  }
}
