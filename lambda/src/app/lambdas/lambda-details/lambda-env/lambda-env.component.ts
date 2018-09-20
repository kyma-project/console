import {
  Component,
  Input,
  ReflectiveInjector,
  Type,
  ViewChild,
  ViewContainerRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IEnvVar } from '../../../shared/datamodel/k8s/container';

@Component({
  selector: 'app-lambda-env-table',
  templateUrl: './lambda-env.component.html',
  styleUrls: [
    '../lambda-details.component.scss',
    './lambda-env.component.scss',
  ],
})
export class LambdaEnvComponent {
  @Input() envs: IEnvVar[];
  @Input() lambdaName: string;
  @Input() isLambdaNameInvalid: boolean;
  @Output() envEmitter = new EventEmitter<IEnvVar[]>();
  isEnvVariableNameInvalid = false;
  isEnvVariableDuplicate = false;
  disableAddVar = true;
  editVar: number;
  envVar: IEnvVar = {
    name: '',
    value: '',
  };

  addVariable(): void {
    if (!this.disableAddVar) {
      this.envs.push(this.envVar);
      this.resetValues();
    }
    this.envEmitter.emit(this.envs);
  }

  resetValues(): void {
    this.isEnvVariableNameInvalid = false;
    this.isEnvVariableDuplicate = false;
    this.disableAddVar = true;
    this.envVar = {
      name: '',
      value: '',
    };
  }

  /** validatesEnvVariableName checks whether a environment variable name is valid */
  validatesEnvVariableName(): void {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*/;
    const found = this.envVar.name.match(regex);
    if (this.envs === undefined) {
      this.envs = [];
    }
    const duplicate = this.envs.find(env => {
      return env.name === this.envVar.name;
    });

    this.isEnvVariableDuplicate = false;
    this.isEnvVariableNameInvalid = false;
    this.disableAddVar = false;

    if (this.envVar.name === '') {
      this.disableAddVar = true;
      return;
    }

    if (!(found && found[0] === this.envVar.name)) {
      this.isEnvVariableNameInvalid = true;
      this.disableAddVar = true;
      return;
    }

    if (duplicate) {
      this.isEnvVariableDuplicate = true;
      this.disableAddVar = true;
      return;
    }
  }

  editVariable(i) {
    this.editVar = i;
  }

  updateVariable() {
    this.editVar = null;
    this.envEmitter.emit(this.envs);
  }

  removeVarariable(i) {
    this.envs.splice(i, 1);
    this.envEmitter.emit(this.envs);
  }
}
