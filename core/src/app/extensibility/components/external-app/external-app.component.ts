import { Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { CurrentEnvironmentService } from '../../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../../services/ext-app-view-registry.service';
import { Subscription } from 'rxjs';
import { ExtensionsService } from '../../services/extensions.service';

const ELEMENT_ID = 'frame';

@Component({
  selector: 'app-external-app',
  templateUrl: './external-app.component.html',
  styleUrls: ['./external-app.component.scss'],
  host: { class: 'sf-main sf-content-external' }
})
export class ExternalAppComponent implements OnChanges, OnDestroy {
  private environmentId;
  private currentEnvironmentSubscription: Subscription;

  constructor(
    private currentEnvironmentService: CurrentEnvironmentService,
    private extAppViewRegistryService: ExtAppViewRegistryService,
    private extensionsService: ExtensionsService
  ) {}

  @Input() url: string;
  @Input() basePath: string;
  @Input() data: {};
  @Input() executionAsync: boolean;

  ngOnChanges() {
    const element = this.returnIframeElement(ELEMENT_ID);

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.environmentId = envId;
      });

    const objectToTransfer = this.getMessage(element, this.basePath, this.data);

    if (this.url && !this.extensionsService.isUsingSecureProtocol(this.url)) {
      return;
    }
    element.src = this.url;

    if (false === this.executionAsync) {
      return (element.onload = () => {
        this.sendMessage(element, objectToTransfer);
      });
    }

    return this.extAppViewRegistryService.deregisterView(element.contentWindow);
  }

  ngOnDestroy() {
    const element = this.returnIframeElement(ELEMENT_ID);

    if (this.url) {
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }

    this.currentEnvironmentSubscription.unsubscribe();
  }

  returnIframeElement(elementId) {
    return document.getElementById(elementId) as HTMLIFrameElement;
  }

  getMessage(element, basePath, data?) {
    const session = this.extAppViewRegistryService.registerView(
      element.contentWindow
    );
    const dataToSend = {
      currentEnvironmentId: this.environmentId ? this.environmentId : 'default',
      sessionId: session,
      linkManagerData: {
        basePath
      }
    };

    if (data) {
      return { ...dataToSend, ...data };
    }

    return dataToSend;
  }

  sendMessage(element, data) {
    element.contentWindow.postMessage(['init', data], '*');
  }
}
