import {ChangeDetectorRef, Component, Input, ViewRef} from '@angular/core';

@Component({
  selector: 'y-list-actions',
  templateUrl: './list-element-actions.component.html',
  styleUrls: ['./list-element-actions.component.scss']
})
export class ListElementActionsComponent {

  @Input() entry: any;
  @Input() entryEventHandler: any;
  @Input() actions: any[];

  isExpanded = false;
  ariaHidden = true;

  constructor(private changeDetector: ChangeDetectorRef) {}

  toggleActionsBtn(event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
    this.ariaHidden = !this.ariaHidden;
      if (!(this.changeDetector as ViewRef).destroyed) {
          this.changeDetector.detectChanges();
      }
  }

  closeActionsBtn(event) {
    event.stopPropagation();
    this.isExpanded = false;
    this.ariaHidden = true;
      if (!(this.changeDetector as ViewRef).destroyed) {
          this.changeDetector.detectChanges();
      }
  }

  executeAction(action: string, event) {
    event.stopPropagation();
    const functionName = action['function'];
    if (functionName && this.entryEventHandler && this.entryEventHandler[functionName]) {
      this.entryEventHandler[functionName](this.entry);
        if (!(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }
  }

  entryAsString() {
    if (this.entry instanceof Object) {
      return this.entry.toString();
    }
    return this.entry;
  }
}
