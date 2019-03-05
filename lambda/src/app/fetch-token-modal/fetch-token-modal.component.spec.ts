import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchTokenModalComponent } from './fetch-token-modal.component';
import { ModalService } from 'fundamental-ngx';

describe('FetchTokenModalComponent', () => {
  let mockModalService: ModalService;
  const modalService = {
    open: jasmine
      .createSpy('open')
      .and.returnValue({ result: { finally: () => {} } }),
  };

  let component: FetchTokenModalComponent;
  let fixture: ComponentFixture<FetchTokenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FetchTokenModalComponent],
      providers: [
        {
          provide: ModalService,
          useValue: modalService,
        },
      ],
    })
      .overrideComponent(FetchTokenModalComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FetchTokenModalComponent);
    component = fixture.componentInstance;
    mockModalService = TestBed.get(ModalService);
    fixture.detectChanges();
  }));

  it('should show the fetch token modal', () => {
    (component.fetchTokenModal as any) = 'mock-fetch-token-modal';
    component.show();
    expect(component['title']).toEqual('Fetch token');
    expect(mockModalService.open).toHaveBeenCalledWith(
      'mock-fetch-token-modal',
    );
  });
});
