//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope. Once we have done this, these variables are available for use by any function in the script
(function(){

//pseudo-global variables
var attrArray = ["Combined Stores: 2008", "Combined Stores: 2009","Combined Stores: 2010","Combined Stores: 2011","Combined Stores: 2012","Combined Stores: 2013","Combined Stores: 2014","Combined Stores: 2015","Combined Stores: 2016","Combined Stores: 2017","Dollar General Stores: 2008", "Dollar General Stores: 2009", "Dollar General Stores: 2010", "Dollar General Stores: 2011", "Dollar General Stores: 2012", "Dollar General Stores: 2013", "Dollar General Stores: 2014", "Dollar General Stores: 2015", "Dollar General Stores: 2016", "Dollar General Stores: 2017", "Dollar Tree Stores: 2008", "Dollar Tree Stores: 2009", "Dollar Tree Stores: 2010", "Dollar Tree Stores: 2011", "Dollar Tree Stores: 2012", "Dollar Tree Stores: 2013", "Dollar Tree Stores: 2014", "Dollar Tree Stores: 2015", "Dollar Tree Stores: 2016", "Dollar Tree Stores: 2017", "Family Dollar Stores: 2008", "Family Dollar Stores: 2009", "Family Dollar Stores: 2010", "Family Dollar Stores: 2011", "Family Dollar Stores: 2012", "Family Dollar Stores: 2013", "Family Dollar Stores: 2014", "Family Dollar Stores: 2015", "Family Dollar Stores: 2016", "Family Dollar Stores: 2017"]; //list of attributes
var expressed = attrArray[0]; //initial attribute

//chart frame dimensions
//Make the widths of the chart and map responsive to each other by setting each to a fraction of the browser window's innerWidth property, which reflects the internal width of the browser frame
var chartWidth = window.innerWidth * 0.4,
    chartHeight = 470,
    leftPadding = 35,
    rightPadding = 2,
    topBottomPadding = 3,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//create a scale to size bars proportionally to frame and for axis
var yScale = d3.scaleLinear()
    .range([chartHeight - 10, 0])
    .domain([0, 13*1.1]); // csv first column max = 1772 = number of stores in Texas


//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    
    //map frame dimensions
    //We can make the widths of the chart and map responsive to each other by setting each to a fraction of the browser window's innerWidth property, which reflects the internal width of the browser frame. the map frame width is set to 50% of the window.innerWidthproperty and the chart frame width is set to 42.5% (above). The 7.5% gap between the two frames will leave space for a margin on either side of the page and ensure a break point (the window width at which the chart falls below the map) that is in between common device display sizes
    var width = window.innerWidth * 0.525,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on US
    
    var projection = d3.geoAlbersUsa()
        //.center([1.81, 49.02])
        //.rotate([100.96, -2.72, 0])
        //.parallels([45.00, 69.42])
        .scale(1000)
        .translate([width / 2, height / 2]);
    
        //d3.geoAlbersUsa() projection already has Alaska & Hawaii at the bottom. I imagine this might look weird if you're using graticules. If you do this, you only need to include .translate & .scale. Per the Murray book, the default scale is 1,000, with anything smaller shrinking the map & anything larger expanding it.
        
        //var projection = d3.geoAlbers()
        //.center([-99, 40]) // specifies the [longitude, latitude] coordinates of the center of the plane.
        //.rotate([-2, 0]) // specifies the [longitude, latitude, and roll] angles by which to rotate the globe
        //.parallels([38, 62]) // specifies the two standard parallels of a conic projection. If the two array values are the same, the projection is a tangent case (the plane intersects the globe at one line of latitude); if they are different, it is a secant case (the plane intersects the globe at two lines of latitude, slicing through it)
        //.scale(200) // is a factor by which distances between points are multiplied, increasing or decreasing the scale of the map.
       // .translate([width / 2, height / 2]); //offsets the pixel coordinates of the projection's center in the <svg> container. Keep these as one-half the <svg> width and height to keep your map centered in the container

    var path = d3.geoPath()
        .projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];
    promises.push(d3.csv("data/all_dollarstores_state_stores_per100K.csv")); //load attributes from csv
    
    promises.push(d3.json("data/US_Can_Mex.topojson")); //load background spatial data
    
    promises.push(d3.json("data/US_States_0.topojson")); //load choropleth spatial data
    Promise.all(promises).then(callback);

    function callback(data){

        
        [csvData, n_america, usa] = data;

        //place graticule on the map
        // setGraticule(map, path);
     
        var us_States = topojson.feature(usa, usa.objects.ne_110m_admin_1_states_provinces).features;

        
        //add north america to map
        /*var countries = map.append("path")
            .datum(us_can_Mex)
            .attr("class", "countries")
            .attr("d", path);*/

        //console.log(csvData);
        
        //join csv data to GeoJSON enumeration units
        us_States = joinData(us_States, csvData);

        //create the color scale
        var colorScale = makeColorScale(csvData);

        //add enumeration units to the map
        setEnumerationUnits(us_States, map, path, colorScale);

        //add coordinated visualization to the map
        setChart(csvData, colorScale);

        // dropdown
        createDropdown(csvData);

    };
}; //end of setMap()

    
    

