import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FileOperatorService } from './../core/file-operator.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-merge-page',
  templateUrl: './merge-page.component.html',
  styleUrls: ['./merge-page.component.css']
})
export class MergePageComponent implements OnInit {

  sourceFileName = 'Please select a source file!';
  sourcePath = '';
  destPath = '';
  destFileName = 'Please select a dest file!';
  btnType = {sourceBtn: 'source', destBtn: 'dest'};
  btnEnable = {sourceBtn: true, destBtn: false, mergeBtn: false};
  isLoading = false;
  sourceFileStore: any = null;
  destFileStore: any = null;

  constructor(private snackBar: MatSnackBar,
              private route: Router,
              private fileService: FileOperatorService,
              private dialogRef: MatDialogRef<MergePageComponent>) {
  }

  ngOnInit() {
  }

  showOpenDialog(btnType: string): void {
    if (btnType === this.btnType.sourceBtn) {
      this.fileService.openFileDialog().asObservable()
          .subscribe( (filePath) => {
            this.fileService.readFile(filePath)
              .subscribe((fileDate) => {
              if (null !== fileDate) {
                this.sourceFileStore = fileDate;
                this.sourceFileName = this.fileService.getFileName();
                this.sourcePath = this.fileService.getFilePath();
                this.btnEnable.destBtn = true;
              } else {
                this.sourceFileName = `${this.fileService
                                             .getFileName()} is empty! Please select a file again.`;
                this.btnEnable.destBtn = false;
              }
            });
          });
    } else if ( btnType === this.btnType.destBtn ) {
      if ( true !== this.btnEnable.destBtn) {
        this.destFileName = 'Please select a source file!';
        return;
      }
      this.fileService.openFileDialog().asObservable()
          .subscribe( (filePath) => {
            this.fileService.readFile(filePath)
                .subscribe((fileDate) => {
                  if (null !== fileDate) {
                    this.destFileStore = fileDate;
                    if (this.sourcePath === this.fileService.getFilePath()) {
                      this.destFileName = 'The file is the same!';
                      return;
                    }
                    this.destFileName = this.fileService.getFileName();
                    this.btnEnable.mergeBtn = true;
                  } else {
                    this.destFileName = `${this.fileService
                                               .getFileName()} is empty! Please select a file again.`;
                    this.btnEnable.mergeBtn = false;
                  }
                });
          });
    } else {
      console.log('Unknown button type.');
    }
  }

  mergeFile() {
    // 然后关闭dialog,并提示成功，然后进入translate
    if ( true !== this.btnEnable.mergeBtn) {
      return;
    }
    this.isLoading = true;
    this.fileService.writeFile(this.sourcePath, this.mergeXlfFiles())
        .subscribe((newJsonData) => {
           this.isLoading = false; // 关闭进度条
           this.dialogRef.close(); // 关闭dialog
           this.snackBar.open('merge file',
                'Successful',
                {
                  duration: 1000
                });
           // 将数据存入服务
           this.fileService.setFileInfo(this.sourcePath, this.sourceFileStore);
           this.route.navigate(['translator']);
    });
  }

  onNoClick(): void {
    this.dialogRef.close(); // 关闭dialog对话框
  }

  private mergeXlfFiles(): any {
    return Object.assign({}, this.sourceFileStore, this.destFileStore);
  }
}
