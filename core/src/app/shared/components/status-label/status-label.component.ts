import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-label',
  templateUrl: './status-label.component.html',
  styleUrls: ['./status-label.component.scss']
})
export class StatusLabelComponent {
  @Input() statusType: string = null;
  @Input() description: string = null;

  showTooltip: boolean;
  public get computedClasses(): string {
    // Angular explodes once the given classes string can't be split by spaces nicely. Thank you Angular.
    return `status-badge ${this.getStatusClass(this.statusType)} ${
      this.description ? 'has-tooltip' : ''
    }`.trim();
  }

  public getStatusClass = (type?: string) => {
    switch (type) {
      case 'warning':
        return 'status-badge--warning';
      case 'error':
        return 'status-badge--error';
      case 'info':
        return 'status-badge--info';
      case 'success':
      case 'ok':
        return 'status-badge--success';
      default:
        return '';
    }
  };
}
