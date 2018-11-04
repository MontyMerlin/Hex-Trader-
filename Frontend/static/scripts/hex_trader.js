//globals 
const master_x =  150; // 50 less allows the rows to be nested
const master_y = 134; 
let size = 0.6;
let number = 11
let numberx = number;
let numbery = number;
let hex_dict = {};
let canvasx;
let canvasy;
let trades;
let inventory;
let colour_dict;
let socket;
let current_players = [];
/*let player_locations = {"red": false, "blue": false, "yellow": false, "green": false}*/

function preload() {
  colour_dict = {"y": "yellow", "r": "red", "g": "green", "b": "brown"};
  socket = io.connect("127.0.0.1."); // development
  //socket = io.connect("https://hextrdr.herokuapp.com"); // deployment
}

function setup() {
  //createCanvas(1000,500) // the width should always be doube the height
  canvasx = displayWidth; 
  canvasy = canvasx*0.6;
  size = (canvasx/2)/(master_x*number);
  // initiate hexagon objects
  socket.on("board_data", loadBoard);
  socket.on("player_update", drawAll);
  windowResized();
}

function mousePressed() {
  console.log("ouch!")
  for (key in hex_dict) {
    let d = dist((hex_dict[key].orthx*size),(hex_dict[key].orthy*size),mouseX,mouseY);
    if (d < 100*size) {
      socket.emit("move_player",[hex_dict[key].isox,hex_dict[key].isoy]);
      break;
    }
  } 
}

function updatePlayers(players) {
  current_players = players; // update global list fo current players
  for (i in players) {
    if (players[i].location != false) {
      //draw connected players list
      push();
      strokeWeight(4);
      stroke(10);
      scale(size);
      fill(70);
      textSize(50);
      rect(150*i,0,150,150)
      noStroke()
      fill(players[i].colour);
      text(players[i].colour,5+(150*i),40)
      pop();
      drawBoat(75+(150*i),110,players[i].colour) 
      // draw the players on the board
      let hex = hex_dict[players[i].location];
      drawBoat(hex.orthx,hex.orthy,players[i].colour);
    }
  }
}


function loadBoard(board_data) {
  trades = board_data;
  for (let a = 1; a < numberx+1; a++) {
    for (let b = 1; b < numbery+1; b++) {
      let orthx = ((master_x*numberx) + ((master_x*b) - (master_x*a)));
      let orthy = ((master_y/numbery) + (master_y*(b*0.5) + master_y*(a*0.5)));
      hex_dict[(a-1)+","+(b-1)] = new hexagon(a-1,b-1,orthx,orthy);
    }
  }
  drawAll(current_players)
}

function drawAll(players) { //draw all visible elements
  createCanvas(canvasx,canvasy);
  background("blue");
  drawBoard(hex_dict,size);
  updatePlayers(players);
}

function windowResized() { //update scale and refresh when resized 
  canvasx = windowWidth;
  canvasy = canvasx*0.6;
  size = (canvasx/2)/(master_x*number);
  drawAll(current_players);
}

/*function draw() {
  frameRate(10)
  let selectx = random(Array.from({length: numberx }, (v, k) => k));
  let selecty = random(Array.from({length: numbery }, (v, k) => k));
  let selection = hex_dict[(selectx)+","+(selecty)];
  drawBoat(selection.orthx,selection.orthy,size);
}*/
  
function drawBoat(x,y,c) { // draw boat to given hex
  push();
  scale(size);
  translate(x,y);
  stroke(c);
  strokeWeight(3);
  fill(c);
  arc(0, 0, 50, 50, 0, PI,CHORD);
  triangle(0,-50,30,-10,0,-10);
  strokeWeight(7);
  line(-40,0,25,0);
  line(0,0,0,-53);
  pop();
}


function drawBoard(dict,s) { // draw the board based on the hex objects
  for (let ke in dict) {
     drawHex(dict[ke],s);
  }
}

class hexagon {
  constructor(isox,isoy,orthx,orthy){
    this.isox = isox;
    this.isoy = isoy;
    this.orthx = orthx;
    this.orthy = orthy;
    this.trade = trades[isox+isoy]
  }
}

function drawHex(hex,s) {
  let trade = hex.trade.split("+")
  let left = trade[0];
  let right = trade[1];
  stroke("red");
  strokeWeight(4);
  fill(100);
  push();
  scale(s);
  translate(hex.orthx, hex.orthy);
  beginShape();
  vertex(50 ,-67);
  vertex(-50, -67);
  vertex(-100, 0);
  vertex(-50, 67);
  vertex(50,  67);
  vertex(100, 0);
  endShape(CLOSE);
  fill("red")
  line(-20,-20,0,-20)
  triangle(0,-20,-10,-30,-10,-10)
  noStroke()
  rectMode(CENTER);
  for (let a = 0; a < left.length; a++) {
    fill(colour_dict[left[a]]);
    rect(-45,-35+(20*a),15,15);
  }
  for (let b = 0; b < right.length; b++) {
    fill(colour_dict[right[b]]);
    if (b < 4) {
      rect(45,-35+(20*b),15,15);
    }
    else {
      rect(25,-35+((20*b)-80),15,15);
    }
  }
  pop();
}















