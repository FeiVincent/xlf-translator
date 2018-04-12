import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { AppRoutingModule } from './app-routing.module';
import { TranslatorPageComponent } from './translator-page/translator-page.component';
import { HomeComponent } from './home/home.component';
import { MergePageComponent } from './merge-page/merge-page.component';
import { NgxElectronModule } from 'ngx-electron';
import { FileOperatorService } from './core/file-operator.service';
import { TranslatorPageModule } from './translator-page/translator-page.module';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MergePageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxElectronModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CdkTableModule,
    SharedModule,
    TranslatorPageModule
  ],
  entryComponents: [MergePageComponent],
  providers: [
    FileOperatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
