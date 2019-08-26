import { Component, OnInit } from '@angular/core';
import { LuigiClientService } from '../../../shared/services/luigi-client.service';

@Component({
  selector: 'app-lambdas-header-renderer',
  templateUrl: './lambdas-header-renderer.component.html',
  styleUrls: ['./lambdas-header-renderer.component.scss'],
})
export class LambdasHeaderRendererComponent implements OnInit {
  public showMetricsColumn = true;

  constructor(private luigiClientService: LuigiClientService) {}

  ngOnInit() {
    this.showMetricsColumn = this.luigiClientService.hasBackendModule(
      'grafana',
    );
  }
}
