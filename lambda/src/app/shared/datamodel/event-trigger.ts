import { ITrigger } from './trigger';
import { Source } from './source';

export class EventTrigger implements ITrigger {
  eventType: string;
  source: Source;
  selected?: boolean;
  description?: string;
  version: string;
}
