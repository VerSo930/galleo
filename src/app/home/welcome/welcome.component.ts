import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {SessionModel} from '../../shared/model/session.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  session: SessionModel;
  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

}
