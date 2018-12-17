import { AppConfig } from '../../../app.config';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-instances-container',
  templateUrl: './instances-container.component.html',
  styleUrls: ['./instances-container.component.scss']
})
export class InstancesContainerComponent {
  public externalUrl: string = AppConfig.serviceInstancesModuleUrl;
  public relativePath = '';
  public path = '/home/namespaces/';
  public executionAsync = false;
  protected route: ActivatedRoute;

  constructor(route: ActivatedRoute) {
    this.route = route;
    this.route.data.subscribe(data => {
      this.route.params.subscribe(params => {
        if (data.path) {
          this.relativePath = data.path;
        }
        if (params) {
          Object.keys(params).forEach(
            p =>
              (this.relativePath = this.relativePath.replace(
                ':' + p,
                params[p]
              ))
          );
        }
      });
    });
  }
}
