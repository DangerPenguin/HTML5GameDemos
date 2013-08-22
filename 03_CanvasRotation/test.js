//Turn that Sprite around! No... really... it needs to be rotated.
//Created by: Nicholas Wrenn

/*
Tired of drawing cubes that just sit there, being all lame and fitting
nicely into a grid, no rotation at all?

Me too, glad we're on the same page friend.

This tutorial has to talk about a lot of heavy things. But I'll try to 
explain them in a way where you don't have to understand everything 
concerning how the canvas works, but you'll know enough to keep yourself
out of trouble!

Running this page allows you to see TWO awesome-o rectangles! (If you're
mad I don't call them squares, squares ARE rectangles. Plus we could make
them not squares easily, why don't you try that after this tutorial?)
We have a green rectangle that is just sitting there, all leaning to
one side and what not. He's just chilling there, let him be. The we have 
our familiar red retangle (renamed to redRect from myRect), but he's still
sitting at a right angle! You get to fix that by pressing the left or right
arrow to rotate him each way.

The basic overview of what happening requires you to understand a little more
about the canvas and canvasContext. Think of the canvas as a painters canvas,
the actualy canvas then ends up being a painting. As the programmer, you're 
the painter. The part we need to explain is the canvasContext. The canvasContext
acts like a combination of the painters brush, and HOW the painter paints the
canvas. We've seen this before where we set the canvasContext.fillStyle to 
a color, that's putting a new color on your paintbrush.

The problem is we, as "painters", were only trained in how to draw things
facing directly up, without any rotation (like a grid on graph paper). 
But not to fear! With the canvasContext we can overcome this.

If you could only paint rectangles without rotation in real life, how would
you overcome that to draw a diamond? I would just rotate the canvas, or
rotate how I'm LOOKING at the canvas. If I'm looking at the canvas from a 
weird angle, but I draw the rectangle right side up from MY POINT OF VIEW,
when the canvas is put back up and looked at without any rotation, the
rectangle I drew could appear to be rotated to any angle, and I never
had to draw it rotated.

Neat huh? That's what we're gonna do. We adjust the canvas( I'll explain
more/why later), rotate how we're looking at it, draw our rectangle, and
we'll return the way we're looking at the canvas to normal.

And then we have a rotated Rectangle, without drawing anything rotated.

Crazy.

*/

//*****************************************
//Tutorial, START!
//*****************************************


/*
This stuff is all the same... you should know it by now.
(If not, look at the earlier examples I've posted)
Make a canvas, set its size and id, hook it into the <div>
on our html page, and create the canvasContext for it in a
2D way.
*/
var canvas = document.createElement('canvas');
canvas.id = "gameCanvas";
canvas.width = 480;
canvas.height = 320;

document.getElementById("gameContentDiv").appendChild(canvas);
var canvasContext = canvas.getContext("2d");

/*
The same constructor, notice we're keeping track of our
rectangles color now (default it's set to red, but you can change 
it later), AND we hve a variable to track the rotation of our 
rectangle. (I set it to 0 by default, which "no rotation". One
thing to note is I'm storing it in degrees.)
*/
function Rect(_x, _y, _width, _height) {
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;

	//Here are the new variables that track rotation 
	//and color respectively, and their default values.
	this.rotation = 0;
	this.color = "red";
}


/*
The same update function, though we don't even need
it in this tutorial.
*/
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

