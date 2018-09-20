import { List } from '../../shared/datamodel/k8s/generic/list';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import {
  IMicroFrontend,
  MicroFrontend
} from '../../shared/datamodel/k8s/microfrontend';
import { map } from 'rxjs/operators';

@Injectable()
export class ExtensionsService {
  constructor(private http: HttpClient) {}

  getExtensions(namespaceId: string): Observable<MicroFrontend[]> {
    const resourceUrl = `${
      AppConfig.k8sApiServerUrl_ui
    }namespaces/${namespaceId}/microfrontends`;
    return this.http.get<List<IMicroFrontend>>(resourceUrl).pipe(
      map(res => {
        return res.items.map(item => {
          return new MicroFrontend(item);
        });
      })
    );
  }

  getExternalExtensions(): Observable<MicroFrontend[]> {
    const resourceUrl = `${AppConfig.k8sApiServerUrl_ui}clustermicrofrontends`;
    return this.http.get<List<IMicroFrontend>>(resourceUrl).pipe(
      map(res => {
        return res.items.map(item => {
          return new MicroFrontend(item);
        });
      })
    );
  }

  isUsingSecureProtocol(url: string) {
    if (!url || (!url.startsWith('https') && !this.isLocalDevelopment(url))) {
      console.error(
        `${url} is not using secure protocol. External views have to be served over HTTPS.`
      );
      return false;
    }
    return true;
  }

  private isLocalDevelopment(url: string) {
    if (
      url.startsWith('http://console-dev.kyma.local') ||
      url.startsWith('http://localhost')
    ) {
      return true;
    }
    return false;
  }
}
