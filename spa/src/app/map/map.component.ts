import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { DataService } from '../data.service';
import { formatDate } from '@angular/common';
import { toTitleCase } from '../common';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapControls') mapControls: NgForm;
  // @ViewChild('caseMonth') monthContol: NgModel;
  private map: L.Map;
  private geoJson: L.GeoJSON;
  private info: L.Control;
  private legend: L.Control;
  private mapboxToken = "pk.eyJ1Ijoicm1hdHRoZXdzIiwiYSI6ImNrbzh3OTBpazFram0ydW9uODZoeDIxZzgifQ.MhR7riaPgzQ-7yqdmVBvuA";
  public caseMonth = '2021-04';
  public monthOptions = [];
  private grades = [0, 100, 200, 500, 1000, 2000, 5000, 10000];
  private infoDiv;
  
  constructor(private http: HttpClient, private dataService: DataService) {
    // this.caseMonth = formatDate(Date(),'yyyy-MM', 'en-US');
    // console.log('Current Month:', this.caseMonth);
    this.buildMonthOptions();
  }

  ngOnInit() {
    this.dataService.getMothlyData(this.caseMonth);
  }

  ngAfterViewInit() {
    // this.caseMonth = this.monthOptions[1].caseMonth
    this.initMap();
    this.dataService.countyDataChanged.subscribe((res: any) => {
      this.updateGeoJson(res);
      this.updateInfo(null);
    });
  }

  buildMonthOptions() {
    var caseMonth;
    for (let i = 0; caseMonth !== this.caseMonth; i++) {
      var year = 2020 + Math.floor(i / 12);
      var month = i % 12 + 1;
      caseMonth = year + '-' + month.toLocaleString('en-US', {minimumIntegerDigits: 2});
      var description = formatDate(caseMonth + '-1','MMMM yyyy', 'en-US');
      this.monthOptions.unshift({ caseMonth: caseMonth, description: description });
    }
    console.log(this.monthOptions);
  }

  initMap() {
    this.map = L.map('map', {
      center: [35.1, -79.9],
      zoom: 7
    });

    L.tileLayer ('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + this.mapboxToken, {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    this.addInfo();
    this.addLegend();
  }

  addInfo() {
    this.info = new L.Control();

    this.info.onAdd = (map) => {
      this.infoDiv = L.DomUtil.create('div', 'info');
      this.updateInfo(null);
      return this.infoDiv;
    };

    this.info.addTo(this.map);
  }

  updateInfo(props) {
    let numberFormatter = new Intl.NumberFormat('en-US');
    let infoMonth = formatDate(this.caseMonth + '-1','MMMM yyyy', 'en-US');
    this.infoDiv.innerHTML = '<h4>Reported COVID-19 Cases</h4>';
    this.infoDiv.innerHTML += '<h4>' + infoMonth + '</h4>';
    if (props) {
      let value = props.totalCases;            
      this.infoDiv.innerHTML +=
        '<b>' + toTitleCase(props.CO_NAME) + ' County</b><br />' + numberFormatter.format(value) + ' cases';
    } else {
      this.infoDiv.innerHTML += 'Hover over a county';
    }
  }

  getColor(d) {
    return d > this.grades[7] ? '#800026' :
           d > this.grades[6] ? '#BD0026' :
           d > this.grades[5] ? '#E31A1C' :
           d > this.grades[4] ? '#FC4E2A' :
           d > this.grades[3] ? '#FD8D3C' :
           d > this.grades[2] ? '#FEB24C' :
           d > this.grades[1] ? '#FED976' :
                                '#FFEDA0';
  }

  style(feature) {
    let value = feature.properties.totalCases;

    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: this.getColor(value)
    };
  }

  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    this.updateInfo(layer.feature.properties);
  }

  resetHighlight(e) {
    this.geoJson.resetStyle(e.target);
    this.updateInfo(null);
  }

  zoomToFeature(e) {
    this.map.fitBounds(e.target.getBounds());
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this)
    });
  }

  updateGeoJson(geoJson) {
    if(this.geoJson) {
      this.geoJson.remove();
    }

    this.geoJson = L.geoJSON(geoJson, {
      style: this.style.bind(this),
      onEachFeature: this.onEachFeature.bind(this)
    }).addTo(this.map);

    console.log('Update GeoJSON');
    //map.attributionControl.addAttribution('Covid case data provided by <a href="http://data.cdc.gov/">US Centers for Disease Control and Prevention</a>');
  }

  addLegend(): void {
    this.legend = new L.Control({position: 'bottomright'});

    this.legend.onAdd = () => {
      var div = L.DomUtil.create('div', 'info legend'),
        grades = this.grades,
        labels = [],
        from, to;
      console.log(div);

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' + this.getColor(from + 1) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    this.legend.addTo(this.map);
  }

  onChangeMonth(e) {
    this.caseMonth = e.value;
    this.dataService.getMothlyData(this.caseMonth);
  }
}
