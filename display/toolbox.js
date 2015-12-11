// Canvas Toolbox v0.03
// (c) Nicole Caroline Branagan 2015
// Released under the terms of the MIT (X11) license
//

// CanvasManager
// Manages a canvas object
// Set functions _update, _draw, _onClick, _offClick, _mouseMove

function CanvasManager(options) {
    this.canvas = document.getElementById(options.id);
    this.updatecycle = options.updatecycle || options.cycle || 10;
    this.drawcycle = options.drawcycle || options.cycle || options.updatecycle;
    
    this.managedObjects = new Array();
}

CanvasManager.prototype._draw = function() {
    var context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.draw)
        this.draw(context);
    
    this.managedObjects.forEach(function (e) {e.draw(context)});
    
    var self = this;
    setTimeout(function() { self._draw.apply(self); }, this.drawcycle);
}

CanvasManager.prototype._update = function () {
    var self = this;
    if (this.update)
        this.update();
    setTimeout(function() { self._update.apply(self); }, this.updatecycle);
}

CanvasManager.prototype.Initialize = function() {
    var self = this;
    setTimeout(function() { self._draw.apply(self); }, this.drawcycle);
    setTimeout(function() { self._update.apply(self); }, this.updatecycle);
    this.canvas.addEventListener("mousedown", function(e) { self._onClick.apply(self, [e]) }, false);
    this.canvas.addEventListener("mouseup", function(e) { self._offClick.apply(self, [e]) }, false);
    this.canvas.addEventListener("mousemove", function(e) { self._mouseMove.apply(self, [e]) }, false);
}

CanvasManager.prototype.getManagedObject = function(obj) {
    if (obj) {
        obj.canvas = this.canvas;
        this.managedObjects.push(obj);
        return obj;
    }
}

CanvasManager.prototype._onClick = function(event) {
    var clicked = false;
    this.managedObjects.forEach(function (e) {
        var check = e.onClick(event)
        clicked = check || clicked;
    });
    if (!clicked && this.onClick)
        this.onClick(event);
}

CanvasManager.prototype._offClick = function(event) {
    if (this.offClick)
        this.offClick(event);
    this.managedObjects.forEach(function (e) {e.offClick(event)});
}

CanvasManager.prototype._mouseMove = function(event) {
    var handled = false;
    this.managedObjects.forEach(function (e) {
        var check = e.mouseMove(event)
        handled = check || handled;
    });
    if (!handled && this.mouseMove)
        this.mouseMove(event);
}

// Button
// A managed object that calls a certain function when clicked

function Button(options) {
	this.x = options.x;
	this.y = options.y;
	this.w = options.width;
	this.h = options.height;
	this.label = options.label || "";
        this.canvas = options.canvas;
        this.clicked = false;
        this.mouseover = false;
	
	this.clickFunction = options.clickFunction;
}

Button.prototype.draw = function(context) {
	context.beginPath();
	context.rect(this.x, this.y, this.w, this.h);
        if (this.clicked)
            context.fillStyle = '#555';
        else if (this.mouseover)
            context.fillStyle = '#BBB';
        else
            context.fillStyle = 'white';
	context.fill();
	context.lineWidth = 3;
	context.strokeStyle = 'grey';
	context.stroke();
	
	context.fillStyle="black";
	context.font = "15px serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(this.label,this.x + (this.w/2),this.y + (this.h/2));
	context.textAlign = "center";
}

Button.prototype.onClick = function(event) {
	var x = event.pageX - this.canvas.offsetLeft;
	var y = event.pageY - this.canvas.offsetTop;
	
	if ((x > this.x) && (x < (this.x + this.w)) && 
			(y > this.y) && (y < (this.y + this.h))) {
		this.clickFunction();
        	this.clicked = true;
                return true;
	}
	else
            return false;
}

Button.prototype.offClick = function(event) {
    this.clicked = false;
}

Button.prototype.mouseMove = function(event) {
    var x = event.pageX - this.canvas.offsetLeft;
    var y = event.pageY - this.canvas.offsetTop;
    
    if ((x > this.x) && (x < (this.x + this.w)) && 
                    (y > this.y) && (y < (this.y + this.h))) {
            this.mouseover = true;
            return true;
    }
    else
    {
        this.mouseover = false;
        this.clicked = false;
        return false;
    }
}

// ScatterPlot
// A simple plot

function ScatterPlot(options) {
	this.x = options.x;
	this.y = options.y;
	this.w = options.width;
	this.h = options.height;
        this.label = options.label || "";
	this.xlabel = options.xlabel || "";
	this.ylabel = options.ylabel || "";
        this.stroke = options.stroke || "#000";
        this.canvas = options.canvas;
        this.clicked = false;
        this.mouseover = false;
        
        this.xmin = options.xmin;
        this.xmax = options.xmax;
        this.xdiv = options.xdiv;
	this.ymin = options.ymin;
        this.ymax = options.ymax;
        this.ydiv = options.ydiv;
        
        this.datasets = new Array();
}

