import { Injector, Input } from '@angular/core';

import * as _ from 'lodash';

export abstract class AbstractKubernetesEntryRendererComponent {
  @Input() entry: any;
  @Input() entryEventHandler: any;
  public actions = [
    {
      function: 'edit',
      name: 'Edit'
    },
    {
      function: 'delete',
      name: 'Delete'
    }
  ];

  protected constructor(protected injector: Injector) {
    this.entry = this.injector.get<any>('entry' as any);
    this.entryEventHandler = this.injector.get<any>('entryEventHandler' as any);
  }

  getLabels(labels) {
    return _.transform(
      labels,
      (result, value, key) => {
        return result.push(key + ':' + value);
      },
      []
    );
  }
}
