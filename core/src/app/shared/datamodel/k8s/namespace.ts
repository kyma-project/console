import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { Observable } from 'rxjs';

export interface INamespace extends IMetaDataOwner {
  disabled?: boolean;
  spec: {};
  applications?: Observable<number>;
  services?: Observable<number>;

  isStatusOk(): boolean;

  getId(): string;

  getUid(): string;

  getLabel(): string;
}

export class Namespace extends MetaDataOwner implements INamespace {
  disabled?: boolean;
  spec: {};
  applications?: Observable<number>;
  services?: Observable<number>;

  constructor(input: INamespace) {
    super(input.metadata, input.status);
    this.spec = input.spec;
    this.applications = input.applications;
    this.services = input.services;
  }

  isStatusOk(): boolean {
    return true;
  }

  public getUid() {
    return this.metadata.uid;
  }

  public getLabel() {
    return this.metadata.name;
  }

  public toString() {
    return this.getLabel();
  }
}
