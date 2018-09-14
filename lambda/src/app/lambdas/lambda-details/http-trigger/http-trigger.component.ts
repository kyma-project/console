///<reference path="../../../../../node_modules/rxjs/add/operator/finally.d.ts"/>
import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Clipboard } from 'ts-clipboard';
import { AppConfig } from '../../../app.config';
import { Source } from '../../../shared/datamodel/source';
import { HTTPEndpoint } from '../../../shared/datamodel/http-endpoint';
import { Lambda, IFunctionSpec } from '../../../shared/datamodel/k8s/function';
import { GraphqlClientService } from '../../../graphql-client/graphql-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FetchTokenModalComponent } from '../../../fetch-token-modal/fetch-token-modal.component';
import * as luigiClient from '@kyma-project/luigi-client';

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
  @ViewChild('fetchTokenModal') fetchTokenModal: FetchTokenModalComponent;

  private title: string;
  public isActive = false;
  private httpURL = '';
  private isHTTPTriggerAuthenticated = false;

  // Api
  public apiName = '';
  public serviceName = '';
  public servicePort = '';

  //Security
  public secure = false;
  private defaultAuthConfig: any;
  public issuer: string;
  public jwksUri: string;
  private token: string;

  //Validation
  public errorHostname = '';
  public errorJWKSUri = '';
  public errorIssuer = '';

  public ariaExpanded = false;
  public ariaHidden = true;

  // presets
  public availablePresets = [];

  constructor(
    private graphQLClientService: GraphqlClientService,
    private httpClient: HttpClient,
  ) {}

  public show(
    lambda,
    environment,
    isHTTPTriggerAuthenticated,
    selectedHTTPTriggers,
  ) {
    this.lambda = lambda;
    this.environment = environment;
    this.isHTTPTriggerAuthenticated =
      isHTTPTriggerAuthenticated == false ? isHTTPTriggerAuthenticated : true;
    this.secure = this.isHTTPTriggerAuthenticated;
    this.selectedHTTPTriggers = selectedHTTPTriggers;
    this.httpURL = `https://${this.lambda.metadata.name}-${this.environment}.${
      AppConfig.domain
    }/`.toLowerCase();

    this.fetchAuthIssuer();

    this.title = 'Expose via HTTPS';
    this.isActive = true;
    let sessionId;

    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      sessionId = eventData.sessionId;
      this.token = `Bearer ${eventData.idToken}`;
    });
  }

  addTrigger() {
    if (this.isHTTPTriggerAuthenticated && !this.isAbleToMakeRequest()) {
      this.validateDetails();
    }

    const src: Source = {
      type: 'endpoint',
    };

    const authentication = {
      type: 'JWT',
      jwt: {
        jwksUri: this.jwksUri,
        issuer: this.issuer,
      },
    };

    const httpTrigger: HTTPEndpoint = {
      eventType: 'http',
      source: src,
      url: this.httpURL,
      isAuthEnabled: this.isHTTPTriggerAuthenticated,
      authentication: authentication,
    };

    this.selectedHTTPTriggers.push(httpTrigger);
    this.httpEmitter.emit(this.selectedHTTPTriggers);
    this.closeHttpTriggerModal();
  }

  copyHTTPUrlEndpoint(): void {
    Clipboard.copy(`${this.httpURL}`);
  }

  pushTrigger(httpTrigger: HTTPEndpoint) {}

  closeHttpTriggerModal() {
    this.isActive = false;
  }

  //Security

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
    //TODO WHAT IS GOING ON HERE?
    this.getDefaultIdpPreset().subscribe(config => {
      this.defaultAuthConfig = config;
      let hasDex = false;
      let jwksUri = config.jwks_uri;
      let issuer = config.issuer;
      this.getIDPPresets()
        .pipe(
          finalize(() => {
            if (!this.jwksUri) {
              this.jwksUri = jwksUri;
              this.issuer = issuer;
            }
            if (!hasDex) {
              this.availablePresets.push({
                label: 'Dex',
                jwksUri: config.jwks_uri,
                issuer: config.issuer,
              });
            }
          }),
        )
        .subscribe(
          data => {
            if (data.IDPPresets) {
              data.IDPPresets.map(preset => {
                console.log(
                  'preset.name.toLowerCase()',
                  preset.name.toLowerCase(),
                );
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
            console.log('Error fetching IDP presets', err);
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

  toggleSecure() {
    this.secure = !this.secure;
  }

  public isDefaultProvider() {
    return (
      this.defaultAuthConfig && this.defaultAuthConfig.issuer === this.issuer
    );
  }

  private fetchToken() {
    this.fetchTokenModal.show();
  }

  public selectPreset(preset) {
    this.jwksUri = preset.jwksUri;
    this.issuer = preset.issuer;
    this.autoCloseDropdown();
    this.validateDetails();
  }

  private loadPreset() {
    this.toggleDropdown();
  }

  public toggleDropdown() {
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  public autoCloseDropdown() {
    this.ariaExpanded = false;
    this.ariaHidden = true;
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
    if (_.isEmpty(this.jwksUri)) {
      return 'JWKS URI is required.';
    }
    return '';
  }

  private validateIssuer() {
    if (!this.secure) {
      return '';
    }
    if (_.isEmpty(this.issuer)) {
      return 'Issuer is required.';
    }
    return '';
  }

  public isAbleToMakeRequest() {
    return _.isEmpty(this.errorJWKSUri) && _.isEmpty(this.errorIssuer);
  }
}
