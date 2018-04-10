import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import {CdkTableModule} from '@angular/cdk/table';
import { AppRoutingModule } from './app-routing.module';
import { TranslatorPageComponent } from './translator-page/translator-page.component';
import { HomeComponent } from './home/home.component';
import { MergePageComponent } from './merge-page/merge-page.component';
import { EditorPageComponent } from './editor-page/editor-page.component';
import { NgxElectronModule } from 'ngx-electron';
import { FileOperatorService } from './core/file-operator.service';

@NgModule({
  declarations: [
    AppComponent,
    TranslatorPageComponent,
    HomeComponent,
    MergePageComponent,
    EditorPageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxElectronModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CdkTableModule,
    SharedModule
  ],
  entryComponents: [MergePageComponent],
  providers: [
    FileOperatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
