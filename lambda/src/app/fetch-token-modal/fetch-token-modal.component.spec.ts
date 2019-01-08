import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchTokenModalComponent } from './fetch-token-modal.component';

describe('FetchTokenModalComponent', () => {
  let component = new FetchTokenModalComponent();
  let fixture: ComponentFixture<FetchTokenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FetchTokenModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the fetch token modal', () => {
    expect(component['isActive']).toBe(false);
    component.show();
    expect(component['isActive']).toBe(true);
    expect(component['title']).toEqual('Fetch token');
  });
});
