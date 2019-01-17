import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretDetailComponent } from './secret-detail.component';
import { AppModule } from '../../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('SecretDetailComponent', () => {
  let component: SecretDetailComponent;
  let fixture: ComponentFixture<SecretDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
