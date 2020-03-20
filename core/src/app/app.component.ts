import { Component } from '@angular/core';
import LuigiClient from '@luigi-project/client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public namespaceId: string;

  public constructor() {
    LuigiClient.addContextUpdateListener(updatedContext => {
      this.namespaceId = updatedContext.namespaceId;
    });
  }
}
