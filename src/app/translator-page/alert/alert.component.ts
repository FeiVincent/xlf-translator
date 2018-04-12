import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  isSave = true;
  constructor(public dialogRef: MatDialogRef<AlertComponent>) {
  }

  // 继续退出
  onNoClick(): void {
    this.isSave = false;
    this.dialogRef.close(this.isSave);
  }

  // 保存按钮
  onSaveClick(): void {
    this.isSave = true;
    this.dialogRef.close(this.isSave);
  }
}
