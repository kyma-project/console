import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BadgeLabelModule,
  FormModule,
  FundamentalNgxModule,
} from 'fundamental-ngx';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchService } from './service/search-service';
import { LuigiContextService } from './service/luigi-context.service';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FundamentalNgxModule,
        BadgeLabelModule,
        FormModule,
        FormsModule,
      ],
      declarations: [SearchFormComponent],
      providers: [SearchService, LuigiContextService],
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
});
