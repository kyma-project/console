import { Component, Input, OnInit } from '@angular/core';
import * as JSONEditor from 'jsoneditor';
import 'brace/theme/tomorrow';

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
      theme: 'ace/theme/tomorrow',
      search: true,
      sortObjectKeys: false,
      mainMenuBar: false
    };
    this.editor = new JSONEditor(container, options, this.resourceData);
  }

  getCurrentValue() {
    return this.editor.get();
  }
}
