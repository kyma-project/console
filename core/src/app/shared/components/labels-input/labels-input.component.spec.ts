import { ElementRef, EventEmitter } from '@angular/core';
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
    component.labelsInput = new ElementRef({ focus: () => {} });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.labelsChangeEmitter$).toEqual(new EventEmitter());
  });

  describe('NgOnInit', () => {
    it('initializes labels to empty array if labels has falsy value', () => {
      component.labels = null;
      component.ngOnInit();
      expect(component.labels).toEqual([]);
    });

    it('does not change labels value if it is truthy', () => {
      component.labels = ['k1=v1'];
      component.ngOnInit();
      expect(component.labels).toEqual(['k1=v1']);
    });
  });

  describe('validateNewLabel()', () => {
    beforeEach(() => {
      component['setWrongLabelMessage'] = jasmine.createSpy();
      spyOn(component.labelsChangeEmitter$, 'emit');
    });

    it('calls function that sets wrong label message', () => {
      component.newLabel = 'any-value';
      component.validateNewLabel();
      expect(component['setWrongLabelMessage']).toHaveBeenCalledWith(
        'any-value'
      );
    });

    it('emits input validation info', () => {
      component.wrongLabelMessage = 'wrong-labels-info';
      component.validateNewLabel();
      expect(component.labelsChangeEmitter$.emit).toHaveBeenCalledWith({
        wrongLabels: true
      });
    });
  });

  describe('addLabel()', () => {
    beforeEach(() => {
      component.wrongLabelMessage = '';
      component.newLabel = 'any=label';
      spyOn(component, 'validateNewLabel');
    });

    it('does not update labels if no label input content', () => {
      component.labels = [];
      component.newLabel = '';
      component.addLabel();
      expect(component.labels).toEqual([]);
    });

    it('does not update labels if wrong labels', () => {
      component.wrongLabelMessage = 'error-info';
      component.addLabel();
      expect(component.labels).toEqual([]);
    });

    it('validates label', () => {
      component.addLabel();
      expect(component.validateNewLabel).toHaveBeenCalled();
    });

    describe('valid label', () => {
      beforeEach(() => {
        spyOn(component.labelsChangeEmitter$, 'emit');
      });

      it('updates labels', () => {
        component.labels = [];
        component.newLabel = 'newkey=newval';
        component.addLabel();
        expect(component.labels).toEqual(['newkey=newval']);
      });

      it('resets label input', () => {
        component.newLabel = 'any=label';
        component.addLabel();
        expect(component.newLabel).toEqual('');
      });

      it('emits updated labels', () => {
        component.labels = [];
        component.newLabel = 'any=label';
        component.addLabel();
        expect(component.labelsChangeEmitter$.emit).toHaveBeenCalledWith({
          labels: ['any=label']
        });
      });
    });
  });

  describe('updateLabel()', () => {
    it('removes label from list', () => {
      spyOn(component, 'removeLabel');
      component.updateLabel('key=val');
      expect(component.removeLabel).toHaveBeenCalledWith('key=val');
    });

    it('sets label input to label to edit', () => {
      this.newLabel = 'any-value';
      component.updateLabel('key=val');
      expect(component.newLabel).toEqual('key=val');
    });
  });

  describe('removeLabel()', () => {
    it('removes label from list', () => {
      component.labels = ['k1=v1', 'k2=v2', 'k3=v3'];
      component.removeLabel('k2=v2');
      expect(component.labels).toEqual(['k1=v1', 'k3=v3']);
    });

    it('emits updated labels', () => {
      spyOn(component.labelsChangeEmitter$, 'emit');
      component.labels = ['k1=v1', 'k2=v2', 'k3=v3'];
      component.removeLabel('k2=v2');
      expect(component.labelsChangeEmitter$.emit).toHaveBeenCalledWith({
        labels: ['k1=v1', 'k3=v3']
      });
    });
  });

  describe('setWrongLabelMessage()', () => {
    it('if invalid format, sets message and return true', () => {
      const label = 'ööööööö';
      const result: boolean = component['setWrongLabelMessage'](label);
      const expected = `Invalid label ${label}! A key and value should be separated by a '='`;
      expect(component.wrongLabelMessage).toBe(expected);
      expect(result).toBe(true);
    });

    describe('key', () => {
      it('if multiple "/", sets message and return true', () => {
        const label = 'a/b/c=d';
        const result: boolean = component['setWrongLabelMessage'](label);
        const expected = 'Key can contain at most one "/".';
        expect(component.wrongLabelMessage).toMatch(expected);
        expect(result).toBe(true);
      });
  
      it('if prefix too long, sets message and return true', () => {
        const label = `${'a'.repeat(253 + 1)}/b=c`;
        const result: boolean = component['setWrongLabelMessage'](label);
        const expected = 'Prefix length should not exceed 253.';
        expect(component.wrongLabelMessage).toMatch(expected);
        expect(result).toBe(true);
      });

      it('if prefix invalid, sets message and return true', () => {
        const label = 'a.b@a/name=c';
        const result: boolean = component['setWrongLabelMessage'](label);
        const expected = 'Prefix should be a valid DNS subdomain.';
        expect(component.wrongLabelMessage).toMatch(expected);
        expect(result).toBe(true);
      });

      it('if valid format and invalid character in key, sets message and return true', () => {
        const label = 'öö=val1';
        const result: boolean = component['setWrongLabelMessage'](label);
        const expected = `Invalid key öö! Key consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character. It can be prefixed with DNS domain, separated with "/".`;
        expect(component.wrongLabelMessage).toBe(expected);
        expect(result).toBe(true);
      });
    });

    describe('value', () => {
      it('if valid format and value too long, sets message and return true', () => {
        const label = `key=${'a'.repeat(63 + 1)}`;
        const result: boolean = component['setWrongLabelMessage'](label);
        const expected = 'Maximum length of value cannot exceed 63';
        expect(component.wrongLabelMessage).toMatch(expected);
        expect(result).toBe(true);
      });
  
      it('if valid format and invalid character in value, sets message and return true', () => {
        const label = 'key=öö';
        const result: boolean = component['setWrongLabelMessage'](label);
        const expected = "Value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.";
        expect(component.wrongLabelMessage).toMatch(expected);
        expect(result).toBe(true);
      });
  
      it('if key valid and label empty, return false', () => {
        const label = 'a=';
        const result: boolean = component['setWrongLabelMessage'](label);
        expect(component.wrongLabelMessage).toBe('');
        expect(result).toBe(false);
      });
    });

    it('if valid format and valid characters but duplicated key, sets message and return true', () => {
      component.labels = ['k1=v1', 'k2=v2', 'k3=v3'];
      const label = 'k2=v-other';
      const result: boolean = component['setWrongLabelMessage'](label);
      const expected = `Invalid label k2=v-other! Keys cannot be reused!`;
      expect(component.wrongLabelMessage).toBe(expected);
      expect(result).toBe(true);
    });

    it('if valid label, returns false ', () => {
      component.labels = ['k1=v1', 'k2=v2', 'k3=v3'];
      const label = 'k4.com.ga/f=v4';
      const result: boolean = component['setWrongLabelMessage'](label);
      expect(component.wrongLabelMessage).toBe('');
      expect(result).toBe(false);
    });
  });
});
