import { ITrigger } from './trigger';
import { Source } from './source';

export class HTTPEndpoint implements ITrigger {
  eventType: string;
  source: Source;
  selected?: boolean;
  url?: string;
  isAuthEnabled?: boolean;
  authentication?: {
    type?: string;
    jwt?: {
      jwksUri?: string;
      issuer?: string;
    };
  };
}
