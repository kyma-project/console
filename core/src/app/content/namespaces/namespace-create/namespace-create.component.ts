import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { NamespacesService } from '../services/namespaces.service';
import LuigiClient from '@kyma-project/luigi-client';
import { ModalService, ModalComponent } from 'fundamental-ngx';

@Component({
  selector: 'app-namespace-create',
  templateUrl: './namespace-create.component.html',
  styleUrls: ['./namespace-create.component.scss']
})
export class NamespaceCreateComponent {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('createNamespaceModal') createNamespaceModal: ModalComponent;

  // default values
  public isActive = true;
  public namespaceName = '';
  public labels = ['istio-injection=true'];
  public memoryLimits = '3Gi';
  public memoryRequests = '3006477108';
  public max = '1Gi';
  public default = '512Mi';
  public defaultRequest = '32Mi';

  // checkboxes
  public istioInjectionEnabled = true;
  public resourceQuotasExpanded = false;
  public limitRangesExpanded = false;

  // input errors
  public err = undefined;
  public wrongName = false;
  public wrongLabels = false;
  public memoryLimitsError = false;
  public memoryRequestsError = false;
  public maxError = false;
  public defaultError = false;
  public defaultRequestError = false;

  public regexErrorMessage = 'Regex error arrrrrrrr. Regex error arrrrrrrr.';

  constructor(
    private namespacesService: NamespacesService,
    private modalService: ModalService
  ) {}

  public createNamespace() {
    this.namespacesService.createNamespace(this.namespaceName).subscribe(
      () => {
        this.isActive = false;
        this.refreshContextSwitcher();
        this.navigateToDetails(this.namespaceName);
      },
      err => {
        this.err = err.error.message || err.message;
      }
    );
  }

  public cancel() {
    this.modalService.close(this.createNamespaceModal);
  }

  public show() {
    this.setDefaultValues();
    this.modalService.open(this.createNamespaceModal).result.finally(() => {
      this.isActive = false;
      this.wrongName = false;
      this.cancelEvent.emit();
    });
  }

  public navigateToDetails(namespaceName) {
    LuigiClient.linkManager().navigate(`/home/namespaces/${namespaceName}/details`);
  }

  public validateRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    this.namespaceName
      ? (this.wrongName = !regex.test(this.namespaceName))
      : (this.wrongName = false);
  }

  public validateLimitsRegex(change, name) {
    const regex = /^([+-]?[0-9.]+)([eEinumkKMGTP]*[-+]?[0-9]*)$/;
    change ? (this[name] = !regex.test(change)) : (this[name] = false)
  }

  public validateMemoryRequests(change) {
    this.memoryRequestsError = isNaN(change);
  }

  private refreshContextSwitcher() {
    window.parent.postMessage({ msg: 'luigi.refresh-context-switcher' }, '*');
  }

  public updateLabels({
    labels,
    wrongLabels
  }: {
    labels?: string[];
    wrongLabels?: boolean;
  }): void {
    if (labels) {

      // disable 'istio injection' button if label has been removed.
      const istioLabel = labels.find(this.findIstioLabel);
      if (istioLabel) {
        const value = istioLabel.split('=')[1];
        this.istioInjectionEnabled = value === 'true';
      } else {
        this.istioInjectionEnabled = false;
      }
    }
    this.labels = labels !== undefined ? labels : this.labels;
    this.wrongLabels = wrongLabels !== undefined ? wrongLabels : this.wrongLabels;
  }

  public toggleIstioCheck(checked: boolean) {
    if (this.labels && this.labels.length > 0) {
      const istioLabel = this.labels.find(this.findIstioLabel);
      if (istioLabel) {
        this.labels.splice(this.labels.indexOf(istioLabel), 1)
      }
    }
    const istioLabelArray = ['istio-injection', checked.toString()]
    this.labels.push(istioLabelArray.join('='))
  }

  public findIstioLabel(label) {
    const key = label.split('=')[0];
    return key === 'istio-injection'
  }

  public setDefaultValues() {
    // default values
    this.isActive = true;
    this.namespaceName = '';
    this.labels = ['istio-injection=true'];
    this.memoryLimits = '3Gi';
    this.memoryRequests = '3006477108';
    this.max = '1Gi';
    this.default = '512Mi';
    this.defaultRequest = '32Mi';

    // checkboxes
    this.istioInjectionEnabled = true;
    this.resourceQuotasExpanded = false;
    this.limitRangesExpanded = false;
  
    // input errors
    this.err = undefined;
    this.wrongName = false;
    this.wrongLabels = false;
    this.memoryLimitsError = false;
    this.memoryRequestsError = false;
    this.maxError = false;
    this.defaultError = false;
    this.defaultRequestError = false;
  }
}

// TODO : write regex