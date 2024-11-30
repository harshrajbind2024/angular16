import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-action-scores',
  templateUrl: './action-scores.component.html',
  styleUrls: ['./action-scores.component.scss']
})
export class ActionScoresComponent implements OnInit {
  @Input() cap1 : any = '';
  @Input() cap2 : any = '';
  @Input() actioninsightsCardData : any;
  @Output() actionCuratedEvent = new EventEmitter<{type:any}>();
  isClickedActionRequired = false;
  isClickedActionTaken = false;
  isClickedActionPending = false;
  isClickedPeopleSaved = false;
  constructor( 
      public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isClickedActionRequired = true
  }

  actionCuratedTable(type) {
    this.isClickedActionRequired = false
    this.isClickedActionTaken = false
    this.isClickedActionPending = false
    this.isClickedPeopleSaved = false

    if (type == 'action-required'){
      this.isClickedActionRequired = true
    }
    else if (type == 'action-taken'){
      this.isClickedActionTaken = true
    }
    else if (type == 'action-pending'){
      this.isClickedActionPending = true
    }
    else{
      this.isClickedPeopleSaved = true
    }
    this.actionCuratedEvent.emit({type});
  }
}