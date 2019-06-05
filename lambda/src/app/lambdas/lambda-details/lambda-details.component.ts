/* tslint:disable:no-submodule-imports */
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HttpErrorResponse,
  HttpHeaders,
  HttpClient,
} from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of as observableOf, Observable, forkJoin } from 'rxjs';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/snippets/javascript';
import 'brace/snippets/json';
import 'brace/snippets/text';
import 'brace/mode/javascript';
import 'brace/mode/json';

// this is a curated list of themes that fit to fiori
// tomorrow is the one who looks most similar
// import 'brace/theme/chrome';
// import 'brace/theme/sqlserver';
// import 'brace/theme/textmate';
import 'brace/theme/tomorrow';

import { sha256 } from 'js-sha256';
import { Clipboard } from 'ts-clipboard';
import * as randomatic from 'randomatic';
import * as luigiClient from '@kyma-project/luigi-client';

import { Lambda } from '../../shared/datamodel/k8s/function';
import { LambdaDetailsService } from './lambda-details.service';
import { IMetaData } from '../../shared/datamodel/k8s/generic/meta-data';
import { ITrigger } from '../../shared/datamodel/trigger';
import { AppConfig } from '../../app.config';
import { HTTPEndpoint } from '../../shared/datamodel/http-endpoint';
import { Event } from '../../shared/datamodel/event';
import { ApisService } from '../../apis/apis.service';
import { Api } from '../../shared/datamodel/k8s/api';
import { FetchTokenModalComponent } from '../../fetch-token-modal/fetch-token-modal.component';
import { ServiceBindingUsagesService } from '../../service-binding-usages/service-binding-usages.service';
import { ServiceBindingsService } from '../../service-bindings/service-bindings.service';
import { InstanceBindingState } from '../../shared/datamodel/instance-binding-state';
import { EventTrigger } from '../../shared/datamodel/event-trigger';
import { EventActivationsService } from '../../event-activations/event-activations.service';
import { EventActivation } from '../../shared/datamodel/k8s/event-activation';
import { Subscription } from '../../shared/datamodel/k8s/subscription';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { EventTriggerChooserComponent } from './event-trigger-chooser/event-trigger-chooser.component';
import { HttpTriggerComponent } from './http-trigger/http-trigger.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

import {has as _has, get as _get, set as _set} from 'lodash';

const DEFAULT_CODE = `module.exports = { main: function (event, context) {

} }`;

const FUNCTION = 'function';

interface INotificationData {
  type: 'info' | 'success' | 'error';
  message: string;
  description?: string;
}

@Component({
  selector: 'app-lambda-details',
  templateUrl: './lambda-details.component.html',
  styleUrls: ['./lambda-details.component.scss'],
})
export class LambdaDetailsComponent implements OnInit, OnDestroy {
  selectedTriggers: ITrigger[] = [];
  availableEventTriggers: EventTrigger[] = [];
  existingEventTriggers: EventTrigger[] = [];

  namespace: string;
  token: string;
  types: object[] = [
    {
      aceMode: 'javascript',
      kind: 'nodejs6',
    },
    {
      aceMode: 'javascript',
      kind: 'nodejs8',
    },
  ];

  theme: string;

  public initialLabels: string[];
  public updatedLabels: string[];

  @ViewChild('functionName') functionName: ElementRef;
  @ViewChild('fetchTokenModal') fetchTokenModal: FetchTokenModalComponent;
  @ViewChild('eventTriggerChooserModal')
  eventTriggerChooserModal: EventTriggerChooserComponent;
  @ViewChild('httpTriggerModal') httpTriggerModal: HttpTriggerComponent;

  @ViewChild('editLabelsForm') editLabelsForm: NgForm;

  code: string;
  dependency: string;
  aceMode: string;
  aceDependencyMode: string;
  mode = 'create';
  title = '';
  kind: string;
  selectedFunctionSize: object;
  selectedFunctionSizeName: string;
  showSample = false;
  toggleTrigger = false;
  toggleTriggerType = false;
  typeDropdownHidden = true;
  sizeDropdownHidden = true;
  isLambdaFormValid = true;
  showHTTPURL: HTTPEndpoint = null;
  httpURL = '';
  labels = [];
  annotations = [];
  md: IMetaData = {
    name: '',
  };
  lambda = new Lambda({
    metadata: this.md,
  });
  loaded = false;
  newLabel;
  wrongLabel = false;
  wrongLabelMessage = '';
  error: string;
  hasDependencies = false;
  envVarKey = '';
  envVarValue = '';
  isEnvVariableNameInvalid = false;
  isFunctionNameInvalid = false;
  isFunctionNameEmpty = false;
  isHTTPTriggerAdded = false;
  isHTTPTriggerAuthenticated = true;
  existingHTTPEndpoint: Api;
  bindingState: Map<string, InstanceBindingState>;
  listenerId: number;
  functionSizes = [];
  dropDownStates = {};
  testPayload = {};
  responseEditorMode: 'json' | 'text' = 'json';
  notificationTimeout: NodeJS.Timeout;

  public issuer: string;
  public jwksUri: string;
  public authType: string;

  public canShowLogs = false;
  public currentTab = 'config';
  public testPayloadText = JSON.stringify(this.testPayload, null, 2);
  public currentNotification: INotificationData = {
    type: 'info',
    message: '',
  };
  public testingResponse = '';