/*
Here is the heavy lifter of this tutorial, where all the "pseudo-rotation"
happens. We've changed the first line, to use the current rectangle objects color 
variable (a string, default is "red") to set the canvasContexts fillColor
so that our rectangles can change color.

Then we call save() on the canvasContext.. why?

Well we're about to do a LOT of changes to the canvasContext, which is how
we "look at" our canvas. When we talked about rotating the painters canvas
earlier, we eventually rotated it back to normal. This is half of that. By
calling save() a canvasContext is able to store a "snapshot" of how it currently
is looking at the canvas. So no matter how we change this perspective we can 
just go back to this "checkpoint" later, and have us looking at the canvas
normally again. It's important to know that each canvasContext can only store
ONE snapshot of itself. So if you call save() again before restoring everything....
well you're in trouble then. Don't do that. Bad.

The next line ( canvasContext.translate() ) will be confusing to people. TO explain
why this is needed you need to know more about how a canvasContext draws things to 
the canvas. Normally when you tell the canvasContext to fill a rectangle on screen,
you give it an X and a Y position. This isn't so much of a position, but an OFFSET 
froma position (or a distance from a position). There is only one point that the 
canvas knows about, it's called the origin. The origin is always 0,0 (or 0,0,0 in
3D) because to GET the the origin there is no offset from the origin. In JavaScript
with the canvas the origin is set to the top-left corner of the screen. From there,
and positive X values count to the right, and any positive Y values count down the 
screen/canvas. This is the offset you pass to the canvasContext to draw in x and y.
So when we draw a square at 50, 100, we're telling the canvasContext to start at 
the origin (0,0, the top left of the canvas), go 50 pixels to the left, 100 pixels
down, and start drawing the rectangle.

This brings up something else we need to discuss. Since we give the canvasContext an
offset, and then once it gets to the offset it starts drawing our rectangle given a 
width and height, the X and Y arent the center of the rectangle, they're the top-left
corner of our rectangle. This works fine for simple drawing, but when we're going
to be doing rotations, we need to change how we draw the rectangle. We want our
X and Y values to represent the MIDDLE of our rectangle, so that way if we rotate
around our X and Y position, we are effectively rotating in place. Try putting your 
finger in the middle of a napkin, and spinning it, works like you expect. Now put
your finger on a corner of the napkin and spin. See how entire napkin circles
all the way around your finger instead of spinning under it? To fix this we only
need to do tiny calculations. If x and y are supposed to be our exact center, when
we go to give our offsets to canvasContext (it takes the top left corner, remember),
we simple take away half of our heigh from out x offset, and half of our height
away from our y offset. This puts our saved x and y co-ordinates smack dab in the
middle of any rectangle we try to draw!

So what the translate() line is doing, is setting the current origin to the middle 
of our rectangle (x and y position). This is so we can "rotate the way we look at
the canvas" around this point. We use the current rectangle's X and Y for the 
translation because of the napkin example I gave earler.

Then comes the actual rotate() funtion. While I like to store rotation in degrees,
the rotate function needs radians. Taking Math.PI/180 and multiplying it by our
degrees (this.rotation variable) produces the equvalent radians, and goes ahead
and rotates our view of the canvas to that rotation.

Now all we have to do is draw our rectangel like normal! Except we decided on a better
way to draw it earlier, remember? Our X and Y were originally the top-left of our
rectangle, but now they're the center. We also moved the origin TO our X and Y 
values, so 0,0 is now the CENTER of our rectangle! All we have to do is take away half
of our width from the X value (zero!), and half our height from the Y value(zero also 
now!). Then we finish the fillRect call like normal by giving it our objects width and
height.

After we're done with our drawing we call canvasContext.restore(). This grabs the 
snapshot saved the last time we called save(), and sets all the canvasContext's 
inner vairables to how they used to be at the point in time we called save(), like
where the origin is and what our canvasContexts rotation is. This sets everything back
to the way it was before we did our drawing, so we're done!

We just rotated some things, go us!
*/
Rect.prototype.render = function(canvasContext){
	canvasContext.fillStyle = this.color;

	canvasContext.save();
	canvasContext.translate(this.x, this.y);
	canvasContext.rotate( Math.PI/180 * this.rotation);

	canvasContext.fillRect(0 - (this.width/2), 0 - (this.height/2), this.width, this.height);

	canvasContext.restore();
}

/*
The move function, we're not using it in this tutorial
*/
Rect.prototype.move = function(_xDifference, _yDifference){
	this.x += _xDifference;
	this.y += _yDifference;
}

/*
Here we have a method to rotate a rectangle. Notice we don't
set the rotation, we add to it. If we pass _amountToRotate as
ANY positive value, the rectangle will rotate that many degrees
in a CLOCKWISE rotation. If _amountToRotate is negative, we 
will be rotating COUNTER-CLOCKWISE. Simple. You've already 
seen the cool stuff earlier on why this works.
*/
Rect.prototype.rotate = function(_amountToRotate){
	this.rotation += _amountToRotate;
}

/*
We have TWO rects now! Our old, faithful, myRect has been
re-branded and re-named as redRect, and we added another 
retangle, called greenRect.
*/
var redRect = new Rect(250, 150, 32, 32);
var greenRect = new Rect(100, 100, 32, 32);

/*
As we said, we get to rotate redRect on our own, but we don't
want to leave greenRect out. We go ahead and give him some 
rotation right away, since he wont be moving/rotating at all,
and then set his color to green, because we can.
*/
greenRect.rotate(67);
greenRect.color = "green";

/*
gameLoop and update are the exact same as last time.
*/
var gameLoop = function(){
	update();
	render();
}

var update = function(){
	redRect.update();
}

/*
All that has changed here is calling greenRect to draw/render itself.
*/
var render = function(){

	canvasContext.fillStyle = "black";
	canvasContext.fillRect(0,0,canvas.width, canvas.height);

	redRect.render(canvasContext);
	greenRect.render(canvasContext)

	canvasContext.font = "15pt Arial";
	canvasContext.fillStyle = "white";
	canvasContext.fillText("Left and Right arrows rotate the red square!", 50, 50);
}


/*
Couple of changes here. We've removed all code except for
if the left or right arrow keys are pressed. If left is 
pressed, we call the rotate method on redRect to rotate it
counter-clockwise 5 degrees, and if we press right we 
rotate redRect 5 degrees clockwise.
*/
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


/*
Nothing changed here either, we juse setup the gameloop to be 
called every 33 ms (30fps), and hook up our event listener to 
listen for ANY keyboard keypresses (though we onl do anything 
with left and right arrow keys), and give it the method to call
when someone does press a key (parseKeyDown). We pass it fase 
lastly because we're just capturing this event.
*/
setInterval( gameLoop ,33);
window.addEventListener( "keydown", parseKeyDown, false );