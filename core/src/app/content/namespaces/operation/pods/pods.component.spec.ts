import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodsComponent } from './pods.component';
import { AppModule } from '../../../../app.module';
import { ListModule } from 'app/generic-list';
import { APP_BASE_HREF } from '@angular/common';

describe('PodsComponent', () => {
  let component: PodsComponent;
  let fixture: ComponentFixture<PodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
