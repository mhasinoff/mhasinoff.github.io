/* MAP3_COUNTY_main.js for Geog575 Final Project, MAP 3 - STATES - Dollar Chains; April 2021*/

var map = L.map('map', {
    center: [37, -99],
    zoom: 4,
    maxZoom: 16,
    attributionControl: false,
    zoomControl: false
})

// searchbar options
var options = {
    key: 'acbc763b23834593848c4113282cf193', // your OpenCage API key
    limit: 5, // number of results to be displayed
    position: 'topleft',
    placeholder: 'Search...', // the text in the empty search box
    errorMessage: 'Nothing found.',
    showResultIcons: false,
    collapsed: true,
    expand: 'click',
    addResultToMap: true, // if a map marker should be added after the user clicks a result
    onResultClick: undefined, // callback with result as first parameter
    resultExtension: {
        geohash: "annotations.geohash",
        what3words: "annotations.what3words",
        addressComponents: "components"
    } //if additional attributes from OpenCage search API should be added to the result
};

// easy buttons for navigation
var buttons = [
    L.easyButton('<img src="../../img/noun_Home_731233_blk.svg">', function(){
        map.setView([37, -99], 4);
    },'Home',{ position: 'topleft'}),
  
    L.easyButton('<span>AK</span>', function(){
        map.setView([65.144912, -152.541399], 3.5);
    },'Alaska',{ position: 'topleft' }),
  
    L.easyButton('<span>HI</span>', function(){
        map.setView([20.891499, -156.89], 6.75);
    },'Hawaii',{ position: 'topleft' }),
  ];

//Step 1: Create the Leaflet map
function createMap(){

    // Add place searchbar to map
    L.Control.openCageSearch(options).addTo(map);

    // Add zoom control (but in top right)
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // build easy bar from array of easy buttons
    L.easyBar(buttons).addTo(map);

    //load tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    }).addTo(map);

    L.control.attribution({
        position: 'bottomright'
    }).addTo(map);
    //call getData function
    getData(map);
};

  //Retrieve the GeoJSON data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/counties_indicators.geojson", {
        dataType: "json",
        success: function(data){
 
            function getColor(d) {
                return  d > 60  ? '#800026' :
                        d > 45  ? '#BD0026' :
                        //d > 50  ? '#E31A1C' :
                        d > 30  ? '#FC4E2A' :
                        d > 20  ? '#FD8D3C' :
                        //d > 20  ? '#FEB24C' :
                        d > 10  ? '#FED976' :
                        '#FFEDA0';
            } //end getColor()
            
            
            //create a legend
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 10, 20, 30, 45, 60],
                    labels = [];

                // loop through our density intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%' + '<br>' : '+ %');
                }
                return div;
            };
            
            legend.addTo(map);
            
            //the info control
            var info = L.control({position:'topright'});
            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                //this.update(); //this line removed from Leaflet tutorial example
                return this._div;
            };
            
            info.addTo(map); //this line added to the Leaflet tutorial example


