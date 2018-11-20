import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() position: string;
  @Input() width: string;

  getPositionClass = (position: string) => {
    switch (position) {
      case 'left':
        return 'tooltip__content--left';
      case 'right':
        return 'tooltip__content--right';
      case 'center':
        return 'tooltip__content--center';
    }
    return '';
  };
}
