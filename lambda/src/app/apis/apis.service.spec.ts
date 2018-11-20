import { TestBed, inject } from '@angular/core/testing';

import { ApisService } from './apis.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AppConfig } from '../app.config';
import { IMetaData } from '../shared/datamodel/k8s/generic/meta-data';
import { Api, IApiSpec } from '../shared/datamodel/k8s/api';
import { Service } from '../shared/datamodel/k8s/api-service';
import { AuthenticationRule } from '../shared/datamodel/k8s/api-authentication-rule';
import { JwtAuthentication } from '../shared/datamodel/k8s/api-jwt-authentication';


describe('ApisService', () => {
  let apiService: ApisService;
  let httpClientMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApisService]
    });

    apiService = TestBed.get(ApisService);
    httpClientMock = TestBed.get(HttpTestingController);
  });

  it('should get api', (done) => {
    const name = 'fakeApiName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    apiService.getApi(name, namespace, token).subscribe((res) => {
      done();
    });

    const req = httpClientMock.expectOne(
      `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${name}`
    );

    req.flush({});
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
  });

  it('should create api', (done) => {
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    const svc: Service = {
      name: '',
      port: 8080
    };

    const jwtAuth: JwtAuthentication = {
      issuer: 'issuer',
      jwksUri: 'jwksUri'
    }

    const authRule: AuthenticationRule = {
      jwt: jwtAuth,
      type: 'JWT'
    };
    const sp: IApiSpec = {
      service: svc,
      authentication: [authRule],
      hostname: ''
    }

    const md: IMetaData = {
      name: 'ApiName',
      namespace: 'fakeNamespace'
    }

    const api = new Api({
      kind: 'Api',
      apiVersion: 'gateway.kyma-project.io/v1alpha2',
      metadata: md,
      spec: sp,
    });

    apiService.createApi(api, namespace, token).subscribe((res) => {
      done();
    });

    const req = httpClientMock.expectOne(
      `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${api.metadata.name}`
    );

    req.flush({});
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');
  });

  it('should update api', (done) => {
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';
    const svc: Service = {
      name: '',
      port: 8080
    };

    const jwtAuth: JwtAuthentication = {
      issuer: 'issuer',
      jwksUri: 'jwksUri'
    }

    const authRule: AuthenticationRule = {
      jwt: jwtAuth,
      type: 'JWT'
    };
    const sp: IApiSpec = {
      service: svc,
      authentication: [authRule],
      hostname: ''
    }

    const md: IMetaData = {
      name: 'ApiName',
      namespace: 'fakeNamespace'
    }

    const api = new Api({
      kind: 'Api',
      apiVersion: 'gateway.kyma-project.io/v1alpha2',
      metadata: md,
      spec: sp,
    });

    apiService.updateApi(api, namespace, token).subscribe((res) => {
      done();
    });

    const req = httpClientMock.expectOne(
      `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${api.metadata.name}`
    );

    req.flush({});
    expect(req.request.method).toEqual('PUT');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');

  });

  it('should delete api', (done) => {
    const name = 'fakeApiName';
    const namespace = 'fakeNamespace';
    const token = 'fakeToken';

    apiService.deleteApi(name, namespace, token).subscribe((res) => {
      done();
    });

    const req = httpClientMock.expectOne(
      `${AppConfig.apisApiUrl}/namespaces/${namespace}/apis/${name}`
    );

    req.flush({});
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer fakeToken');

  });
});
