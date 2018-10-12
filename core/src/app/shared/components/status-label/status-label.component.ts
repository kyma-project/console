import { Component, Input } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'app-status-label',
  templateUrl: './status-label.component.html',
  styleUrls: ['./status-label.component.scss']
})
export class StatusLabelComponent {
  @Input() statusType: string;
  @Input() description: string = null;
  private statusClass: string;

  public getStatusClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'tn-label--warning';
      case 'error':
        return 'tn-label--error';
      default:
        return 'tn-label--success';
    }
  };

  ngOnInit() {
    this.statusClass = this.getStatusClass(this.statusType);
  }
}
