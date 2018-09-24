import { Event } from '../event';
import { Source } from '../source';

export class EventActivation {
  name: string;
  displayName: string;
  source: Source;
  events: Event[];
}
