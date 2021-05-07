import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public countyDataChanged = new Subject<{}>();

  private monthlyData = <{}>[];
  private countiesRequest: Observable<any>;
  private counties: string = '/assets/data/nc-counties.geojson';
  private countyGeoJson;
  public currentMonth;

  constructor(private http: HttpClient) {
    this.countiesRequest = this.http.get(this.counties);
    this.countiesRequest.subscribe((res: any) => {
      this.countyGeoJson = res;
      console.log('County GeoJSON loaded.');
      //this.countyDataChanged.next(this.countyGeoJson)
    });
  }

  getMothlyData(caseMonth) {
    if (this.monthlyData[caseMonth]) {
      console.log('Cached');
      this.addMonthDataToCounties(caseMonth);
    } else {
      console.log('Getting data for ' + caseMonth);
      this.http.get(environment.apiUrl + '/month/' + caseMonth + '/', {'responseType': 'json'})
        .subscribe((res: any) => {
          this.currentMonth = caseMonth;
          this.monthlyData[caseMonth] = res;
          this.addMonthDataToCounties(caseMonth);
        });
    }
  }

  addMonthDataToCounties(caseMonth) {
    console.log('Attaching data for ' + caseMonth);
    this.countiesRequest.toPromise().finally(() => {
      for (let feature of this.countyGeoJson.features) {
        feature.properties.totalCases = 0;
        feature.properties.stats = {};

        let countyName = feature.properties.CO_NAME;
        let countyMonthData = this.monthlyData[caseMonth][countyName];
        if (countyMonthData) {
          feature.properties.totalCases = countyMonthData.totalCases;
          feature.properties.stats = countyMonthData.stats;
        }
      }
      console.log('Attached data for ' + caseMonth);
      this.countyDataChanged.next(this.countyGeoJson)
    });
  }
}
