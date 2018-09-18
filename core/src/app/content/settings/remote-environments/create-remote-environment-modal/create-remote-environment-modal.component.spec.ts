import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRemoteEnvironmentModalComponent } from './create-remote-environment-modal.component';

describe('CreateRemoteEnvironmentModalComponent', () => {
  let component: CreateRemoteEnvironmentModalComponent;
  let fixture: ComponentFixture<CreateRemoteEnvironmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRemoteEnvironmentModalComponent]
    })
      .overrideTemplate(CreateRemoteEnvironmentModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRemoteEnvironmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
