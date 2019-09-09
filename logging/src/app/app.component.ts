import { Component, OnInit } from '@angular/core';
import * as LuigiClient from '@kyma-project/luigi-client';
import {
  LuigiContextService,
  ILuigiContextTypes,
} from './search-form/service/luigi-context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public luigiClient = LuigiClient;
  public title = 'Kyma Log';

  constructor(private luigiService: LuigiContextService) {}

  ngOnInit() {
    this.luigiClient.addInitListener(context =>
      this.onLuigiContext('init', context),
    );
    this.luigiClient.addContextUpdateListener(context =>
      this.onLuigiContext('update', context),
    );
  }

  private onLuigiContext(contextType: ILuigiContextTypes, context: any): void {
    this.luigiService.setContext({ contextType, context });
  }
}
