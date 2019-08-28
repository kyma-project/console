import * as LuigiClient from '@kyma-project/luigi-client';

export class LuigiClientService {
  constructor() {}

  public hasBackendModule(backendModule: string): boolean {
    const eventData = LuigiClient.getEventData();
    const backendModules: string[] = eventData
      ? eventData.backendModules || []
      : [];
    return backendModules.includes(backendModule);
  }
}
