import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  BadgeLabelModule,
  FormModule,
  FundamentalNgxModule,
} from 'fundamental-ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchService } from './search-form/service/search-service';
import { LuigiContextService } from './search-form/service/luigi-context.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SearchFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FundamentalNgxModule,
    HttpClientModule,
    BadgeLabelModule,
    FormModule,
    FormsModule,
  ],
  providers: [SearchService, LuigiContextService],
  bootstrap: [AppComponent],
})
export class AppModule {}
