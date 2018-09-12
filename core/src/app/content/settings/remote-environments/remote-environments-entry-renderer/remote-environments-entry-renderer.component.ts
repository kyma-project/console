import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as tippy from 'tippy.js';
import { AbstractKubernetesEntryRendererComponent } from '../../../environments/operation/abstract-kubernetes-entry-renderer.component';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pods-entry-renderer',
  styleUrls: ['./remote-environments-entry-renderer.component.scss'],
  templateUrl: './remote-environments-entry-renderer.component.html'
})
export class RemoteEnvironmentsEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  constructor(
    protected injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    super(injector);
    this.actions = [
      {
        function: 'delete',
        name: 'Delete'
      }
    ];
  }
  public disabled = false;
  private communicationServiceSubscription: Subscription;

  ngOnInit() {
    this.communicationServiceSubscription = this.componentCommunicationService.observable$.subscribe(
      e => {
        const event: any = e;
        if ('disable' === event.type && this.entry.name === event.entry.name) {
          this.disabled = event.entry.disabled;
        }
      }
    );
  }

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
  }

  public listConnectedEnvs(entry) {
    let result = '';
    if (entry.enabledInEnvironments) {
      result = entry.enabledInEnvironments.join(', ');
    }
    return result;
  }

  public determineClass(entry) {
    return this.remoteEnvironmentsService.determineClass(entry);
  }

  public prettyPrintStatus(entryStatus) {
    if (entryStatus) {
      tippy('.sf-indicator');
      return this.remoteEnvironmentsService.printPrettyConnectionStatus(
        entryStatus
      );
    }
  }

  public openRemoteEnvDetails() {
    this.router.navigate(['home/settings/remoteEnvs/' + this.entry.name]);
  }
}
