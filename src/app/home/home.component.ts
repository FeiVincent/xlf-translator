import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MergePageComponent } from './../merge-page/merge-page.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: Router,
              private dialog: MatDialog) { }

  jumpTranslatorPage() {
    this.route.navigate(['translator']);
  }

  jumpMergePage() {
    this.dialog.open(MergePageComponent, {
      width: '500px',
      height: '420px',
    });
  }

  ngOnInit() {
  }

}
