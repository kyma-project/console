import { AppConfig } from './../../app.config';

import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClientService } from './graphql-client-service';

@Injectable()
export class RbacService {
  public envChangeStateEmitter$: EventEmitter<boolean>;

  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphQLClientService
  ) {
    this.envChangeStateEmitter$ = new EventEmitter();
  }

  prepareMetadata(data) {
    if ('RoleBinding' === data.kind) {
      return {
        name: `${data.name}-${data.roleName}-binding`,
        namespace: data.namespace
      };
    }

    return {
      name: `${data.name}-${data.roleName}-binding`
    };
  }

  prepareBindingToCreate(data) {
    const subject = {
      apiGroup: 'rbac.authorization.k8s.io',
      name: data.name,
      kind: data.isUserGroup ? 'Group' : 'User'
    };
    return {
      kind: data.kind,
      metadata: this.prepareMetadata(data),
      apiVersion: 'rbac.authorization.k8s.io/v1',
      subjects: [subject],
      roleRef: {
        kind: data.roleKind,
        name: data.roleName,
        apiGroup: 'rbac.authorization.k8s.io'
      }
    };
  }

  public getRoles(environmentId) {
    return this.http.get(
      `${AppConfig.k8sApiServerUrl_rbac}namespaces/${environmentId}/roles`
    );
  }

  public getClusterRoles() {
    return this.http.get(AppConfig.k8sApiServerUrl_rbac + 'clusterroles');
  }

  public createClusterRoleBinding(data) {
    return this.http.post(
      `${AppConfig.k8sApiServerUrl_rbac}clusterrolebindings`,
      this.prepareBindingToCreate(data)
    );
  }

  public getClusterRoleBindings() {
    return this.http.get(
      `${AppConfig.k8sApiServerUrl_rbac}clusterrolebindings`
    );
  }

  public deleteClusterRoleBinding(name) {
    return this.http.delete(
      `${AppConfig.k8sApiServerUrl_rbac}clusterrolebindings/${name}`
    );
  }

  public createRoleBinding(data) {
    return this.http.post(
      `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
        data.namespace
      }/rolebindings`,
      this.prepareBindingToCreate(data)
    );
  }

  public getRoleBindings(namespace) {
    return this.http.get(
      `${AppConfig.k8sApiServerUrl_rbac}namespaces/${namespace}/rolebindings`
    );
  }

  public deleteRoleBinding(namespace, name) {
    return this.http.delete(
      `${
        AppConfig.k8sApiServerUrl_rbac
      }namespaces/${namespace}/rolebindings/${name}`
    );
  }
}
