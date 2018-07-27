import { DummyElementListRendererComponent } from './dummy-element-list-renderer/dummy-element-list-renderer.component';
import { ListModule } from './modules/list/list.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DummyElementRendererComponent } from './dummy-element-renderer/dummy-element-renderer.component';
import { DummyHeaderRendererComponent } from './dummy-header-renderer/dummy-header-renderer.component';


@NgModule({
  declarations: [
    AppComponent,
    DummyElementRendererComponent,
    DummyHeaderRendererComponent,
    DummyElementListRendererComponent
  ],
  imports: [
    BrowserModule,
    ListModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DummyElementRendererComponent, DummyHeaderRendererComponent, DummyElementListRendererComponent]
})
export class AppModule { }
