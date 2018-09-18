import { Component } from '@angular/core';

@Component({
  selector: 'app-create-remote-environment-modal',
  templateUrl: './create-remote-environment-modal.component.html',
  styleUrls: ['./create-remote-environment-modal.component.scss']
})
export class CreateRemoteEnvironmentModalComponent {
  public isActive = false;
  public name: string;
  public description: string;
  public labels: string[];
  public newLabel: string;
  public wrongLabelMessage: string;

  public show() {
    this.resetForm();
    this.isActive = true;
  }

  private resetForm() {
    this.name = '';
    this.description = '';
    this.labels = [];
    this.newLabel = '';
    this.wrongLabelMessage = '';
  }

  public close() {
    this.isActive = false;
  }

  public isReadyToCreate() {
    return this.name && this.description;
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
  }

  private setWrongLabelMessage(label: string) {
    this.wrongLabelMessage = '';

    if (!(label.split(':').length === 2)) {
      this.wrongLabelMessage = `Invalid label ${label}! A key and value should be separated by a ':'`;
      return true;
    }

    const key: string = label.split(':')[0].trim();
    const value: string = label.split(':')[1].trim();

    const duplicateKeyExists: boolean = Boolean(
      this.labels
        .map(l => l.split(':')[0])
        .find((keyFromList: string) => keyFromList === key)
    );
    if (duplicateKeyExists) {
      this.wrongLabelMessage = `Invalid label ${key}:${value}! Keys cannot be reused!`;
      return true;
    }

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

    return false;
  }
}
