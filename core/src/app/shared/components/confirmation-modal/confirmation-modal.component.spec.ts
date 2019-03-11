import { LuigiClientCommunicationDirective } from './../../directives/luigi-client-communication/luigi-client-communication.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ModalService } from 'fundamental-ngx';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationModalComponent,
        LuigiClientCommunicationDirective
      ],
      providers: [
        {
          provide: ModalService,
          useValue: { updateModalService: () => {} }
        }
      ]
    })
      .overrideTemplate(ConfirmationModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
