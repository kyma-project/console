import {
  Namespace,
  INamespace
} from '../../../shared/datamodel/k8s/namespace';
import { DataConverter } from 'app/generic-list';
import { ApplicationBindingService } from '../../settings/applications/application-details/application-binding-service';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, publishReplay, refCount } from 'rxjs/operators';
export class NamespaceDataConverter
  implements DataConverter<INamespace, Namespace> {
  constructor(
    private applicationBindingService: ApplicationBindingService,
    private http: HttpClient
  ) {}

  convert(entry: INamespace): Namespace {
    const namespace = new Namespace(entry);

    namespace.applications = this.applicationBindingService
      .getBoundApplications(namespace.getId())
      .pipe(
        map(boundNamespaces => {
          const namespaces = boundNamespaces['applications'];
          return namespaces ? namespaces.length : 0;
        }),
        catchError(() => {
          return of(0);
        }),
        publishReplay(1),
        refCount()
      );

    const servicesUrl = `${
      AppConfig.k8sApiServerUrl
    }namespaces/${namespace.getId()}/services`;
    namespace.services = this.http.get<any>(servicesUrl).pipe(
      map(res => {
        return res.items.length;
      }),
      catchError(() => {
        return of(0);
      }),
      publishReplay(1),
      refCount()
    );

    return namespace;
  }
}