// function setGraticule(map, path){
//     //...GRATICULE BLOCKS FROM MODULE 8
//     //create graticule generator
//     var graticule = d3.geoGraticule()
//         .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

//     //create graticule background
//     var gratBackground = map.append("path")
//         .datum(graticule.outline()) //bind graticule background
//         .attr("class", "gratBackground") //assign class for styling
//         .attr("d", path) //project graticule

//     //create graticule lines	
//     var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
//         .data(graticule.lines()) //bind graticule lines data to each element to be created
//             .enter() //create an element for each datum
//         .append("path") //append each element to the svg as a path element
//         .attr("class", "gratLines") //assign class for styling
//         .attr("d", path); //project graticule lines
// };

function joinData(us_States, csvData){
    //...DATA JOIN LOOPS FROM EXAMPLE 1.1 (module 2-3)
    // these loops are used to accomplish the CSV to GeoJSON attribute data transfer which then returns the updated us_States GeoJSON features array
    //loop through csv to assign each set of csv attribute values to geojson region
    for (var i=0; i<csvData.length; i++){
        var csvRegion = csvData[i]; //the current region
        var csvKey = csvRegion.adm1_code; //the CSV primary key

        //loop through geojson regions to find correct region
        for (var a=0; a<us_States.length; a++){

            var geojsonProps = us_States[a].properties; //the current region geojson properties
            var geojsonKey = geojsonProps.adm1_code; //the geojson primary key

            //where primary keys match, transfer csv data to geojson properties object
            if (geojsonKey == csvKey){

                //assign all attributes and values
                attrArray.forEach(function(attr){
                    var val = parseFloat(csvRegion[attr]); //get csv attribute value; parseFloat is the JavaScript method to change the CSV strings into numbers as they are transferred 
                    geojsonProps[attr] = val; //assign attribute and value to geojson properties
                });
            };
        };
    };


    return us_States;
};

//Example 1.6 Natural Breaks color scale
function makeColorScale(data){
    var colorClasses = [
        "#ffffb2",
        "#fecc5c",
        "#fd8d3c",
        "#f03b20",
        "#bd0026"
    ];

    //create color scale generator
    var colorScale = d3.scaleThreshold()
        .range(colorClasses);

    //build array of all values of the expressed attribute
    var domainArray = [];
    for (var i=0; i<data.length; i++){
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };

    //cluster data using ckmeans clustering algorithm to create natural breaks. These clusters are returned in the form of a nested array, which you can see in the Console if you pass clusters to a console.log() statement.
    var clusters = ss.ckmeans(domainArray, 5);
    // reset the domainArray to a new array of break points, using JavaScript's .map() method to build a new array out of each cluster's minimum value. Since the threshold scale includes each break point in the class above it, we want our array of break points to be class minimums, which we select using d3.min()
    domainArray = clusters.map(function(d){
        return d3.min(d);
    });
    //The final step in formatting the domainArray is to remove the first value of the array using the JavaScript .shift() method, leaving the correct number of break points (4)—each of which is included by the class above it—in the domainArray
    //console.log(domainArray);
    domainArray.shift();

    //assign array of last 4 cluster minimums as domain
    colorScale.domain(domainArray);
    //console.log(domainArray);

    return colorScale;
};


