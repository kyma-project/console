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

const commonLabelSchemaMessage = "It should consist of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character";

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
    this.removeWhitespaces();
    this.setWrongLabelMessage(this.newLabel);
    this.labelsChangeEmitter$.emit({
      wrongLabels: Boolean(this.wrongLabelMessage)
    });
  }

  public removeWhitespaces() {
    if (this.newLabel) {
      this.newLabel = this.newLabel.trim();
    }
  }

  public addLabel() {
    this.validateNewLabel();
    if (this.newLabel && !this.wrongLabelMessage) {
      this.labels.push(this.newLabel);
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

  private validateLabelKey(key: string): string {
    const containsPrefix = key.includes('/');
    if (containsPrefix) {
      if (key.split('/').length > 2) {
        return `Invalid key ${key}! Key can contain at most one "/".`;
      }
      const [prefix, name] = key.split('/');

      if (prefix.length > 253) {
        return `Invalid key prefix ${prefix}! Prefix length should not exceed 253.`;
      }

      const subdomain = '[A-Za-z0-9](?:[-A-Za-z0-9]{0,61}[A-Za-z0-9])?';
      const prefixRegex = `^${subdomain}(?:\\.${subdomain})*$`;
      if (!prefix.match(prefixRegex)) {
        return `Invalid key prefix ${key}! Prefix should be a valid DNS subdomain.`;
      }

      key = name;
    }

    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const foundKey = key.match(regex);
    const isKeyValid = foundKey && foundKey[0] === key && key !== '';
    return isKeyValid ? null : `Invalid key ${key}! ${commonLabelSchemaMessage}. It can be prefixed with DNS domain, separated with "/".`;
  }

  private validateLabelValue(value: string): string {
    if (value && value.length > 63) {
      return `Invalid ${value}! Maximum length of value cannot exceed 63!`;
    }

    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const foundVal = value.match(regex);
    const isValueValid = foundVal && foundVal[0] === value || value === '';
    if (!isValueValid) {
      return `Invalid value ${value}! ${commonLabelSchemaMessage}.`;
    }
    return null;
  }

  private setWrongLabelMessage(label: string) {
    this.wrongLabelMessage = '';

    if (!label) {
      return false;
    }

    if (!(label.split('=').length === 2)) {
      this.wrongLabelMessage = `Invalid label ${label}! A key and value should be separated by a '='`;
      return true;
    }

    const [key, value] = label.split('=');

    const keyError = this.validateLabelKey(key);
    if (keyError) {
      this.wrongLabelMessage = keyError;
      return true;
    }

    const valueError = this.validateLabelValue(value);
    if (valueError) {
      this.wrongLabelMessage = valueError;
      return true;
    }

    const duplicateKeyExists: boolean = Boolean(
      this.labels
        .map(l => l.split('=')[0])
        .find((keyFromList: string) => keyFromList === key)
    );
    if (duplicateKeyExists) {
      this.wrongLabelMessage = `Invalid label ${key}=${value}! Keys cannot be reused!`;
      return true;
    }

    return false;
  }
}
