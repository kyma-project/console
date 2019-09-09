import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  BadgeLabelModule,
  FormModule,
  FundamentalNgxModule,
} from 'fundamental-ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchService } from './search-form/service/search-service';
import { LuigiContextService } from './search-form/service/luigi-context.service';
import { FormsModule } from '@angular/forms';

import { WebSocketLink } from './ws';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { split, ApolloLink } from 'apollo-link';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppConfig } from './app.config';
import { TokenInterceptor } from './auth/token.interceptor';
import { AriaDisabledDirective } from './search-form/shared/appAriaDisabled.directive';

@NgModule({
  declarations: [AppComponent, SearchFormComponent, AriaDisabledDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FundamentalNgxModule,
    HttpClientModule,
    BadgeLabelModule,
    FormModule,
    FormsModule,
    ApolloModule,
    HttpLinkModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    SearchService,
    LuigiContextService,
    Apollo,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    // Create an http link:
    const http = httpLink.create({
      uri: AppConfig.graphqlApiUrl,
    });

    // Create a WebSocket link:
    const ws = new WebSocketLink({
      uri: AppConfig.subscriptionsApiUrl,
      options: {
        reconnect: true,
      },
    });

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http,
    );

    apollo.create({
      link,
      cache: new InMemoryCache(),
    });
  }
}