  @ViewChild('dependencyEditor') dependencyEditor;
  @ViewChild('editor') editor;
  @ViewChild('labelsInput') labelsInput;
  @ViewChild('isFunctionNameInvalidAlert') isFunctionNameInvalidAlert;

  constructor(
    private apisService: ApisService,
    private eventActivationsService: EventActivationsService,
    private lambdaDetailsService: LambdaDetailsService,
    private serviceBindingUsagesService: ServiceBindingUsagesService,
    private serviceBindingsService: ServiceBindingsService,
    private subscriptionsService: SubscriptionsService,
    private cdr: ChangeDetectorRef,
    protected route: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.functionSizes = AppConfig.functionSizes.map(s => s['size']).map(s => {
      s.description = `Memory: ${s.memory} CPU: ${s.cpu} minReplicas: ${
        s.minReplicas
      } maxReplicas: ${s.maxReplicas}`;
      return s;
    });

    this.selectedFunctionSize = this.functionSizes[0];
    this.selectedFunctionSizeName = this.selectedFunctionSize['name'];

    // this.theme = 'chrome'; // blue, violet, orange
    // this.theme = 'sqlserver'; // mint, orange
    // this.theme = 'textmate'; // white blueish
    this.theme = 'tomorrow'; // blue, violet orange, lighter
    this.aceMode = 'javascript';
    this.aceDependencyMode = 'json';
    this.kind = 'nodejs8';
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.listenerId = luigiClient.addInitListener(() => {
          this.initCanShowLogs();
          const eventData = luigiClient.getEventData();
          this.namespace = eventData.namespaceId;
          this.token = eventData.idToken;
          if (params['name']) {
            this.mode = 'update';
            const lambdaName = params['name'];
            this.title = `${lambdaName} Details`;
            this.getFunction(lambdaName);
            this.apisService
              .getApi(lambdaName, this.namespace, this.token)
              .subscribe(
                api => {
                  this.existingHTTPEndpoint = api;
                  this.httpURL = `${api.spec.hostname}`;
                  const httpEndPoint: HTTPEndpoint = this.getHTTPEndPointFromApi(
                    api,
                  );
                  this.selectedTriggers.push(httpEndPoint);
                  this.isHTTPTriggerAdded = true;
                  this.isHTTPTriggerAuthenticated = httpEndPoint.isAuthEnabled;
                  this.jwksUri = httpEndPoint.authentication.jwt.jwksUri;
                  this.authType = httpEndPoint.authentication.type;
                },
                err => {
                  // Can be a valid 404 error when api is not found of a function
                },
              );
            this.subscriptionsService
              .getSubscriptions(this.namespace, this.token, {
                labelSelector: `Function=${lambdaName}`,
              })
              .subscribe(resp => {
                resp.items.forEach(sub => {
                  const evTrigger: EventTrigger = {
                    eventType: sub.spec.event_type,
                    version: sub.spec.event_type_version,
                    sourceId: sub.spec.source_id,
                  };
                  this.selectedTriggers.push(evTrigger);
                  this.existingEventTriggers.push(evTrigger);
                });
              });
          } else {
            this.title = 'Create Lambda Function';
            this.lambda = this.lambdaDetailsService.initializeLambda();
            this.lambda.spec.function = this.code = DEFAULT_CODE;

            this.setLoaded(true);
            this.initializeEditor();
            if (!this.lambda.metadata.name || this.isFunctionNameInvalid) {
              this.editor.setReadOnly(true);
            }
            if (this.lambda.metadata.name === '') {
              this.functionName.nativeElement.focus();
            }
          }

          this.eventActivationsService
            .getEventActivations(this.namespace, this.token)
            .subscribe(resp => {
              resp.data.eventActivations.forEach(ea => {
                ea.events.forEach(ev => {
                  const eventTrigger: EventTrigger = {
                    eventType: ev.eventType,
                    sourceId: ea.sourceId,
                    description: ev.description,
                    version: ev.version,
                  };
                  this.availableEventTriggers.push(eventTrigger);
                });
              });
            });
        });
      },
      err => {
        this.navigateToList();
      },
    );
  }

  ngOnDestroy() {
    if (this.listenerId) {
      luigiClient.removeInitListener(this.listenerId);
    }
  }

  showError(error: string): void {
    this.error = error;
  }

  toggleDropdownState(id: string): void {
    const isOpened = this.dropDownStates[id] || false;
    this.dropDownStates[id] = !isOpened;
  }

  selectType(selectedType) {
    this.aceMode = selectedType.aceMode;
    this.kind = selectedType.kind;
    this.typeDropdownHidden = true;
  }

  selectSize(selectedSize) {
    this.selectedFunctionSize = selectedSize;
    this.selectedFunctionSizeName = this.selectedFunctionSize['name'];
    this.sizeDropdownHidden = true;
  }

  onCodeChange(event) {
    const isChange = this.lambda.spec.function !== event;
    this.lambda.spec.function = event;
    if (isChange) {
      this.warnUnsavedChanges(true);
    }
  }

  onDependencyChange(event) {
    const isChange = this.lambda.spec.deps !== event;
    this.lambda.spec.deps = event;
    if (isChange) {
      this.warnUnsavedChanges(true);
    }
  }

  selectedServiceInstance($event): object {
    return $event;
  }

  deployLambda() {
    this.lambdaDetailsService
      .getResourceQuotaStatus(this.namespace, this.token)
      .pipe(
        finalize(() => {
          if (this.mode === 'create') {
            this.createFunction();
          } else {
            this.updateFunction();
          }
        }),
      )
      .subscribe(res => {
        const msg = {
          msg: 'console.quotaexceeded',
          data: res.data,
          env: this.namespace,
        };
        window.parent.postMessage(msg, '*');
      });
  }

  isEventTriggerPresent(): boolean {
    if (
      (this.isHTTPTriggerAdded && this.selectedTriggers.length > 1) ||
      (!this.isHTTPTriggerAdded && this.selectedTriggers.length > 0) ||
      this.availableEventTriggers.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateFunction(): void {
    this.warnUnsavedChanges(false);
    this.lambda.metadata.labels = this.getUpdatedLabels();
    this.lambda.spec.runtime = this.kind;
    this.lambda.spec.topic =
      this.selectedTriggers.length > 0
        ? this.selectedTriggers[0].eventType
        : 'undefined';
    this.setChecksum();

    if (this.functionSizeHasChanged() === true) {
      this.lambdaDetailsService.deleteHPA(this.lambda, this.token).subscribe(
        hpa => {
          this.setFunctionSize();
          this.lambda.metadata.annotations = {
            'function-size': `${this.selectedFunctionSize['name']}`,
          };
          this.handleFunctionUpdate();
        },
        err => {
          console.error('deleteHPA Error', err);
          this.showError(err.message);
        },
      );
    } else {
      this.handleFunctionUpdate();
    }
  }

  handleFunctionUpdate() {
    this.lambdaDetailsService.updateLambda(this.lambda, this.token).subscribe(
      lambda => {
        if (this.isHTTPTriggerAdded) {
          if (this.existingHTTPEndpoint) {
            this.updateApi();
          } else {
            this.createApi();
          }
        } else if (!this.isHTTPTriggerAdded && this.existingHTTPEndpoint) {
          // delete API and manage service bindings
          this.apisService
            .deleteApi(this.lambda.metadata.name, this.namespace, this.token)
            .subscribe(
              () => {
                this.manageServiceBindings();
                this.lambda = lambda;
              },
              err => {
                this.showError(err.message);
              },
            );
        } else {
          // manage service bindings only
          this.manageServiceBindings();
          this.lambda = lambda;
        }
      },
      err => {
        this.showError(err.message);
      },
    );
  }

  manageServiceBindings(): void {
    const createBindingAndUsageResources: InstanceBindingState[] = [];
    const deleteBindingUsageResources: InstanceBindingState[] = [];
    if (this.bindingState === undefined) {
      if (this.isEventTriggerPresent()) {
        this.manageEventTriggers();
      } else {
        this.navigateToList();
      }
    } else {
      // Changes in binding state
      this.bindingState.forEach((v, k) => {
        if (
          v.hasChanged &&
          (v.currentState !== undefined || v.previousState !== undefined)
        ) {
          if (
            v.currentState === undefined &&
            v.previousState !== undefined &&
            Object.keys(v.previousState).length > 0
          ) {
            // ServiceBindingUsage needs to be deleted.
            deleteBindingUsageResources.push(v);
          } else if (
            v.currentState !== undefined &&
            Object.keys(v.currentState).length > 0 &&
            v.previousState === undefined
          ) {
            // ServiceBinding and ServiceBindingUsage need to be created.
            createBindingAndUsageResources.push(v);
          } else {
            // ServiceBindingUsage needs to be modified.
            deleteBindingUsageResources.push(v);
            createBindingAndUsageResources.push(v);
          }
        }
      });
      if (
        createBindingAndUsageResources.length > 0 ||
        this.deleteAndCreateBindingAndUsages.length > 0
      ) {
        this.deleteAndCreateBindingAndUsages(
          createBindingAndUsageResources,
          deleteBindingUsageResources,
        );
      } else {
        if (this.isEventTriggerPresent) {
          this.manageEventTriggers();
        } else {
          this.navigateToList();
        }
      }
    }
  }

  deleteAndCreateBindingAndUsages(
    createBindingStates: InstanceBindingState[],
    deleteBindingStates: InstanceBindingState[],
  ): void {
    const createRequests = [];
    const deleteRequests = [];

    createBindingStates.forEach(bs => {
      const serviceBindingName = randomatic('a', 10, {});
      const serviceBindingUsage = this.serviceBindingUsagesService.initializeServiceBindingUsage();
      serviceBindingUsage.metadata.namespace = this.namespace;
      serviceBindingUsage.metadata.name = serviceBindingName;
      if (bs.currentState.createSecret) {
        const serviceBinding = this.serviceBindingsService.initializeServiceBinding();
        serviceBinding.metadata.namespace = this.namespace;
        serviceBinding.metadata.name = serviceBindingName;
        serviceBinding.metadata.labels = {
          Function: this.lambda.metadata.name,
        };
        serviceBinding.spec.instanceRef.name = bs.currentState.instanceName;
        serviceBindingUsage.spec.serviceBindingRef.name = serviceBindingName;
        serviceBindingUsage.metadata.labels = {
          Function: this.lambda.metadata.name,
          ServiceBinding: serviceBindingName,
        };
        if (bs.currentState.instanceBindingPrefix !== undefined) {
          serviceBindingUsage.spec.parameters.envPrefix.name =
            bs.currentState.instanceBindingPrefix + '-';
        }
        createRequests.push(
          this.serviceBindingsService
            .createServiceBinding(serviceBinding, this.token)
            .pipe(
              catchError(err => {
                return observableOf(err);
              }),
            ),
        );
      } else {
        serviceBindingUsage.spec.serviceBindingRef.name =
          bs.currentState.serviceBinding;
        serviceBindingUsage.metadata.labels = {
          Function: this.lambda.metadata.name,
          ServiceBinding: bs.currentState.serviceBinding,
        };
        if (bs.currentState.instanceBindingPrefix !== undefined) {
          serviceBindingUsage.spec.parameters.envPrefix.name =
            bs.currentState.instanceBindingPrefix + '-';
        }
      }
      serviceBindingUsage.spec.usedBy.kind = FUNCTION;
      serviceBindingUsage.spec.usedBy.name = this.lambda.metadata.name;
      createRequests.push(
        this.serviceBindingUsagesService
          .createServiceBindingUsage(serviceBindingUsage, this.token)
          .pipe(
            catchError(err => {
              return observableOf(err);
            }),
          ),
      );
    });

    deleteBindingStates.forEach(bs => {
      this.serviceBindingUsagesService
        .getServiceBindingUsages(this.namespace, this.token, {})
        .subscribe(sbuList => {
          sbuList.items.forEach(sbu => {
            if (
              bs.previousState.serviceBinding ===
                sbu.spec.serviceBindingRef.name &&
              this.lambda.metadata.name === sbu.spec.usedBy.name &&
              sbu.spec.usedBy.kind === FUNCTION
            ) {
              deleteRequests.push(
                this.serviceBindingUsagesService
                  .deleteServiceBindingUsage(
                    sbu.metadata.name,
                    this.namespace,
                    this.token,
                  )
                  .pipe(
                    catchError(err => {
                      return observableOf(err);
                    }),
                  ),
              );
            }
          });
          forkJoin(deleteRequests).subscribe(responses => {
            responses.forEach(resp => {
              if (resp instanceof HttpErrorResponse) {
                const err = resp as HttpErrorResponse;
                this.showError(err.message);
              }
            });
            if (createRequests.length > 0) {
              this.executeCreateBindingRequests(createRequests);
            } else {
              if (this.isEventTriggerSelected) {
                this.manageEventTriggers();
              } else {
                this.navigateToList();
              }
            }
          });
        });
    });
    // Reaches here when there are deleteBindingStates are empty
    if (deleteBindingStates.length === 0) {
      this.executeCreateBindingRequests(createRequests);
    }
  }

  areEventTriggersEqual(sourceET: EventTrigger, destET: EventTrigger): boolean {
    if (
      sourceET.eventType === destET.eventType &&
      sourceET.version === destET.version &&
      sourceET.sourceId === destET.sourceId
    ) {
      return true;
    } else {
      return false;
    }
  }

  isEventTriggerNew(selectedEvTrigger: EventTrigger): boolean {
    let isEventTriggerNew = true;
    this.existingEventTriggers.forEach(existingTr => {
      if (this.areEventTriggersEqual(existingTr, selectedEvTrigger)) {
        isEventTriggerNew = false;
        return;
      }
    });
    return isEventTriggerNew;
  }

  getEventTriggersToBeRemoved(): EventTrigger[] {
    let eventTriggersToBeRemoved: EventTrigger[] = [];
    eventTriggersToBeRemoved = this.existingEventTriggers.filter(existingTr => {
      let isPresent = false;
      this.selectedTriggers.forEach(selectedTrigger => {
        if (
          this.areEventTriggersEqual(
            existingTr,
            selectedTrigger as EventTrigger,
          )
        ) {
          isPresent = true;
          return;
        }
      });
      return !isPresent;
    });
    return eventTriggersToBeRemoved;
  }

  manageEventTriggers() {
    const createSubscriptionRequests: Array<Observable<Subscription>> = [];
    const deleteSubscriptionRequests: Array<Observable<Subscription>> = [];
    this.selectedTriggers.forEach(trigger => {
      if (trigger.eventType !== 'http') {
        if (this.isEventTriggerNew(trigger as EventTrigger)) {
          const sub = this.subscriptionsService.initializeSubscription();
          sub.metadata.name = `lambda-${this.lambda.metadata.name}-${
            trigger.eventType
          }-${trigger.version}`.toLowerCase();
          sub.metadata.namespace = this.namespace;
          sub.metadata.labels['Function'] = this.lambda.metadata.name;
          sub.spec.endpoint = `http://${this.lambda.metadata.name}.${
            this.namespace
          }:8080/`;
          sub.spec.event_type = trigger.eventType;
          sub.spec.event_type_version = trigger.version;
          sub.spec.source_id = trigger.sourceId;
          const req = this.subscriptionsService
            .createSubscription(sub, this.token)
            .pipe(
              catchError(err => {
                return observableOf(err);
              }),
            );
          createSubscriptionRequests.push(req);
        }
      }
    });
    this.getEventTriggersToBeRemoved().forEach(et => {
      const req = this.subscriptionsService
        .deleteSubscription(
          `lambda-${this.lambda.metadata.name}-${et.eventType}-${
            et.version
          }`.toLowerCase(),
          this.namespace,
          this.token,
        )
        .pipe(
          catchError(err => {
            return observableOf(err);
          }),
        );
      deleteSubscriptionRequests.push(req);
    });
    this.executeCreateAndDeleteSubscriptionRequests(
      createSubscriptionRequests,
      deleteSubscriptionRequests,
    );
  }

  executeCreateAndDeleteSubscriptionRequests(
    createSubReqs: Array<Observable<Subscription>>,
    deleteSubReqs: Array<Observable<Subscription>>,
  ): void {
    if (createSubReqs.length > 0) {
      forkJoin(createSubReqs).subscribe(responses => {
        let errMessage: string;
        responses.forEach(response => {
          if (response instanceof HttpErrorResponse) {
            const err = response as HttpErrorResponse;
            errMessage =
              this.mode === 'create'
                ? 'Function is created but: ' + err.message
                : 'Function is updated but: ' + err.message;
            return;
          }
        });
        if (deleteSubReqs.length > 0) {
          this.executeDeleteSubscriptionRequests(deleteSubReqs);
        } else {
          if (errMessage === undefined) {
            this.navigateToList();
          } else {
            this.showError(errMessage);
          }
        }
      });
    } else {
      if (deleteSubReqs.length > 0) {
        this.executeDeleteSubscriptionRequests(deleteSubReqs);
      } else {
        this.navigateToList();
      }
    }
  }

  executeDeleteSubscriptionRequests(deleteSubReqs: any): void {
    forkJoin(deleteSubReqs).subscribe(responses => {
      let errMessage: string;
      responses.forEach(response => {
        if (response instanceof HttpErrorResponse) {
          const err = response as HttpErrorResponse;
          errMessage =
            this.mode === 'create'
              ? 'Function is created but: ' + err.message
              : 'Function is updated but: ' + err.message;
          return;
        }
      });
      if (errMessage === undefined) {
        this.navigateToList();
      } else {
        this.showError(errMessage);
      }
    });
  }

  executeCreateBindingRequests(createRequests: any): void {
    forkJoin(createRequests).subscribe(responses => {
      let errMessage: string;
      responses.forEach(response => {
        if (response instanceof HttpErrorResponse) {
          const err = response as HttpErrorResponse;
          if (
            err.status !== 409 ||
            response.error.details.kind !== 'servicebindings'
          ) {
            errMessage =
              this.mode === 'create'
                ? 'Function is created but: ' + err.message
                : 'Function is updated but: ' + err.message;
            return;
          }
        }
      });
      if (errMessage === undefined) {
        if (this.isEventTriggerSelected) {
          this.manageEventTriggers();
        } else {
          this.navigateToList();
        }
      } else {
        this.showError(errMessage);
      }
    });
  }

  createFunction(): void {
    this.warnUnsavedChanges(false);
    this.lambda.metadata.namespace = this.namespace;
    this.lambda.spec.runtime = this.kind;
    if (this.selectedTriggers.length > 0) {
      this.lambda.spec.topic = this.selectedTriggers[0].eventType;
    }
    this.lambda.spec.service.selector = {
      'created-by': 'kubeless',
      function: this.lambda.metadata.name,
    };
    this.lambda.metadata.annotations = {
      'function-size': `${this.selectedFunctionSize['name']}`,
    };

    this.lambda.metadata.labels = this.getUpdatedLabels();

    this.setFunctionSize();

    this.lambdaDetailsService.createLambda(this.lambda, this.token).subscribe(
      lambda => {
        if (this.isHTTPTriggerAdded) {
          this.createApi();
        } else {
          this.manageServiceBindings();
          this.lambda = lambda;
        }
      },
      err => {
        console.error('createLambda Error', err);
        this.showError(err.message);
      },
    );
  }

  setChecksum() {
    this.lambda.spec.checksum = 'sha256:' + sha256(this.lambda.spec.function);
  }

  addSnippet(id: string) {
    const snippet = null;
    if (snippet) {
      this.editor
        .getEditor()
        .setValue(
          '/*' + snippet + '\n*/\n' + this.editor.getEditor().getValue(),
        );
      this.editor.getEditor().selection.clearSelection();
    }
  }

  setLoaded(value: boolean): void {
    this.loaded = value;
    this.cdr.detectChanges();
  }

  initializeEditor() {
    const editorOptions = {
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      minLines: 12,
      maxLines: 1000,
      printMargin: false,
    };
    this.editor.getEditor().setOptions(editorOptions);
    this.dependencyEditor.getEditor().setOptions(editorOptions);
  }

  getFunction(functionName): void {
    this.lambdaDetailsService
      .getLambda(functionName, this.namespace, this.token)
      .subscribe(
        lambda => {
          this.lambda = lambda;
          this.labels = this.getLabels(lambda);
          this.initialLabels = this.updatedLabels = this.getLabels(lambda);
          this.annotations = this.getAnnotations(lambda);
          this.code = lambda.spec.function;
          this.kind = lambda.spec.runtime;
          this.dependency = lambda.spec.deps;
          this.hasDependencies =
            this.dependency != null &&
            this.dependency !== undefined &&
            this.dependency !== '';

          if (!_has(this, 'lambda.spec.deployment.spec.template.spec.containers[0].env')) {
            _set(this, 'lambda.spec.deployment.spec.template.spec.containers[0].env', []);
          }

          this.setLoaded(true);
          this.initializeEditor();
          if(lambda.metadata && lambda.metadata.annotations){
            this.functionSizes.forEach(s => {
            if (`${s.name}` === lambda.metadata.annotations['function-size']) {
              this.selectedFunctionSize = s;
              this.selectedFunctionSizeName = this.selectedFunctionSize['name'];
            }
            });
          }
        },
        err => {
          this.navigateToList();
        },
      );
  }

  getLabels(lambda): string[] {
    const labels = [];
    for (const key in lambda.metadata.labels) {
      if (lambda.metadata.labels.hasOwnProperty(key)) {
        if (lambda.metadata.labels[key] === 'undefined') {
          labels.push(key);
        } else {
          labels.push(key + '=' + lambda.metadata.labels[key]);
        }
      }
    }
    return labels;
  }

  getAnnotations(lambda): string[] {
    const annotations = [];
    for (const key in lambda.metadata.annotations) {
      if (lambda.metadata.annotations.hasOwnProperty(key)) {
        if (lambda.metadata.annotations[key] === 'undefined') {
          annotations.push(key);
        } else {
          annotations.push(key + '=' + lambda.metadata.annotations[key]);
        }
      }
    }
    return annotations;
  }

  cancel() {
    this.navigateToList();
  }

  initCanShowLogs() {
    luigiClient
      .linkManager()
      .pathExists('/home/cmf-logs')
      .then(exists => {
        this.canShowLogs = exists;
      });
  }

  showLogs() {
    luigiClient
      .linkManager()
      .withParams({
        function: this.lambda.metadata.name,
        namespace: this.namespace,
        container_name: this.lambda.metadata.name,
      })
      .openAsModal('/home/cmf-logs');
  }

  navigateToList() {
    setTimeout(() => {
      luigiClient
        .linkManager()
        .fromClosestContext()
        .navigate('/');
    }, 100);
  }

  getEventActivations(): void {
    this.eventActivationsService
      .getEventActivations(this.namespace, this.token)
      .subscribe(
        events => {
          this.setLoaded(true);
        },
        err => {
          this.showError(err.message);
        },
      );
  }

  showHTTPTrigger(): void {
    this.isHTTPTriggerAuthenticated = true;
    this.toggleTriggerType = false;
    this.httpTriggerModal.show(this.lambda, this.namespace, [
      ...this.selectedTriggers,
    ]);
  }

  unselectEvent(event: ITrigger) {
    const index = this.selectedTriggers.indexOf(event);
    if (index > -1) {
      this.selectedTriggers.splice(index, 1);
    }

    if (event.eventType === 'http') {
      this.isHTTPTriggerAdded = false;
    }
  }

  isNewLabelValid(label) {
    const key = label.split('=')[0].trim();
    const value = label.split('=')[1].trim();
    if (this.duplicateKeyExists(key)) {
      this.wrongLabelMessage = `Invalid label ${key}:${value}! Keys cannot be reused!`;
      return false;
    }
    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const foundKey = key.match(regex);
    const isKeyValid =
      foundKey && foundKey[0] === key && key !== '' ? true : false;
    const foundVal = value.match(regex);
    const isValueValid =
      (foundVal && foundVal[0] === value) || value === '' ? true : false;
    if (!isKeyValid || !isValueValid) {
      this.wrongLabelMessage = `Invalid label ${key}:${value}! In a valid label, a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.`;
    }
    return isKeyValid && isValueValid ? true : false;
  }

  duplicateKeyExists(key) {
    let hasDuplicate = false;
    this.labels.forEach(l => {
      if (l.split('=')[0] === key) {
        hasDuplicate = true;
        return;
      }
    });
    return hasDuplicate;
  }

  addLabel() {
    this.wrongLabelMessage = '';
    if (
      this.newLabel &&
      this.newLabel.split('=').length === 2 &&
      this.isNewLabelValid(this.newLabel)
    ) {
      const newLabelArr = this.newLabel.split('=');
      this.newLabel = `${newLabelArr[0].trim()}=${newLabelArr[1].trim()}`;
      this.labels.push(this.newLabel);
      this.newLabel = '';
      this.wrongLabel = false;
      this.isLambdaFormValid = true;
      this.warnUnsavedChanges(true);
    } else {
      this.isLambdaFormValid = this.newLabel ? false : true;
      this.wrongLabel = this.newLabel ? true : false;
      this.wrongLabelMessage =
        this.wrongLabel && this.wrongLabelMessage
          ? this.wrongLabelMessage
          : `Invalid label ${
              this.newLabel
            }! A key and value should be separated by a "="`;
    }
  }

  updateLabel(label) {
    this.warnUnsavedChanges(true);
    this.removeLabel(label);
    this.newLabel = label;
    setTimeout(() => {
      this.labelsInput.nativeElement.focus();
    }, 100);
  }

  removeLabel(label) {
    const index = this.labels.indexOf(label);
    this.labels.splice(index, 1);
  }

  public updateLabelsData({
    labels,
    wrongLabels,
  }: {
    labels?: string[];
    wrongLabels?: boolean;
  }): void {
    this.updatedLabels = labels !== undefined ? labels : this.updatedLabels;
    this.wrongLabel = wrongLabels !== undefined ? wrongLabels : this.wrongLabel;
    // mark form as dirty when deleting an existing label
    this.editLabelsForm.form.markAsDirty();
  }

  getUpdatedLabels() {
    return (this.updatedLabels || []).reduce((acc, label) => {
      return { ...acc, [label.split('=')[0]]: label.split('=')[1] };
    }, {});
  }

  changeDependencies(status: boolean): void {
    if (status) {
      this.hasDependencies = true;
    } else {
      this.dependency = '';
      this.lambda.spec.deps = null;
      this.hasDependencies = false;
    }
  }

  /** validatesName checks whether a function name is a valid DNS-1035 label */
  validatesName(): void {
    if (this.lambda.metadata.name.length > 0) {
      this.warnUnsavedChanges(true);
    }
    const regex = /[a-z]([-a-z0-9]*[a-z0-9])?/;
    const found = this.lambda.metadata.name.match(regex);
    this.isFunctionNameEmpty = this.lambda.metadata.name === '' ? true : false;
    if (this.isFunctionNameEmpty) {
      this.isLambdaFormValid = false;
    }
    this.isFunctionNameInvalid =
      (found && found[0] === this.lambda.metadata.name) ||
      this.lambda.metadata.name === ''
        ? false
        : true;
    if (!this.lambda.metadata.name || this.isFunctionNameInvalid) {
      this.editor.setReadOnly(true);
      this.dependencyEditor.setReadOnly(true);
      this.isLambdaFormValid = false;
    } else {
      this.editor.setReadOnly(false);
      this.dependencyEditor.setReadOnly(false);
      this.isLambdaFormValid = true;
    }
  }

  onMouseOver(trigger: ITrigger): void {
    this.showHTTPURL =
      trigger.eventType === 'http' ? (trigger as HTTPEndpoint) : null;
  }

  copyHTTPURLEndpoint(): void {
    Clipboard.copy(`https://${this.httpURL}/`);
    this.showHTTPURL = null;
  }

  showFetchTokenModal(): void {
    this.showHTTPURL = null;
    this.fetchTokenModal.show();
  }

  hideHTTPURL(): void {
    this.showHTTPURL = null;
  }

  getApi(): void {
    this.apisService.getApi(
      this.lambda.metadata.name,
      this.namespace,
      this.token,
    );
  }

  createApi(): void {
    const api: Api = this.apisService.initializeApi(
      this.lambda,
      this.namespace,
      this.existingHTTPEndpoint,
      this.isHTTPTriggerAuthenticated,
      this.httpURL,
      this.authType,
      this.jwksUri,
      this.issuer,
    );
    this.apisService.createApi(api, this.namespace, this.token).subscribe(
      () => {
        this.manageServiceBindings();
      },
      err => {
        this.showError(err.message);
        if (this.mode === 'create') {
          this.lambdaDetailsService
            .deleteLambda(this.lambda.metadata.name, this.namespace, this.token)
            .subscribe(
              () => {
                // Deleting function which as part of create-flow as creation of api fails
              },
              errCreate => {
                this.showError(errCreate.message);
              },
            );
        }
      },
    );
  }

  updateApi(): void {
    const api: Api = this.apisService.initializeApi(
      this.lambda,
      this.namespace,
      this.existingHTTPEndpoint,
      this.isHTTPTriggerAuthenticated,
      this.httpURL,
      this.authType,
      this.jwksUri,
      this.issuer,
    );
    this.apisService.updateApi(api, this.namespace, this.token).subscribe(
      () => {
        this.manageServiceBindings();
      },
      err => {
        this.showError(err.message);
      },
    );
  }

  isEventTriggerSelected(
    eventTrigger: ITrigger,
    eventActivation: EventActivation,
    event: Event,
  ): boolean {
    if (
      eventTrigger.eventType === event.eventType &&
      eventTrigger.sourceId === eventActivation.sourceId
    ) {
      return true;
    } else {
      return false;
    }
  }

  showEventTrigger(): void {
    this.eventTriggerChooserModal.show(
      [...this.availableEventTriggers],
      [...this.selectedTriggers],
    );
  }

  getHTTPEndPointFromApi(api: Api): HTTPEndpoint {
    const httpEndPoint: HTTPEndpoint = {
      isAuthEnabled: false,
      eventType: 'http',
      url: '',
      sourceId: '',
    };
    httpEndPoint.url = `https://${api.spec.hostname}`;

    if (api.spec.authentication !== undefined) {
      httpEndPoint.isAuthEnabled =
        api.spec.authentication.length !== 0 ? true : false;
      if (httpEndPoint.isAuthEnabled) {
        httpEndPoint.authentication = api.spec.authentication[0];
      }
    }

    return httpEndPoint;
  }

  handleBindingStateEmitter($event): void {
    this.bindingState = $event;
    this.warnUnsavedChanges(true);
  }

  handleEnvEmitter($event): void {
    this.lambda.spec.deployment.spec.template.spec.containers[0].env = $event;
    this.warnUnsavedChanges(true);
  }

  handleEventEmitter($event): void {
    this.selectedTriggers = $event;
    this.warnUnsavedChanges(true);
  }

  handleHttpEmitter($event): void {
    this.selectedTriggers = $event;

    this.selectedTriggers.forEach(trigger => {
      if (trigger.eventType === 'http') {
        this.httpURL = `${this.lambda.metadata.name}-${this.namespace}.${
          AppConfig.domain
        }`.toLowerCase();

        this.isHTTPTriggerAdded = true;
        this.isHTTPTriggerAuthenticated = (trigger as HTTPEndpoint).isAuthEnabled;
        this.warnUnsavedChanges(true);

        if ((trigger as HTTPEndpoint).isAuthEnabled) {
          this.authType = (trigger as HTTPEndpoint).authentication.type;
          this.jwksUri = (trigger as HTTPEndpoint).authentication.jwt.jwksUri;
          this.issuer = (trigger as HTTPEndpoint).authentication.jwt.issuer;
        }
      }
    });
  }

  warnUnsavedChanges(hasChanges: boolean): void {
    luigiClient.uxManager().setDirtyStatus(hasChanges);
  }

  setFunctionSize() {
    const resources = {
      limits: {
        cpu: this.selectedFunctionSize['cpu'],
        memory: this.selectedFunctionSize['memory'],
      },
      requests: AppConfig.functionResourceRequest.requests,
    };

    // Function Size
    this.lambda.spec.deployment.spec.replicas = this.selectedFunctionSize[
      'minReplicas'
    ];
    this.lambda.spec.deployment.spec.template.spec.containers[0].name = this.lambda.metadata.name;
    this.lambda.spec.deployment.spec.template.spec.containers[0].resources = resources;

    // Autoscaler
    this.lambda.spec.horizontalPodAutoscaler.metadata.name = `${
      this.lambda.metadata.name
    }`;
    this.lambda.spec.horizontalPodAutoscaler.metadata.namespace = this.namespace;
    this.lambda.spec.horizontalPodAutoscaler.metadata.labels = {
      function: `${this.lambda.metadata.name}`,
    };

    this.lambda.spec.horizontalPodAutoscaler.spec.scaleTargetRef.name = this.lambda.metadata.name;

    // horizontalPodAutoscaler -> spec -> minReplicas and maxReplicas
    this.lambda.spec.horizontalPodAutoscaler.spec.minReplicas = this.selectedFunctionSize[
      'minReplicas'
    ];
    this.lambda.spec.horizontalPodAutoscaler.spec.maxReplicas = this.selectedFunctionSize[
      'maxReplicas'
    ];

    // cpu: spec -> metrics -> resource -> targetAverageUtilization
    this.lambda.spec.horizontalPodAutoscaler.spec.metrics[0].resource.targetAverageUtilization =
      AppConfig.targetAverageUtilization;
  }

  functionSizeHasChanged(): boolean {
    let functionSizeChanged = false;
    if (this.annotations.length > 0) {
      this.annotations.forEach(label => {
        const annotationsSplitted = label.split('=');
        if (annotationsSplitted[0] === 'function-size') {
          if (annotationsSplitted[1] !== this.selectedFunctionSize['name']) {
            functionSizeChanged = true;
          }
        }
      });
      return functionSizeChanged;
    }
  }

  getEnvs(){
    return _get(this, 'lambda.spec.deployment.spec.template.spec.containers[0].env');
  }

  changeTab(name: string) {
    this.currentTab = name;
  }

  showNotification(notificationData: INotificationData, timeout?: number) {
    this.currentNotification = { message: '', type: 'info' }; // "pretend" there's no error to force notification re-render

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    setTimeout(() => {
      this.currentNotification = notificationData;
    });

    if (timeout) {
      this.notificationTimeout = setTimeout(() => {
        this.currentNotification = { message: '', type: 'info' };
      }, timeout);
    }
  }

  handleTestButtonClick() {
    this.testingResponse = '';
    if (!this.existingHTTPEndpoint) {
      throw new Error('It looks like the Lambda is not deployed yet');
    }

    try {
      this.testPayload = JSON.parse(this.testPayloadText);
    } catch (ex) {
      this.showNotification(
        {
          type: `error`,
          message: `Couldn't parse the payload JSON`,
          description: null,
        },
        5000,
      );
      return;
    }

    const lambdaEndpoint: HTTPEndpoint = this.getHTTPEndPointFromApi(
      this.existingHTTPEndpoint,
    );

    luigiClient.uxManager().showLoadingIndicator();

    fetch(lambdaEndpoint.url, {
      method: 'POST',
      body: this.testPayloadText,
      headers: lambdaEndpoint.isAuthEnabled
        ? new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          })
        : new Headers({
          'Content-Type': 'application/json',
        }),
    })
      .then(async res => {
        const responseText = await res.text();
        if (!res.ok) {
          throw new Error(responseText);
        }

        this.showNotification(
          {
            type: `success`,
            message: `The Lambda received your payload.`,
            description: `You can now browse its logs.`,
          },
          5000,
        );

        try {
          // the result can be parsed to JSON => pretty print it
          this.testingResponse = JSON.stringify(
            JSON.parse(responseText),
            null,
            2,
          );
          this.responseEditorMode = 'json';
        } catch {
          // just display it as it is
          this.testingResponse = responseText;
          this.responseEditorMode = 'text';
        }
      })
      .finally(() => {
        luigiClient.uxManager().hideLoadingIndicator();
      })
      .catch(async error => {
        this.showNotification(
          {
            type: `error`,
            message: error.message,
            description: null,
          },
          5000,
        );
      });
  }
}
