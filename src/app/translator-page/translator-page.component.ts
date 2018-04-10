import { Observable } from 'rxjs/Observable';
import { FileOperatorService } from './../core/file-operator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import { TranslationUnit } from './../model';

@Component({
  selector: 'app-translator-page',
  templateUrl: './translator-page.component.html',
  styleUrls: ['./translator-page.component.css']
})
export class TranslatorPageComponent implements OnInit {

  filename = 'message.xlf';

  counts = 100;
  noTransItemsCount = 0;
  doneItemCount = 0;

  displayedColumns = ['id', 'source', 'target', 'done', 'edit'];
  translationList: Observable<any[]>;
  transUnits: any[] = [];  // 存储xml转换json后的原有数据格式
  listItems: any[] = [];   // 指定的json格式数据
  dataSource: MatTableDataSource<any>; // listview数据数组
  editorPageData: TranslationUnit;
  version = '';
  constructor(private route: Router,
              private fileService: FileOperatorService) { }

  ngOnInit() {
    this.editorPageData = {
      index: 0,
      id: '',
      meaning: '',
      description: '',
      source: '',
      target: '',
      version: ''
    };
  }

  showOpenDialog() {
    this.fileService.openFileDialog()
        .asObservable()
        .subscribe( (filePath) => {
            this.fileService.readFile(filePath)
                .subscribe( (res) => {
                    console.log(res);
                    // 获取翻译单元数据
                    this.version = res.xliff.$.version;
                    this.transUnits = this.fileService.getTransUnits(res);
                    this.listItems = this.dataFormat(this.transUnits);
                    this.dataSource = new MatTableDataSource(this.listItems);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
        });
  }

  saveFile() {

  }

  private dataFormat(data: any[]) {
    const items: any[] = [];
    this.counts = data.length;
    let done = false;
    for ( let i = 0; i < this.counts; ++i) {
      if (null === data[i].target[0] || '' === data[i].target[0] ) {
        done = false;
        this.noTransItemsCount++;
      }
      done = true;
      items.push({
        index: i,
        id: data[i].$.id,
        meaning: '',
        description: '',
        source: data[i].source[0],
        target: done ? data[i].target[0] : '',
        done: done
      });
    }
    return items;
  }
  editeWord(index: number): void {
    const data = {
      index: index,
      id: this.listItems[index].id,
      meaning: this.listItems[index].meaning,
      description: this.listItems[index].description,
      source: this.listItems[index].source,
      target: this.listItems[index].target,
      version: this.version
    };
    this.editorPageData = data;
    // TODO: 找到指定id数据，然后通过output或者subject发送到editor界面，订阅的方式
  }
  back(): void {
    this.route.navigate(['home']);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
