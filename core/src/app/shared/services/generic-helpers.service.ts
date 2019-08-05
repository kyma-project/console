import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';

@Injectable()
export class GenericHelpersService {
  public getURL = ({
    schema = 'https',
    host,
    domain = AppConfig.domain,
    port = '',
    path = '/'
  }: {
    schema?: string;
    host: string;
    domain?: string;
    port?: string;
    path?: string;
  }) => {
    const hostname = this.addDomainIfMissing(host, domain);
    const hostnameWithPort = port ? `${hostname}:${port}` : hostname;
    return `${schema}://${hostnameWithPort}${path}`;
  };

  private addDomainIfMissing = (hostname: string, domain: string): string =>
    hostname.endsWith('.' + domain) ? hostname : `${hostname}.${domain}`;
}
