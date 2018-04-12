import { Observable } from 'rxjs/Observable';
import { FileOperatorService } from './../core/file-operator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { TranslationUnit } from './../model';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { AlertComponent } from './alert/alert.component';

@Component({
  selector: 'app-translator-page',
  templateUrl: './translator-page.component.html',
  styleUrls: ['./translator-page.component.css']
})
export class TranslatorPageComponent implements OnInit {

  filename = '';

  counts = 0;
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
  isModified = false; // 文件内容是否被修改，用来当用户没有保存退出的时候判断是否需要保存
  constructor(private route: Router,
              private fileService: FileOperatorService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

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

    this.dataStore = this.fileService.getJsonData(); // 获取json数据
    if (null !== this.dataStore) {
      this.version = this.fileService.getVersion();
      this.transUnits = this.fileService.getTransUnits(this.dataStore);
      this.listItems = this.dataFormat(this.transUnits);
      this.filename = this.fileService.getFileName();
      this.refreshList();
    }
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
                      this.openMessageBox('File is empty!', 'Faild', {
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
    if ( null === this.dataStore || false === this.isModified) {
      this.openMessageBox('No file or content is not modified !',
          'Faild',
          {
            duration: 1000
          });
      return;
    }
    const filePath = this.fileService.getFilePath();
    this.fileService.writeFile(filePath, this.dataStore)
        .subscribe((res) => {
          if (res) {
            this.openMessageBox('Save file',
            'Successful',
            {
              duration: 1000
            });
          }
        });
  }

  updateTarget(translation: {index: number, target: string}): void {
    if (null === this.dataStore || null === translation.index) {
      this.openMessageBox('No translation unit!',
          'Faild',
          {
            duration: 1000
          });
      return;
    }
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
        // 如果原来翻译好的
        if (true === this.listItems[translation.index].done) {
          this.noTransItemsCount++;
          this.doneItemCount = this.counts - this.noTransItemsCount;
        }
        this.listItems[translation.index].done = false;
      } else {
        // 如果原来就是没有翻译好的
        if (false === this.listItems[translation.index].done) {
          this.noTransItemsCount--;
          this.doneItemCount = this.counts - this.noTransItemsCount;
          this.listItems[translation.index].done = true;
        }
      }
      // 原本没有这个属性，创建一个json的属性并赋值
      this.listItems[translation.index].target = translation.target;
      this.isModified = true; // 标记文件已经修改
      this.refreshList();
      this.openMessageBox('Save',
          'Successful',
          {
            duration: 1000
          });
    } else {
      this.dataStore.xliff
          .file[0]
          .body[0]['trans-unit']
          [translation.index]
          .target[0] = translation.target;
      this.transUnits = this.fileService.getTransUnits(this.dataStore);
      // 判断传入进来的和列表中的翻译是否一样
      if (this.listItems[translation.index].target === translation.target) {
        return;
      }
      this.listItems[translation.index].target = translation.target;
      if ( '' === translation.target) {
        // 如果原来翻译好的
        if (true === this.listItems[translation.index].done) {
          this.noTransItemsCount++;
          this.doneItemCount = this.counts - this.noTransItemsCount;
        }
        this.listItems[translation.index].done = false;
      } else {
        // 如果原来就是没有翻译好的
        if (false === this.listItems[translation.index].done) {
          this.noTransItemsCount--;
          this.doneItemCount = this.counts - this.noTransItemsCount;
          this.listItems[translation.index].done = true;
        }
      }
      this.refreshList();
      this.isModified = true; // 标记文件已经修改
      this.openMessageBox('Save',
          'Successful',
          {
            duration: 1000
          });
    }
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
    this.doneItemCount = this.counts - this.noTransItemsCount;
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
    if ( false === this.isModified ) { // 如果当前没有任何更改
      this.fileService.clear();
      this.route.navigate(['home']);
    } else {
      const dialogRef = this.dialog.open(AlertComponent, {
        width: '250px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe( (result) => {
        if (true === result) { // 如果用户点击了save按钮
          this.saveFile();
          this.fileService.clear();
          this.route.navigate(['home']);
        } else if ( false === result ) { // 如果用户点击了继续退出按钮
          this.fileService.clear();
          this.route.navigate(['home']);
        } else {
          return;
        }
      });
    }
  }

  private refreshList(): void {
    if (null !== this.listItems) {
      this.dataSource = new MatTableDataSource(this.listItems);
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openMessageBox(message: string, action: string, option: any): void {
    this.snackBar.open(message,
      action,
    {
      duration: 1000
    });
  }
}
