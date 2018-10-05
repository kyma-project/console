import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteEnvironmentDetailsComponent } from './remote-environment-details.component';
import { APP_BASE_HREF } from '@angular/common';

describe('RemoteEnvironmentDetailsComponent', () => {
  let component: RemoteEnvironmentDetailsComponent;
  let fixture: ComponentFixture<RemoteEnvironmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RemoteEnvironmentDetailsComponent],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
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
