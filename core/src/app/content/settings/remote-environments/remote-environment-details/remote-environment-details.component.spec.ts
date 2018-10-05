import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { empty } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

import { RemoteEnvironmentDetailsComponent } from './remote-environment-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { RemoteEnvironmentBindingService } from './remote-environment-binding-service';

describe('RemoteEnvironmentDetailsComponent', () => {
  let component: RemoteEnvironmentDetailsComponent;
  let fixture: ComponentFixture<RemoteEnvironmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RemoteEnvironmentDetailsComponent],
      providers: [
        [{ provide: APP_BASE_HREF, useValue: '/my/app' }],
        {
          provide: RemoteEnvironmentsService,
          useValue: { getConnectorServiceUrl: () => empty() }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { observable$: empty() }
        },
        {
          provide: RemoteEnvironmentBindingService,
          useValue: {}
        }
      ]
    })
      .overrideTemplate(RemoteEnvironmentDetailsComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteEnvironmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
