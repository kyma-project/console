import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { NamespacesService } from '../services/namespaces.service';
import LuigiClient from '@kyma-project/luigi-client';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-namespace-create',
  templateUrl: './namespace-create.component.html',
  styleUrls: ['./namespace-create.component.scss']
})
export class NamespaceCreateComponent {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('createNamespaceModal')
  createNamespaceModal: TemplateRef<ModalRef>;

  // default values
  public isActive: boolean;
  public namespaceName: string;
  public labels: string[];
  public memoryLimits: string;
  public memoryRequests: string;
  public max: string;
  public default: string;
  public defaultRequest: string;

  // checkboxes
  public istioInjectionEnabled: boolean;
  public resourceQuotaChecked: boolean;
  public limitRangeChecked: boolean;

  // input errors
  public err: string;
  public nameError: boolean;
  public labelsError: boolean;
  public memoryLimitsError: boolean;
  public memoryRequestsError: boolean;
  public maxError: boolean;
  public defaultError: boolean;
  public defaultRequestError: boolean;

  public regexErrorMessage = `Use plain value in bytes, or suffix equivalents. For example: 128974848, 129e6, 129M, 123Mi.`;

  constructor(
    private namespacesService: NamespacesService,
    private modalService: ModalService
  ) {}

  public createNamespace() {
    this.namespacesService
      .createNamespace(this.namespaceName, this.labelsArrayToObject())
      .subscribe(
        () => {
          const handleSuccess = () => {
            this.isActive = false;
            this.refreshContextSwitcher();
            this.navigateToDetails(this.namespaceName);
          };

          if (this.resourceQuotaChecked && this.limitRangeChecked) {
            this.createResourceQuotaAndLimitRange().subscribe(
              () => {
                handleSuccess();
              },
              err => {
                this.refreshContextSwitcher();
                this.err = `Namespace has been created, but there was an error while creating Limits: ${err}`;
              }
            );
          } else if (this.resourceQuotaChecked && !this.limitRangeChecked) {
            this.createResourceQuota().subscribe(
              () => {
                handleSuccess();
              },
              err => {
                this.refreshContextSwitcher();
                this.err = `Namespace has been created, but there was an error while creating Resource Quota: ${err}`;
              }
            );
          } else if (this.limitRangeChecked && !this.resourceQuotaChecked) {
            this.createLimitRange().subscribe(
              () => {
                handleSuccess();
              },
              err => {
                this.refreshContextSwitcher();
                this.err = `Namespace has been created, but there was an error while creating Limit Range: ${err}`;
              }
            );
          } else {
            handleSuccess();
          }
        },
        err => {
          this.err = err;
        }
      );
  }

  public createResourceQuotaAndLimitRange() {
    return this.namespacesService.createResourceQuotaAndLimitRange(
      this.namespaceName,
      this.memoryLimits,
      this.memoryRequests,
      this.default,
      this.defaultRequest,
      this.max
    );
  }

  public createResourceQuota() {
    return this.namespacesService.createResourceQuota(
      this.namespaceName,
      this.memoryLimits,
      this.memoryRequests
    );
  }

  public createLimitRange() {
    return this.namespacesService.createLimitRange(
      this.namespaceName,
      this.default,
      this.defaultRequest,
      this.max
    );
  }

  public namespaceCanBeCreated(): boolean {
    const hasErrors =
      this.err ||
      this.nameError ||
      this.labelsError ||
      this.memoryLimitsError ||
      this.memoryRequestsError ||
      this.maxError ||
      this.defaultError ||
      this.defaultRequestError;
    let rqFields = true;
    let lrFields = true;
    if (this.resourceQuotaChecked) {
      rqFields = !!(this.memoryLimits && this.memoryRequests);
    }
    if (this.limitRangeChecked) {
      lrFields = !!(this.default && this.defaultRequest && this.max);
    }
    return this.namespaceName && rqFields && lrFields && !hasErrors;
  }

  public show() {
    this.setDefaultValues();
    this.modalService
      .open(this.createNamespaceModal)
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        this.nameError = false;
        this.cancelEvent.emit();
      });
  }

  public setDefaultValues() {
    // default values
    this.isActive = true;
    this.namespaceName = '';
    this.labels = ['istio-injection=enabled'];
    this.memoryLimits = '3Gi';
    this.memoryRequests = '2.8Gi';
    this.max = '1Gi';
    this.default = '512Mi';
    this.defaultRequest = '32Mi';

    // checkboxes
    this.istioInjectionEnabled = true;
    this.resourceQuotaChecked = false;
    this.limitRangeChecked = false;

    // input errors
    this.err = undefined;
    this.nameError = false;
    this.labelsError = false;
    this.memoryLimitsError = false;
    this.memoryRequestsError = false;
    this.maxError = false;
    this.defaultError = false;
    this.defaultRequestError = false;
  }

  public cancel() {
    if (this.modalService) {
      this.modalService.dismissAll();
    }
  }

  public removeError() {
    this.err = undefined;
  }

  public navigateToDetails(namespaceName: string) {
    LuigiClient.linkManager().navigate(
      `/home/namespaces/${namespaceName}/details`
    );
  }

  private refreshContextSwitcher() {
    window.parent.postMessage({ msg: 'luigi.refresh-context-switcher' }, '*');
  }

  public validateRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    this.namespaceName
      ? (this.nameError = !regex.test(this.namespaceName))
      : (this.nameError = false);
  }

  public validateLimitsRegex(change: string, name: string) {
    //  plain integer or plain integer + k | Ki | M | Mi | G | Gi | T | Ti | P | Pi | E | Ei | m
    const regex = /^[+]?[0-9]*(\.[0-9]*)?(([eE][-+]?[0-9]+(\.[0-9]*)?)?|([MGTPE]i?)|Ki|k|m)?$/;
    change ? (this[name] = !regex.test(change)) : (this[name] = false);
  }

  public updateLabels({
    labels,
    wrongLabels
  }: {
    labels?: string[];
    wrongLabels?: boolean;
  }): void {
    if (labels) {
      // enable 'istio injection' button if label has been removed (by default istio is injected if label is not in place).
      const istioLabel = labels.find(this.isIstioLabel);
      if (istioLabel) {
        const value = istioLabel.split('=')[1];
        this.istioInjectionEnabled = value === 'enabled';
      } else {
        this.istioInjectionEnabled = true;
      }
    }
    this.labels = labels !== undefined ? labels : this.labels;
    this.labelsError =
      wrongLabels !== undefined ? wrongLabels : this.labelsError;
  }

  public toggleIstioCheck(checked: boolean) {
    if (this.labels && this.labels.length > 0) {
      const istioLabel = this.labels.find(this.isIstioLabel);
      if (istioLabel) {
        this.labels.splice(this.labels.indexOf(istioLabel), 1);
      }
    }
    const istioLabelArray = [
      'istio-injection',
      checked ? 'enabled' : 'disabled'
    ];
    this.labels.push(istioLabelArray.join('='));
  }

  public isIstioLabel(label: string): boolean {
    const key = label.split('=')[0];
    return key === 'istio-injection';
  }

  public labelsArrayToObject(): object {
    const labelsObject = {};
    if (this.labels && this.labels.length > 0) {
      this.labels.forEach(label => {
        const [key, value] = label.split('=');
        labelsObject[key] = value;
      });
    }
    return labelsObject;
  }
}