//function to test for data value and return color. tests for the presence of each attribute value, returns the correct color class if it exists, and returns a neutral gray if it does not
function choropleth(props, colorScale){
    //make sure attribute value is a number
    var val = parseFloat(props[expressed]);
    //The conditional statement tests to see whether the expressed attribute value exists and is a real number using JavaScript's typeof operator and isNaN() function, and if so, applies the colorScale to it; if not, it returns a neutral gray
    if (typeof val == 'number' && !isNaN(val)){
        return colorScale(val);
    } else {
        return "#CCC";
    };
};


function setEnumerationUnits(us_States, map, path, colorScale){
    //...REGIONS BLOCK FROM MODULE 8
    //add France regions to map
    var regions = map.selectAll(".regions")
        .data(us_States)
        .enter()
        .append("path")
        .attr("class", function(d){
            return "regions " + d.properties.adm1_code;
        })
        .attr("d", path)
        //Applying the choropleth function within the regions block 
        .style("fill", function(d){
            return choropleth(d.properties, colorScale);
        })
    
    //console.log(d.properties);
    
        .on("mouseover", function(d){
           highlight(d.properties); //regions event listener
        })
           
        .on("mouseout", function(d){
            dehighlight(d.properties); //regions event listener
        })
    
        .on("mousemove", moveLabel); //regions event listener
    
    //below Example 2.2 line 16...add style descriptor to each path
    var desc = regions.append("desc")
    .text('{"stroke": "#000", "stroke-width": "0.5px"}');
};

//function to create coordinated bar chart
//The <rect> element is used to create rectangles in SVG graphics. To draw the bars, we will use four attributes of <rect>: width, height, x (the horizontal coordinate of the left side of the rectangle), and y(the vertical coordinate of the rectangle bottom)
//To make our bars, we need to build a new .selectAll() block that appends a rectangle to the chart container for each feature in the dataset, positions it, and sizes it according to its attribute value
    
function setChart(csvData, colorScale){

    //create a second svg element to hold the bar chart
    var chart = d3.select("body")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");

    //create a rectangle for chart background fill
    var chartBackground = chart.append("rect")
        .attr("class", "chartBackground")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);


    //set bars for each province
    var bars = chart.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .sort(function(a, b){
            return b[expressed]-a[expressed]
        })
        .attr("class", function(d){
            return "bar " + d.adm1_code;
        })
        //
        .attr("width", chartInnerWidth / csvData.length - 1)
        .on("mouseover", highlight) //a bars event listener
        .on("mouseout", dehighlight) //a bars event listener
        .on("mousemove", moveLabel); //a bars event listener
    
    //below Example 2.2 line 31...add style descriptor to each rect. the SVG <desc>  element, a simple element that only holds text content, remains invisible to the user, and can be appended to any other kind of SVG element. We can add a <desc> element containing a text description of the original style to each of our map's <path> elements and our chart's <rect> elements. each style descriptor string adheres to JSON format . This will make the information easier to parse in the dehighlight()function. Be aware that JSON formatting uses even stricter syntax than regular JavaScript: each property and value must be encased by double-quotes
    var desc = bars.append("desc")
    .text('{"stroke": "none", "stroke-width": "0px"}');

    //create a text element for the chart title
    var chartTitle = chart.append("text")
        .attr("x", 40)
        .attr("y", 40)
        .attr("class", "chartTitle")
        .text("Number of Variable " + expressed[3] + " in each region");

    //create vertical axis generator
    var yAxis = d3.axisLeft()
        .scale(yScale);

    //place axis
    var axis = chart.append("g")
        .attr("class", "axis")
        .attr("transform", translate)
        .call(yAxis);

    //create frame for chart border
    var chartFrame = chart.append("rect")
        .attr("class", "chartFrame")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);

    //set bar positions, heights, and colors
    updateChart(bars, csvData.length, colorScale);
}; //end of setChart()

