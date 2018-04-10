import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslatorPageComponent } from './translator-page/translator-page.component';
import { HomeComponent } from './home/home.component';
import { MergePageComponent } from './merge-page/merge-page.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
  },
  {
      path: 'home',
      component: HomeComponent
  },
  {
      path: 'translator',
      component: TranslatorPageComponent
  },
  {
      path: 'merge',
      component: MergePageComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
