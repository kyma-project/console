import { Event } from '../event';
import { EventActivation } from './event-activation';

export class EventActivationResponse {
  data: {
    eventActivations: EventActivation[];
  };
}
