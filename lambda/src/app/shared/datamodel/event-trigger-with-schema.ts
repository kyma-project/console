import { ITrigger } from './trigger';

export class EventTriggerWithSchema implements ITrigger {
  eventType: string;
  sourceId: string;
  selected?: boolean;
  description?: string;
  version: string;
  schema: JSON;
}
