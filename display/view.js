var categories = ["ARSON", "ASSAULT", "BAD CHECKS", "BRIBERY", "BURGLARY", "DISORDERLY CONDUCT", "DRIVING UNDER THE INFLUENCE", "DRUG/NARCOTIC", "DRUNKENNESS", "EMBEZZLEMENT", "EXTORTION", "FAMILY OFFENSES", "FORGERY/COUNTERFEITING", "FRAUD", "GAMBLING", "KIDNAPPING", "LARCENY/THEFT", "LIQUOR LAWS", "LOITERING", "MISSING PERSON", "NON-CRIMINAL", "OTHER OFFENSES", "PORNOGRAPHY/OBSCENE MAT", "PROSTITUTION", "RECOVERED VEHICLE", "ROBBERY", "RUNAWAY", "SECONDARY CODES", "SEX OFFENSES, FORCIBLE", "SEX OFFENSES, NON FORCIBLE", "STOLEN PROPERTY", "SUICIDE", "SUSPICIOUS OCC", "TREA", "TRESPASS", "VANDALISM", "VEHICLE THEFT", "WARRANTS", "WEAPON LAWS"]

// Modified but originally from:
// http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(name, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', name, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
xobj.send(null);  
}

function sumArray(array1, array2) {
    var newArray = new Array(array1.length);
    for (var i = 0; i < array1.length; i++) {
        if (isNaN(array1[i]))
            newArray[i] = array2[i];
        else if (isNaN(array2[i]))
            newArray[i] = array1[i];
        else
            newArray[i] = array1[i]+array2[i];
    }
    return newArray;
}

var trolley;
var bart;
var cable;
var bus;

var x = new Array(1100);
x[0] = 5;

for (var i = 1; i < 1100; i++) {
    x[i] = x[i - 1] + 10;
}

var manager = new CanvasManager( {
    id: "graph",
    updatecycle: 10,
    drawcycle: 10,
});

var graph = manager.getManagedObject( new ScatterPlot( {
    x: 40,
    y: 35,
    width: 580,
    height: 400,
    canvas: manager.canvas,
    label: "Crime Data",
    xlabel: "Distance (m)",
    ylabel: "Counts per bucket",
    stroke: "#000000",
    xmin: 0,
    xmax: 11000,
    ymin: 0,
    ymax: 1000,
    xdiv: 10,
    ydiv: 10,
}));

manager.Initialize();

loadJSON("trolley.json", function(response) { 
    trolley = JSON.parse(response);
    checkLoad();
});
loadJSON("bart.json", function(response) { 
    bart = JSON.parse(response);
    checkLoad();
});
loadJSON("cable.json", function(response) { 
    cable = JSON.parse(response);
    checkLoad();
});
loadJSON("bus.json", function(response) { 
    bus = JSON.parse(response);
    checkLoad();
});

var loadedFiles = 0;
var checkLoad = function() {
    loadedFiles = loadedFiles + 1;
    if (loadedFiles == 4)
        console.log("Loaded JSON");
}

var modes = document.getElementById('modes');

function getCheckBox() {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.id = "id";
    return checkbox;
}

function getLabel(name) {
    var label = document.createElement('label')
    label.htmlFor = "id";
    label.appendChild(document.createTextNode(name));
    return label;
}

var trolleyBox = getCheckBox();
var bartBox = getCheckBox();
var busBox = getCheckBox();
var cableBox = getCheckBox();
modes.appendChild(trolleyBox);
modes.appendChild(getLabel("TROLLEY"));
modes.appendChild(bartBox);
modes.appendChild(getLabel("BART"));
modes.appendChild(busBox);
modes.appendChild(getLabel("BUS"));
modes.appendChild(cableBox);
modes.appendChild(getLabel("CABLE CAR"));

var container = document.getElementById('container2');
var checkboxes = new Array(categories.length);
// Populate
for (var i = 0; i < categories.length; i++) {
    var checkbox = getCheckBox();
    var label = getLabel(categories[i]);

    container.appendChild(checkbox);
    container.appendChild(label);
    checkboxes[i] = checkbox;
}

function getRelevantData(input) {
    var output = new Array(1100);
    for (var i = 0; i < categories.length; i++) {
        if (checkboxes[i].checked)
        {
            if (!input[categories[i]])
                alert(categories[i]);
            output = sumArray(output, input[categories[i]]);
        }
    }
    return output;
}

drawButton = function() {
    graph.clearDataSets();
    if (trolleyBox.checked) {
        graph.getDataSet(new PlotDataSet( {
            x: x,
            y: getRelevantData(trolley),
            color: "#F00",
            name: "trolley",
        }));
    }
    if (bartBox.checked) {
        graph.getDataSet(new PlotDataSet( {
            x: x,
            y: getRelevantData(bart),
            color: "#0F0",
            name: "bart",
        }));
    }
    if (cableBox.checked) {
        graph.getDataSet(new PlotDataSet( {
            x: x,
            y: getRelevantData(cable),
            color: "#008",
            name: "cable",
        }));
    }
    if (busBox.checked) {
        graph.getDataSet(new PlotDataSet( {
            x: x,
            y: getRelevantData(bus),
            color: "#AA0",
            name: "bus",
        }));
    }
    graph.autoSetMinMaxX();
    graph.autoSetMinMaxY();
}

checkAll = function() {
    checkboxes.forEach( function(e) { e.checked = true; } );
}