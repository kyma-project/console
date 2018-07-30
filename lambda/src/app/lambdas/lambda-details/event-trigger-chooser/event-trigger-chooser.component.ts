import { Component, Output, EventEmitter } from '@angular/core';
import { EventTrigger } from '../../../shared/datamodel/event-trigger';
import * as _ from 'lodash';

@Component({
  selector: 'app-event-trigger-chooser',
  templateUrl: './event-trigger-chooser.component.html',
  styleUrls: [
    '../../../app.component.scss',
    './event-trigger-chooser.component.scss',
  ],
})
export class EventTriggerChooserComponent {
  availableEventTriggers: EventTrigger[] = [];
  selectedEventTriggers: EventTrigger[] = [];
  @Output() eventEmitter = new EventEmitter<EventTrigger[]>();

  public eventSearchQuery = '';
  public filteredTriggers: EventTrigger[] = [];
  private title: string;
  public isActive = false;
  private eventsSelected = 0;
  public enableAdd = false;

  constructor() { }

  initializeView() {
    this.eventSearchQuery = '';
    this.availableEventTriggers = [];
    this.selectedEventTriggers = [];
    this.filteredTriggers = [];
    this.eventsSelected = 0;
    this.enableAdd = false;
  }

  public show(availableEventTriggers, selectedEventTriggers) {
    this.initializeView();
    this.selectedEventTriggers = selectedEventTriggers;
    availableEventTriggers.forEach(event => {
      let isSelected = false;
      this.selectedEventTriggers.forEach(selEvent => {
        if (this.areEventTriggersEqual(event, selEvent)) {
          isSelected = true;
          return;
        }
      });
      if (!isSelected) {
        this.filteredTriggers.push(event);
      }
    });
    this.availableEventTriggers = this.filteredTriggers;
    this.title = 'Add Event Trigger';
    this.isActive = true;
  }

  filterEvents(search) {
    this.filteredTriggers = _.filter(this.availableEventTriggers, event => {
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
      this.selectedEventTriggers.push(event);
      this.eventsSelected++;
    } else {
      let indexToBeDeleted: number;
      this.selectedEventTriggers.forEach((val, index) => {
        if (this.areEventTriggersEqual(event, val)) {
          indexToBeDeleted = index;
        }
      });
      this.selectedEventTriggers.splice(indexToBeDeleted, 1);
      this.eventsSelected--;
    }
    this.enableAdd = this.eventsSelected > 0 ? true : false;
  }

  addEvents() {
    this.eventEmitter.emit(this.selectedEventTriggers);
    this.closeEventTriggerChooserModal();
  }

  closeEventTriggerChooserModal() {
    this.isActive = false;
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
}
