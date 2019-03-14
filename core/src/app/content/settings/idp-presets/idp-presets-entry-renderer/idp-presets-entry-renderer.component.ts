import { Component, Injector } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../namespaces/operation/abstract-kubernetes-entry-renderer.component';

@Component({
  selector: 'app-idp-presets-entry-renderer',
  templateUrl: './idp-presets-entry-renderer.component.html'
})
export class IdpPresetsEntryRendererComponent extends AbstractKubernetesEntryRendererComponent {
  constructor(protected injector: Injector) {
    super(injector);

    this.actions = [
      {
        function: 'delete',
        name: 'Delete'
      }
    ];
  }
}
