import { FilterAllOnSelectedDirective } from 'shared/directives/filter-all-on-selected/filter-all-on-selected.directive';
import {
  Component,
  DebugElement,
  Input,
  ViewContainerRef
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxModule, ModalModule } from 'fundamental-ngx';
import { ComboboxComponent } from 'fundamental-ngx/lib/combobox/combobox.component';
import { By } from '@angular/platform-browser';

@Component({
  template: `<fd-combobox filterAllOnSelected></fd-combobox>`
})
class TestFilterAllOnSelectedComboboxComponent {}

@Component({
  template: `<fd-modal-body filterAllOnSelected></fd-modal-body>`
})
class TestFilterAllOnSelectedModalComponent {}

describe('FilterAllOnSelectedDirective', () => {
  let fixture: ComponentFixture<TestFilterAllOnSelectedComboboxComponent>;
  let comboboxEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFilterAllOnSelectedComboboxComponent,
        FilterAllOnSelectedDirective,
        TestFilterAllOnSelectedModalComponent
      ],
      imports: [ComboboxModule, ModalModule]
    });
    fixture = TestBed.createComponent(TestFilterAllOnSelectedComboboxComponent);
    comboboxEl = fixture.debugElement.query(By.css(`fd-combobox`));
  });

  it('sets filterFn on component', () => {
    expect(comboboxEl.componentInstance.filterFn).toBeDefined();
    expect(comboboxEl.componentInstance.filterFn).not.toBe(
      comboboxEl.componentInstance.defaultFilter
    );
  });

  it('crashes if component does not have filterFn', () => {
    expect(() =>
      TestBed.createComponent(TestFilterAllOnSelectedModalComponent)
    ).toThrowError('filterAllOnSelected can only be used wth fd-combobox');
  });

  describe('filterFn', () => {
    it('returns all content if value matches', () => {
      const content = ['aa', 'ba', 'ca'];
      expect(comboboxEl.componentInstance.filterFn(content, 'aa')).toEqual(
        content
      );
    });

    it('returns searched elements if values does not match', () => {
      const content = ['aa', 'ba', 'ca'];
      expect(comboboxEl.componentInstance.filterFn(content, 'b')).toEqual([
        'ba'
      ]);
    });
  });
});
