import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FundamentalNgxModule } from 'fundamental-ngx';
import { FormsModule } from '@angular/forms';
import { SearchService } from './service/search-service';
import { LuigiContextService } from './service/luigi-context.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ISearchFormData } from './data';
import { PodsSubscriptonService } from './service/pods-subscription/pods-subscription.service';
import { Apollo } from 'apollo-angular';
import AppAriaDisabled from './shared/appAriaDisabled.directive';

const ActivatedRouteMock = {
  queryParams: of({}),
};

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchFormComponent, AppAriaDisabled],
      imports: [HttpClientTestingModule, FundamentalNgxModule, FormsModule],
      providers: [
        SearchService,
        LuigiContextService,
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        PodsSubscriptonService,
        Apollo,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getSearchQuery()', () => {
    function getModel(override?: object): ISearchFormData {
      const baseModel: ISearchFormData = {
        query: 'bla}blu',
        extraQuery: '-mockExtra',
        direction: 'mock-direction',
        limit: 123456,
        from: '1m',
        to: 'whatever',
        label: 'whatever',
        showOutdatedLogs: false,
      };
      return { ...baseModel, ...override };
    }

    it('sets non-date params', () => {
      component.model = getModel();
      const expected = {
        query: 'bla}',
        regexp: 'blu-mockExtra',
        limit: 123456,
        direction: 'mock-direction',
      };
      const actual = component['getSearchQuery']();
      expect(actual.query).toEqual(expected.query);
      expect(actual.regexp).toEqual(expected.regexp);
      expect(actual.limit).toEqual(expected.limit);
      expect(actual.direction).toEqual(expected.direction);
    });

    // it('builds query when `from` is set to minutes', () => {
    //   const timeBackInMs = 5 * 60 * 1000;
    //   component.model = getModel({from: '5m'});

    //   const dateBefore = Date.now() - timeBackInMs;
    //   const actual = component['getSearchQuery']();
    //   const dateAfter = Date.now() - timeBackInMs;

    //   expect(actual.from).toBeGreaterThan(dateBefore);
    //   expect(actual.from).toBeLessThan(dateAfter);
    // });

    // it('builds query when `from` is set to hours', () => {
    //   const timeBackInMs = 5 * 60 * 60 * 1000;
    //   component.model = getModel({ from: '5h' });

    //   const dateBefore = Date.now() - timeBackInMs;
    //   const actual = component['getSearchQuery']();
    //   const dateAfter = Date.now() - timeBackInMs;

    //   expect(actual.from).toBeGreaterThan(dateBefore);
    //   expect(actual.from).toBeLessThan(dateAfter);
    // });

    // it('builds query when `from` is set to days', () => {
    //   const timeBackInMs = 5 * 24 * 60 * 60 * 1000;
    //   component.model = getModel({ from: '5d' });

    //   const dateBefore = Date.now() - timeBackInMs;
    //   const actual = component['getSearchQuery']();
    //   const dateAfter = Date.now() - timeBackInMs;

    //   expect(actual.from).toBeGreaterThan(dateBefore);
    //   expect(actual.from).toBeLessThan(dateAfter);
    // });
  });

  describe('processParams()', () => {
    beforeEach(() => {
      component.title = 'mock-title';
    });

    it('returns if input param is falsy', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      component.processParams(undefined);
      expect(addLabelSpy).not.toHaveBeenCalled();
      expect(component.title).toBe('mock-title');
    });

    it('returns if input param has length zero', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      component.processParams({});
      expect(addLabelSpy).not.toHaveBeenCalled();
      expect(component.title).toBe('mock-title');
    });

    it('adds label and updates title if `function` param present', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      component.processParams({ function: 'mock-function' });
      expect(addLabelSpy).toHaveBeenCalledWith('function=mock-function', true);
      expect(component.title).toBe('Logs for function "mock-function"');
    });

    it('adds label and updates title if `pod` param present', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      component.processParams({ function: 'mock-function', pod: 'mock-pod' });
      expect(addLabelSpy).toHaveBeenCalledWith('instance=mock-pod', true);
      expect(component.title).toBe('Logs for pod "mock-pod"');
    });

    it('adds label but no title if `namespace` param present', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      component.processParams({
        function: 'mock-function',
        pod: 'mock-pod',
        namespace: 'mock-namespace',
      });
      expect(addLabelSpy).toHaveBeenCalledWith('instance=mock-pod', true);
      expect(component.title).toBe('Logs for pod "mock-pod"');
    });

    it('does not call onSubmit() if no params', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      const onSubmitSpy = spyOn(component, 'onSubmit');
      component.selectedLabels = new Map();
      component.processParams({});
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it('does not call onSubmit() if there are no selectedlabels', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      const onSubmitSpy = spyOn(component, 'onSubmit');
      component.selectedLabels = new Map();
      component.processParams({ function: 'mock-function' });
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it('calls onSubmit() if there are any labels', () => {
      const addLabelSpy = spyOn(component, 'addLabel');
      const onSubmitSpy = spyOn(component, 'onSubmit');
      component.selectedLabels = new Map();
      component.selectedLabels.set('mock-key', 'mock-val');
      component.processParams({ function: 'mock-function' });
      expect(onSubmitSpy).toHaveBeenCalled();
    });
  });

  describe('updateQuery()', () => {
    it('sets query to empty string if no selected labels', () => {
      component.model.query = 'whatever';
      component.selectedLabels = new Map();

      component.updateQuery();
      expect(component.model.query).toBe('');
    });

    it('builds query if selected labels', () => {
      component.model.query = 'whatever';
      component.selectedLabels = new Map();
      component.selectedLabels.set('key1', 'val1');
      component.selectedLabels.set('key2', 'val2');
      component.selectedLabels.set('key3', 'val3');

      const expected = `{key1="val1", key2="val2", key3="val3"}`;
      component.updateQuery();
      expect(component.model.query).toBe(expected);
    });
  });
});
