import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, empty } from 'rxjs';

import { EditRemoteEnvironmentModalComponent } from './edit-remote-environment-modal.component';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';

describe('EditRemoteEnvironmentModalComponent', () => {
  let component: EditRemoteEnvironmentModalComponent;
  let fixture: ComponentFixture<EditRemoteEnvironmentModalComponent>;
  let mockRemoteEnvironmentsService: RemoteEnvironmentsService;
  let mockComponentCommunicationService: ComponentCommunicationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRemoteEnvironmentModalComponent],
      providers: [
        {
          provide: RemoteEnvironmentsService,
          useValue: { createRemoteEnvironment: () => {} }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { sendEvent: () => {} }
        }
      ]
    })
      .overrideTemplate(EditRemoteEnvironmentModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRemoteEnvironmentModalComponent);
    component = fixture.componentInstance;
    mockRemoteEnvironmentsService = TestBed.get(RemoteEnvironmentsService);
    mockComponentCommunicationService = TestBed.get(
      ComponentCommunicationService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
