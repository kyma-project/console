import { Component, ViewChild } from '@angular/core';
import { ResourceUploadService } from '../services/resource-upload.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html'
})
export class UploaderComponent {
  public err = false;
  public fileToUpload: any;
  public fileName = '';
  public fileContents: string[] = [];
  public ready = false;

  @ViewChild('fileInput') fileInput: any;

  constructor(private resourceUploadService: ResourceUploadService) {}

  public upload() {
    return this.ready
      ? this.resourceUploadService.uploadWorkaround(this.fileContents)
      : null;
  }

  private isFileReadyToUpload() {
    return this.ready;
  }

  public reset() {
    if (this.fileInput) {
      this.fileInput.clear();
    }
    this.fileToUpload = null;
    this.ready = false;
    this.fileName = '';
    this.fileContents = [];
  }

  public selectFile(files: File[]) {
    if (files && files[0]) {
      this.fileToUpload = files[0];
      this.fileName = this.fileToUpload.name;

      this.resourceUploadService.getFileContent(this.fileToUpload).subscribe(
        (data: string[]) => {
          this.fileContents = data;
          this.err = false;
          this.ready = true;
        },
        error => {
          this.err = error;
          this.ready = false;
        }
      );
    }
  }
}
