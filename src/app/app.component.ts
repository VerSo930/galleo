import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  constructor(@Inject(DOCUMENT) private document: Document,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.document.body.classList.add('profile-page');
    this.document.body.classList.add('sidebar-collapse');

  }
}
