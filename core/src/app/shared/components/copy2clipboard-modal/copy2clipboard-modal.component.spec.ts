import { LuigiClientCommunicationDirective } from './../../directives/luigi-client-communication/luigi-client-communication.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipboardModule } from 'ngx-clipboard';

import { Copy2ClipboardModalComponent } from './copy2clipboard-modal.component';

describe('Copy2ClipboardModalComponent', () => {
  let component: Copy2ClipboardModalComponent;
  let fixture: ComponentFixture<Copy2ClipboardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Copy2ClipboardModalComponent,
        LuigiClientCommunicationDirective
      ],
      imports: [ClipboardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Copy2ClipboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
