import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../../app.config';
import { map } from 'rxjs/operators';

@Injectable()
export class K8sResourceEditorService {
  constructor(private httpClient: HttpClient) {}

  updateResource(jsonData) {
    return this.httpClient
      .put(`${AppConfig.k8sServerUrl}${jsonData.metadata.selfLink}`, jsonData)
      .pipe(
        map(
          data => {
            return data;
          },
          err => {
            throw err;
          }
        )
      );
  }
}
