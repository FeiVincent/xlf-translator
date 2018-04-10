import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';

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
  translationList = [{id: 0, source: 'good', target: '好', done: false},
                     {id: 1, source: 'good', target: '好', done: true},
                     {id: 2, source: 'good', target: '好', done: false},
                     {id: 3, source: 'good', target: '好', done: true},
                     {id: 4, source: 'good', target: '好', done: true},
                     {id: 5, source: 'good', target: '好', done: true},
                     {id: 6, source: 'good', target: '好', done: true},
                     {id: 7, source: 'good', target: '好', done: true},
                     {id: 8, source: 'good', target: '好', done: true},
                     {id: 9, source: 'good', target: '好', done: true},
                     {id: 10, source: 'good', target: '好', done: true},
                     {id: 11, source: 'good', target: '好', done: true},
                     {id: 12, source: 'good', target: '好', done: true},
                     {id: 13, source: 'good', target: '好', done: true},
                     {id: 14, source: 'good', target: '好', done: true},
                     {id: 15, source: 'good', target: '好', done: true},
                     {id: 16, source: 'good', target: '好', done: true},
                     {id: 17, source: 'good', target: '好', done: true},
                     {id: 18, source: 'good', target: '好', done: true},
                     {id: 19, source: 'good', target: '好', done: true},
                     {id: 20, source: 'good', target: '好', done: true},
                     {id: 21, source: 'good', target: '好', done: true},
                     {id: 22, source: 'good', target: '好', done: true},
                     {id: 23, source: 'good', target: '好', done: true}];
  dataSource = new MatTableDataSource(this.translationList);
  constructor(private route: Router) { }

  ngOnInit() {
  }

  showOpenDialog() {

  }

  saveFile() {

  }

  editeWord(id: number): void {
    console.log(id);
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
