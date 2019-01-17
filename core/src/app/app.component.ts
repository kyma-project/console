import { Component } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public environmentId: string;

  public constructor() {
    LuigiClient.addContextUpdateListener(updatedContext => {
      this.environmentId = updatedContext.environmentId;
      console.info(
        'context update: project ID as luigi param: ' +
          updatedContext.environmentId,
        updatedContext.goBackContext
          ? 'goBackContext? ' + updatedContext.goBackContext
          : ''
      );
    });
  }
}
