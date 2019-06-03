import {
  IServiceSpec,
  IServicePort,
} from './../../shared/datamodel/k8s/service';
import { IContainer } from './../../shared/datamodel/k8s/container';
import {
  IPodTemplate,
  IPodTemplateSpec,
} from './../../shared/datamodel/k8s/pod-template';
import { IMetaData } from './../../shared/datamodel/k8s/generic/meta-data';
import {
  IFunctionSpec,
} from './../../shared/datamodel/k8s/function';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lambda } from '../../shared/datamodel/k8s/function';
import { catchError, map, tap } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import {
  IDeploymentSpec,
  Deployment,
} from '../../shared/datamodel/k8s/deployment';
import { GraphqlClientService } from '../../graphql-client/graphql-client.service';
import {
  HPAutoscaler,
  IHPAutoscalerSpec,
  IMetricResource,
  IMetricSpec,
} from '../../shared/datamodel/k8s/autoscaler';
import { cloneDeep } from 'lodash';

@Injectable()
export class LambdaDetailsService {
  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphqlClientService,
  ) {}

  /** GET Lambda by name and namespace. Will 404 if name not found */
  getLambda(
    name: string,
    namespace: string,
    token: string,
  ): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.kubelessApiUrl
    }/namespaces/${namespace}/functions/${name}`;
    return this.http.get<Lambda>(url, httpOptions);
  }

  /** DELETE Lambda by name and namespace. Will 404 if name not found */
  deleteLambda(
    name: string,
    namespace: string,
    token: string,
  ): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${
      AppConfig.kubelessApiUrl
    }/namespaces/${namespace}/functions/${name}`;
    return this.http.delete<Lambda>(url, httpOptions);
  }

  /** PUT: update Lambda */
  updateLambda(func: Lambda, token: string): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.kubelessApiUrl}/namespaces/${
      func.metadata.namespace
    }/functions/${func.metadata.name}`;
    return this.http.put<Lambda>(url, func, httpOptions);
  }

  /** POST: create Lambda */
  createLambda(func: Lambda, token: string): Observable<Lambda> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.kubelessApiUrl}/namespaces/${
      func.metadata.namespace
    }/functions/${func.metadata.name}`;
    return this.http.post<Lambda>(url, func, httpOptions);
  }

  deleteHPA(func: Lambda, token: string): Observable<HPAutoscaler> {
    const httpOptions = this.getHTTPOptions(token);
    const url = `${AppConfig.autoscalingUrl}/namespaces/${
      func.metadata.namespace
    }/horizontalpodautoscalers/${func.metadata.name}`;
    return this.http.delete<HPAutoscaler>(url, httpOptions);
  }

  getHTTPOptions(token: string): object {
    let httpHeaders: any;
    httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return httpHeaders;
  }

  initializeLambda(): Lambda {
    const md: IMetaData = {
      name: '',
      namespace: '',
      labels: {
        'created-by': 'kubeless',
      },
      annotations: {},
    };

    const con: IContainer = {
      name: '',
      image: '',
      env: [],
      resources: {},
    };

    const podSpec: IPodTemplateSpec = {
      containers: [con],
    };

    const podTemplate: IPodTemplate = {
      spec: podSpec,
    };

    const depSpec: IDeploymentSpec = {
      replicas: 1,
      template: podTemplate,
    };

    const dep = new Deployment({
      spec: depSpec,
    });

    const svcPort: IServicePort = {
      name: 'http-function-port',
      protocol: 'TCP',
      port: 8080,
      targetPort: 8080,
    };

    const svcSpec: IServiceSpec = {
      ports: [svcPort],
      selector: {},
    };

    const mdScaler: IMetaData = {
      name: '',
      namespace: '',
      labels: {},
    };

    const targetRefScale = {
      apiVersion: 'apps/v1beta1',
      kind: 'Deployment',
      name: '',
    };

    const cpuResource: IMetricResource = {
      name: 'cpu',
      targetAverageUtilization: 40,
    };

    const cpuMetricSpec: IMetricSpec = {
      type: 'Resource',
      resource: cpuResource,
    };

    const scalerSpec: IHPAutoscalerSpec = {
      scaleTargetRef: targetRefScale,
      maxReplicas: 2,
      minReplicas: 1,
      metrics: [cpuMetricSpec],
    };

    const hpAutoscaler = new HPAutoscaler({
      kind: 'HorizontalPodAutoscaler',
      apiVersion: 'autoscaling/v1',
      metadata: mdScaler,
      spec: scalerSpec,
    });

    const funcSpec: IFunctionSpec = {
      handler: 'handler.main',
      runtime: 'nodejs6',
      deps: '',
      function: '',
      type: 'HTTP',
      deployment: dep,
      service: svcSpec,
      horizontalPodAutoscaler: hpAutoscaler,
    };

    const lambda = new Lambda({
      kind: 'Function',
      apiVersion: 'kubeless.io/v1beta1',
      metadata: md,
      spec: funcSpec,
    });
    lambda.spec['function-content-type'] = 'text';
    return lambda;
  }

  initializeMissingLambdaContainers(lambda: Lambda): Lambda {
    if (!lambda.spec.deployment.spec.template.spec.containers) {
      const newLambda = cloneDeep(lambda);
      newLambda.spec.deployment.spec.template.spec.containers = [{}];
      return newLambda;
    }
    return lambda;
  }

  public getResourceQuotaStatus(namespace: string, token: string) {
    const query = ` query ResourceQuotasStatus($namespace: String!) {
      resourceQuotasStatus(namespace: $namespace){
        exceeded
        exceededQuotas{
          quotaName
          resourceName
          affectedResources
        }
      } 
    }`;

    const variables = {
      namespace,
    };

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables,
      token,
    );
  }
}
