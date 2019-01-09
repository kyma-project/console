import { IDashboardMetaData } from './dashboard-meta-data';

export interface IDashboardMetaDataOwner {
  objectMeta: IDashboardMetaData;
  typeMeta: object;

  getName(): string;
  getId(): string;
  getLabels?(): string[];
}

export class DashboardMetaDataOwner implements IDashboardMetaDataOwner {
  constructor(public objectMeta: IDashboardMetaData, public typeMeta: object) {}

  public getName(): string {
    return this.objectMeta.name;
  }

  public getId(): string {
    return this.objectMeta.name;
  }

  public getLabels(): string[] {
    const labels = [];
    for (const key in this.objectMeta.labels) {
      if (this.objectMeta.labels.hasOwnProperty(key)) {
        if (this.objectMeta.labels[key] === 'undefined') {
          labels.push(key);
        } else {
          labels.push(key + '=' + this.objectMeta.labels[key]);
        }
      }
    }
    return labels;
  }
}
