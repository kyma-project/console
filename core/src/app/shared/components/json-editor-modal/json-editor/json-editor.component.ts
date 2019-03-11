import { Component, Input, OnInit } from '@angular/core';
import * as JSONEditor from 'jsoneditor';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit {
  @Input() resourceData: any;
  private editor: any;

  constructor() {}

  ngOnInit() {
    const container = document.getElementById('jsoneditor');
    const options = {
      escapeUnicode: false,
      history: true,
      indentation: 2,
      mode: 'code',
      // theme: 'tomorrow', <-- doesn't work for now
      search: true,
      sortObjectKeys: false,
      modes: ['code', 'tree', 'view', 'form']
    };
    this.editor = new JSONEditor(container, options, this.resourceData);
  }

  getCurrentValue() {
    return this.editor.get();
  }
}
