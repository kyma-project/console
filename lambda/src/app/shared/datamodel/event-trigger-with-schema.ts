import { ITrigger } from './trigger';
import { EventTrigger } from './event-trigger';

export class EventTriggerWithSchema extends EventTrigger implements ITrigger {
  schema: JSON;
}
