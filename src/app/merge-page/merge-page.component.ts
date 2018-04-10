import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-merge-page',
  templateUrl: './merge-page.component.html',
  styleUrls: ['./merge-page.component.css']
})
export class MergePageComponent implements OnInit {

  sourceFile = 'source.xlf';
  destFile = 'destFile.xlf';
  isLoading = true;
  constructor(private snackBar: MatSnackBar,
              private route: Router,
              private dialogRef: MatDialogRef<MergePageComponent>) {
  }

  ngOnInit() {
  }

  showOpenDialog() {

  }

  mergeFile() {
    // TODO: 增加合并代码,并加载进度条
    // 然后关闭dialog,并提示成功，然后进入translate
    this.dialogRef.close();
    this.snackBar.open('merge file',
      'Successful',
      {
        duration: 1000
      });
      this.route.navigate(['translator']);
  }

  onNoClick(): void {
    this.dialogRef.close(); // 关闭dialog对话框
  }
}
