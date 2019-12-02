var spr;
var ship;
var shipImage;
let img;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function preload() {
  img = loadImage('assets/dog.png');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent('sketch-holder');
  image(img, 0, 0);
  shipImage = img;

  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 6;
  ship.friction = 0.98;
  ship.setCollider('circle', 0, 0, 20);

  ship.addImage('normal', shipImage);
}

function draw() {
  background(50);
  drawSprites();
}
function mousePressed() {
  // spr.position.x = mouseX;
  // spr.position.y = mouseY;
}
