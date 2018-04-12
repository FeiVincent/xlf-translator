import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { SharedModule } from './../shared/shared.module';
import { TranslatorPageComponent } from './translator-page.component';
import { EditorPageComponent } from '../editor-page/editor-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [AlertComponent],
  declarations: [
    TranslatorPageComponent,
    AlertComponent,
    EditorPageComponent
  ]
})
export class TranslatorPageModule { }
