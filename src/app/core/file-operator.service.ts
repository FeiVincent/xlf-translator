import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ElectronService } from 'ngx-electron';
import { FileInfo } from './../model';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

import xml2js from 'xml2js';
const fs = (window as any).require('fs');
const path = (window as any).require('path');

@Injectable()
export class FileOperatorService {

  fileInfo = new FileInfo();
  constructor(private electronService: ElectronService,
              private zone: NgZone) {
    this.fileInfo.fileName = null;
    this.fileInfo.path = null;
    this.fileInfo.jsonData = null;
  }

  /**
   * 选择文件的窗口，选择完成之后获取xlf文件路径
   * @param no
   * @returns Subject的path信息
   */
  openFileDialog(): Subject<string> {
    const result = new Subject<string>(); // 事件流广播
    // 使用渲染进程打开文件，主进程不能占用
    const { dialog } = (window as any).require('electron').remote;
    // const BrowserWindow = require('electron').BrowserWindow;
    dialog.showOpenDialog({
      filters: [ // 过滤器，过滤其他文件
        { name: 'XLF', extensions: ['xlf', 'xliff'] }
      ]},
      (paths) => {
        this.zone.run(() => {
          if (paths) {
            const filePath = paths[0];
            result.next(filePath);
          } else {
            console.log('np path selected');
            return '';
          }
        });
      }
    );
    return result;
  }

  setFileInfo(filePath: string, jsonData: any): void {
    if (null === filePath || '' === filePath) {
      console.log('Merge file faild');
      return;
    }
    this.fileInfo.path = filePath;
    this.fileInfo.fileName = path.basename(filePath);
    this.fileInfo.jsonData = jsonData;
  }
  /**
   * 读取文件内容,返回json对象
   * @param filePath 文件路径
   */
  readFile(filePath: string): Observable<any> {
    let data;
    try {
      // node.js的fs文件操作，这里为同步操作
      data = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
      console.log('read file failed');
      return Observable.throw('failed to open file');
    }

    // 基于node.js的路径转换文件名函数
    this.fileInfo.fileName = path.basename(filePath);
    this.fileInfo.path = filePath;

    return Observable.fromPromise(this.xmlToJson(data))
                     .catch((error) => {
                       console.log('failed to parse file.');
                       return Observable.throw('failed to parse file.');
                     });
  }

  /**
   * 使用xml2js第三方库将xml字符串解析为json对象
   * @param xmlData xml数据字符串
   * @returns 返回json对象
   */
  private xmlToJson(xmlData: string): Promise<any> {
    // let jsonData;
    const result = new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (err, data) => {
        if (true === err) {
          console.log('xml2js parse string faild.');
          return reject(err);
        }
        // jsonData = data;
        this.fileInfo.jsonData = data;
        resolve(data);
      });
    });

    return result;
  }

  /**
   * 使用xml2js第三方库将json对象解析为xml
   * @param jsonData json对象
   * @returns 返回xml数据
   */
  private jsonToXml(jsonData: {}) {
    const builder = new xml2js.Builder();
    return builder.buildObject(jsonData);
  }

  /**
   * 获取json对象内的翻译单元数据集合
   * @param jsonData json对象
   */
  getTransUnits(jsonData: any): any[] {
    if ( {} === jsonData) {
      return [];
    }

    // i18n xlf文件的格式
    const xliff = jsonData.xliff;
    // const header = xliff.$; // 里面有version, xmlns属性
    const file = xliff.file; // 下面有$和body，$内有datatype, original, source-language
    const body = file[0].body;
    const transUnits: any[] = body[0]['trans-unit'] || [];
    return transUnits;
  }

  getFileName(): string {
    return this.fileInfo.fileName;
  }

  getFilePath(): string {
    return this.fileInfo.path;
  }

  getJsonData(): any {
    return this.fileInfo.jsonData;
  }

  getVersion(): string {
    return this.fileInfo.jsonData.xliff.$.version;
  }
  writeFile(filePath: string, jsonData: {}): Observable<boolean> {
    try {
      fs.writeFileSync(filePath, this.jsonToXml(jsonData));
      return Observable.of(true);
    } catch (e) {
      console.log(' write file faild.');
    }
  }

  clear(): void {
    this.fileInfo.fileName = '';
    this.fileInfo.path = '';
    this.fileInfo.jsonData = null;
  }
}