//Example 1.1 line 1...function to create a dropdown menu for attribute selection
function createDropdown(csvData){
    //add select element
    var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, csvData)
        });
            //  .on()  operator listens for a "change" interaction on the <select> element. To .on, we pass an anonymous function, within which we call our new listener handler, changeAttribute(). The parameters of changeAttribute() are the value of the <select> element (referenced by "this"), which holds the attribute selected by the user, as well as our csvData. The csvData will be used to recreate the color scale. Note that we also need to add it as a parameter to the createDropdown() function and its function call within the callback() (~line 60)
            //Within changeAttribute(), we change the expressed attribute by simply assigning the user-selected attribute to the expressed pseudo-global variable class breaks. To recreate the color scale with new class breaks we repeat the call to makeColorScale(), passing the scale generator our csvData and assigning the returned scale to a new colorScale variable. To recolor each enumeration unit on the map, we create a selection of all enumeration units. Since these already have our GeoJSON data attached to them as a hidden property in the DOM, we can easily re-use their GeoJSON properties with the choropleth()function to reset each enumeration unit's fill attribute.

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select Year");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};

//Example 1.4 line 14...dropdown change listener handler
function changeAttribute(attribute, csvData){
    //change the expressed attribute
    expressed = attribute;


    // change yscale dynamically
    csvmax = d3.max(csvData, function(d) { return parseFloat(d[expressed]); });
    
    //create a scale to size bars proportionally to frame
    yScale = d3.scaleLinear()
        .range([chartHeight - 10, 0])
        .domain([0, csvmax*1.1]);

    //updata vertical axis 
    d3.select(".axis").remove();
    var yAxis = d3.axisLeft()
        .scale(yScale);

    //place axis
    var axis = d3.select(".chart")
        .append("g")
        .attr("class", "axis")
        .attr("transform", translate)
        .call(yAxis);
    

    //recreate the color scale
    var colorScale = makeColorScale(csvData);

    //recolor enumeration units
    var regions = d3.selectAll(".regions")
        .transition() //add animation to make changes more noticeable
        .duration(1000) // .duration() operator specifies a duration in milliseconds; hence the transition will last 1000 milliseconds or 1 second. The effect is to smoothly animate between colors when the color of each enumeration unit is changed in response to user input
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        });

    //re-sort, resize, and recolor bars
    // sorting the bars in either ascending or descending size order. This can be accomplished using D3's .sort() method to sort the data values
    //.sort() method, like the array sort method native to JavaScript, uses a comparator function to compare each value in the data array to the next value in the array and rearrange the array elements if the returned value is positive. Subtracting the second value from the first in the comparator function orders the bars from smallest to largest, making the chart more readable. Note that if you want to order the bars from largest to smallest, you can simply reverse the two values in the comparator function.
    var bars = d3.selectAll(".bar")
        //re-sort bars
        .sort(function(a, b){
            return b[expressed] - a[expressed];
            //use "return a[expressed]-b[expressed]" to sort largest to smallest 
        })
        .transition() //add animation
        .delay(function(d, i){
            return i * 20
        }) //add a .delay operator with an anonymous function that delays the start of animations 20 additional milliseconds for each bar in the sequence (lines 8-10). This gives the appearance that the bars consciously rearrange themselves
        .duration(500); //gives each bar half a second to complete its transition

    updateChart(bars, csvData.length, colorScale);
}; //When the bars selection is passed to updateChart(), the transition is passed with it, so that each of the changing attributes and the fill style are animated when the attribute changes

