import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationModalComponent } from './information-modal.component';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { LuigiClientCommunicationDirective } from '../../directives/luigi-client-communication/luigi-client-communication.directive';
import { ModalService } from 'fundamental-ngx';

describe('InformationModalComponent', () => {
  let component: InformationModalComponent;
  let fixture: ComponentFixture<InformationModalComponent>;
  const routes: Routes = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [
        InformationModalComponent,
        LuigiClientCommunicationDirective
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/my/app'
        },
        {
          provide: ModalService,
          useValue: {}
        }
      ]
    })
      .overrideTemplate(InformationModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
