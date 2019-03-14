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
export class EnvironmentDataConverter
  implements DataConverter<INamespace, Namespace> {
  constructor(
    private applicationBindingService: ApplicationBindingService,
    private http: HttpClient
  ) {}

  convert(entry: INamespace): Namespace {
    const environment = new Namespace(entry);

    environment.applications = this.applicationBindingService
      .getBoundApplications(environment.getId())
      .pipe(
        map(boundEnvironments => {
          const envs = boundEnvironments['applications'];
          return envs ? envs.length : 0;
        }),
        catchError(() => {
          return of(0);
        }),
        publishReplay(1),
        refCount()
      );

    const servicesUrl = `${
      AppConfig.k8sApiServerUrl
    }namespaces/${environment.getId()}/services`;
    environment.services = this.http.get<any>(servicesUrl).pipe(
      map(res => {
        return res.items.length;
      }),
      catchError(() => {
        return of(0);
      }),
      publishReplay(1),
      refCount()
    );

    return environment;
  }
}
