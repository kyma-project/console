import { Injectable } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

@Injectable()
export class LuigiClientService {
  public hasBackendModule(backendModule: string): boolean {
    const backendModules: string[] =
      LuigiClient.getEventData().backendModules || [];
    return Boolean(backendModules.find((x: string) => x === backendModule));
  }
}
