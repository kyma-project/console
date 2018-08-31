import { IdpPresetsService } from './../../../../../settings/idp-presets/idp-presets.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentEnvironmentService } from '../../../../services/current-environment.service';
import { ExposeApiService } from './expose-api.service';
import { AppConfig } from '../../../../../../app.config';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/finally';
import * as _ from 'lodash';
import { InformationModalComponent } from '../../../../../../shared/components/information-modal/information-modal.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { Copy2ClipboardModalComponent } from '../../../../../../shared/components/copy2clipboard-modal/copy2clipboard-modal.component';

@Component({
  selector: 'app-expose-api',
  templateUrl: './expose-api.component.html',
  styleUrls: ['./expose-api.component.scss']
})
export class ExposeApiComponent implements OnInit, OnDestroy {
  @ViewChild('infoModal') private infoModal: InformationModalComponent;
  public apiName = '';
  public serviceName = '';
  public servicePort = '';
  public hostname = '';
  public domain: string = '.' + AppConfig.domain;
  public secure = false;
  private currentEnvironmentId = '';
  private currentEnvironmentSubscription: Subscription;
  public error = '';
  public errorApiName = '';
  public errorHostname = '';
  public errorPort = '';
  public errorJWKSUri = '';
  public errorIssuer = '';
  public apiDefinition: any;
  private apiDefUrl = '';
  private service: any;
  private deployment: any;
  public canBeSecured = false;
  public jwksUri: string;
  public issuer: string;
  private defaultAuthConfig: any;
  public listOfServices;
  public filteredServices;
  public listOfDeployments;
  public routedFromServiceDetails = true;
  public isLambda = false;

  public ariaExpanded = false;
  public ariaHidden = true;
  public ariaServiceExpanded = false;
  public ariaServiceHidden = true;

  public availablePresets = [];

  @ViewChild('fetchModal') fetchModal: Copy2ClipboardModalComponent;

  constructor(
    private currentEnvironmentService: CurrentEnvironmentService,
    private exposeApiService: ExposeApiService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private idpPresetsService: IdpPresetsService,
    private oAuthService: OAuthService
  ) {}

  public validateDetails() {
    this.clearInputErrors();

    this.errorApiName = this.validateApiName();
    this.errorHostname = this.validateHostname();
    this.errorPort = this.validatePort();
    this.errorJWKSUri = this.validateJWKSUri();
    this.errorIssuer = this.validateIssuer();
  }

  public toggleSecure() {
    this.secure = !this.secure;
  }

  public navigateToServiceDetails() {
    this.router.navigate([
      `home/environments/${this.currentEnvironmentId}/services/${
        this.serviceName
      }`
    ]);
  }

  public navigateToServicesList() {
    this.router.navigate([
      `home/environments/${this.currentEnvironmentId}/services`
    ]);
  }

  public navigateToApiList() {
    this.router.navigate([
      `home/environments/${this.currentEnvironmentId}/apis`
    ]);
  }

  public goBack() {
    this.routedFromServiceDetails
      ? this.navigateToServiceDetails()
      : this.navigateToApiList();
  }

  public isAbleToMakeRequest() {
    this.findMatchingDeployment();
    return (
      _.isEmpty(this.error) &&
      _.isEmpty(this.errorPort) &&
      _.isEmpty(this.errorApiName) &&
      _.isEmpty(this.errorHostname) &&
      _.isEmpty(this.errorJWKSUri) &&
      _.isEmpty(this.errorIssuer) &&
      !_.isEmpty(this.serviceName) &&
      !_.isEmpty(this.hostname) &&
      !_.isEmpty(_.toString(this.servicePort)) &&
      this.checkIfServiceExists()
    );
  }

  public createResource() {
    const data = this.dataToSend();
    const preparedData = this.exposeApiService.prepareApiDefinitionToCreate(
      data
    );

    if (this.isAbleToMakeRequest()) {
      return this.exposeApiService
        .createApiDefinition(this.apiDefUrl, preparedData)
        .subscribe(
          res => this.goBack(),
          err => {
            this.infoModal.show(
              'Error',
              `There was an error trying to create ${this.apiName} API: ${err
                .error.message || err.message}`
            );
          }
        );
    }
    return this.validateDetails();
  }

  public updateResource() {
    const url = `${this.apiDefUrl}${this.apiName}`;
    const data = this.dataToSend();
    const preparedData = this.exposeApiService.prepareApiDefinitionToUpdate(
      this.apiDefinition,
      data
    );

    if (this.isAbleToMakeRequest()) {
      return this.exposeApiService
        .updateApiDefinition(url, preparedData)
        .subscribe(
          res => this.goBack(),
          err => {
            this.infoModal.show(
              'Error',
              `There was an error trying to update ${this.apiName} API: ${
                err.message
              }`
            );
          }
        );
    }

    return this.validateDetails();
  }

