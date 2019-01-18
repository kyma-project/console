import { Injectable } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

@Injectable()
export class LuigiClientService {
  private luigiClient: LuigiClient;

  constructor() {
    this.luigiClient = LuigiClient;
  }

  public hasBackendModule(backendModule: string): boolean {
    const backendModules: string[] =
      this.luigiClient.getEventData().backendModules || [];
    return Boolean(backendModules.find((x: string) => x === backendModule));
  }
}
