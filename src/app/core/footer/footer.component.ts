import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {


   clock: Observable<Date>;


  constructor() {

  }

  ngOnInit() {
    this.clock = Observable
      .interval(1000)
      .map(() => new Date());

  }

  ngOnDestroy(): void {
    this.clock = null;
  }

}
