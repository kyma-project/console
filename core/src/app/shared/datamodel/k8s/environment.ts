import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { Observable } from 'rxjs';

export interface IEnvironment extends IMetaDataOwner {
  disabled?: boolean;
  spec: {};
  remoteEnvs?: Observable<number>;
  services?: Observable<number>;

  isStatusOk(): boolean;

  getId(): string;

  getUid(): string;

  getLabel(): string;
}

export class Environment extends MetaDataOwner implements IEnvironment {
  disabled?: boolean;
  spec: {};
  remoteEnvs?: Observable<number>;
  services?: Observable<number>;

  constructor(input: IEnvironment) {
    super(input.metadata, input.status);
    this.spec = input.spec;
    this.remoteEnvs = input.remoteEnvs;
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
