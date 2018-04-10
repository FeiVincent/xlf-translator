import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent implements OnInit {

  id = 1;
  meaning = '';
  description = '这里是一个翻译';
  source = 'good';
  target = '好的';
  targetValue = '';
  constructor() { }

  ngOnInit() {
  }

  save(): void {
    // TODO: 补充未输入功能
  }
}
