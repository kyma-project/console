import { Component, OnInit } from '@angular/core';
import * as LuigiClient from '@kyma-project/luigi-client';
import { LuigiClientService } from 'shared/services/luigi-client.service';

@Component({
  selector: 'app-deployment-header-renderer',
  templateUrl: './deployment-header-renderer.component.html',
  styleUrls: ['./deployment-header-renderer.component.scss']
})
export class DeploymentHeaderRendererComponent implements OnInit {
  public showBoundServices: boolean;
  public isSystemNamespace: boolean;

  constructor(private luigiClientService: LuigiClientService) {}

  ngOnInit() {
    this.showBoundServices =
      this.luigiClientService.hasBackendModule('servicecatalogaddons') &&
      !LuigiClient.getEventData().isSystemNamespace;
  }
}
