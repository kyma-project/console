import { DummyElementListRendererComponent } from './dummy-element-list-renderer/dummy-element-list-renderer.component';
import { DummyElementRendererComponent } from './dummy-element-renderer/dummy-element-renderer.component';
import { ArrayDataProvider } from './modules/list/source/array-data-provider';
import { Component } from '@angular/core';
import { Filter } from './modules/list/filter/Filter';
import { DummyHeaderRendererComponent } from './dummy-header-renderer/dummy-header-renderer.component';

@Component({
  selector: 'y-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  filterState = { filters: [new Filter('name', '', false)] };
  pagingState = { pageNumber: 1, pageSize: 3 };

  title = 'Dummy List';
  emptyListText = 'Nothing to show on dummy list';
  createNewElementText = 'createNewElementText';

  dummyDataProvider = new ArrayDataProvider([
    { id: '1', name: 'one' },
    { id: '2', name: 'two' },
    { id: '3', name: 'threeee' },
    { id: '4', name: 'four' },
    { id: '5', name: 'five' },
    { id: '6', name: 'six' },
  ]);

  dummyDataRenderer = DummyElementRendererComponent;
  dummyHeaderRenderer = DummyHeaderRendererComponent;
  dummyDataListRenderer = DummyElementListRendererComponent;
  dummyEventHandler = {
    doABC: (entry: any) => {
      alert('doing ABC for entry ' + entry.name);
    },
    doXYZ: (entry: any) => {
      alert('doing XYZ for entry ' + entry.name);
    },
  };
}
