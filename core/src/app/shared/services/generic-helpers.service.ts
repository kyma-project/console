import { Injectable } from '@angular/core';

@Injectable()
export class GenericHelpersService {
  public getHostnameURL = (hostname: string, domain = ''): string =>
    `https://${hostname}${domain}`;

  public addDomainIfMissing = (hostname: string, domain: string): string =>
    hostname.endsWith('.' + domain) ? hostname : `${hostname}.${domain}`;
}
