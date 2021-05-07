# data-viewer-rbm

## About the Project
This project is an interactive map data visualization demo, that shows a heat-map by county of reported COVID-19 cases in
North Carolina by month.

For demonstration purposes, the project is set up as a full stack solution configured to be deployed to the Heroku
platform-as-a-service. The application stack is Linux, Apache, PostgreSQL, and PHP running in a Heroku container.
The back end API is powered by the Symfony web application framework using the Doctrine ORM.
The front end is a single-page application built with Angular and Bootstrap. The map is built with the Leaflet
JavaScript library, and incorporates map data from
OpenStreetMap and imagery from Mapbox. The interactive map overlays are created using county geometry provided by the
North Carolina Department of Environmental Quality, and COVID-19 reported case data from the United States Centers for
Disease Control and Prevention via the Socrata Open Data API.

## Live Demo
A live demo can be found at: http://data-viewer-rbm.herokuapp.com

The `bin/download` script is run daily using the Heroku Scheduler add-on to update the database with current data.

## Tools Used
- Heroku - https://www.heroku.com
- Apache 2.4 - https://www.apache.org
- PHP 7.4 - https://www.php.net
- PostgreSQL 13.2 - https://www.postgresql.org
- Composer 2.0 - https://getcomposer.org
- Symfony 5.2 - https://symfony.com 
- Doctrine 2.8 - https://www.doctrine-project.org
- Angular 9 - https://angular.io
- Bootstrap 3.4 - https://getbootstrap.com
- OpenStreetMap - https://www.openstreetmap.org
- Mapbox - https://www.mapbox.com
- Leaflet 1.7 - https://leafletjs.com

## Data Sources
- NC Counties | NC DEQ GIS Data 

    https://data-ncdenr.opendata.arcgis.com/datasets/nc-counties
    
- COVID-19 Case Surveillance Public Use Data with Geography | Data | Centers for Disease Control and Prevention

    https://data.cdc.gov/Case-Surveillance/COVID-19-Case-Surveillance-Public-Use-Data-with-Ge/n8mc-b4w4