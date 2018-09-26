import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsInputComponent } from './labels-input.component';

describe('LabelsInputComponent', () => {
  let component: LabelsInputComponent;
  let fixture: ComponentFixture<LabelsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsInputComponent]
    })
      .overrideTemplate(LabelsInputComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addLabel()', () => {
    beforeEach(() => {
      component['setWrongLabelMessage'] = jasmine.createSpy();
    });

    it('returns if no label input content', () => {
      component.labels = [];
      component.newLabel = '';
      component.addLabel();
      expect(component.labels).toEqual([]);
    });

    it('sets wrong label message', () => {
      component.newLabel = 'new-label';
      component.addLabel();
      expect(component['setWrongLabelMessage']).toHaveBeenCalledWith(
        'new-label'
      );
    });

    describe('valid label', () => {
      beforeEach(() => {
        component['setWrongLabelMessage'] = jasmine
          .createSpy()
          .and.returnValue(false);
      });

      it('updates labels', () => {
        component.labels = [];
        component.newLabel = ' newkey  : newval  ';
        component.addLabel();
        expect(component.labels).toEqual(['newkey:newval']);
      });

      it('resets label input', () => {
        component.newLabel = 'any:label';
        component.addLabel();
        expect(component.newLabel).toEqual('');
      });

      it('emits updated labels', () => {
        component.labels = [];
        component.newLabel = 'any:label';
        spyOn(component.labelsChangeEmitter$, 'emit');
        component.addLabel();
        expect(component.labelsChangeEmitter$.emit).toHaveBeenCalledWith([
          'any:label'
        ]);
      });
    });
  });

  describe('updateLabel()', () => {
    it('remove label from list', () => {
      spyOn(component, 'removeLabel');
      component.updateLabel('key:val');
      expect(component.removeLabel).toHaveBeenCalledWith('key:val');
    });

    it('set label input to label to edit', () => {
      this.newLabel = 'any-value';
      component.updateLabel('key:val');
      expect(component.newLabel).toEqual('key:val');
    });
  });

  describe('removeLabel()', () => {
    it('remove label from list', () => {
      component.labels = ['k1:v1', 'k2:v2', 'k3:v3'];
      component.removeLabel('k2:v2');
      expect(component.labels).toEqual(['k1:v1', 'k3:v3']);
    });

    it('emits updated labels', () => {
      spyOn(component.labelsChangeEmitter$, 'emit');
      component.labels = ['k1:v1', 'k2:v2', 'k3:v3'];
      component.removeLabel('k2:v2');
      expect(component.labelsChangeEmitter$.emit).toHaveBeenCalledWith([
        'k1:v1',
        'k3:v3'
      ]);
    });
  });

  describe('setWrongLabelMessage()', () => {
    it('if invalid format, set message and return true', () => {
      const label = 'ööööööö';
      const result: boolean = component['setWrongLabelMessage'](label);
      const expected = `Invalid label ${label}! A key and value should be separated by a ':'`;
      expect(component.wrongLabelMessage).toBe(expected);
      expect(result).toBe(true);
    });

    it('if valid format and invalid characters, set message and return true', () => {
      const label = ' öö : val1 ';
      const result: boolean = component['setWrongLabelMessage'](label);
      const expected = `Invalid label öö:val1! In a valid label, a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.`;
      expect(component.wrongLabelMessage).toBe(expected);
      expect(result).toBe(true);
    });

    it('if valid format and valid characters but duplicated key, set message and return true', () => {
      component.labels = ['k1:v1', 'k2:v2', 'k3:v3'];
      const label = ' k2 : v-other ';
      const result: boolean = component['setWrongLabelMessage'](label);
      const expected = `Invalid label k2:v-other! Keys cannot be reused!`;
      expect(component.wrongLabelMessage).toBe(expected);
      expect(result).toBe(true);
    });

    it('if valid label, return false ', () => {
      component.labels = ['k1:v1', 'k2:v2', 'k3:v3'];
      const label = ' k4 : v4 ';
      const result: boolean = component['setWrongLabelMessage'](label);
      expect(component.wrongLabelMessage).toBe('');
      expect(result).toBe(false);
    });
  });
});
