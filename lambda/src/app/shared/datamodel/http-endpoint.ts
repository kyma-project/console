import { ITrigger } from './trigger';
import { Authentication } from './authentication';

export class HTTPEndpoint implements ITrigger {
  eventType: string;
  sourceId: '';
  selected?: boolean;
  url?: string;
  isAuthEnabled?: boolean;
  authentication?: Authentication;
}
