import { ITrigger } from './trigger';

export class EventTrigger implements ITrigger {
  eventType: string;
  sourceId: string;
  selected?: boolean;
  description?: string;
  version: string;
}