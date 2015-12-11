var categories = ["ARSON", "ASSAULT", "BAD CHECKS", "BRIBERY", "BURGLARY", "DISORDERLY CONDUCT", "DRIVING UNDER THE INFLUENCE", "DRUG/NARCOTIC", "DRUNKENNESS", "EMBEZZLEMENT", "EXTORTION", "FAMILY OFFENSES", "FORGERY/COUNTERFEITING", "FRAUD", "GAMBLING", "KIDNAPPING", "LARCENY/THEFT", "LIQUOR, LAWS", "LOITERING", "MISSING PERSON", "NON-CRIMINAL", "OTHER OFFENSES", "PORNOGRAPHY/OBSCENE MAT", "PROSTITUTION", "RECOVERED VEHICLE", "ROBBERY", "RUNAWAY", "SECONDARY CODES", "SEX OFFENSES, FORCIBLE", "SEX OFFENSES, NON FORCIBLE", "STOLEN PROPERTY", "SUICIDE", "SUSPICIOUS OCC", "TREA", "TRESPASS", "VANDALISM", "VEHICLE THEFT", "WARRANTS", "WEAPON LAWS"]

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
        newArray[i] = array1[i]+array2[i];
    }
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
    stroke: "#FFF",
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