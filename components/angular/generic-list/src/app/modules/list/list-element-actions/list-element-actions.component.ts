import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'y-list-actions',
  templateUrl: './list-element-actions.component.html',
  styleUrls: ['./list-element-actions.component.scss'],
})
export class ListElementActionsComponent {
  @Input() entry: any;
  @Input() entryEventHandler: any;
  @Input() actions: any[];
  @ViewChild('popover') private popover: any;

  constructor(private changeDetector: ChangeDetectorRef) {}

  handlePopoverClick(event) {
    event.stopPropagation();
    this.popover.onClickHandler(event);
  }

  executeAction(action: string, event) {
    event.stopPropagation();
    const functionName = action['function'];
    if (
      functionName &&
      this.entryEventHandler &&
      this.entryEventHandler[functionName]
    ) {
      this.entryEventHandler[functionName](this.entry);
      if (!(this.changeDetector as ViewRef).destroyed) {
        this.changeDetector.detectChanges();
      }
    }
  }
}
