import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input()
  message: string;

  @Output()
  confirmation: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onButtonClick(confirm: boolean) {
    this.confirmation.next(confirm);
  }


}
