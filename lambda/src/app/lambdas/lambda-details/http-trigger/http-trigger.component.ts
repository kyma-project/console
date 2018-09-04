import { Component, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Clipboard } from 'ts-clipboard';
import { AppConfig } from '../../../app.config';
import { Source } from '../../../shared/datamodel/source';
import { HTTPEndpoint } from '../../../shared/datamodel/http-endpoint';

import { Lambda, IFunctionSpec } from '../../../shared/datamodel/k8s/function';

@Component({
  selector: 'app-http-trigger',
  templateUrl: './http-trigger.component.html',
  styleUrls: ['../../../app.component.scss', './http-trigger.component.scss'],
})
export class HttpTriggerComponent {
  lambda: Lambda;
  environment: string;
  selectedHTTPTriggers: HTTPEndpoint[] = [];
  @Output() httpEmitter = new EventEmitter<HTTPEndpoint[]>();

  private title: string;
  public isActive = false;
  private httpURL = '';
  private isHTTPTriggerAuthenticated = false;

  constructor() {}

  public show(
    lambda,
    environment,
    isHTTPTriggerAuthenticated,
    selectedHTTPTriggers,
  ) {
    this.lambda = lambda;
    this.environment = environment;
    this.isHTTPTriggerAuthenticated = isHTTPTriggerAuthenticated;

    this.httpURL = `https://${this.lambda.metadata.name}-${this.environment}.${
      AppConfig.domain
    }/`.toLowerCase();

    this.title = 'Expose via HTTPS';
    this.isActive = true;
  }

  addTrigger() {
    this.addHTTPTrigger();
    this.httpEmitter.emit(this.selectedHTTPTriggers);
    this.closeHttpTriggerModal();
  }

  copyHTTPUrlEndpoint(): void {
    Clipboard.copy(`${this.httpURL}`);
  }

  addHTTPTrigger() {
    const src: Source = {
      type: 'endpoint',
    };

    const httpTrigger: HTTPEndpoint = {
      eventType: 'http',
      source: src,
      url: this.httpURL,
      isAuthEnabled: this.isHTTPTriggerAuthenticated,
    };

    this.selectedHTTPTriggers.push(httpTrigger);
  }

  closeHttpTriggerModal() {
    this.isActive = false;
  }
}
