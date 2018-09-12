import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CreatePresetModalComponent } from './create-preset-modal.component';
import { IdpPresetsService } from '../idp-presets.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { Observable, of } from 'rxjs';

class IdpPresetsServiceMock {
  public createIdpPreset(data) {
    return of({});
  }
}

describe('CreatePresetModalComponent', () => {
  let component: CreatePresetModalComponent;
  let fixture: ComponentFixture<CreatePresetModalComponent>;
  let IdpPresetsServiceMockStub: IdpPresetsService;
  let header: DebugElement;
  let buttonSaveClasses: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/my/app' },
        { provide: IdpPresetsService, useClass: IdpPresetsServiceMock },
        ComponentCommunicationService
      ],
      declarations: [CreatePresetModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePresetModalComponent);
    component = fixture.componentInstance;
    IdpPresetsServiceMockStub = fixture.debugElement.injector.get(
      IdpPresetsService
    );
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
    expect(component.wrongJwks).toBeFalsy();
    expect(component.wrongPresetName).toBeFalsy();
  });

  it('should be visible with empty data and disabled Create button', () => {
    // given
    component.isActive = true;

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    buttonSaveClasses = fixture.debugElement.query(
      By.css('.tn-modal__button-primary')
    ).classes;

    // then
    expect(header.nativeElement.innerText).toBe('Create Preset');
    expect(buttonSaveClasses.disabled).toBeTruthy();
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('');
    expect(component.jwks).toBe('');
    expect(component.issuer).toBe('');
    expect(component.isActive).toBeTruthy();
    expect(component.error).toBe('');
    expect(component.wrongJwks).toBeFalsy();
    expect(component.wrongPresetName).toBeFalsy();
  });

  it('should be visible with half filled data and disabled Create button', () => {
    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    buttonSaveClasses = fixture.debugElement.query(
      By.css('.tn-modal__button-primary')
    ).classes;

    // then
    expect(header.nativeElement.innerText).toBe('Create Preset');
    expect(buttonSaveClasses.disabled).toBeTruthy();
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset-name');
    expect(component.jwks).toBe('');
    expect(component.issuer).toBe('');
    expect(component.isActive).toBeTruthy();
    expect(component.error).toBe('');
    expect(component.wrongJwks).toBeFalsy();
    expect(component.wrongPresetName).toBeFalsy();
  });

  it('should be visible with wrong presetName format and disabled Create button', () => {
    // given
    component.isActive = true;
    component.presetName = 'preset name';
    component.jwks = 'https://jwks';
    component.issuer = 'preset issuer';
    component.wrongJwks = false;
    component.validateJwksRegex();
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    buttonSaveClasses = fixture.debugElement.query(
      By.css('.tn-modal__button-primary')
    ).classes;

    // then
    expect(header.nativeElement.innerText).toBe('Create Preset');
    expect(buttonSaveClasses.disabled).toBeTruthy();
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset name');
    expect(component.jwks).toBe('https://jwks');
    expect(component.issuer).toBe('preset issuer');
    expect(component.wrongJwks).toBeFalsy();
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
    component.wrongJwks = false;
    component.validateJwksRegex();
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    buttonSaveClasses = fixture.debugElement.query(
      By.css('.tn-modal__button-primary')
    ).classes;

    // then
    expect(header.nativeElement.innerText).toBe('Create Preset');
    expect(buttonSaveClasses.disabled).toBeTruthy();
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset-name');
    expect(component.jwks).toBe('http://wrong-uri');
    expect(component.issuer).toBe('preset issuer');
    expect(component.wrongJwks).toBeTruthy();
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
    component.wrongJwks = false;
    component.validateJwksRegex();
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    buttonSaveClasses = fixture.debugElement.query(
      By.css('.tn-modal__button-primary')
    ).classes;

    // then
    expect(header.nativeElement.innerText).toBe('Create Preset');
    expect(buttonSaveClasses.disabled).toBeFalsy();
    expect(component).toBeTruthy();
    expect(component.presetName).toBe('preset-name');
    expect(component.jwks).toBe('https://jwks');
    expect(component.issuer).toBe('preset issuer');
    expect(component.isActive).toBeTruthy();
    expect(component.wrongJwks).toBeFalsy();
    expect(component.wrongPresetName).toBeFalsy();
    expect(component.error).toBe('');
  });

  it('should react on Cancel event', done => {
    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.jwks = 'https://jwks';
    component.issuer = 'preset issuer';
    component.wrongJwks = false;
    component.validateJwksRegex();
    component.validatePresetNameRegex();

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    component.close();

    fixture.whenStable().then(() => {
      // then
      expect(header.nativeElement.innerText).toBe('Create Preset');
      expect(component).toBeTruthy();
      expect(component.presetName).toBe('');
      expect(component.jwks).toBe('');
      expect(component.issuer).toBe('');
      expect(component.isActive).toBeFalsy();
      expect(component.wrongJwks).toBeFalsy();
      expect(component.wrongPresetName).toBeFalsy();
      expect(component.error).toBe('');

      done();
    });
  });

  it('should react on Create event', done => {
    // given
    component.isActive = true;
    component.presetName = 'preset-name';
    component.jwks = 'preset jwks';
    component.issuer = 'preset issuer';
    component.wrongJwks = false;
    component.validateJwksRegex();
    component.validatePresetNameRegex();

    const spyCreate = spyOn(
      IdpPresetsServiceMockStub,
      'createIdpPreset'
    ).and.returnValue(of({}));

    // when
    fixture.detectChanges();
    header = fixture.debugElement.query(By.css('h4'));
    component.save();

    fixture.whenStable().then(() => {
      // then
      expect(header.nativeElement.innerText).toBe('Create Preset');
      expect(component).toBeTruthy();
      expect(component.presetName).toBe('');
      expect(component.jwks).toBe('');
      expect(component.issuer).toBe('');
      expect(component.isActive).toBeFalsy();
      expect(component.wrongJwks).toBeFalsy();
      expect(component.wrongPresetName).toBeFalsy();
      expect(component.error).toBe('');
      expect(spyCreate.calls.any()).toEqual(true);
      expect(IdpPresetsServiceMockStub.createIdpPreset).toHaveBeenCalledTimes(
        1
      );

      done();
    });
  });
});
