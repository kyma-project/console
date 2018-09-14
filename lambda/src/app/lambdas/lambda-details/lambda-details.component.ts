/* tslint:disable:no-submodule-imports */

import { Observable } from 'rxjs/Observable';
import {
  Component,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'brace';
import 'brace/ext/language_tools';
import 'brace/snippets/javascript';
import 'brace/snippets/json';
import 'brace/snippets/text';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/eclipse';
import { Lambda, IFunctionSpec } from '../../shared/datamodel/k8s/function';
import { LambdaDetailsService } from './lambda-details.service';
import { IMetaData } from '../../shared/datamodel/k8s/generic/meta-data';
import { sha256 } from 'js-sha256';
import { ITrigger } from '../../shared/datamodel/trigger';
import { AppConfig } from '../../app.config';
import { Clipboard } from 'ts-clipboard';
import { HTTPEndpoint } from '../../shared/datamodel/http-endpoint';
import { Event } from '../../shared/datamodel/event';
import { ApisService } from '../../apis/apis.service';
import { Api, IApi, IApiSpec } from '../../shared/datamodel/k8s/api';
import { FetchTokenModalComponent } from '../../fetch-token-modal/fetch-token-modal.component';
import { ServiceBindingUsagesService } from '../../service-binding-usages/service-binding-usages.service';
import { ServiceBindingsService } from '../../service-bindings/service-bindings.service';
import { InstanceBindingState } from '../../shared/datamodel/instance-binding-state';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpErrorResponse } from '@angular/common/http';
import { EventTrigger } from '../../shared/datamodel/event-trigger';
import { EventActivationsService } from '../../event-activations/event-activations.service';
import { Source } from '../../shared/datamodel/source';
import { EventActivation } from '../../shared/datamodel/k8s/event-activation';
import { Subscription } from '../../shared/datamodel/k8s/subscription';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import * as randomatic from 'randomatic';

import * as luigiClient from '@kyma-project/luigi-client';

import { Service } from '../../shared/datamodel/k8s/api-service';
import { timeout } from 'rxjs/operators';
import { EventTriggerChooserComponent } from './event-trigger-chooser/event-trigger-chooser.component';
import { HttpTriggerComponent } from './http-trigger/http-trigger.component';
@Component({
  selector: 'app-lambda-details',
  templateUrl: './lambda-details.component.html',
  styleUrls: ['./lambda-details.component.scss'],
})
@HostListener('sf-content')
export class LambdaDetailsComponent implements AfterViewInit {
  selectedTriggers: ITrigger[] = [];
  availableEventTriggers: EventTrigger[] = [];
  existingEventTriggers: EventTrigger[] = [];

  environment: string;
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
  @ViewChild('fetchTokenModal') fetchTokenModal: FetchTokenModalComponent;
  @ViewChild('eventTriggerChooserModal')
  eventTriggerChooserModal: EventTriggerChooserComponent;
  @ViewChild('httpTriggerModal') httpTriggerModal: HttpTriggerComponent;

  code = `module.exports = { main: function (event, context) {

} }`;
  dependency: string;
  aceMode: string;
  aceDependencyMode: string;
  mode = 'create';
  title = '';
  kind: string;
  showSample = false;
  toggleTrigger = false;
  toggleTriggerType = false;
  typeDropdownHidden = true;
  isLambdaFormValid = true;
  showHTTPURL: HTTPEndpoint = null;
  httpURL = '';
  labels = [];
  md: IMetaData = {
    name: '',
  };
  lambda = new Lambda({
    metadata: this.md,
  });
  loaded: Observable<boolean> = Observable.of(false);
  newLabel;
  wrongLabel = false;
  wrongLabelMessage = '';
  error: string = null;
  hasDependencies: Observable<boolean> = Observable.of(false);
  envVarKey = '';
  envVarValue = '';
  isEnvVariableNameInvalid = false;
  isFunctionNameInvalid = false;
  isHTTPTriggerAdded = false;
  isHTTPTriggerAuthenticated = false;
  existingHTTPEndpoint: Api;
  bindingState: Map<string, InstanceBindingState>;

  public issuer: string;
  public jwksUri: string;
  public authType: string;

  @ViewChild('dependencyEditor') dependencyEditor;
  @ViewChild('editor') editor;
  @ViewChild('labelsInput') labelsInput;

