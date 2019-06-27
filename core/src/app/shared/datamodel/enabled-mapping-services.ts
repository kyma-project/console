export interface EnabledMappingServices {
  allServices: boolean;
  namespace: string;
  services: EnabledServices[];
}

export interface EnabledServices {
  id: string;
  displayName: string;
  exist: boolean;
}