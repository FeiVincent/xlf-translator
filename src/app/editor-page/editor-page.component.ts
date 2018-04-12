import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationUnit } from '../model';
@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent implements OnInit {

  @Input() transInfo: TranslationUnit = {
    index: null,
    id: '',
    meaning: '',
    description: '',
    source: '',
    target: '',
    version: '1.0'
  };
  @Output() saveTarget = new EventEmitter<{index: number, target: string}>();
  targetValue = '';
  constructor() { }

  ngOnInit() {
  }

  save(): void {
    if ('' === this.transInfo.id) {
      return;
    }
    this.saveTarget.emit({index: this.transInfo.index , target: this.transInfo.target});
  }
}
