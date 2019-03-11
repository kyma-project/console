import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceUploaderModalComponent } from './resource-uploader-modal.component';
import { InformationModalComponent } from '../../information-modal/information-modal.component';
import { UploaderComponent } from '../uploader/uploader.component';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { LuigiClientCommunicationDirective } from '../../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';
import { ModalService } from 'fundamental-ngx';

describe('ResourceUploaderModalComponent', () => {
  let component: ResourceUploaderModalComponent;
  let fixture: ComponentFixture<ResourceUploaderModalComponent>;
  const routes: Routes = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceUploaderModalComponent,
        InformationModalComponent,
        UploaderComponent,
        LuigiClientCommunicationDirective
      ],
      providers: [
        ComponentCommunicationService,
        {
          provide: ModalService
        }
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    })
      .overrideTemplate(ResourceUploaderModalComponent, '')
      .overrideTemplate(InformationModalComponent, '')
      .overrideTemplate(UploaderComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUploaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
