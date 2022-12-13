var map = L.map('mapid', {
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
    L.easyButton('<img src="img/noun_Home_731233_blk.svg">', function(){
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

    // Add easy button to pull up splash screen
    L.easyButton('<img src="img/noun_Info_1845673_blk.svg">', function(){
        $('#splash-screen').modal('show');
    },'info window',{ position: 'topleft' }).addTo(map);

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

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 5;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//Popup constructor function
function Popup(properties, attribute, layer, radius){
        this.properties = properties;
    this.layer = layer;

    // define the start year property
    var staryYearProp = "Pop_2008";
    var startYear = staryYearProp.split("_")[1];
    var startStoreCount = this.properties[staryYearProp];

    // get the end year property
    var endYearProp = attribute;
    var endYear = endYearProp.split("_")[1];
    var endStoreCount = this.properties[endYearProp];

    // calculate the difference and percentage change
    var storeChange = endStoreCount - startStoreCount;
    var percentChange = ((storeChange/startStoreCount)*100).toFixed(2);

    // Is it an increase or decrease?
    var changeWord = " Increase";
    if (storeChange < 0) {
        changeWord = " Decrease";
    }

    // Opening page shows 2008 figures where no data change has happened yet. Any change would show as zero.
    if (startYear == endYear) {
        this.content = "<p><b>" + this.properties.City + "</b></p><p> had " + startStoreCount + " stores in 2008.</p>";

    // else what the change in data is from 2008 to displayed year
    } else { 
      this.content = "<p><b>" + this.properties.City + "</b></p><p> had an " + changeWord.toLowerCase() + " of " + storeChange + " stores, from " + startStoreCount + " to " + endStoreCount + " (" + percentChange + "%" + changeWord.toLowerCase() + ")<i> from " + startYear + "-" + endYear + ".</i></p>";
    }

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        });
    };
};
        
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

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //Example 1.3 line 6...in UpdatePropSymbols()
            var popup = new Popup(props, attribute, layer, radius);

            //add popup to circle marker
            popup.bindToLayer();
        };
    });

    updateLegend(map, attribute);
};

function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            //Example 3.5 line 15...Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';

            //object to base loop on...replaces Example 3.10 line 1
            var circles = {
                max: 20,
                mean: 40,
                min: 60
            };

            //loop to add each circle and text to svg string
            for (var circle in circles){
                //circle string
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#152890" fill-opacity="0.6" stroke="#000000" cx="30"/>';

                //text string
                svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            };

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};


//Example 3.7 line 1...Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.split("_")[1];
    var content = "Number of Dollar Stores in " + year;

    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);

    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 59 - radius,
            r: radius
        });

        //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
    };
};

//Slider control
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');

            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    map.addControl(new SequenceControl());

	//set slider attributes
	$('.range-slider').attr({
		max: 9,
		min: 0,
		value: 0,
		step: 1
	});

	//replace button content with images
    //Arrow Right by Kiran Shastry from the Noun Project

	$('#reverse').html('<img src="img/Left_Arrow_20px.png">');
	$('#forward').html('<img src="img/Right_Arrow_20px.png">');

	//click listener for buttons
	$('.skip').click(function(){

		//get the old index value
		var index = $('.range-slider').val();

		//increment or decriment depending on button clicked
		if ($(this).attr('id') == 'forward'){
			index++;
			//if past the last attribute, wrap around to first attribute
			index = index > 9 ? 0 : index;
		} else if ($(this).attr('id') == 'reverse'){
			index--;
			//if past the first attribute, wrap around to last attribute
			index = index < 0 ? 9 : index;
		};

		//update slider
		$('.range-slider').val(index);

		//pass new attribute to update symbols
		updatePropSymbols(map, attributes[index]);
	});

	//input listener for slider
	$('.range-slider').on('input', function(){
		//get the new index value
		var index = $(this).val();

		//pass new attribute to update symbols
		updatePropSymbols(map, attributes[index]);
	});
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