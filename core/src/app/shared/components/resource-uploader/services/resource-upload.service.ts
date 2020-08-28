import * as LuigiClient from '@luigi-project/client';
import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrentNamespaceService } from '../../../../content/namespaces/services/current-namespace.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

import * as _ from 'lodash';
import * as YAML from 'js-yaml';

@Injectable()
export class ResourceUploadService implements OnDestroy {
  private currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;

  private readonly mutation = `mutation  createResource($namespace: String!, $resource: JSON!) {
    createResource(namespace: $namespace, resource: $resource)
  }`;
  
  constructor(
    private httpClient: HttpClient,
    private graphQLClientService: GraphQLClientService,
    private currentNamespaceService: CurrentNamespaceService
  ) {
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
      });
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
  }

  private isYaml(file) {
    return _.endsWith(file.name, '.yaml') || _.endsWith(file.name, '.yml');
  }
  private isValid(file) {
    return (
      _.endsWith(file.name, '.yaml') ||
      _.endsWith(file.name, '.yml') ||
      _.endsWith(file.name, '.json')
    );
  }
  private parseJsonResource(resources) {
    const fileContents = [];

    if (!_.isArray(JSON.parse(resources))) {
      fileContents.push(JSON.parse(resources));

      return fileContents;
    }

    return JSON.parse(resources);
  }

  private convertFileContents(file, resources) {
    const fileContents = [];
    if (this.isValid(file)) {
      if (this.isYaml(file)) {
        YAML.safeLoadAll(resources, r => fileContents.push(r));

        return fileContents;
      }

      return this.parseJsonResource(resources);
    } else {
      throw new Error('File has wrong format. Select YAML or JSON file.');
    }
  }

  private read(file: File) {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => observer.next(reader.result);

      return reader.readAsText(file);
    });
  }

  public getFileContent(file: File) {
    return new Observable(observer => {
      this.read(file).subscribe(
        (resources: string[]) => {
          try {
            const fileContents = this.convertFileContents(file, resources);
            if (resources.length > 0) {
              _.each(fileContents, content => {
                if (content.kind && content.metadata && content.apiVersion) {
                  return observer.next(fileContents);
                } else {
                  throw new Error(
                    'Fields "apiVersion", "kind" and "metadata" are required.'
                  );
                }
              });
            } else {
              throw new Error('File cannot be empty.');
            }
          } catch (err) {
            observer.error(err);
          }
        },
        err => console.log(err)
      );
    });
  }

  public upload(fileContents: any[]) {
    const observables = fileContents.map(content => {
      // add "metadata.namespace", as it's required for RBAC
      if (!content.metadata.namespace) {
        content.metadata.namespace = this.currentNamespaceId;
      }
      const variables = {
        namespace: this.currentNamespaceId,
        resource: content,
      };
      return this.graphQLClientService.gqlMutation(this.mutation, variables)
    })
    return forkJoin(observables);
  }
}
