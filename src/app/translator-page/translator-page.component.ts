import { Observable } from 'rxjs/Observable';
import { FileOperatorService } from './../core/file-operator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import { TranslationUnit } from './../model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-translator-page',
  templateUrl: './translator-page.component.html',
  styleUrls: ['./translator-page.component.css']
})
export class TranslatorPageComponent implements OnInit {

  filename = '';

  counts = 100;
  noTransItemsCount = 0;
  doneItemCount = 0;

  displayedColumns = ['id', 'source', 'target', 'done', 'edit'];
  // translationList: Observable<any[]>;
  transUnits: any[] = [];  // 存储xml转换json后的原有数据格式
  listItems: any[] = [];   // 指定的json格式数据
  dataSource: MatTableDataSource<any>; // listview数据数组
  editorPageData: TranslationUnit;
  version = '';
  dataStore: any = null;
  constructor(private route: Router,
              private fileService: FileOperatorService,
              private snackBar: MatSnackBar) { }

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

  showOpenDialog(): void {
    this.fileService.openFileDialog()
        .asObservable()
        .subscribe( (filePath) => {
            this.fileService.readFile(filePath)
                .subscribe( (res) => {
                    if (null !== res) {
                      // 获取翻译单元数据
                      this.dataStore = res;
                      this.version = res.xliff.$.version;
                      this.transUnits = this.fileService.getTransUnits(res);
                      this.listItems = this.dataFormat(this.transUnits);
                      this.filename = this.fileService.getFileName();
                      this.refreshList();
                    } else {
                      this.snackBar.open('File is empty!',
                      'Faild',
                      {
                        duration: 1000
                      });
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
        });
  }

  saveFile(): void {
    if ( null === this.dataStore) {
      return;
    }
    const filePath = this.fileService.getFilePath();
    this.fileService.writeFile(filePath, this.dataStore)
        .subscribe((res) => {
          if (res) {
            this.snackBar.open('Save file',
            'Successful',
            {
              duration: 1000
            });
          }
        });
  }

  updateTarget(translation: {index: number, target: string}): void {

    if ( undefined === this.transUnits[translation.index]['target']) {
      this.dataStore.xliff
                  .file[0]
                  .body[0]['trans-unit']
                  [translation.index]
                  .target = [translation.target];
      // 更新翻译单元数组
      this.transUnits = this.fileService.getTransUnits(this.dataStore);
      // 更新list列表的数据
      if ( '' === translation.target) {
        this.listItems[translation.index].done = false;
      } else {
        this.listItems[translation.index].done = true;
      }
      this.listItems[translation.index].target = translation.target;
      this.refreshList();
    } else {
      this.dataStore.xliff
          .file[0]
          .body[0]['trans-unit']
          [translation.index]
          .target[0] = translation.target;
      this.transUnits = this.fileService.getTransUnits(this.dataStore);
      this.listItems[translation.index].target = translation.target;
      if ( '' === translation.target) {
        this.listItems[translation.index].done = false;
      } else {
        this.listItems[translation.index].done = true;
      }
      this.refreshList();
    }
    this.snackBar.open('Save',
            'Successful',
            {
              duration: 1000
            });
  }
  private dataFormat(data: any[]) {
    const items: any[] = [];
    this.counts = data.length;
    let done = false;
    let target = '';
    for ( let i = 0; i < this.counts; ++i) {
      if (undefined === data[i]['target']) {
        done = false;
        this.noTransItemsCount++;
      } else {
        if ( null === data[i].target[0] || '' === data[i].target[0]) {
          done = false;
          target = '';
        } else {
          done = true;
          target = data[i].target[0];
        }
      }
      items.push({
        index: i,
        id: data[i].$.id,
        meaning: '',
        description: '',
        source: data[i].source[0],
        target: target,
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
    this.editorPageData = data; // 这一步触发editor-page界面刷新
    // TODO: 找到指定id数据，然后通过output或者subject发送到editor界面，订阅的方式
  }
  back(): void {
    this.route.navigate(['home']);
  }

  private refreshList(): void {
    this.dataSource = new MatTableDataSource(this.listItems);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