//BUTTON FUNCTION CONTROLS   
            
            // setup OBESITY button click event
            $("#obese").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                 var attribute = ["Obese"];               

                // add 'active' class to the clicked button
                $(this).addClass('active');

            
                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        strokecolor: "#000000",
                        dashArray: '3',
                        fillOpacity: 1
                    };
                } //end style()
                
                var geojson;
                
                //create highlight of state/county when hover
                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 1
                    });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                    
                    info.update(layer.feature.properties);
                }
                
                //reset style after move past state/county
                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }
                
                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
                
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                
                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }
                
                //buttonOperator(map, data, attribute); //NOT WORKING YET
                
                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {
                    this._div.innerHTML = '<h4>Obese Adults</h4>' +  (props ?
                        '<b>' + props.County + ' County,' + props.State + '</b><br />' + props[attribute] + '% of adults'
                        : 'Hover over a county to see percentage of total'
                                                                     );
                };
                info.update()
            });            
            
            
            // setup LOW-INCOME button click event
            $("#lowIncome").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Low-Income Households"]

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        strokecolor: "#000000",
                        dashArray: '3',
                        fillOpacity: 1
                    };
                } //end style()
                
                var geojson;
                
                //create highlight of state/county when hover
                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 1
                    });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                    
                    info.update(layer.feature.properties);
                }
                
                //reset style after move past state/county
                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }
                
                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
                
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                
                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Low-Income Households</h4>' +  (props ?
                        '<b>' + props.County + ' County,' + props.State + '</b><br />' + props[attribute] + '% of households'
                        : 'Hover over a county to see percentage of total');
                };
                info.update()

            });
            
            // setup CAR-FREE button click event
            $("#carFree").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Car-Free Households"]; 

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        strokecolor: "#000000",
                        dashArray: '3',
                        fillOpacity: 1
                    };
                } //end style()
                
                var geojson;
                
                //create highlight of state/county when hover
                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 1
                    });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                    
                    info.update(layer.feature.properties);
                }
                
                //reset style after move past state/county
                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }
                
                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
                
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                
                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Car-Free Households</h4>' +  (props ?
                        '<b>' + props.County + ' County,' + props.State + '</b><br />' + props[attribute] + '% of households'
                        : 'Hover over a county to see percentage of total');
                };
                info.update()

            });            
 
            // setup DIABETES button click event
            $("#diabetes").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Diabetes"]; 

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        strokecolor: "#000000",
                        dashArray: '3',
                        fillOpacity: 1
                    };
                } //end style()
                
                var geojson;
                
                //create highlight of state/county when hover
                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 1
                    });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                    
                    info.update(layer.feature.properties);
                }
                
                //reset style after move past state/county
                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }
                
                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
                
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                
                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Diabetic Adults</h4>' +  (props ?
                        '<b>' + props.County + ' County,' + props.State + '</b><br />' + props[attribute] + '% of adults'
                        : 'Hover over a county to see percentage of adults');
                };
                info.update()

            });            

            // setup COMBINED SCORE button click event 
            $("#combinedScore").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Combined Score"]; 

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        strokecolor: "#000000",
                        dashArray: '3',
                        fillOpacity: 1
                    };
                } //end style()
                
                var geojson;
                
                //create highlight of state/county when hover
                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                        weight: 5,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 1
                    });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                    
                    info.update(layer.feature.properties);
                }
                
                //reset style after move past state/county
                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }
                
                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }
                
                geojson = L.geoJson(data, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                
                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Combined Poverty Score</h4>' +  (props ?
                        '<b>' + props.County + ' County,' + props.State + '</b><br />' + props[attribute] + '% of population'
                        : 'Hover over a county to see percentage');
                };
                info.update()

            });
            
            
            // trigger the button click for the default view
            $("#lowIncome").trigger('click');
        }            
    });
    
    //call function to create Marker Clusters
    createMarkerClusters(map);
    
    //call function to create overlays - NOT ACTIVE
    //createOverlays(map);
    
    //call function to define button operations - NOT FULLY WORKING
    //function buttonOperator(map, data, attribute)

}//end getData()

$(document).ready(createMap);


