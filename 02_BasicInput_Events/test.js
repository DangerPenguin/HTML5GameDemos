//Input! Events! Fun!
//Created by: Nicholas Wrenn

/*
This tutorial is going to cover how to use the arrow keys to
manually move a red square around. Fun, right?

To do this we set up something called an eventListener, which
waits for something to happen either in our code, the browser,
or the universe (that it can read/measure!), and then calls a 
function that we've given it. When it does this it actually
passes the event it was waiting for TO the function we gave
(as the callback). This allows your function to use data from
the event to do different things, like move a rectangle around
using the arrow keys!

Lets jump in! 
*/

//*****************************************
//Tutorial, START!
//*****************************************

/*
Once again we start by pragmatically creating a canvas object,
and setting its ID (in case we need to do anything to it later, 
or from HTML/CSS)
*/
var canvas = document.createElement('canvas');
canvas.id = "gameCanvas";

/*
We set the canvas' width and height to 480 and 320 again,
because if we don't they'll be 0 by default, and I like those
numbers. :3
*/
canvas.width = 480;
canvas.height = 320;

/* 
You'll notice that from here on out, we won't use 
document.body.appendChild(canvas); anymore. This is because 
that just tacks the canvas onto the END of the <body> tag, just
before </body> ... thats pretty lazy. If we needed to style, 
hide, or move around the canvas, we would have to do so 
manually. 

By putting the canvas in the <div>, which is inside the html page's
<body> tag(I added it, go look!), it becomes very flexible. This is 
a very wizard thing to do.
*/
document.getElementById("gameContentDiv").appendChild(canvas);

/*
Also again, creating a 2D context, so we can draw 2D shapes to 
the canvas.
*/
var canvasContext = canvas.getContext("2d");

/*
Our Rect constructor, exactly the same as last time. Just takes
an x and y position, then a width and height. The reasoning for _
in front of parameters is the same as last time.
*/
function Rect(_x, _y, _width, _height) {
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height; 
}