  constructor(
    private apisService: ApisService,
    private eventActivationsService: EventActivationsService,
    private lambdaDetailsService: LambdaDetailsService,
    private serviceBindingUsagesService: ServiceBindingUsagesService,
    private serviceBindingsService: ServiceBindingsService,
    private subscriptionsService: SubscriptionsService,
    protected route: ActivatedRoute,
    router: Router,
  ) {
    this.theme = 'eclipse';
    this.aceMode = 'javascript';
    this.aceDependencyMode = 'json';
    this.kind = 'nodejs8';
    this.route.params.subscribe(
      params => {
        luigiClient.addInitListener(() => {
          const eventData = luigiClient.getEventData();
          this.environment = eventData.currentEnvironmentId;
          this.token = eventData.idToken;
          if (params['name']) {
            this.mode = 'update';
            const lambdaName = params['name'];
            this.title = `${lambdaName} Details`;
            this.getFunction(lambdaName);
            this.apisService
              .getApi(lambdaName, this.environment, this.token)
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
                },
                err => {
                  console.log(
                    'Can be a valid 404 error when api is not found of a function',
                  );
                  // Can be a valid 404 error when api is not found of a function
                },
              );
            this.subscriptionsService
              .getSubscriptions(this.environment, this.token, {
                labelSelector: `Function=${lambdaName}`,
              })
              .subscribe(resp => {
                resp.items.forEach(sub => {
                  const src: Source = {
                    environment: sub.spec.source['source_environment'],
                    type: sub.spec.source['source_type'],
                    namespace: sub.spec.source['source_namespace'],
                  };
                  const evTrigger: EventTrigger = {
                    eventType: sub.spec['event_type'],
                    version: sub.spec['event_type_version'],
                    source: src,
                  };
                  this.selectedTriggers.push(evTrigger);
                  this.existingEventTriggers.push(evTrigger);
                });
              });
          } else {
            this.title = 'Create Lambda Function';
            this.lambda = this.lambdaDetailsService.initializeLambda();
            this.lambda.spec.function = this.code;
            this.loaded = Observable.of(true);
            if (!this.lambda.metadata.name || this.isFunctionNameInvalid) {
              this.editor.setReadOnly(true);
            }
          }

          this.eventActivationsService
            .getEventActivations(this.environment, this.token)
            .subscribe(resp => {
              resp.data.eventActivations.forEach(ea => {
                ea.events.forEach(ev => {
                  const eventTrigger: EventTrigger = {
                    eventType: ev.eventType,
                    source: ea.source,
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

  selectType(selectedType) {
    this.aceMode = selectedType.aceMode;
    this.kind = selectedType.kind;
    this.typeDropdownHidden = true;
  }

  onCodeChange(event) {
    this.lambda.spec.function = event;
  }

  onDependencyChange(event) {
    this.lambda.spec.deps = event;
  }

  selectedServiceInstance($event): object {
    return $event;
  }

  deployLambda() {
    if (this.mode === 'create') {
      this.createFunction();
    } else {
      this.updateFunction();
    }
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
    this.lambda.metadata.labels = this.changeLabels();
    this.lambda.spec.runtime = this.kind;
    this.lambda.spec.topic =
      this.selectedTriggers.length > 0
        ? this.selectedTriggers[0].eventType
        : 'undefined';
    this.setChecksum();
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
            .deleteApi(this.lambda.metadata.name, this.environment, this.token)
            .subscribe(
              () => {
                this.manageServiceBindings();
                this.lambda = lambda;
              },
              err => {
                this.error = err.message;
              },
            );
        } else {
          // manage service bindings only
          this.manageServiceBindings();
          this.lambda = lambda;
        }
      },
      err => {
        this.error = err.message;
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
          // const serviceBindingUsageName = `lambda-${this.lambda.metadata.name}-${v.previousState.instanceName}`;
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
      serviceBindingUsage.metadata.namespace = this.environment;
      serviceBindingUsage.metadata.name = serviceBindingName;
      if (bs.currentState.createSecret) {
        const serviceBinding = this.serviceBindingsService.initializeServiceBinding();
        serviceBinding.metadata.namespace = this.environment;
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
        createRequests.push(
          this.serviceBindingsService
            .createServiceBinding(serviceBinding, this.token)
            .catch(err => {
              return Observable.of(err);
            }),
        );
      } else {
        serviceBindingUsage.spec.serviceBindingRef.name =
          bs.currentState.serviceBinding;
        serviceBindingUsage.metadata.labels = {
          Function: this.lambda.metadata.name,
          ServiceBinding: bs.currentState.serviceBinding,
        };
      }
      serviceBindingUsage.spec.usedBy.kind = 'function';
      serviceBindingUsage.spec.usedBy.name = this.lambda.metadata.name;
      createRequests.push(
        this.serviceBindingUsagesService
          .createServiceBindingUsage(serviceBindingUsage, this.token)
          .catch(err => {
            return Observable.of(err);
          }),
      );
    });

    deleteBindingStates.forEach(bs => {
      this.serviceBindingUsagesService
        .getServiceBindingUsages(this.environment, this.token, {
          Function: this.lambda.metadata.name,
          ServiceBinding: bs.previousState.serviceBinding,
        })
        .subscribe(bsuList => {
          bsuList.items.forEach(bsu => {
            if (bs.previousState.serviceBinding === bsu.metadata.name) {
              deleteRequests.push(
                this.serviceBindingUsagesService
                  .deleteServiceBindingUsage(
                    bsu.metadata.name,
                    this.environment,
                    this.token,
                  )
                  .catch(err => {
                    return Observable.of(err);
                  }),
              );
            }
          });
          forkJoin(deleteRequests).subscribe(responses => {
            responses.forEach(resp => {
              if (resp instanceof HttpErrorResponse) {
                const res = resp as HttpErrorResponse;
                this.error = res.message;
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
    this.executeCreateBindingRequests(createRequests);
  }

  areEventTriggersEqual(sourceET: EventTrigger, destET: EventTrigger): boolean {
    if (
      sourceET.eventType === destET.eventType &&
      sourceET.version === destET.version &&
      sourceET.source.environment === destET.source.environment &&
      sourceET.source.namespace === destET.source.namespace &&
      sourceET.source.type === destET.source.type
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
          sub.metadata.namespace = this.environment;
          sub.metadata.labels['Function'] = this.lambda.metadata.name;
          sub.spec.endpoint = `http://${this.lambda.metadata.name}.${
            this.environment
          }:8080/`;
          sub.spec['event_type'] = trigger.eventType;
          sub.spec['event_type_version'] = trigger.version;
          sub.spec.source = {
            source_namespace: trigger.source.namespace,
            source_type: trigger.source.type,
            source_environment: trigger.source.environment,
          };
          const req = this.subscriptionsService
            .createSubscription(sub, this.token)
            .catch(err => {
              return Observable.of(err);
            });
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
          this.environment,
          this.token,
        )
        .catch(err => {
          return Observable.of(err);
        });
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
            this.error = errMessage;
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
        this.error = errMessage;
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
        this.error = errMessage;
      }
    });
  }

  createFunction(): void {
    this.lambda.metadata.namespace = this.environment;
    this.lambda.spec.runtime = this.kind;
    if (this.selectedTriggers.length > 0) {
      this.lambda.spec.topic = this.selectedTriggers[0].eventType;
    }
    this.lambda.spec.service.selector = {
      'created-by': 'kubeless',
      function: this.lambda.metadata.name,
    };
    this.lambda.metadata.labels = this.changeLabels();

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
        this.error = err.message;
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

  toggleTypeDropDown() {
    this.typeDropdownHidden = !this.typeDropdownHidden;
  }

  closeTypeDropDown() {
    return (this.typeDropdownHidden = true);
  }

  closeTriggerTypeDropDown() {
    return (this.toggleTriggerType = false);
  }

  ngAfterViewInit() {
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
      .getLambda(functionName, this.environment, this.token)
      .subscribe(
        lambda => {
          this.lambda = lambda;
          this.labels = this.getLabels(lambda);
          this.code = lambda.spec.function;
          this.kind = lambda.spec.runtime;
          this.dependency = lambda.spec.deps;
          this.hasDependencies = Observable.of(
            this.dependency != null &&
              this.dependency !== undefined &&
              this.dependency !== '',
          );
          this.loaded = Observable.of(true);
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
          labels.push(key + ':' + lambda.metadata.labels[key]);
        }
      }
    }
    return labels;
  }

  cancel() {
    this.navigateToList();
  }

  navigateToList() {
    let sessionId;
    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      sessionId = eventData.sessionId;
    });
    luigiClient.linkManager().openInCurrentEnvironment(`lambdas`, sessionId);
  }

  getEventActivations(): void {
    this.eventActivationsService
      .getEventActivations(this.environment, this.token)
      .subscribe(
        events => {
          this.loaded = Observable.of(true);
        },
        err => {
          this.error = err.message;
        },
      );
  }

  toggleDropdown(event) {
    const dropdown = event.target.attributes['dropdown'].value;
    if ('trigger' === dropdown) {
      return (this.toggleTrigger = !this.toggleTrigger);
    }
  }

  toggleTriggerTypeDropdown(event) {
    const dropdown = event.target.attributes['dropdown'].value;
    if ('triggerType' === dropdown) {
      return (this.toggleTriggerType = !this.toggleTriggerType);
    }
  }

  showHTTPTrigger(): void {
    this.toggleTriggerType = false;
    this.httpTriggerModal.show(
      this.lambda,
      this.environment,
      this.isHTTPTriggerAuthenticated,
      [...this.selectedTriggers],
    );
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

  changeLabels() {
    const newLabels = {};
    if (this.labels.length > 0) {
      this.labels.forEach(label => {
        const labelSplitted = label.split(':');
        newLabels[labelSplitted[0]] = labelSplitted[1];
      });
    }
    return newLabels;
  }

  isNewLabelValid(label) {
    const key = label.split(':')[0].trim();
    const value = label.split(':')[1].trim();
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
      if (l.split(':')[0] === key) {
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
      this.newLabel.split(':').length === 2 &&
      this.isNewLabelValid(this.newLabel)
    ) {
      const newLabelArr = this.newLabel.split(':');
      this.newLabel = `${newLabelArr[0].trim()}:${newLabelArr[1].trim()}`;
      this.labels.push(this.newLabel);
      this.newLabel = '';
      this.wrongLabel = false;
      this.isLambdaFormValid = true;
    } else {
      this.isLambdaFormValid = this.newLabel ? false : true;
      this.wrongLabel = this.newLabel ? true : false;
      this.wrongLabelMessage =
        this.wrongLabel && this.wrongLabelMessage
          ? this.wrongLabelMessage
          : `Invalid label ${
              this.newLabel
            }! A key and value should be separated by a ":"`;
    }
  }

  updateLabel(label) {
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

  addDependencies() {
    this.hasDependencies = Observable.of(true);
  }
  removeDependencies() {
    this.dependency = '';
    this.lambda.spec.deps = null;
    this.hasDependencies = Observable.of(false);
  }

  /** validatesName checks whether a function name is abiding by RFC 1123 or not */
  validatesName(): void {
    const regex = /[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*/;
    const found = this.lambda.metadata.name.match(regex);
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
      this.environment,
      this.token,
    );
  }

  createApi(): void {
    const api: Api = this.apisService.initializeApi(
      this.lambda,
      this.environment,
      this.existingHTTPEndpoint,
      this.isHTTPTriggerAuthenticated,
      this.httpURL,
      this.authType,
      this.jwksUri,
      this.issuer,
    );
    this.apisService.createApi(api, this.environment, this.token).subscribe(
      () => {
        this.manageServiceBindings();
      },
      err => {
        this.error = err.message;
        if (this.mode === 'create') {
          this.lambdaDetailsService
            .deleteLambda(
              this.lambda.metadata.name,
              this.environment,
              this.token,
            )
            .subscribe(
              () => {
                // Deleting function which as part of create-flow as creation of api fails
              },
              errCreate => {
                this.error = errCreate.message;
              },
            );
        }
      },
    );
  }

  updateApi(): void {
    const api: Api = this.apisService.initializeApi(
      this.lambda,
      this.environment,
      this.existingHTTPEndpoint,
      this.isHTTPTriggerAuthenticated,
      this.httpURL,
      this.authType,
      this.jwksUri,
      this.issuer,
    );
    this.apisService.updateApi(api, this.environment, this.token).subscribe(
      () => {
        this.manageServiceBindings();
      },
      err => {
        this.error = err.message;
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
      eventTrigger.source.environment === eventActivation.source.environment &&
      eventTrigger.source.namespace === eventActivation.source.namespace &&
      eventTrigger.source.type === eventActivation.source.type
    ) {
      return true;
    } else {
      return false;
    }
  }

  showEventTrigger(): void {
    this.closeTriggerTypeDropDown();
    this.eventTriggerChooserModal.show(
      [...this.availableEventTriggers],
      [...this.selectedTriggers],
    );
  }

  getHTTPEndPointFromApi(api: Api): HTTPEndpoint {
    const src: Source = {
      type: 'endpoint',
    };
    const httpEndPoint: HTTPEndpoint = {
      isAuthEnabled: false,
      eventType: 'http',
      url: '',
      source: src,
    };
    httpEndPoint.url = `https://${api.spec.hostname}`;

    if (api.spec.authentication !== undefined) {
      httpEndPoint.isAuthEnabled =
        api.spec.authentication.length !== 0 ? true : false;
    }

    return httpEndPoint;
  }

  handleBindingStateEmitter($event): void {
    this.bindingState = $event;
  }

  handleEnvEmitter($event): void {
    this.lambda.spec.deployment.spec.template.spec.containers[0].env = $event;
  }

  handleEventEmitter($event): void {
    this.selectedTriggers = $event;
  }

  handleHttpEmitter($event): void {
    this.selectedTriggers = $event;

    this.selectedTriggers.forEach(trigger => {
      if (trigger.eventType == 'http') {
        this.httpURL = `${this.lambda.metadata.name}-${this.environment}.${
          AppConfig.domain
        }`.toLowerCase();

        this.isHTTPTriggerAdded = true;

        if ((trigger as HTTPEndpoint).isAuthEnabled) {
          this.authType = (trigger as HTTPEndpoint).authentication.type;
          this.jwksUri = (trigger as HTTPEndpoint).authentication.jwt.jwksUri;
          this.issuer = (trigger as HTTPEndpoint).authentication.jwt.issuer;
          this.isHTTPTriggerAuthenticated = (trigger as HTTPEndpoint).isAuthEnabled;
        }
      }
    });
  }
}
