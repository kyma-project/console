import { Component, ViewChild, TemplateRef } from '@angular/core';
import { IdpPresetsService } from '../idp-presets.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ModalService, ModalRef } from 'fundamental-ngx';
import { DEFAULT_MODAL_CONFIG } from '../../../../shared/constants/constants';

@Component({
  selector: 'app-create-preset-modal',
  templateUrl: './create-preset-modal.component.html',
  styleUrls: ['./create-preset-modal.component.scss']
})
export class CreatePresetModalComponent {
  @ViewChild('createIDPPresetModal')
  createIDPPresetModal: TemplateRef<ModalRef>;
  public presetName = '';
  public issuer = '';
  public jwks = '';
  public isActive = false;
  public wrongPresetName = false;
  public error = '';
  public urlPrefix = 'https://';

  constructor(
    private idpPresetsService: IdpPresetsService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  show() {
    this.isActive = true;
    this.resetForm();
    this.modalService
      .open(this.createIDPPresetModal, {
        ...DEFAULT_MODAL_CONFIG,
        width: '30em'
      })
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
      });
  }

  close() {
    this.isActive = false;
    this.modalService.dismissAll();
  }

  resetForm() {
    this.presetName = '';
    this.issuer = '';
    this.jwks = '';
    this.error = '';
    this.wrongPresetName = false;
  }

  isReadyToCreate() {
    return this.presetName && this.issuer && this.jwks && !this.wrongPresetName;
  }

  validatePresetNameRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    this.wrongPresetName = this.presetName
      ? !regex.test(this.presetName) || this.presetName.length > 253
      : false;
  }

  save() {
    const data = {
      name: this.presetName,
      issuer: this.issuer,
      jwksUri: this.urlPrefix + this.jwks
    };

    return this.idpPresetsService.createIdpPreset(data).subscribe(
      res => {
        const response: any = res;

        this.close();
        this.communicationService.sendEvent({
          type: 'createResource',
          data: response.createIDPPreset
        });
      },
      err => {
        this.error = `Error: ${err}`;
      }
    );
  }
}