/*
Here we're starting to see some changes. You'll notice the Rect no longer
moves to the left on its own. The Rect can't be trusted, it kept moving 
even when we WEREN'T pressing a key, so we've taking away its powers!

We did, however, add some stuff. This code allows the Rect to check if it 
has gone "off the screen" in any of the 4 direction. If it has, it wraps 
around to the other side! 

The Rect cannot escape our canvas prison!
*/
Rect.prototype.update = function(){

	/*
	In this code, we check if this.x is less than 0 MINUS 
	this.width. Why?
	
	Well, when you draw a rectangle, canvas draws it starting
	from the top left corner (the x and y values), and goes
	down and to the right until the bottom right corner.

	If we checked if JUST x was less than 0, when the first pixel
	went off the screen, the ENTIRE square would jump to the left. 
	This is unintuitive, and honestly looks absolutely horrid.

	So we check if the left side (x value) of the square is so far 
	off the screen that even adding the width back wouldn't let it
	get above zero! This makes it where the square won't "wrap around"
	to the other side until it's completely off the screen!

	Huzzah~!

	Then we just do the reverse of this check for the right side of
	the screen, and then invert this stuff to use the y value (top)
	of the rectangle and the height of it!

	Easy-peasy, right?
	*/
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

/*
The exact same render function, we pass in the canvas context (the way in
which we interact with the canvas), tell the canvas context to change the 
color that it fills its drawing with to red, and then calls the canvas
context to draw a rectangle representing itself to the screen.
*/
Rect.prototype.render = function(canvasContext){
	canvasContext.fillStyle = "red";
	canvasContext.fillRect(this.x, this.y, this.width, this.height);
}

/*
This is a new method! Since we took away the power of the Rect object
to move itself, we put it inside this nice little method that we call.

To use this, you pass in an xDifference, and a yDifference. These are just 
the amount that the rectangle needs to move on the X and Y axis. This will
be explained in much more detail below where we actually call it. 
*/
Rect.prototype.move = function(_xDifference, _yDifference){
	this.x += _xDifference;
	this.y += _yDifference;
}

/*
Creating the myRect object that we will get to move around 
and that will draw itself to the screen.
*/
var myRect = new Rect(50, 25, 32, 32);

/*
Here are some more functions you've seen before!
We have gameLoop, the function passed as the callback 
later in the program to get called every 33 milliseconds (30fps).
*/
var gameLoop = function(){
	update();
	render();
}

/*
Then we have the update function, which updates the myRect 
object. As explained earlier this makes sure it stays within 
the bounds of the canvas.
*/
var update = function(){
	myRect.update();
}

/*
Once again our render function! I've removed the comments,
it basically just sets the color that the canvas will use
to draw to black, then draws a huge black rectangle over
the entire canvas. (If you're still confused on why you
need to do this, go ahead and comment out those first two 
lines and see what happens!)

After that we allow the myRect object to draw itself again,
passing it the canvasContext object.

And lastly we set the font we want the canvas context to 
use, set the color it will fill with, and the fill some
text to the screen, and the position (50,50)
*/
var render = function(){

	canvasContext.fillStyle = "black";
	canvasContext.fillRect(0,0,canvas.width, canvas.height);

	myRect.render(canvasContext);

	canvasContext.font = "15pt Arial";
	canvasContext.fillStyle = "white";
	canvasContext.fillText("Holy crackers! Arrow keys move things!", 50, 50);
}


/*
Now we get some new stuff! This method will be called later, as 
a callback function, whenever a key is pressed. We take in the event that
happened (it will be passed to this function automatically), and our first
line grabs the key code of which key was pressed out of the keyEvent (All 
this means is that we get the number of which key was pressed from the 
event).

Once we have this, we use a switch statement to see which key was pressed.
I've taken the liberty to label each case so you know whats going on! Once
inside the case statement for which key was pressed, we FINALLY call the
myRect objects move method!

To move left and right you pass in a negative or positive first numbers, 
respectivly, but to move up and down you have to be careful. You pass 
in the second number as negative to go up, and positive to go down.

This is because the canvas starts drawing and counting pixels from the 
TOP-LEFT of the screen. So the top left corner is (0,0), and in our
example the bottom right corner is (479,319). You'll notice I dont hit
480 or 320, thats because the FIRST pixel is at 0,0 and we only have 
480 pixels in height.
*/
var parseKeyDown = function(keyEvent){
	var keyCode = keyEvent.keyCode;

	switch(keyCode){
		case 37: 
			//Left pressed
			myRect.move(-2, 0);
		break;

		case 38:
			//Up pressed
			myRect.move(0, -2);
		break;

		case 39:
			//Right pressed
			myRect.move(2, 0);
		break;

		case 40:
			//Down pressed
			myRect.move(0, 2);
		break;
		
	}
}

/*
Here we start the game loop again, telling the browser to 
set an interval to call this function at continuously (every
33 milliseconds call the gameLoop function!).
*/
setInterval( gameLoop ,33);

/*
Lastly, this is where more magick happens!

With this, we're grabbing the window (The window represents what your
browser is displaying to you, literally the "window" or square under the
url bar where you see your google searches and your facebook feed), and 
adding an event to it.

When you add an event to the window, you give it 3 things, in this form.
	window.addEventListener( event_type, function_to_call, boolean_capture);

Lets break this down.

The event_type that you pass (as a string) tells the browser what type of 
event you're waiting on. In this example, we're waiting on the "keydown" 
event, which means "when any key is pressed". It's like waiting for traffic
to stop, and a guy flaps his arms wildly and runs across as soon as the cars
stop. The event he was waiting on was for traffic to stop. With an event, 
as soon as the event happens you're LISTENTING for happens, this listener 
calls a function that you have passed to it. Thats the next part!

The function_to_call is what the listener does when the event happens. In
our earlier example, the function_to_call was for the man to flap his arms
and run across the street. In this example, we're passing the parseKeyDown
function. Note how we're passing it just like the gameLoop function to
setInterval. We're passing it as the function OBJECT, instead of calling it,
it's another callback! Wheeeeee!

The last part, boolean_capture, is a boolean value. For now, just set this
to false. It's basically asking if you want to capture other events also,
but it's past the scope of this tutorial.
*/
window.addEventListener( "keydown", parseKeyDown, false );

/*
That's it! Go forth and make stuff move!
*/
