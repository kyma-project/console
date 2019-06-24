import { Component, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { ModalService, ModalComponent } from 'fundamental-ngx';
import { Clipboard } from 'ts-clipboard';
import * as luigiClient from '@kyma-project/luigi-client';

import { AppConfig } from '../../../app.config';
import { Authentication } from '../../../shared/datamodel/authentication';
import { HTTPEndpoint } from '../../../shared/datamodel/http-endpoint';
import { Lambda } from '../../../shared/datamodel/k8s/function';
import { GraphqlClientService } from '../../../graphql-client/graphql-client.service';
import { FetchTokenModalComponent } from '../../../fetch-token-modal/fetch-token-modal.component';
import { Jwt } from '../../../shared/datamodel/jwt';

@Component({
  selector: 'app-http-trigger',
  templateUrl: './http-trigger.component.html',
  styleUrls: ['./http-trigger.component.scss'],
})
export class HttpTriggerComponent {
  lambda: Lambda;
  environment: string;
  selectedHTTPTriggers: HTTPEndpoint[] = [];
  @Output() httpEmitter = new EventEmitter<HTTPEndpoint[]>();
  @ViewChild('fetchTokenModal') fetchTokenModal: FetchTokenModalComponent;
  @ViewChild('httpTriggerModal') httpTriggerModal: ModalComponent;

  public title: string;
  public isActive = false;
  public httpURL = '';

  public apiName = '';
  public serviceName = '';
  public servicePort = '';

  public secure = true;
  private defaultAuthConfig: any;
  public issuer: string;
  public jwksUri: string;
  private token: string;

  public errorHostname = '';
  public errorJWKSUri = '';
  public errorIssuer = '';

  public availablePresets = [];

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.closeHttpTriggerModal();
  }

  constructor(
    private graphQLClientService: GraphqlClientService,
    private httpClient: HttpClient,
    private modalService: ModalService,
  ) { }

  public show(lambda, environment, selectedHTTPTriggers) {
    this.lambda = lambda;
    this.environment = environment;
    this.secure = true;
    this.selectedHTTPTriggers = selectedHTTPTriggers;
    this.httpURL = `https://${this.lambda.metadata.name}-${this.environment}.${
      AppConfig.domain
      }/`.toLowerCase();

    this.fetchAuthIssuer();

    this.title = 'Expose via HTTPS';
    this.isActive = true;

    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.token = `${eventData.idToken}`;
    });
    luigiClient.uxManager().addBackdrop();

    this.modalService.open(this.httpTriggerModal).result.finally(() => {
      this.isActive = false;
      luigiClient.uxManager().removeBackdrop();
    });
  }

  addTrigger() {
    if (this.secure && !this.isAbleToMakeRequest()) {
      this.validateDetails();
    }

    const jwt: Jwt = {
      jwksUri: this.secure === true ? this.jwksUri : undefined,
      issuer: this.secure === true ? this.issuer : undefined,
    };

    const authentication: Authentication = {
      type: this.secure === true ? 'JWT' : undefined,
      jwt: this.secure === true ? jwt : undefined,
    };

    const httpTrigger: HTTPEndpoint = {
      eventType: 'http',
      sourceId: '',
      url: this.httpURL,
      isAuthEnabled: this.secure,
      authentication: this.secure === true ? authentication : undefined,
    };
    this.selectedHTTPTriggers.push(httpTrigger);
    this.httpEmitter.emit(this.selectedHTTPTriggers);
    this.closeHttpTriggerModal();
  }

  copyHTTPUrlEndpoint(): void {
    Clipboard.copy(`${this.httpURL}`);
  }

  pushTrigger(httpTrigger: HTTPEndpoint) { }

  closeHttpTriggerModal() {
    if (this.isActive) {
      this.modalService.close(this.httpTriggerModal);
    }
  }

  public getIDPPresets() {
    const query = `query {
      IDPPresets{
        name
        issuer
        jwksUri
      }
    }`;

    const result = this.graphQLClientService.requestWithToken(
      AppConfig.graphqlApiUrl,
      query,
      {},
      this.token,
    );
    return result;
  }

  public fetchAuthIssuer() {
    this.availablePresets = [];
    this.getDefaultIdpPreset().subscribe(config => {
      this.defaultAuthConfig = config;
      let hasDex = false;
      const dexFQDNJwksUri =
        'http://dex-service.kyma-system.svc.cluster.local:5556/keys';
      let jwksUri = config.jwks_uri;
      let issuer = config.issuer;
      this.getIDPPresets()
        .pipe(
          finalize(() => {
            if (!this.jwksUri) {
              this.jwksUri = dexFQDNJwksUri;
              this.issuer = issuer;
            }
            if (!hasDex) {
              this.availablePresets.push({
                label: 'Dex',
                jwksUri: dexFQDNJwksUri,
                issuer: config.issuer,
              });
            }
          }),
        )
        .subscribe(
          data => {
            if (data.IDPPresets) {
              data.IDPPresets.map(preset => {
                if ('dex' === preset.name.toLowerCase()) {
                  hasDex = true;
                  jwksUri = preset.jwksUri;
                  issuer = preset.issuer;
                }
                this.availablePresets.push({
                  label: preset.name,
                  jwksUri: preset.jwksUri,
                  issuer: preset.issuer,
                });
              });
            }
          },
          err => {
            return [];
          },
        );
    });
  }

  public getDefaultIdpPreset = () => {
    return this.httpClient.get<any>(
      `${AppConfig.authIssuer}/.well-known/openid-configuration`,
      {},
    );
  };

  public isDefaultProvider() {
    return (
      this.defaultAuthConfig && this.defaultAuthConfig.issuer === this.issuer
    );
  }

  public selectPreset(preset) {
    this.jwksUri = preset.jwksUri;
    this.issuer = preset.issuer;
    this.validateDetails();
  }

  public validateDetails() {
    this.clearInputErrors();

    this.errorJWKSUri = this.validateJWKSUri();
    this.errorIssuer = this.validateIssuer();
  }

  private clearInputErrors() {
    this.errorJWKSUri = '';
    this.errorIssuer = '';
  }

  private validateJWKSUri() {
    if (!this.secure) {
      return '';
    }
    if (isEmpty(this.jwksUri)) {
      return 'JWKS URI is required.';
    }
    return '';
  }

  private validateIssuer() {
    if (!this.secure) {
      return '';
    }
    if (isEmpty(this.issuer)) {
      return 'Issuer is required.';
    }
    return '';
  }

  public isAbleToMakeRequest() {
    return isEmpty(this.errorJWKSUri) && isEmpty(this.errorIssuer);
  }
}
