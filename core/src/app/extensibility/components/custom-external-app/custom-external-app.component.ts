import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExtensionsService } from '../../services/extensions.service';

@Component({
  selector: 'app-custom-external-app',
  templateUrl: './custom-external-app.component.html',
  styleUrls: ['./custom-external-app.component.scss']
})
export class CustomExternalAppComponent {
  public externalUrl: string;
  public mountingPath: string;
  public relativePath = '';
  public executionAsync: boolean;

  constructor(
    private route: ActivatedRoute,
    private extensionsService: ExtensionsService
  ) {
    this.route = route;
    this.route.data.subscribe(data => {
      this.mountingPath = data.mountingPath;

      if (!this.extensionsService.isUsingSecureProtocol(data.externalUrl)) {
        return;
      }
      this.externalUrl = data.externalUrl;

      this.executionAsync = data.executionAsync;
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
