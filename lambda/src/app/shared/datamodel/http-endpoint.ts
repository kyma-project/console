import { ITrigger } from './trigger';

export class HTTPEndpoint implements ITrigger {
  eventType: string;
  sourceId: '';
  selected?: boolean;
  url?: string;
  isAuthEnabled?: boolean;
}
