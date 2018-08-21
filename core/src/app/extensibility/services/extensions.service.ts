import { List } from '../../shared/datamodel/k8s/generic/list';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import {
  IMicroFrontend,
  MicroFrontend
} from '../../shared/datamodel/k8s/microfrontend';

@Injectable()
export class ExtensionsService {
  constructor(private http: HttpClient) {}

  getExtensions(namespaceId: string): Observable<any> {
    const resourceUrl = `${
      AppConfig.k8sApiServerUrl_ui
    }namespaces/${namespaceId}/microfrontends`;
    return this.http.get<List<IMicroFrontend>>(resourceUrl).map(res => {
      return res.items.map(item => {
        return new MicroFrontend(item);
      });
    });
  }

  getClusterExtensions(): Observable<any> {
    const resourceUrl = `${AppConfig.k8sApiServerUrl_ui}clustermicrofrontends`;
    return this.http.get<List<IMicroFrontend>>(resourceUrl).map(res => {
      return res.items.map(item => {
        return new MicroFrontend(item);
      });
    });
  }

  isUsingSecureProtocol(url: string) {
    if (!url || !url.startsWith('https')) {
      console.error(
        `${url} is not using secure protocol. External views have to be served over HTTPS.`
      );
      return false;
    }
    return true;
  }
}
