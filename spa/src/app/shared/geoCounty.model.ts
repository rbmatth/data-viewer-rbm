/*
{
  "type": "Feature",
  "properties": {
    "FID": 1,
    "OBJECTID": 1.0,
    "PERIMETER": 156472.984375,
    "CO_NAME": "ROCKINGHAM",
    "CO_ABBR": "ROCK",
    "ACRES": 366053.0625,
    "Shape_Leng": 513361.78737699997,
    "RO": "WSRO",
    "SHAPE_Length": 1.6055089085470764,
    "SHAPE_Area": 15945261643.200001
  },
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": []
  }
}
*/

export class GeoCounty {
    constructor(public type, public properties, public geometry) {}
}