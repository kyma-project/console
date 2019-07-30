import {LuigiClientCommunicationDirective} from './../../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CreatePresetModalComponent} from './create-preset-modal.component';
import {IdpPresetsService} from '../idp-presets.service';
import {ComponentCommunicationService} from '../../../../shared/services/component-communication.service';
import {of} from 'rxjs';
import {ModalService} from 'fundamental-ngx';

class IdpPresetsServiceMock {
  public createIdpPreset(data) {
    return of({});
  }
}

describe('CreatePresetModalComponent', () => {
  let component: CreatePresetModalComponent;
  let fixture: ComponentFixture<CreatePresetModalComponent>;
  let IdpPresetsServiceMockStub: IdpPresetsService;
  let mockModalService: ModalService;
  const modalService = {
    open: () => ({
      afterClosed: {
        toPromise: () => ({
          finally: () => {
          }
        })
      }
    }),
    dismissAll: () => {
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: IdpPresetsService, useClass: IdpPresetsServiceMock },
        { provide: ModalService, useValue: modalService },
        ComponentCommunicationService
      ],
      declarations: [
        CreatePresetModalComponent,
        LuigiClientCommunicationDirective
      ]
    })
      .overrideTemplate(CreatePresetModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePresetModalComponent);
    component = fixture.componentInstance;
    IdpPresetsServiceMockStub = fixture.debugElement.injector.get(
      IdpPresetsService
    );
    mockModalService = TestBed.get(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    // then
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('');
    expect(component.jwks).toBe('');
    expect(component.issuer).toBe('');
    expect(component.isActive).toBeFalsy();
    expect(component.error).toBe('');
    expect(component.wrongPresetName).toBeFalsy();
  });

  it('should be visible with empty data', () => {
    // given
    component.isActive = true;

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('');
    expect(component.jwks).toBe('');
    expect(component.issuer).toBe('');
    expect(component.isActive).toBeTruthy();
    expect(component.error).toBe('');
    expect(component.wrongPresetName).toBeFalsy();
  });

  it('should be visible with half filled data', () => {
    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset-name');
    expect(component.jwks).toBe('');
    expect(component.issuer).toBe('');
    expect(component.isActive).toBeTruthy();
    expect(component.error).toBe('');
    expect(component.wrongPresetName).toBeFalsy();
  });

  it('should be visible with wrong presetName format', () => {
    // given
    component.isActive = true;
    component.presetName = 'preset name';
    component.jwks = 'https://jwks';
    component.issuer = 'preset issuer';
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset name');
    expect(component.jwks).toBe('https://jwks');
    expect(component.issuer).toBe('preset issuer');
    expect(component.wrongPresetName).toBeTruthy();
    expect(component.isActive).toBeTruthy();
    expect(component.error).toBe('');
  });

  it('should be visible with wrong Jwks format and disabled Create button', () => {
    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.jwks = 'http://wrong-uri';
    component.issuer = 'preset issuer';
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset-name');
    expect(component.jwks).toBe('http://wrong-uri');
    expect(component.issuer).toBe('preset issuer');
    expect(component.wrongPresetName).toBeFalsy();
    expect(component.isActive).toBeTruthy();
    expect(component.error).toBe('');
  });

  it('should be visible with all filled data and enabled Create button', () => {
    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.jwks = 'https://jwks';
    component.issuer = 'preset issuer';
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset-name');
    expect(component.jwks).toBe('https://jwks');
    expect(component.issuer).toBe('preset issuer');
    expect(component.isActive).toBeTruthy();
    expect(component.wrongPresetName).toBeFalsy();
    expect(component.error).toBe('');
  });

  it('should react on Cancel event', done => {
    spyOn(mockModalService, 'dismissAll');
    (component.createIDPPresetModal as any) = 'mock-value';

    component.close();

    fixture.whenStable().then(() => {
      // then
      expect(mockModalService.dismissAll).toHaveBeenCalled();
      done();
    });
  });

  it('should react on Create event', done => {
    spyOn(mockModalService, 'dismissAll');
    (component.createIDPPresetModal as any) = 'mock-value';
    spyOn(IdpPresetsServiceMockStub, 'createIdpPreset').and.returnValue(of({}));

    component.save();

    fixture.whenStable().then(() => {
      expect(IdpPresetsServiceMockStub.createIdpPreset).toHaveBeenCalledTimes(
        1
      );
      expect(mockModalService.dismissAll).toHaveBeenCalled();

      done();
    });
  });

  it('show create idp preset modal', done => {
    spyOn(mockModalService, 'open').and.returnValue({
      afterClosed: {
        toPromise: () => ({finally: fn => fn()})
        }
    });

    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.jwks = 'preset jwks';
    component.issuer = 'preset issuer';
    component.error = 'mock-error';
    component.wrongPresetName = true;

    // when
    fixture.detectChanges();
    component.show();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.presetName).toBe('');
      expect(component.jwks).toBe('');
      expect(component.issuer).toBe('');
      expect(component.isActive).toBeFalsy();
      expect(component.wrongPresetName).toBeFalsy();
      expect(component.error).toBe('');
      done();
    });
  });
});
