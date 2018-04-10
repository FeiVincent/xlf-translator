import { Component, OnInit, Input } from '@angular/core';
import { TranslationUnit } from '../model';
@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent implements OnInit {

  @Input() transInfo: TranslationUnit = {
    index: 0,
    id: '',
    meaning: '',
    description: '',
    source: '',
    target: ''
  };
  targetValue = '';
  constructor() { }

  ngOnInit() {
  }

  save(): void {
    // TODO: 补充未输入功能
    this.transInfo.target  = this.targetValue;
  }
}
