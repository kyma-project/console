import { Component, Injector } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';

@Component({
  selector: 'app-configmaps-entry-renderer',
  templateUrl: './configmaps-entry-renderer.component.html'
})
export class ConfigMapsEntryRendererComponent extends AbstractKubernetesEntryRendererComponent {
  constructor(protected injector: Injector) {
    super(injector);
  }
}