//creates Marker Clusters
function createMarkerClusters(map){
    var markers = L.markerClusterGroup();

    var dollGenIcon = L.icon({
        iconUrl: 'img/dollGenMarker.png',
        iconSize:     [40, 64], // size of the icon
        iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [20, -40] // point from which the popup should open relative to the iconAnchor
    });

    var dollTreeIcon = L.icon({
        iconUrl: 'img/dollTreeMarker.png',
        iconSize:     [40,64], // size of the icon
        iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [20, -40] // point from which the popup should open relative to the iconAnchor
    });     

    var famDollarIcon = L.icon({
        iconUrl: 'img/famDollarMarker.png',
        iconSize:     [40,64], // size of the icon
        iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [20, -40] // point from which the popup should open relative to the iconAnchor
    });     

    for (var i = 0; i < allStorePoints.length; i++) {
        var a = allStorePoints[i];
        var myIcon;            
            if (a[5] == "Dollar General") {
              myIcon = dollGenIcon;
            } else if (a[5] == "Dollar Tree") {
              myIcon = dollTreeIcon;
            } else {
              myIcon = famDollarIcon;
            }
        var marker = L.marker(new L.LatLng(a[6], a[7]), {icon: myIcon
        });
        var title = '<b>' + a[0] + '</b><br />' + a[1] + '<br />' + a[2] + ', ' + a[3] + ' ' + a[4];
        marker.bindPopup(title);
        //event listeners to open popup on hover
        marker.on({
            mouseover: function(){
                this.openPopup();
            },
            mouseout: function(){
                this.closePopup();
            }
        });
        markers.addLayer(marker);
    }
    map.addLayer(markers);
} //end createMarkerClusters


//function to remove duplication of button actions - NEED TO FIGURE OUT HOW TO ADAPT 'e.target' TO WORK OUTSIDE OF SPECIFIC BUTTON FUNCTIONS
/*function buttonOperator(map, data, attribute){
    // add 'active' class to the clicked button
    $(this).addClass('active');  
    
    function getColor(d) {
    return  d > 40 ? '#800026' :
            d > 35  ? '#BD0026' :
            d > 30  ? '#E31A1C' :
            d > 25  ? '#FC4E2A' :
            d > 20   ? '#FD8D3C' :
            d > 15   ? '#FEB24C' :
            d > 10   ? '#FED976' :
            '#FFEDA0';
    } //end getColor()
    
    //style the choropleth units
    function style(feature) {
        return {
            fillColor: getColor(Number(feature.properties[attribute])),
            weight: 2,
            opacity: 1,
            color: 'white',
            strokecolor: "#000000",
            dashArray: '3',
            fillOpacity: 0.7
        };
    } //end style()

    var geojson;

    //create highlight of state/county when hover
    function highlightFeature(e) {
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

        info.update(layer.feature.properties);
    }

    //reset style after move past state/county
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
} //end buttonOperator()
*/

//Create overlays for dollar store chain - WORKS BUT NOT USING. ALSO NEED TO RESOLVE STATE/COUNTY FILL COVERING MARKERS ON RESTYLE AFTER HOVER EVENT
/*function createOverlays(map){
    
    //create Dollar Tree layer
    var dollarTreeData = 'data/all_DollarTree.geojson';    
    var dollarTreeStores = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {		
				return L.circleMarker(latlng, {
				radius: 4,
				opacity: .5,
                fillColor: 'orange',    
				fillOpacity: 0.8
				});
            },	
    });
    
    //create Dollar General layer
    var dollarGenData = 'data/all_DollarGeneral.geojson';    
    var dollarGenStores = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {		
				return L.circleMarker(latlng, {
				radius: 4,
				opacity: .5,
                fillColor: 'purple',    
				fillOpacity: 0.8
				});
            },	
    });
    
    //create Family Dollar layer
    var famDollarData = 'data/all_FamilyDollar.geojson';    
    var famDollarStores = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {		
				return L.circleMarker(latlng, {
				radius: 4,
				opacity: .5,
                fillColor: 'green',    
				fillOpacity: 0.8
				});
            },	
    });
    
    $.getJSON(dollarTreeData, function(dataDT) {
        return dollarTreeStores.addData(dataDT);
	});	
    
     $.getJSON(dollarGenData, function(dataDG) {
        return dollarGenStores.addData(dataDG);
	});
     
    $.getJSON(famDollarData, function(dataFD) {
        return famDollarStores.addData(dataFD);
	});	
    
    var overlays = {
        "Dollar Tree": dollarTreeStores,
        "Dollar General": dollarGenStores,
        "Family Dollar": famDollarStores
    };
    
    L.control.layers(null, overlays).addTo(map);
	//});   
} end createOverlays
*/
    