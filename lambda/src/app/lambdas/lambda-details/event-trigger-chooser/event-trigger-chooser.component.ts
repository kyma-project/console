import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import * as luigiClient from '@kyma-project/luigi-client';
import { ModalComponent, ModalService } from 'fundamental-ngx';

import { EventTrigger } from '../../../shared/datamodel/event-trigger';

@Component({
  selector: 'app-event-trigger-chooser',
  templateUrl: './event-trigger-chooser.component.html',
  styleUrls: ['./event-trigger-chooser.component.scss'],
})
export class EventTriggerChooserComponent {
  availableEventTriggers: EventTrigger[] = [];
  selectedEventTriggers: EventTrigger[] = [];
  @Output() eventEmitter = new EventEmitter<EventTrigger[]>();
  @ViewChild('eventTriggerModal') eventTriggerModal: ModalComponent;

  public eventSearchQuery = '';
  public filteredTriggers: EventTrigger[] = [];
  public title: string;
  public isActive = false;
  private eventsSelected = 0;
  public enableAdd = false;

  constructor(private modalService: ModalService) {}

  initializeView() {
    this.eventSearchQuery = '';
    this.availableEventTriggers = [];
    this.selectedEventTriggers = [];
    this.filteredTriggers = [];
    this.eventsSelected = 0;
    this.enableAdd = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.closeEventTriggerChooserModal();
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
    luigiClient.uxManager().addBackdrop();
    this.modalService.open(this.eventTriggerModal).result.finally(() => {
      this.isActive = false;
      luigiClient.uxManager().removeBackdrop();
    });
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
    if (this.isActive) {
      this.isActive = false;
      this.modalService.close(this.eventTriggerModal);
    }
  }

  areEventTriggersEqual(sourceET: EventTrigger, destET: EventTrigger): boolean {
    if (
      sourceET.eventType === destET.eventType &&
      sourceET.version === destET.version &&
      sourceET.sourceId === destET.sourceId
    ) {
      return true;
    } else {
      return false;
    }
  }
}
