import { Source } from './source';

export interface ITrigger {
  eventType: string;
  description?: string;
  source: Source;
  selected?: boolean;
  version?: string;
}