  public save() {
    this.validateDetails();
    this.apiDefinition ? this.updateResource() : this.createResource();
  }

  public ngOnInit() {
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        this.apiDefUrl = `namespaces/${this.currentEnvironmentId}/apis/`;
      });

    this.route.params.subscribe(params => {
      if (params['apiName']) {
        this.apiName = params['apiName'];
        this.fetchApiDefinition();
        if (!params['name']) {
          this.routedFromServiceDetails = false;
        }
      } else if (params['name']) {
        this.serviceName = params['name'];
        this.fetchService();
      } else {
        this.routedFromServiceDetails = false;
        this.fetchListOfServices();
      }
    });
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  private splitHostname(host) {
    return host.split(this.domain)[0];
  }

  public setData(data) {
    this.apiDefinition = data;
    this.serviceName = data.spec.service.name;
    this.hostname = this.splitHostname(data.spec.hostname);
    this.servicePort = data.spec.service.port;

    if (
      _.isArray(data.spec.authentication) &&
      data.spec.authentication.length > 0
    ) {
      this.secure = true;
      const firstEntry = data.spec.authentication[0];
      this.jwksUri = firstEntry.jwt.jwksUri;
      this.issuer = firstEntry.jwt.issuer;
    }

    this.fetchService();
  }

  public fetchApiDefinition() {
    const url = `${this.apiDefUrl}${this.apiName}`;
    this.exposeApiService.getApiDefinition(url).subscribe(
      def => this.setData(def),
      err => {
        console.log(err);
      }
    );
  }

  public fetchAuthIssuer() {
    this.idpPresetsService.getDefaultIdpPreset().subscribe(config => {
      this.defaultAuthConfig = config;
      let hasDex = false;
      let jwksUri = config.jwks_uri;
      let issuer = config.issuer;
      this.idpPresetsService
        .getIDPPresets()
        .finally(() => {
          if (!this.apiDefinition || !this.jwksUri) {
            this.jwksUri = jwksUri;
            this.issuer = issuer;
          }
          if (!hasDex) {
            this.availablePresets.push({
              label: 'Dex',
              jwksUri: config.jwks_uri,
              issuer: config.issuer
            });
          }
        })
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
                  issuer: preset.issuer
                });
              });
            }
          },
          err => {
            console.log('Error fetching IDP presets', err);
            return [];
          }
        );
    });
  }

  public fetchService() {
    this.exposeApiService
      .getService(this.currentEnvironmentId, this.serviceName)
      .subscribe(
        service => {
          this.service = service;
          if (!this.servicePort) {
            this.servicePort = service.spec.ports[0].port;
          }
          if (this.service.spec && this.service.spec.selector) {
            if (
              Object.getOwnPropertyNames(this.service.spec.selector).length > 0
            ) {
              this.fetchDeployment(this.service.spec.selector);
            }
          }
          this.setApiName();
          this.fetchAuthIssuer();
        },
        err => console.log(err)
      );
  }

  public fetchListOfServices() {
    this.exposeApiService
      .getListOfServices(this.currentEnvironmentId)
      .subscribe(
        services => {
          this.filteredServices = services.items;
          this.listOfServices = services.items;
          this.fetchListOfDeployments();
          this.fetchAuthIssuer();
        },
        err => console.log(err)
      );
  }

  public fetchListOfDeployments() {
    this.exposeApiService
      .getListOfDeplotments(this.currentEnvironmentId)
      .map(deployments => {
        if (deployments && deployments.items && deployments.items.length > 0) {
          return deployments.items;
        }
        return null;
      })
      .subscribe(
        deployments => {
          this.listOfDeployments = deployments;
        },
        err => console.log(err)
      );
  }

  public findMatchingDeployment() {
    let matchingDeployment = null;
    if (this.listOfDeployments && this.listOfDeployments.length > 0) {
      this.listOfDeployments.forEach(deployment => {
        if (
          this.service &&
          this.service.spec &&
          this.service.spec.selector &&
          deployment.spec &&
          deployment.spec.selector &&
          deployment.spec.selector.matchLabels.app ===
            this.service.spec.selector.app
        ) {
          matchingDeployment = deployment;
        }
      });
      this.deployment = matchingDeployment;
    }
    this.checkIfServiceCanBeSecured();
  }

  public checkIfServiceCanBeSecured() {
    if (
      this.deployment &&
      this.deployment.spec &&
      this.deployment.spec.template &&
      this.deployment.spec.template.metadata &&
      this.deployment.spec.template.metadata.annotations
    ) {
      this.canBeSecured =
        this.deployment.spec.template.metadata.annotations[
          'sidecar.istio.io/inject'
        ] === 'true'
          ? true
          : false;
    } else {
      this.canBeSecured = false;
    }
  }

  public filterServices() {
    this.filteredServices = [];
    let chosenService;
    this.listOfServices.forEach(service => {
      if (service.metadata.name.includes(this.serviceName.toLowerCase())) {
        this.filteredServices.push(service);
      }
      if (service.metadata.name === this.serviceName.toLowerCase()) {
        chosenService = service;
      }
    });
    if (chosenService) {
      this.selectService(chosenService);
    } else {
      this.service = undefined;
    }
    this.setApiName();
  }

  public toggleDropDown() {
    this.ariaServiceExpanded = !this.ariaServiceExpanded;
    this.ariaServiceHidden = !this.ariaServiceHidden;
  }

  public closeDropDown() {
    this.ariaServiceExpanded = false;
    this.ariaServiceHidden = true;
  }

  public openDropDown(event: Event) {
    event.stopPropagation();
    this.ariaServiceExpanded = true;
    this.ariaServiceHidden = false;
  }

  public selectService(service) {
    this.service = service;
    this.serviceName = service.metadata.name;
    this.servicePort = service.spec.ports[0].port;
    this.fecthLambdaServices(this.currentEnvironmentId, this.serviceName);
  }

  private fetchDeployment(selector: any) {
    const selectorKey = Object.getOwnPropertyNames(selector)[0];
    const selectorValue = selector[selectorKey];
    const url = `${AppConfig.k8sApiServerUrl_apps}namespaces/${
      this.currentEnvironmentId
    }/deployments?labelSelector=${selectorKey}=${selectorValue}`;
    this.http
      .get<any>(url, {})
      .map(deployments => {
        if (deployments && deployments.items && deployments.items.length > 0) {
          return deployments.items[0];
        }
        return null;
      })
      .subscribe(
        deployment => {
          this.deployment = deployment;
          this.checkIfServiceCanBeSecured();
        },
        err => console.log(err)
      );
  }

  private fetchToken() {
    const message = `Bearer ${this.oAuthService.getIdToken()}`;
    this.fetchModal.show('Fetch token', message);
  }

  public isDefaultProvider() {
    return (
      this.defaultAuthConfig && this.defaultAuthConfig.issuer === this.issuer
    );
  }

  public dataToSend() {
    let authentication = null;
    if (this.secure && this.canBeSecured) {
      authentication = [
        {
          type: 'JWT',
          jwt: {
            jwksUri: this.jwksUri,
            issuer: this.issuer
          }
        }
      ];
    }
    return {
      apiName: this.apiName,
      serviceName: this.serviceName,
      servicePort: _.parseInt(this.servicePort),
      hostname: this.hostname + this.domain,
      function: this.isLambda == true ? this.serviceName : '',
      authentication
    };
  }

  private clearInputErrors() {
    this.errorPort = '';
    this.errorApiName = '';
    this.errorHostname = '';
    this.errorJWKSUri = '';
    this.errorIssuer = '';
  }

  private validateRegexName(name) {
    // it must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character (e.g. 'example.com')
    const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    return !regex.test(name);
  }

  private validateLengthHostname() {
    return 3 > this.hostname.length;
  }

  private validateHostname() {
    if (_.isEmpty(this.hostname)) {
      return 'Hostname is required.';
    }

    if (this.validateLengthHostname()) {
      return 'Hostname is required and should be at least 3 characters long.';
    }

    if (this.validateRegexName(this.hostname)) {
      return 'Hostname has wrong format. Use letters, numbers, dots and dashes.';
    }

    return '';
  }

  private validateApiName() {
    if (_.isEmpty(this.apiName)) {
      return 'Api name is required.';
    }

    if (this.validateRegexName(this.apiName)) {
      return 'Api name has wrong format. Use letters, numbers, dots and dashes.';
    }

    return '';
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

  private validatePort() {
    if (_.isEmpty(_.toString(this.servicePort))) {
      return 'Service Port is required.';
    }

    if (!_.isInteger(Number(this.servicePort))) {
      return 'Service Port should be a number.';
    }

    return '';
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

  public checkIfServiceExists() {
    if (this.listOfServices) {
      const svc = this.listOfServices.map(service => {
        return service.metadata.name;
      });
      return _.includes(svc, this.serviceName);
    }
    return true;
  }

  public setApiName() {
    if (!this.apiDefinition) {
      this.apiName =
        this.serviceName && this.hostname
          ? `${this.serviceName}-${this.hostname}`
          : `${this.serviceName}${this.hostname}`;
    }
  }

  public fecthLambdaServices(environment: string, serviceName: string) {
    const label = `function=${serviceName}`;
    const url = `${
      AppConfig.k8sApiServerUrl
    }namespaces/${environment}/services?labelSelector=${label}`;
    this.http
      .get<any>(url, {})
      .map(services => {
        if (services && services.items && services.items.length > 0) {
          return services.items[0];
        }
        return null;
      })
      .subscribe(
        service => {
          if (service != null) {
            this.isLambda = true;
          } else {
            this.isLambda = false;
          }
        },
        err => console.log(err)
      );
  }
}