ScatterPlot.prototype.draw = function(context) {
    context.beginPath();
    context.rect(this.x, this.y, this.w, this.h);
    context.lineWidth = 1;
    context.strokeStyle = this.stroke;
    context.stroke();
    
    for (var i = 0; i < this.datasets.length; i++) {
        var data = this.datasets[i];
        context.beginPath();
        context.strokeStyle = data.color;
        context.moveTo(
            this.x + ( this.w / (this.xmax - this.xmin) ) * (data.xdata[0] - this.xmin),
            this.y + this.h + ( this.h / (this.ymin - this.ymax) ) * (data.ydata[0] - this.ymin))
        for (var j = 1; j < data.xdata.length; j++) {
            context.lineTo(
                this.x + ( this.w / (this.xmax - this.xmin) ) * (data.xdata[j] - this.xmin),
                this.y + this.h + ( this.h / (this.ymin - this.ymax) ) * (data.ydata[j] - this.ymin))
        }
        context.stroke();
    }

    context.fillStyle = this.stroke;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "8px sans-serif";
    
    for (var i = 0; i <= this.xdiv; i++) {
        context.fillText("" + Math.round(this.xmin + (i * (this.xmax - this.xmin) / this.xdiv)), this.x + (i * this.w/this.xdiv),this.y + (this.h) + 10);
    }
    
    context.font = "15px serif";
    context.fillText(this.label,this.x + (this.w/2),this.y - 18);    
    context.fillText(this.xlabel,this.x + (this.w/2),this.y + (this.h) + 28);    
    
    context.rotate(-Math.PI/2);
    context.font = "8px sans-serif";
    
    for (var i = 0; i <= this.ydiv; i++) {
        context.fillText("" + Math.round(this.ymin + ((this.ydiv - i) * (this.ymax - this.ymin) / this.ydiv)), -this.y - (i * this.h/this.ydiv), this.x - 8);
    }
    
    context.font = "15px serif";
    context.fillText(this.ylabel, -this.y - (this.h/2), this.x - 26);
    
    context.rotate(+Math.PI/2);
    context.textAlign = "center";
    
    this.drawLegend(context);
}

ScatterPlot.prototype.getDataSet = function(dataset) {
    this.datasets.push(dataset);
    return dataset;
}

ScatterPlot.prototype.clearDataSets = function() {
    this.datasets = new Array();
}

ScatterPlot.prototype.drawLegend = function(context) {
    for (var i = 0; i < this.datasets.length; i++) {
        var data = this.datasets[i];
        context.beginPath();
        context.strokeStyle = data.color;
        context.moveTo(this.x + this.w - 125, this.y + 10 + 16 * i);
        context.lineTo(this.x + this.w - 100, this.y + 10 + 16 * i);
        context.stroke();
        context.font = "15px serif";
        context.textAlign = "left";
        context.fillText(data.name, this.x + this.w - 90, this.y + 10 + 16 * i);
    }
}

ScatterPlot.prototype.autoSetMinMaxX = function() {
    this.xmax = -10000;
    this.xmin = 10000;
    
    for (var i = 0; i < this.datasets.length; i++) {
        var data = this.datasets[i];
        if (this.xmin > data.xdata[0])
            this.xmin = data.xdata[0];
        for (var j = 1; j < data.xdata.length; j++) {
            if ((data.xdata[j] > this.xmax) && (data.ydata[j] > 0))
                this.xmax = data.xdata[j];
        }
    }
}

ScatterPlot.prototype.autoSetMinMaxY = function() {
    this.ymax = -100000;
    this.ymin = 100000;
    
    for (var i = 0; i < this.datasets.length; i++) {
        var data = this.datasets[i];
        for (var j = 1; j < data.xdata.length; j++) {
            if (data.ydata[j] > this.ymax)
                this.ymax = data.ydata[j];
            if (data.ydata[j] < this.ymin)
                this.ymin = data.ydata[j];
        }
    }
}

ScatterPlot.prototype.onClick = function(event) {
    return false;
}

ScatterPlot.prototype.offClick = function(event) {

}

ScatterPlot.prototype.mouseMove = function(event) {
    return false;
}

// PlotDataSet
// Data sets for ScatterPlot
function PlotDataSet(options) {
    this.xdata = options.x;
    this.ydata = options.y;
    this.name = options.name;
    this.color = options.color || "#F00";
}