//function to position, size, and color bars in chart
function updateChart(bars, n, colorScale){
    //position bars
    bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
        //size/resize bars
        .attr("height", function(d, i){
            return 463 - yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d, i){
            return yScale(parseFloat(d[expressed])) + topBottomPadding;
        })
        //color/recolor bars
        .style("fill", function(d){
            return choropleth(d, colorScale);
        });
    
    //add text to chart title
    var chartTitle = d3.select(".chartTitle")
        .text("Number of Stores Per 100,000 People") 
};

//function to highlight enumeration units and bars by restyling the stroke of each. props is the properties object of the selected element from the GeoJSON data or the attributes object from the CSV data, depending on whether the selected element is an enumeration unit on the map or a bar on the chart 
function highlight(props){
    //change stroke
    var selected = d3.selectAll("." + props.adm1_code)
        .style("stroke", "blue")
        .style("stroke-width", "2");
    
    setLabel(props);
};

//function to reset the element style on mouseout. we can't pass one value for each style, since we are resetting both enumeration units and bars, which have different styles. Instead, each style calls an anonymous function, which in turn calls a separate getStyle() function to retrieve the information stored in the <desc> element for that style. The getStyle()function takes as parameters the current element in the DOM—represented by the keyword this—and the style property being manipulated . The results returned by getStyle() are passed along to the style object and in turn to the .style() operator, which applies them to each element. Within the getStyle() function, we retrieve the <desc> content by creating a selection of the current DOM element, selecting its <desc> element, and returning the text content using the .text() operator with no parameters . We then parse the JSON string to create a JSON object  and return the correct style property's value.

//This completes the dehighlight() function, which we can now add event listeners to call
    
    
    
function dehighlight(props){
    var selected = d3.selectAll("." + props.adm1_code)
        .style("stroke", function(){
            return getStyle(this, "stroke")
        })
        .style("stroke-width", function(){
            return getStyle(this, "stroke-width")
        });
    
    
    //below Example 2.4 line 21...To make sure our labels don't stack up in the DOM, we need to remove each new inof label on dehighlight
    d3.select(".infolabel")
        .remove();

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };
};

    console.log("wtf");
    
//function to create dynamic label, showing the attribute values for each region
function setLabel(props){
    //label content. we first create an HTML string containing an <h1> element with the selected attribute value and a <b> element with the attribute name
    var labelAttribute = "<h1>" + props[expressed] +
        "</h1><b>" + expressed + "</b>";

    //create info label div. we create the actual label <div> element, giving it class and id attributes and assigning our HTML string with the .html()operator. Finally, we add a child <div> to the label to contain the name of the selected region
    
    
    
    var infolabel = d3.select("body")
        .append("div")
        .attr("class", "infolabel")
        .attr("id", props.adm1_code + "_label")
        .html(labelAttribute);

    var regionadm1_code = infolabel.append("div")
        .attr("class", "labelname")
        .html(props.name);
};

//function to move info label with mouse (label follows the user's cursor)
//Example 2.8 line 1...function to move info label with mouse
    
    console.log("wtf");
function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".infolabel")
        .node() //to get the width of the label, we select the label then use the .node()  operator to return its DOM node
        .getBoundingClientRect() //return an object containing the size of the label, from which we access its width property. use this value to set the backup x coordinate that will shift the label to the left of the mouse when it approaches the right side of the page 
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 25;

    //horizontal label coordinate, testing for overflow (if the mouse gets too high or too far to the right, the label may overflow the page). After setting our default coordinates (x1 and y1) and backup coordinates (x2 and y2), we perform each overflow test, assigning the backup coordinates if the defaults would overflow the page, and the default coordinates if not. 
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
    
    //vertical label coordinate, testing for overflow (if the mouse gets too high or too far to the right, the label may overflow the page).After setting our default coordinates (x1 and y1) and backup coordinates (x2 and y2), we perform each overflow test, assigning the backup coordinates if the defaults would overflow the page, and the default coordinates if not. 
    var y = d3.event.clientY < 75 ? y2 : y1; 

    d3.select(".infolabel")
        .style("left", x + "px")
        .style("top", y + "px");
};
console.log("wtf");
})(); //last line of main.js