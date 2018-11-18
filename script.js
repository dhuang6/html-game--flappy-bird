//global variables being declared.
var myGamePiece;
var secondGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var Btn = document.getElementById('accelerate');

//when spacebar is pressed box goes up
document.onkeydown = function(e){
 if(e.keyCode == 32) {
   accelerate(-0.2)
 }
}
//when you let go of space bar box is pulled back down by gravity.
document.onkeyup = function(e){
  if(e.keyCode == 32) {
   accelerate(0.1)
  }
}
//adding in space bar as an option to control box.
document.getElementById('accelerate').onkeydown = function(e) {
 if(event.keyCode ===32){
   event.preventDefault();
   document.querySelector('button').click(); //this will trigger a click on the first button
 }
};

//function changeImage(obj, img) {
//  console.log(myGamePiece.image.src="sadFace.png");
//}


//invokes the method start() of myGameArea object added in the creation of the gamepiece modify this to add additional pieces to this game
function startGame() {
//after adding in a restart function you need to clear the array before the start of the game
	myGamePiece = new component(30, 30, "aliveFace.png", 10,120, 'image');
	myGamePiece1 = new component(30, 30, "sadFace.png", 10,120,'image');
	myBackground = new component(480, 370, "background-image.png",0,0,"background");
  myObstacles = [];
  myScore = new component('30px','Consolas', 'black', 400, 40,'text');
	myGameArea.start();
//generates the pieces and defines characteristics

	
}

function restartGame() {
  myGameArea.stop();
  myGameArea.clear();
  startGame();
  
}
//use the hide the second image
function changeImage() {
  for(let z=0; z < myObstacles.length; z++){
  if(myGamePiece1.crashWith(myObstacles[z])){
    console.log(myGamePiece1)
  
    }
  }
}
//stop the game / clear / restart
 
//we will add more properties and methods to this object
var myGameArea = {
	canvas: document.createElement('canvas'),
// start method creates a <canvas> element and inserts it into the first childnode
	start : function() {
		this.canvas.width = 580;
		this.canvas.height = 370;
		this.context = this.canvas.getContext('2d');
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
//set current frames to be zero
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);
	},
	clear : function() {
		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
	},
	stop : function() { //clearInterval = stops the 20 milisecond interval for gameArea
	 clearInterval(this.interval);
	    
	  }
	};
//then update the fame with a function returns true if the current framenumber is the same as a given interval.
function everyinterval(n){
  if((myGameArea.frameNo / n ) % 1 == 0) {
   return true;
  } return false;
}

//created a master function to make the components of the game.
function component(width, height, color, x, y, type) {
  this.type = type;
  if(type == "image" || type =="background") {
    this.image = new Image();
    this.image.src = color;
  }
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.gravity = 0.05;
	this.gravitySpeed = 0;
//draws the component
	this.update = function() {
	ctx = myGameArea.context;
//accounting for the the component being the score and the data being text.
	 if(this.type == 'text'){
	 ctx.font = this.width + ' ' + this.height;
	 ctx.fillStyle = color;
	 ctx.fillText(this.text, this.x, this.y);
	 } else if(type =='image' || type == 'background') {
	  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	  if(type == 'background') {
	    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
	  }
	  } else { //if it's not text draw the face icon.
	ctx.fillStyle = color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
	  }
	}

	this.newPos = function() {
	  this.gravitySpeed += this.gravity;
	  this.x += this.speedX;
	  this.y += this.speedY + this.gravitySpeed;
	  this.hitBottom();
	  this.stopAtTop();
	 
	  if(this.type == "background") {
	      if(this.x == -(this.width)) {
	        this.x = 0;
	      }
	    }
	  }
	  this.hitBottom = function() {
	      var rockbottom = myGameArea.canvas.height - this.height;
	      if(this.y > rockbottom) {
	        this.y = rockbottom;
	        this.gravitySpeed = 0;
	      }
	    }
//prevents object from going off the top of the map.
	    this.stopAtTop = function() {
	      var  hitTop = myGameArea.canvas.height > this.height;
	      if(this.y < hitTop) {
	        this.y = hitTop;
	        this.gravitySpeed = -0.1
	      }
	    }
	

//added in a function to identify when an object crashes with obstacles.
	this.crashWith = function(otherobj) {
	  var myleft = this.x;
	  var myright = this.x + (this.width);
	  var mytop = this.y;
	  var mybottom = this.y + (this.height);
	  var otherleft = otherobj.x;
	  var otherright = otherobj.x + (otherobj.width);
	  var othertop = otherobj.y;
	  var otherbottom = otherobj.y + (otherobj.height);
	  var crash = true;
	//mybottom  = localtion y + object's height < location of the other obj's y location
	  if((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
	  (myleft > otherright)) {
	    crash  = false;
	  }
	  
	  return crash;
	  
	}
}
//required changes to allow multiple obstacles to be made.
function updateGameArea() {
  var x,height,gap, minHeight, maxHeight, minGap, maxGap;
  for(i = 0; i < myObstacles.length; i ++) {
    if(myGamePiece.crashWith(myObstacles[i])) {
      changeImage();
      myGameArea.stop();
      
    
      
       return;
    }
  }
  
  myGameArea.clear();
  myBackground.speedX = -1;
  myBackground.newPos();
  myBackground.update();
  myGameArea.frameNo += 1;
  if(myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight +1) + minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
  
//new generator for new obstacles first one generates objects on the bottom
    myObstacles.push(new component(10, height, 'green', x, 0));
//generates obstacles on the top of the canvas.
    myObstacles.push(new component(10, x - height - gap, 'green', x, height + gap))
  }
  for(i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  myScore.text='SCORE: ' + myGameArea.frameNo;
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
  myGamePiece1.newPos();
  myGamePiece1.update();

/* we needed to switch this from myobstacle to an array so that we could generate
more than 1 obstacle.
  if(myGamePiece.crashWith(myObstacle)) {
    myGameArea.stop();
  } else {
//the clear function allows you to not leave a trail for the red box
	myGameArea.clear();
//obstacle is moving in the opposite direction as our game piece.
	myObstacle.x += -1
//got to add in the update feature to make the obstacle appear.
	myObstacle.update();
	myGamePiece.newPos();
	myGamePiece.x += 1;
	myGamePiece.update();
  }
}
*/

}
/*
function moveup() {
  myGamePiece.speedY -= 1;
}

function movedown() {
  myGamePiece.speedY += 1;
}

function moveleft(){
  myGamePiece.speedX -= 1;
}

function moveright() {
  myGamePiece.speedX += 1;
}
*/

function accelerate(n) {
  myGamePiece.gravity = n;
  myGamePiece1.gravity = n;
}

function clearmove(){
  myGamePiece.speedX = 0;
  myGamePiece1.speedX = 0;
  myGamePiece.speedY = 0;
  myGamePiece.speedY = 0;
}
  
