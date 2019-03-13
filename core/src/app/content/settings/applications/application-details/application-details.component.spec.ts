import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

import { ApplicationDetailsComponent } from './application-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationsService } from '../services/applications.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ApplicationBindingService } from './application-binding-service';

describe('ApplicationDetailsComponent', () => {
  let component: ApplicationDetailsComponent;
  let fixture: ComponentFixture<ApplicationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ApplicationDetailsComponent],
      providers: [
        [{ provide: APP_BASE_HREF, useValue: '/my/app' }],
        {
          provide: ApplicationsService,
          useValue: {
            getConnectorServiceUrl: () => EMPTY,
            getApplication: () => EMPTY
          }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { observable$: EMPTY }
        },
        {
          provide: ApplicationBindingService,
          useValue: {}
        }
      ]
    })
      .overrideTemplate(ApplicationDetailsComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
