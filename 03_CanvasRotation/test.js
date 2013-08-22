//Turn that Sprite around! No... really... it needs to be rotated.
//Created by: Nicholas Wrenn

/*

*/

//*****************************************
//Tutorial, START!
//*****************************************


var canvas = document.createElement('canvas');
canvas.id = "gameCanvas";
canvas.width = 480;
canvas.height = 320;

document.getElementById("gameContentDiv").appendChild(canvas);
var canvasContext = canvas.getContext("2d");


function Rect(_x, _y, _width, _height) {
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;

	//this is new 
	this.rotation = 0;
	this.color = "red";
}


Rect.prototype.update = function(){
	if(this.x <= 0 - this.width){ 
		this.x = 480;
	}
	else if(this.x > 480){
		this.x = 0 - this.width;
	}

	if(this.y <= 0 - this.height){ 
		this.y = 320;
	}
	else if(this.y > 320){
		this.y = 0 - this.height;
	}
}

//this has new things
Rect.prototype.render = function(canvasContext){
	canvasContext.fillStyle = this.color;

	canvasContext.save();
	canvasContext.translate(this.x, this.y);
	canvasContext.rotate( Math.PI/180 * this.rotation);

	canvasContext.fillRect(0 - (this.width/2), 0 - (this.height/2), this.width, this.height);

	canvasContext.restore();

}

Rect.prototype.move = function(_xDifference, _yDifference){
	this.x += _xDifference;
	this.y += _yDifference;
}

//this is new
Rect.prototype.rotate = function(_amountToRotate){
	this.rotation += _amountToRotate;
}

//we have TWO rects now
var redRect = new Rect(250, 150, 32, 32);
var greenRect = new Rect(100, 100, 32, 32);
//this is new
greenRect.rotate(67);
greenRect.color = "green";

var gameLoop = function(){
	update();
	render();
}

var update = function(){
	redRect.update();
}

//added a second draw method
var render = function(){

	canvasContext.fillStyle = "black";
	canvasContext.fillRect(0,0,canvas.width, canvas.height);

	redRect.render(canvasContext);
	greenRect.render(canvasContext)

	canvasContext.font = "15pt Arial";
	canvasContext.fillStyle = "white";
	canvasContext.fillText("Left and Right arrows rotate the red square!", 50, 50);
}

var parseKeyDown = function(keyEvent){
	var keyCode = keyEvent.keyCode;

	switch(keyCode){
		case 37: 
			//Left pressed
			redRect.rotate(-5);
		break;

		case 39:
			//Right pressed
			redRect.rotate(5);
		break;	
	}
}

setInterval( gameLoop ,33);
window.addEventListener( "keydown", parseKeyDown, false );