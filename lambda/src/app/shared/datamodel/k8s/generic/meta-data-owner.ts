import { IMetaData } from './meta-data';
import { IStatus } from './status';
export interface IMetaDataOwner {
  kind?: string;
  apiVersion?: string;
  metadata?: IMetaData;
  status?: IStatus;
  getName?(): string;
  getId?(): string;
  getLabels?(): string[];
}

export class MetaDataOwner implements IMetaDataOwner {
  constructor(
    public metadata?: IMetaData,
    public status?: IStatus,
    public kind?: string,
    public apiVersion?: string,
  ) {}

  public getName(): string {
    return this.metadata.name;
  }

  public getId() {
    return this.metadata.name;
  }

  public getLabels(): string[] {
    const labels = [];
    for (const key in this.metadata.labels) {
      if (this.metadata.labels.hasOwnProperty(key)) {
        if (this.metadata.labels[key] === 'undefined') {
          labels.push(key);
        } else {
          labels.push(key + '=' + this.metadata.labels[key]);
        }
      }
    }
    return labels;
  }
}
