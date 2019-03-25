import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BadgeLabelModule,
  FormModule,
  FundamentalNgxModule,
} from 'fundamental-ngx';
import { FormsModule } from '@angular/forms';
import { SearchService } from './service/search-service';
import { LuigiContextService } from './service/luigi-context.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

const ActivatedRouteMock = {
  queryParams: of({ })
};

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
        RouterModule
      ],
      declarations: [SearchFormComponent],
      providers: [SearchService, LuigiContextService,
        { provide: ActivatedRoute, useValue: ActivatedRouteMock }
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
});
