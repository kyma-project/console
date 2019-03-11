import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceUploadService } from '../services/resource-upload.service';
import { UploaderComponent } from './uploader.component';
import { AppModule } from '../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('UploaderComponent', () => {
  let component: UploaderComponent;
  let fixture: ComponentFixture<UploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
