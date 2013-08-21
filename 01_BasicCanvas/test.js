//Canvas Fun!
//Created by: Nicholas Wrenn

/*
The basic Idea of this is to show you how to make a canvas and
hook up some simple things that could easily turn into a game.
An important thing to know is the idea of the "Game Loop". 
We've been doing that already in class, but it's more obvious here.
All you do it
-Take user input
-Update all your game things
-Render all your game things
-Repeat

To do this, we define a gameLoop method, which calls update and
render. Inside update you update and move all your game objects, 
and in render you render all of them to the canvas (through the
canvas context, don't worry, i'll explain it).

While rendering a rectangle is simple, I make a ractangle class
that has update and render, and let it move across the screen, 
to show you how you could do this in your game!
*/


//*****************************************
//Tutorial, START!
//*****************************************


/*
Here we manually create the DOM canvas element
This is equivalent to making a <canvas> tag in our html page,
and filling it in. We do it this way so that you have ULTIMATE 
CONTROL at run-time This is useful especially for mobile devices,
where you might want to adjust to fill the entire screen!
*/
var canvas = document.createElement('canvas');
canvas.id = "gameCanvas";

/*
We set the width and height manually, because it 
will be 0 by default if we dont!
*/
canvas.width = 480;
canvas.height = 320;

/*
Here we are connecting the canvas to the actual webpage.
This is important, because since we didn't use the canvas tag,
it only exists in the memory stack at this moment.

If you notice, we call the document (html page), get the
body (the <body> tag) and append a child to it (put it inside the body tag).
*/
document.body.appendChild(canvas);

/*
Here we create a canvas context. This is how you actually draw stuff to the
canvas. The reason you have to setup the context, is because the canvas needs to 
know how we're going to be drawing things. It's possible to draw 3D 
scenes to the canvas with libraries like WebGL, so we tell out canvas
we want its context to be 2D, a-la-mario style.
*/
var canvasContext = canvas.getContext("2d");


/*
Constructor to make a Rectangle object, 
this is only used to show an object oriented way of drawing
for this tutorial.
*/
function Rect(_x, _y, _width, _height) {
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height; 
}

/*
Adding an update method to the Rect prototype,
that way every time the "game" updates, we can
update, or move, our retangle
*/
Rect.prototype.update = function(){
	//move x left
	this.x -= 2;

	//if this rectangle went off-screen
	//wrap around to the right
	if(this.x <= 0-this.width){ 
		this.x = 480;
	}
}

/*
The render function for our Rect object
This will let our rectangle obj draw itself,
without us having to manually write out a ton
of stuff for every object we have to draw.

Trust me, this saves time!

(Note: we pass the object the canvasCONTEXT, because
thats how we interact with the canvas)
*/
Rect.prototype.render = function(canvasContext){
	canvasContext.fillStyle = "red";
	canvasContext.fillRect(this.x, this.y, this.width, this.height);
}


/*
Let's go ahead and make a Rect object to have fun with
*/
var myRect = new Rect(200, 200, 32, 32);

/*
The gameloop function, when this gets called, it will call
update, which we use to update all our game stuff. Then it calls
render, where we draw all of our game objects to the canvas.
*/
var gameLoop = function(){
	update();
	render();
}

/*
The game's update function, if we had a ton of objects,
we could have them all in an Array and just loop through
them updating. But we only have 1, so we just manually update it.
*/
var update = function(){
	myRect.update();
}

/*
The render function, where we draw everything. We have to be careful here,
besides just drawing everything, we also have to find a way to "clear" the 
canvas. While there are special ways to do that, I prefer jsut drawing 
a rectangle over the entire canvas!
*/
var render = function(){
	//Render a black square over the entire canvas, you're basically
	//clearing it to black, so that way as you move objects around they
	//don't leave a trail.
	canvasContext.fillStyle = "black";
	canvasContext.fillRect(0,0,canvas.width, canvas.height);


	
	//Drawing style 1: manually: 
	//I DONT SUGGEST EVERY DOING THIS
	//WHAT IF YOU HAD LIKE 35253456456523 OBJECTS?!?!
	/*
	canvasContext.fillStyle = "red";
	canvasContext.fillRect(myRect.x, myRect.y, myRect.width, myRect.height);
	*/

	//Drawing style 2: letting the object do the work
	//This is how smart people make vidya games!
	myRect.render(canvasContext);


	//render some font onto the screen
	canvasContext.font = "15pt Arial";
	canvasContext.fillStyle = "white";
	canvasContext.fillText("WOOOOO It's a UI!", 50, 50);
	/*
	I could make this more obejct oriented,
	but it can be done like above with the Rect.

	You should try making this into an object, and find
	a way to change what it says.
	(Like a health counter or score!)
	*/
}


/*
This we've seen today with the clock but I'm going to explain why its here.

Like the clock, we can't jsut do a while(gameNotOver), because that will
tie up the entire browser, and not allow anything to happen.

Browsers are weird, they dont constantly run code. They run a little code
from here, a little code form there, then loop back and start again. So
we tell the browser that we want a method to be called every so often
by using setInterval(function, time). This just gives the browser a callback
function that it will call every so many milliseconds.

The first paramer is the gameLoop function (passing it, NOT calling it). 
By calling this, we call the update and render functions, which calls
the update and render functions of all our game objects, respectively.

The last parameter is the time we want to wait in-between calls.
Can you guess why I chose 33?

I chose 33 because in milliseconds, if something happened 33 times, 
it would even out to just about 30 times a second. This is pretty
low for a game, but enough to show you whats going on.

If you wat 60fps(frames per second, the optimal speed of games),
replace 33 with 16. But this causes some other problems, the
rectangle moves twice as fast!

That's when you need delta time, which I might make another of these
for if enough people ask. 
*/
setInterval( gameLoop ,33);