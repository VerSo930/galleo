import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-filed-display-error',
  templateUrl: './filed-display-error.component.html',
  styleUrls: ['./filed-display-error.component.css']
})
export class FiledDisplayErrorComponent implements OnInit, OnChanges {

  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.displayError) {
      this.displayError = changes.displayError.currentValue;
    }
  }

  ngOnInit() {
  }

}
