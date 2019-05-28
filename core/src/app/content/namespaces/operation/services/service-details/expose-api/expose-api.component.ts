import { IdpPresetsService } from '../../../../../settings/idp-presets/idp-presets.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentNamespaceService } from '../../../../services/current-namespace.service';
import { ExposeApiService } from './expose-api.service';
import { AppConfig } from '../../../../../../app.config';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { InformationModalComponent } from 'shared/components/information-modal/information-modal.component';
import { Copy2ClipboardModalComponent } from 'shared/components/copy2clipboard-modal/copy2clipboard-modal.component';
import { finalize, map } from 'rxjs/operators';
import * as LuigiClient from '@kyma-project/luigi-client';
import { API_PORT_DESCRIPTION } from '../../../../../../shared/constants/constants';

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
  private currentNamespaceId = '';
  private currentNamespaceSubscription: Subscription;
  public error = '';
  public errorApiName = '';
  public errorHostname = '';
  public errorPort = '';
  public errorJWKSUri = '';
  public errorIssuer = '';
  public apiDefinition: any;
  private apiDefUrl = '';
  private service: any;
  public canBeSecured = false;
  public jwksUri: string;
  public issuer: string;
  private defaultAuthConfig: any;
  public listOfServices;
  public filteredServices;
  public routedFromServiceDetails = true;
  private pods: any;

  public ariaExpanded = false;
  public ariaHidden = true;
  public ariaServiceExpanded = false;
  public ariaServiceHidden = true;

  public availablePresets = [];

  readonly API_PORT_DESCRIPTION = API_PORT_DESCRIPTION;

  @ViewChild('fetchModal') fetchModal: Copy2ClipboardModalComponent;

  constructor(
    private currentNamespaceService: CurrentNamespaceService,
    private exposeApiService: ExposeApiService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private idpPresetsService: IdpPresetsService
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

  public navigateToList(list) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(list);
  }

  public navigateToDetails(apiName) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`services/details/${apiName}`);
  }

  public goBack() {
    this.routedFromServiceDetails
      ? this.navigateToDetails(this.serviceName)
      : this.navigateToList('cmf-apis');
  }

  public isAbleToMakeRequest() {
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
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        this.apiDefUrl = `namespaces/${this.currentNamespaceId}/apis/`;
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
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
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
      let jwksUri = AppConfig.dexFQDNUri;
      let issuer = config.issuer;
      this.idpPresetsService
        .getIDPPresets()
        .pipe(
          finalize(() => {
            if (!this.apiDefinition || !this.jwksUri) {
              this.jwksUri = jwksUri;
              this.issuer = issuer;
            }
            if (!hasDex) {
              this.availablePresets.push({
                label: 'Dex',
                jwksUri,
                issuer: config.issuer
              });
            }
          })
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
      .getService(this.currentNamespaceId, this.serviceName)
      .subscribe(
        service => {
          this.service = service;
          if (!this.servicePort) {
            this.servicePort = service.spec.ports[0].port;
          }

          this.checkIfServiceCanBeSecured(service);

          this.setApiName();
          this.fetchAuthIssuer();
        },
        err => console.log(err)
      );
  }

  public fetchListOfServices() {
    this.exposeApiService
      .getListOfServices(this.currentNamespaceId)
      .subscribe(
        services => {
          this.filteredServices = services.items;
          this.listOfServices = services.items;
          this.fetchAuthIssuer();
        },
        err => console.log(err)
      );
  }

  public checkIfServiceCanBeSecured(service) {
    try {
      let labels = '';

      Object.entries(service.spec.selector).forEach(labelPair => {
        labels += `${labelPair[0]}=${labelPair[1]},`;
      });

      if (labels.endsWith(',')) {
        labels = labels.slice(0, -1);
      }

      this.exposeApiService
        .getPodsByLabelSelector(this.currentNamespaceId, labels)
        .subscribe(pods => {
          this.pods = pods.items;
          this.canBeSecured = this.pods.find(pod => {
            return pod.spec.containers.find(container => {
              return container.name === 'istio-proxy';
            });
          });
        });
    } catch (e) {
      // nop
      // secure api creation not possible
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
  }

  private fetchToken() {
    const token = LuigiClient.getEventData().idToken;
    const message = `Bearer ${token}`;
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
}
