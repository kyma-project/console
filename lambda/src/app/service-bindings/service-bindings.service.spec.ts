import { TestBed, inject } from '@angular/core/testing';

import { ServiceBindingsService } from './service-bindings.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfig } from '../app.config';
import {
  ServiceBinding,
  IServiceBindingSpec,
} from '../shared/datamodel/k8s/service-binding';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';
import { IMetaDataOwner } from '../shared/datamodel/k8s/generic/meta-data-owner';
import { HttpHeaders } from '@angular/common/http';
import { LocalObjectReference } from '../shared/datamodel/k8s/local-object-reference';

describe('ServiceBindingsService', () => {
  let serviceBindingsService: ServiceBindingsService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceBindingsService],
    });

    serviceBindingsService = TestBed.get(ServiceBindingsService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should get Service Binding', done => {
    const name = 'fakeServiceBindingName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    serviceBindingsService
      .getServiceBinding(name, namespace, token)
      .subscribe(res => {
        done();
      });

    const req = httpClientMock.expectOne(
      `${
        AppConfig.serviceCatalogApiUrl
      }/namespaces/${namespace}/servicebindings/${name}`,
    );

    expect(req.request.method).toEqual('GET');
    // We need this to fake the return call of subscribe. Without this the call would timeout
    req.flush({});

    httpClientMock.verify();
  });

  it('should get all the Service Bindings', done => {
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    serviceBindingsService
      .getServiceBindings(namespace, token)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(
      `${
        AppConfig.serviceCatalogApiUrl
      }/namespaces/${namespace}/servicebindings`,
    );
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });

  it('should create the Service Binding', done => {
    const md: IMetaData = {
      name: '',
      namespace: 'fakeNamespace',
    };

    const lor: LocalObjectReference = {
      name: '',
    };
    const sp: IServiceBindingSpec = {
      instanceRef: lor,
      secretName: '',
    };

    const fakeServiceBinding = new ServiceBinding({
      kind: 'ServiceBindingUsage',
      apiVersion: 'servicecatalog.kyma-project.io/v1alpha1',
      metadata: md,
      spec: sp,
    });
    const token = 'fakeToken';
    serviceBindingsService
      .createServiceBinding(fakeServiceBinding, token)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(
      `${AppConfig.serviceCatalogApiUrl}/namespaces/${
        fakeServiceBinding.metadata.namespace
      }/servicebindings`,
    );
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });

  it('should delete the Service Binding', done => {
    const name = 'fakeServiceBindingName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    serviceBindingsService
      .deleteServiceBinding(name, namespace, token)
      .subscribe(res => {
        done();
      });
    const req = httpClientMock.expectOne(
      `${
        AppConfig.serviceCatalogApiUrl
      }/namespaces/${namespace}/servicebindings/${name}`,
    );
    req.flush({});
    httpClientMock.verify();
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual(
      'Bearer fakeToken',
    );
  });
});
