import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification[header]',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() type: 'info' | 'success' | 'error' = 'info';
  @Input() header: string;
  @Input() description?: string;

  public iconForType: Map<string, string> = new Map([
    ['error', 'message-error'],
    ['info', 'message-information'],
    ['success', 'message-success'],
  ]);
}
