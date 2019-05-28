import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { NamespacesService } from '../services/namespaces.service';
import LuigiClient from '@kyma-project/luigi-client';
import { ModalService, ModalComponent } from 'fundamental-ngx';

@Component({
  selector: 'app-namespace-create',
  templateUrl: './namespace-create.component.html'
})
export class NamespaceCreateComponent {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('createNamespaceModal') createNamespaceModal: ModalComponent;

  public namespaces = [];
  public namespaceName: string;
  public isActive: boolean;
  public err: string;
  public wrongName = false;
  public istioInjectionEnabled = true;
  public resourceQuotasExpanded = false;
  public limitRangesExpanded = false;
  public labels = ['istio-injection=true'];
  public wrongLabels = false;

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
    this.namespaceName = '';
    this.err = undefined;
    this.isActive = true;

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

  private refreshContextSwitcher() {
    window.parent.postMessage({ msg: 'luigi.refresh-context-switcher' }, '*');
  }

  public showResourceQuotas(bla) {
    console.log(bla)
    return bla
  }

  public updateLabels({
    labels,
    wrongLabels
  }: {
    labels?: string[];
    wrongLabels?: boolean;
  }): void {
    if (labels) {
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

  private findIstioLabel(label) {
    const key = label.split('=')[0];
    return key === 'istio-injection'
  }
}