import { Injectable } from '@angular/core';

@Injectable()
export class GenericHelpersService {
  public getHostnameURL = (hostname: string, domain = ''): string =>
    `https://${hostname}${domain}`;
}
