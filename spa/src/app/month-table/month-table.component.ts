import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from '../data.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-month-table',
  templateUrl: './month-table.component.html',
  styleUrls: ['./month-table.component.css'],
})
export class MonthTableComponent implements OnInit, AfterViewInit {
  public data = [];
  public dataChanged: Subject<any> = new Subject();
  public headerDate;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.countyDataChanged.subscribe((res: JSON) => {
      this.headerDate = formatDate(this.dataService.currentMonth + '-1','MMMM yyyy', 'en-US');
      this.data = res['features'];
      this.data.sort((a, b) => {
        return (a.properties.CO_NAME < b.properties.CO_NAME) ? -1 : 1; })
    });
  }
  
  ngAfterViewInit() {
  }
}
