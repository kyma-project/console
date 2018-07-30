import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { CurrentEnvironmentService } from '../../../../content/environments/services/current-environment.service';
import { AppConfig } from '../../../../app.config';

import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import * as YAML from 'js-yaml';

@Injectable()
export class ResourceUploadService implements OnDestroy {
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;

  constructor(
    private httpClient: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private oAuthService: OAuthService
  ) {
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
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

  private getResourceUrl(fileContent) {
    const resource = fileContent.kind.toLowerCase() + 's';

    switch (fileContent.apiVersion) {
      case 'v1':
        return `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentEnvironmentId
        }/${resource}`;
      default:
        return `${AppConfig.k8sServerUrl}/apis/${
          fileContent.apiVersion
        }/namespaces/${this.currentEnvironmentId}/${resource}`;
    }
  }

  private read(file: File) {
    return Observable.create(observer => {
      const reader = new FileReader();
      reader.onload = () => observer.next(reader.result);

      return reader.readAsText(file);
    });
  }

  public getFileContent(file: File) {
    return Observable.create(observer => {
      this.read(file).subscribe(
        resources => {
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

  public upload(url: string, fileContents: string[]) {
    const observables = [];

    _.each(fileContents, c => {
      observables.push(
        this.httpClient.post(url, c, {
          headers: new HttpHeaders()
            .set('Authorization', `Bearer ${this.oAuthService.getIdToken()}`)
            .set('Content-Type', 'application/json')
        })
      );
    });

    return forkJoin(observables);
  }

  public uploadWorkaround(fileContents: string[]) {
    const observables = [];

    _.each(fileContents, c => {
      const url = this.getResourceUrl(c);
      observables.push(
        this.httpClient.post(url, c, {
          headers: new HttpHeaders()
            .set('Authorization', `Bearer ${this.oAuthService.getIdToken()}`)
            .set('Content-Type', 'application/json')
        })
      );
    });

    return forkJoin(observables);
  }
}
