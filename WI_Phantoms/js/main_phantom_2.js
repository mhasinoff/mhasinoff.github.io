//JS and Leaflet Step 1: Create Leaflet Map
function createMap(){
    //cities for city layer
    var austin = L.marker([30.2672, -97.7431], {title:'Austin, TX'}),
    baltimore    = L.marker([39.2904, -76.6122], {title:'Baltimore, MD'}),
    birmingham    = L.marker([33.5186, -86.8104], {title:'Birmingham, AL'}),
    bridgeport    = L.marker([41.1792, -73.1894], {title:'Bridgeport, CT'}),
    buffalo = L.marker([42.8864, -78.8784], {title:'Buffalo, NY'}),
    cincinnati    = L.marker([39.1031, -84.5120], {title:'Cincinnatti, OH'}),
    cleveland    = L.marker([41.4993, -81.6944], {title:'Cleveland, OH'}),
    des_moines    = L.marker([41.5868, -93.6250], {title:'Des Moines, IA'}),
    hartford = L.marker([41.7658, -72.6734], {title:'Hartford, CT'}),
    kansas_city    = L.marker([39.0997, -94.5786], {title:'Kansas City, MO'}),
    knoxville    = L.marker([35.9606, -83.9207], {title:'Knoxville, TN'}),
    las_vegas    = L.marker([36.1699, -115.1398], {title:'Las Vegas, NV'}),
    louisville = L.marker([38.2527, -85.7585], {title:'Louisville, KY'}),
    memphis    = L.marker([35.1495, -90.0490], {title:'Memphis, TN'}),
    nashville    = L.marker([36.1627, -86.7816], {title:'Nashville, TN'}),
    oklahoma_city    = L.marker([35.4676, -97.5164], {title:'Oklahoma City, OK'}),
    omaha = L.marker([41.2565, -95.9345], {title:'Omaha, NB'}),
    pittsburgh    = L.marker([40.4406, -79.9959], {title:'Pittsburgh, PA'}),
    providence    = L.marker([41.8240, -71.4128], {title:'Providence, RI'}),
    rochester    = L.marker([43.1566, -77.6088], {title:'Rochester, NY'}),
    salt_lake_city    = L.marker([40.7608, -111.8910], {title:'Salt Lake City, UT'}),
    san_antonio    = L.marker([29.4241, -98.4936], {title:'San Antonio, TX'}),
    tucson    = L.marker([32.2226, -110.9747], {title:'Tucson, AZ'}),
    wichita    = L.marker([37.6872, -97.3301], {title:'Wichita, KS'}),
    worchester    = L.marker([42.2626, -71.8023], {title:'Worchester, MA'});
    
    //Cities put into a layergroup class
    var cities = L.layerGroup([austin, baltimore, birmingham, bridgeport, buffalo, cincinnati, cleveland, des_moines, hartford, kansas_city, knoxville, las_vegas, louisville, memphis, nashville, oklahoma_city, omaha, pittsburgh, providence, rochester, salt_lake_city, san_antonio, tucson, wichita, worchester]);
    
    //add ESRI Gray Map, OSM, ESRI World Imagery basemap tile layers
    
    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
    });
    
    var osmMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });

    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    //starting center and zoom for map
    var map = L.map('mapid', {
        center: [44.5, -89.6],
        zoom: 7,
        layers: [Esri_WorldGrayCanvas, cities]
    });
    
    var baseMaps = {
        "Grayscale": Esri_WorldGrayCanvas,
        "osmMap": osmMap,
        "Imagery": Esri_WorldImagery
    };
    
    var overlayMaps = {
    "Areas for Further Study": cities
    // "Verified Unincs": verifiedunincs,
    // "Verified Phantoms": verifiedphantoms,
    // "Phantoms To Explore": phantomstoexplore,
    // "Likely Phantoms per GIS": likelyphantoms
    };

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

    var buttons = [
        L.easyButton('<img src="img/noun_Home_731233_blk.svg">', function(){
            map.setView([37, -99], 4);
        },'Home',{ position: 'topleft'}),    
      ];   

      
    //creates the control/icon
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Add place searchbar to map
    L.Control.openCageSearch(options).addTo(map);

    // Add zoom control
    // L.control.zoom({position: 'topleft'}).addTo(map);

    // build easy bar from array of easy buttons
    L.easyBar(buttons).addTo(map);
  
    // Add easy button to pull up splash screen
    L.easyButton('<img src="img/noun_Info_1845673_blk.svg">', function(){
        $('#splash-screen').modal('show');
        },'Background Info',{ position: 'topleft' }).addTo(map);

    //Places attribution at lower right corner of map
    L.control.attribution({position: 'bottomright'}).addTo(map); 
    
    //call getData function
    getData(map);
};



////////////////////////////////




//     var map = L.map('mapid', {
//  center: [37, -99],
//     zoom: 4,
//     maxZoom: 16,
//     attributionControl: false,
//     zoomControl: false
// })

    

// easy buttons for navigation


//Step 1: Create the Leaflet map
// function createMap(){

//     // Add place searchbar to map
//     L.Control.openCageSearch(options).addTo(map);

    // Add zoom control (but in top left)
    // L.control.zoom({
    //     position: 'topleft'
    // }).addTo(map);

//         // build easy bar from array of easy buttons
//     L.easyBar(buttons).addTo(map);

//     // Add easy button to pull up splash screen
//     L.easyButton('<img src="img/noun_Info_1845673_blk.svg">', function(){
//         $('#splash-screen').modal('show');
//     },'Background Info',{ position: 'topleft' }).addTo(map);

//     L.easyButton('<img src="img/noun-photograph-5087768.svg">', function(){
//         map.setView([37, -99], 4);
//     },'Add Your Story',{ position: 'topleft'}),
    

//     //load tile layer
//     L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
// 	    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
//     }).addTo(map);

    // L.control.attribution({
    //     position: 'bottomright'
    // }).addTo(map);
    //call getData function
//     getData(map);
// };


        
//convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];

    //create marker options
    var options = {
        fillColor: "#152890",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //line 1...in pointToLayer()
    //create new popup
    var popup = new Popup(feature.properties, attribute, layer, options.radius);

    //add popup to circle marker
    popup.bindToLayer();

    //event listeners to open popup on hover and fill panel on click
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//build an attributes array from the data
function processData(data){
    //create empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};



//Import GeoJSON data, used https://odileeds.github.io/CSV2GeoJSON/ to convert csv to geojson
function getData(map){
    //load the data
    $.ajax("data/DollarStores_likeMegaCities2.geojson", {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var attributes = processData(response);
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
        }
    });
};

//Splash Screen when start
$(window).on('load',function(){
    $('#splash-screen').modal('show');
});

$(document).ready(createMap);