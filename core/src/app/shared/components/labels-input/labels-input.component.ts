import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-labels-input',
  templateUrl: './labels-input.component.html',
  styleUrls: ['./labels-input.component.scss']
})
export class LabelsInputComponent {
  @Output() public labelsChangeEmitter$: EventEmitter<string[]>;
  public newLabel: string;
  public labels: string[];
  public wrongLabelMessage: string;

  constructor() {
    this.labelsChangeEmitter$ = new EventEmitter();
    this.labels = [];
  }

  public addLabel() {
    if (!this.newLabel) {
      return;
    }

    if (!this.setWrongLabelMessage(this.newLabel)) {
      this.labels.push(
        this.newLabel
          .split(':')
          .map(s => s.trim())
          .join(':')
      );
      // Avoid sharing of same array copy among parent and child component
      this.labelsChangeEmitter$.emit([...this.labels]);
      this.newLabel = '';
    }
  }

  public updateLabel(label: string) {
    this.removeLabel(label);
    this.newLabel = label;
  }

  public removeLabel(label: string) {
    const index = this.labels.indexOf(label);
    this.labels.splice(index, 1);
    // Avoid sharing of same array copy among parent and child component
    this.labelsChangeEmitter$.emit([...this.labels]);
  }

  private setWrongLabelMessage(label: string) {
    this.wrongLabelMessage = '';

    if (!(label.split(':').length === 2)) {
      this.wrongLabelMessage = `Invalid label ${label}! A key and value should be separated by a ':'`;
      return true;
    }

    const key: string = label.split(':')[0].trim();
    const value: string = label.split(':')[1].trim();

    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const foundKey = key.match(regex);
    const isKeyValid = Boolean(foundKey && foundKey[0] === key && key !== '');
    const foundVal = value.match(regex);
    const isValueValid = Boolean(
      (foundVal && foundVal[0] === value) || value === ''
    );
    if (!isKeyValid || !isValueValid) {
      this.wrongLabelMessage = `Invalid label ${key}:${value}! In a valid label, a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.`;
      return true;
    }

    const duplicateKeyExists: boolean = Boolean(
      this.labels
        .map(l => l.split(':')[0])
        .find((keyFromList: string) => keyFromList === key)
    );
    if (duplicateKeyExists) {
      this.wrongLabelMessage = `Invalid label ${key}:${value}! Keys cannot be reused!`;
      return true;
    }

    return false;
  }
}
