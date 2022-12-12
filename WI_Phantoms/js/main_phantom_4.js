//JS and Leaflet Step 1: Create Leaflet Map
  
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



//Add GeoJSON data

    //1.Verified Unincs//
var bluecirclemarker = new L.Icon({iconUrl: 'img/bluecircle2.png'});

function verified (feature, layer){
    layer.bindPopup("<p><strong><h6>Previously Verified Uninc:</h6></strong></p><p><h6>" + feature.properties.NAME + "</h6></p>" + "<p><h7>Have a story or picture of " + feature.properties.NAME + "? Send it to <a href = 'mailto: mhasinoff@wisc.edu'> mhasinoff@wisc.edu </a> and we will put it on the map!</h7></p>");
    layer.setIcon(bluecirclemarker);
    // layer.on({
    //     mouseover: function(){
    //         this.openPopup();
    //     },
    //     mouseout: function(){
    //         this.closePopup();
    //     }
    // });
};
//verifiedgeojson is the name of the GeoJSON js script in the js folder and in the index.html
var verifiedunincs = L.geoJson(verifiedgeojson,{
    onEachFeature: verified
});



    //2.Phantom Unincs//
var greycirclemarker = new L.Icon({iconUrl: 'img/greycircle2.png'});
function phantoms (feature, layer){
    layer.bindPopup("<p><strong><h6>Verified Phantom:</h6></strong></p><p><h6>" + feature.properties.NAME + "</h6></p>" + "<p><h7>Have a story or picture of " + feature.properties.NAME + "? Send it to <a href = 'mailto: mhasinoff@wisc.edu'> mhasinoff@wisc.edu </a> and we will put it on the map!</h7></p>");
    layer.setIcon(greycirclemarker);
    // layer.on({
    //     mouseover: function(){
    //         this.openPopup();
    //     },
    //     mouseout: function(){
    //         this.closePopup();
    //     }
    // });
};
//phantomsgeojson is the name of the GeoJSON js script in the js folder and in the index.html
var verifiedphantoms = L.geoJson(phantomsgeojson,{
    onEachFeature: phantoms
});



    //3.Phantoms To Explore Unincs//
var darkredcirclemarker = new L.Icon({iconUrl: 'img/darkred_circle2.png'});
function phant2expl (feature, layer){
    layer.bindPopup("<p><strong><h6>Possible Phantom To Be Explored:</h6></strong></p><p><h6>" + feature.properties.NAME + "</h6></p>" + "<p><h7>Have a story or picture of " + feature.properties.NAME + "? Send it to <a href = 'mailto: mhasinoff@wisc.edu'> mhasinoff@wisc.edu </a> and we will put it on the map!</h7></p>");
    layer.setIcon(darkredcirclemarker);
    // layer.on({
    //     mouseover: function(){
    //         this.openPopup();
    //     },
    //     mouseout: function(){
    //         this.closePopup();
    //     }
    // });
};
//phantoms2exploregeojson is the name of the GeoJSON js script in the js folder and in the index.html
var phantoms2expl = L.geoJson(phantoms2exploregeojson,{
    onEachFeature: phant2expl
});



    //4.Mikes Likely Phantoms//
var liteyellowcirclemarker = new L.Icon({iconUrl: 'img/liteyellowcircle2.png'});
function mikeslikely (feature, layer){
    layer.bindPopup("<p><strong><h6>Mike's Likely Phantom:</h6></strong></p><p><h6>" + feature.properties.NAME + "</h6></p>" + "<p><h7>Have a story or picture of " + feature.properties.NAME + "? Send it to <a href = 'mailto: mhasinoff@wisc.edu'> mhasinoff@wisc.edu </a> and we will put it on the map!</h7></p>");
    layer.setIcon(liteyellowcirclemarker);
    // layer.on({
    //     mouseover: function(){
    //         this.openPopup();
    //     },
    //     mouseout: function(){
    //         this.closePopup();
    //     }
    // });
};
//mikes_likely_phantoms is the name of the GeoJSON js script in the js folder and in the index.html
var likelyphantoms = L.geoJson(mikes_likely_phantoms,{
    onEachFeature: mikeslikely
});

//starting center and zoom for map
var map = L.map('mapid', {
    center: [44.5, -89.6],
    zoom: 7,
    layers: [Esri_WorldGrayCanvas, verifiedunincs, verifiedphantoms, phantoms2expl, likelyphantoms],
    attributionControl: false
});

var baseMaps = {
    "Grayscale Map": Esri_WorldGrayCanvas,
    "Open Street Map": osmMap,
    "Satellite Imagery": Esri_WorldImagery
};

var overlayMaps = {
    "Verified Unincs <img src = 'img/bluecircle2.png'/>": verifiedunincs,
    "Verified Phantoms <img src = 'img/greycircle2.png'/>": verifiedphantoms,
    "Likely Phantoms <img src = 'img/liteyellowcircle2.png'/>": likelyphantoms,
    "Phantoms To Explore <img src = 'img/darkred_circle2.png'/>": phantoms2expl  
};

//creates the control/icon
const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// searchbar options
var options = {
    key: 'c1db2f87003e466cbc46ff85f77c33bc', // my OpenCage API key from opencagedata.com, using github as login info
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
       map.setView([44.4, -90.1], 7);
       },'Home',{ position: 'topleft'}),    
        ];   
      
// Add place searchbar to map
L.Control.openCageSearch(options).addTo(map);

// build easy bar from array of easy buttons
L.easyBar(buttons).addTo(map);
  
// Add easy button to pull up splash screen
L.easyButton('<img src="img/noun_Info_1845673_blk.svg">', function(){
    $('#splash-screen').modal('show');
    },'Background Info',{ position: 'topleft' }).addTo(map);

//Places attribution at lower right corner of map
L.control.attribution({position: 'bottomright'}).addTo(map); 



//Splash Screen when start
$(window).on('load',function(){
    $('#splash-screen').modal('show');
});

