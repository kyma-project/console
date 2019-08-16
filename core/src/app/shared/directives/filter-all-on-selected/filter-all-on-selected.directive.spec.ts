import { FilterAllOnSelectedDirective } from 'shared/directives/filter-all-on-selected/filter-all-on-selected.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxModule, ModalModule } from 'fundamental-ngx';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <fd-combobox filterAllOnSelected></fd-combobox>
  `
})
class TestFilterAllOnSelectedComboboxComponent {}

describe('FilterAllOnSelectedDirective', () => {
  let fixture: ComponentFixture<TestFilterAllOnSelectedComboboxComponent>;
  let comboboxEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFilterAllOnSelectedComboboxComponent,
        FilterAllOnSelectedDirective
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

  describe('filterFn', () => {
    it('returns all content if search value matches', () => {
      const content = ['aa', 'ba', 'ca'];
      expect(comboboxEl.componentInstance.filterFn(content, 'aa')).toEqual(
        content
      );
    });

    it('returns all content if search value is empty', () => {
      const content = ['aa', 'ba', 'ca'];
      expect(comboboxEl.componentInstance.filterFn(content, '')).toEqual(
        content
      );
    });

    it('returns searched elements if search value does not match', () => {
      const content = ['aa', 'ba', 'ca'];
      expect(comboboxEl.componentInstance.filterFn(content, 'b')).toEqual([
        'ba'
      ]);
    });
  });
});

describe('FilterAllOnSelectedDirective with different template', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestFilterAllOnSelectedComboboxComponent,
        FilterAllOnSelectedDirective
      ],
      imports: [ComboboxModule, ModalModule]
    });
    TestBed.overrideComponent(TestFilterAllOnSelectedComboboxComponent, {
      set: {
        template: `<fd-modal-body filterAllOnSelected></fd-modal-body>`
      }
    });
  });

  it('crashes if component does not have filterFn', () => {
    expect(() =>
      TestBed.createComponent(TestFilterAllOnSelectedComboboxComponent)
    ).toThrowError('filterAllOnSelected can only be used wth fd-combobox');
  });
});
