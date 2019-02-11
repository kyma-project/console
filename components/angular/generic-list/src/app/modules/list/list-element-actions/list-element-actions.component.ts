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

  handlePopoverClick(event: Event): void {
    const wasPopoverOpened = this.popover && this.popover.isOpen;
    event.stopPropagation();
    this.fireClick(document);
    if (this.popover && typeof this.popover.onClickHandler === 'function') {
      if (!wasPopoverOpened) {
        this.popover.onClickHandler(event);
      }
    } else {
      console.warn(`Could not fire Popover's built-in click event`);
    }
  }

  executeAction(action: string, event) {
    if (this.popover) {
      this.popover.close();
    }
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

  entryAsString = (entry: any): string => {
    if (entry instanceof Object) {
      return entry.name
        ? entry.name
        : entry.metadata.name
          ? entry.metadata.name
          : entry.toString();
    }

    return entry;
  };

  private fireClick(node: Document): void {
    if (document.createEvent) {
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, false);
      node.dispatchEvent(evt);
    } else if (typeof node.onclick === 'function') {
      node.onclick(new MouseEvent('click'));
    }
  }
}
