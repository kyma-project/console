import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceUploaderComponent } from './resource-uploader.component';
import { AppModule } from '../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { Routes } from '@angular/router';

describe('ResourceUploaderComponent', () => {
  let component: ResourceUploaderComponent;
  let fixture: ComponentFixture<ResourceUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
