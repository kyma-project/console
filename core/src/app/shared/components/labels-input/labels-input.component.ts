import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-labels-input',
  templateUrl: './labels-input.component.html',
  styleUrls: ['./labels-input.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class LabelsInputComponent implements OnInit {
  @ViewChild('labelsInput') labelsInput: ElementRef;
  @Input() labels?: string[];
  @Output()
  public labelsChangeEmitter$: EventEmitter<{
    labels?: string[];
    wrongLabels?: boolean;
  }>;
  public newLabel: string;
  public wrongLabelMessage: string;

  public constructor() {
    this.labelsChangeEmitter$ = new EventEmitter();
  }

  public ngOnInit() {
    this.labels = this.labels || [];
  }

  public validateNewLabel() {
    this.setWrongLabelMessage(this.newLabel);
    this.labelsChangeEmitter$.emit({
      wrongLabels: Boolean(this.wrongLabelMessage)
    });
  }

  public addLabel() {
    this.validateNewLabel();
    if (this.newLabel && !this.wrongLabelMessage) {
      this.labels.push(
        this.newLabel
          .split(':')
          .map(s => s.trim())
          .join(':')
      );
      this.newLabel = '';
      // Avoid sharing of same array copy among parent and child component
      this.labelsChangeEmitter$.emit({ labels: [...this.labels] });
      setTimeout(() => {
        this.labelsInput.nativeElement.focus();
      }, 0);
    }
  }

  public updateLabel(label: string) {
    this.removeLabel(label);
    this.newLabel = label;
    setTimeout(() => {
      this.labelsInput.nativeElement.focus();
    }, 0);
  }

  public removeLabel(label: string) {
    const index = this.labels.indexOf(label);
    this.labels.splice(index, 1);
    // Avoid sharing of same array copy among parent and child component
    this.labelsChangeEmitter$.emit({ labels: [...this.labels] });
  }

  private setWrongLabelMessage(label: string) {
    this.wrongLabelMessage = '';

    if (!label) {
      return false;
    }

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
