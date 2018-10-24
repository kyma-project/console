import { Component, Injector } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../environments/operation/abstract-kubernetes-entry-renderer.component';

@Component({
  selector: 'app-services-entry-renderer',
  templateUrl: './service-broker-entry-renderer.component.html'
})
export class ServiceBrokerEntryRendererComponent extends AbstractKubernetesEntryRendererComponent {
  constructor(protected injector: Injector) {
    super(injector);
  }

  getStatus(entry) {
    return entry.isStatusOk() ? 'Running' : 'Error';
  }

  getStatusType(entry) {
    if (this.getStatus(entry) === 'Running') {
      return 'ok';
    }
    return 'error';
  }
}
