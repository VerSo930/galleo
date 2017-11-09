import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-filed-display-error',
  templateUrl: './filed-display-error.component.html',
  styleUrls: ['./filed-display-error.component.css']
})
export class FiledDisplayErrorComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() { }

  ngOnInit() {
  }

}
