import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { EventTrigger } from '../../../shared/datamodel/event-trigger';
import * as _ from 'lodash';

@Component({
  selector: 'app-event-trigger-chooser',
  templateUrl: './event-trigger-chooser.component.html',
  styleUrls: ['../lambda-details.component.scss'],
})
export class EventTriggerChooserComponent implements OnInit, OnChanges {
  @Input() availableTriggers: EventTrigger[];
  @Input() lambdaName: string;
  @Input() isLambdaNameInvalid: boolean;
  @Input() selectedTriggers: EventTrigger[];

  public eventSearchQuery = '';
  public filteredTriggers: EventTrigger[] = [];

  constructor() {}

  public ngOnChanges() {}

  public ngOnInit() {
    this.filteredTriggers = [...this.availableTriggers];
  }

  filterEvents(search) {
    this.filteredTriggers = _.filter(this.availableTriggers, event => {
      return (
        (event.eventType &&
          _.includes(event.eventType.toUpperCase(), search.toUpperCase())) ||
        (event.description &&
          _.includes(event.description.toUpperCase(), search.toUpperCase()))
      );
    });
  }

  toggleEventSelection(event: EventTrigger, clickEvent) {
    if (clickEvent.target.checked) {
      this.selectedTriggers.push(event);
    } else {
      let indexToBeDeleted: number;
      this.selectedTriggers.forEach((val, index) => {
        if (this.areEventTriggersEqual(event, val)) {
          indexToBeDeleted = index;
        }
      });
      this.selectedTriggers.splice(indexToBeDeleted, 1);
    }
  }

  areEventTriggersEqual(sourceET: EventTrigger, destET: EventTrigger): boolean {
    if (
      sourceET.eventType === destET.eventType &&
      sourceET.version === destET.version &&
      sourceET.source.environment === destET.source.environment &&
      sourceET.source.namespace === destET.source.namespace &&
      sourceET.source.type === destET.source.type
    ) {
      return true;
    } else {
      return false;
    }
  }

  isEventSelected(sourceET: EventTrigger): boolean {
    let isSelected = false;
    this.selectedTriggers.forEach(event => {
      if (this.areEventTriggersEqual(event, sourceET)) {
        isSelected = true;
        return;
      }
    });
    return isSelected;
  }
}
