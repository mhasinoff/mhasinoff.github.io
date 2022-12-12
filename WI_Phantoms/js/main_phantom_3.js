//JS and Leaflet Step 1: Create Leaflet Map
  
//add ESRI Gray Map, OSM, ESRI World Imagery basemap tile layers

//starting center and zoom for map
var map = L.map('mapid', {
    center: [44.5, -89.6],
    zoom: 7,
    
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

//Add GeoJSON data

    //1.Verified UNincs JSON//
var bluecirclemarker = new L.Icon({iconUrl: 'img/bluecircle.png'});
function verified (feature, layer){
    layer.bindPopup("<p>Verified Uninc!</p><p>" + feature.properties.NAME + "</p>");
    layer.setIcon(bluecirclemarker);
};
//verifiedgeojson is the name of the GeoJSON js script in the js folder and in the index.html
L.geoJson(verifiedgeojson,{
    onEachFeature: verified
}).addTo(map);



    //2.Phantom Unincs//
var liteyellowcirclemarker = new L.Icon({iconUrl: 'img/liteyellowcircle.png'});
function phantoms (feature, layer){
    layer.bindPopup("<p>Verified Uninc</p><p>" + feature.properties.NAME + "</p>");
    layer.setIcon(liteyellowcirclemarker);
};
//phantomsgeojson is the name of the GeoJSON js script in the js folder and in the index.html
L.geoJson(phantomsgeojson,{
    onEachFeature: phantoms
}).addTo(map);



    //3.Phantoms To Explore Unincs//
var darkredcirclemarker = new L.Icon({iconUrl: 'img/darkred_circle.png'});
function phant2expl (feature, layer){
    layer.bindPopup("<p>Phantom To Explore</p><p>" + feature.properties.NAME + "</p>");
    layer.setIcon(darkredcirclemarker);
};
//phantoms2exploregeojson is the name of the GeoJSON js script in the js folder and in the index.html
L.geoJson(phantoms2exploregeojson,{
    onEachFeature: phant2expl
}).addTo(map);



    //4.Mikes Likely Phantoms//
var darkorangecirclemarker = new L.Icon({iconUrl: 'img/darkorange_circle.png'});
function mikeslikely (feature, layer){
    layer.bindPopup("<p>Mike's Likely Phantom</p><p>" + feature.properties.NAME + "</p>");
    layer.setIcon(darkorangecirclemarker);
};
//mikes_likely_phantoms is the name of the GeoJSON js script in the js folder and in the index.html
L.geoJson(mikes_likely_phantoms,{
    onEachFeature: mikeslikely
}).addTo(map);






    // var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	// attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	// maxZoom: 16
    // });
    
    // var osmMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    // });

    // var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	// attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    // });
             
    // var baseMaps = {
    //     "Grayscale": Esri_WorldGrayCanvas,
    //     "osmMap": osmMap,
    //     "Imagery": Esri_WorldImagery
    // };
    
    // var overlayMaps = {
    // "Areas for Further Study": cities
    // // "Verified Unincs": verifiedunincs,
    // // "Verified Phantoms": verifiedphantoms,
    // // "Phantoms To Explore": phantomstoexplore,
    // // "Likely Phantoms per GIS": likelyphantoms
    // };

    // // searchbar options
    // var options = {
    //     key: 'acbc763b23834593848c4113282cf193', // your OpenCage API key
    //     limit: 5, // number of results to be displayed
    //     position: 'topleft',
    //     placeholder: 'Search...', // the text in the empty search box
    //     errorMessage: 'Nothing found.',
    //     showResultIcons: false,
    //     collapsed: true,
    //     expand: 'click',
    //     addResultToMap: true, // if a map marker should be added after the user clicks a result
    //     onResultClick: undefined, // callback with result as first parameter
    //     resultExtension: {
    //         geohash: "annotations.geohash",
    //         what3words: "annotations.what3words",
    //         addressComponents: "components"
    //         } //if additional attributes from OpenCage search API should be added to the result
    // };

    // var buttons = [
    //     L.easyButton('<img src="img/noun_Home_731233_blk.svg">', function(){
    //         map.setView([37, -99], 4);
    //     },'Home',{ position: 'topleft'}),    
    //   ];   

      
    // //creates the control/icon
    // L.control.layers(baseMaps, overlayMaps).addTo(map);

    // // Add place searchbar to map
    // L.Control.openCageSearch(options).addTo(map);

    // // Add zoom control
    // // L.control.zoom({position: 'topleft'}).addTo(map);

    // // build easy bar from array of easy buttons
    // L.easyBar(buttons).addTo(map);
  
    // // Add easy button to pull up splash screen
    // L.easyButton('<img src="img/noun_Info_1845673_blk.svg">', function(){
    //     $('#splash-screen').modal('show');
    //     },'Background Info',{ position: 'topleft' }).addTo(map);

    // //Places attribution at lower right corner of map
    // L.control.attribution({position: 'bottomright'}).addTo(map); 
    
    // //call getData function
    // getData(map);




////////////////////////////////





    



        
// //convert markers to circle markers
// function pointToLayer(feature, latlng, attributes){
//     //Assign the current attribute based on the first index of the attributes array
//     var attribute = attributes[0];

//     //create marker options
//     var options = {
//         fillColor: "#152890",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.6
//     };

//     //For each feature, determine its value for the selected attribute
//     var attValue = Number(feature.properties[attribute]);

//     //Give each feature's circle marker a radius based on its attribute value
//     options.radius = calcPropRadius(attValue);

//     //create circle marker layer
//     var layer = L.circleMarker(latlng, options);

//     //line 1...in pointToLayer()
//     //create new popup
//     var popup = new Popup(feature.properties, attribute, layer, options.radius);

//     //add popup to circle marker
//     popup.bindToLayer();

//     //event listeners to open popup on hover and fill panel on click
//     layer.on({
//         mouseover: function(){
//             this.openPopup();
//         },
//         mouseout: function(){
//             this.closePopup();
//         }
//     });

//     //return the circle marker to the L.geoJson pointToLayer option
//     return layer;
// };

// //build an attributes array from the data
// function processData(data){
//     //create empty array to hold attributes
//     var attributes = [];

//     //properties of the first feature in the dataset
//     var properties = data.features[0].properties;
    
//     //push each attribute name into attributes array
//     for (var attribute in properties){
//         //only take attributes with population values
//         if (attribute.indexOf("Pop") > -1){
//             attributes.push(attribute);
//         };
//     };

//     return attributes;
// };

// //Add circle markers for point features to the map
// function createPropSymbols(data, map, attributes){
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: function(feature, latlng){
//             return pointToLayer(feature, latlng, attributes);
//         }
//     }).addTo(map);
// };



// //Import GeoJSON data, used https://odileeds.github.io/CSV2GeoJSON/ to convert csv to geojson
// function getData(map){
//     //load the data
//     $.ajax("data/DollarStores_likeMegaCities2.geojson", {
//         dataType: "json",
//         success: function(response){
//             //create an attributes array
//             var attributes = processData(response);
//             createPropSymbols(response, map, attributes);
//             createSequenceControls(map, attributes);
//             createLegend(map, attributes);
//         }
//     });
// };

//Splash Screen when start
$(window).on('load',function(){
    $('#splash-screen').modal('show');
});

// $(document).ready(createMap);