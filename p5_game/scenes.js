
var bullets;
var asteroids;
var ship;
var lives = 0;
var shipImage, bulletImage, particleImage;
var shipSpeed = 100;
var slowDown = false;
var nextScene = false;
var MARGIN = 40;

function scene1() {
  //Main Menu
  this.setup = function() {
    //setup for scene1
    console.log("setup for menu");
  }

  this.enter = function() {
    //entering scene1
    console.log("entering menu");
    lives = 0;
  }

  this.draw = function() {
    var txtSize = Math.sqrt(width);
    background(0);
    fill(255);
    textStyle(BOLD);
    textAlign(CENTER);
    textSize(txtSize*2);
    text("Asteroids", width/2, txtSize*2);
    textStyle(NORMAL);
    textSize(txtSize);
    text("Press ENTER to Play", width/2, (height/2));

    noFill();
    strokeWeight(txtSize/10);
    stroke(255);
    rectMode(CENTER);
  }

  this.keyPressed = function() {
    if(keyCode == ENTER){
      this.sceneManager.showScene(scene2);
    }
  }
}

function scene2() {
  //level 1
  this.setup = function() {
    //setup for scene2
    console.log("setup for level 1");

    bulletImage = loadImage("assets/asteroids_bullet.png");
    shipImage = loadImage("assets/asteroids_ship0001.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = 0.98;
    ship.setCollider("circle", 0, 0, 20);

    ship.addImage("normal", shipImage);
    ship.addAnimation("thrust", "assets/asteroids_ship0002.png", "assets/asteroids_ship0007.png");

    asteroids = new Group();
    bullets = new Group();

    for(var i = 0; i<8; i++) {
      var ang = random(360);
      var px = width/2 + 1000 * cos(radians(ang));
      var py = height/2+ 1000 * sin(radians(ang));
      createAsteroid(3, px, py);
    }
  }

  this.enter = function() {
    //entering scene2
    console.log("entering level 1");
    lives = 0;
  }

  this.draw = function() {
    background(0);

    fill(255);
    var txtSize = Math.sqrt(width);
    textSize(txtSize);
    textAlign(CENTER);
    text("Controls: Arrow Keys + X", width/2, 30);
    //text(asteroids.length, width/2, height/2);

    if(shipSpeed < 0){
        slowDown = false;
        shipSpeed = 100;
    }
    //ship.addSpeed(shipSpeed, ship.rotation);

      if(ship.position.x<-MARGIN) ship.position.x = width+MARGIN;
      if(ship.position.x>width+MARGIN) ship.position.x = -MARGIN;
      if(ship.position.y<-MARGIN) ship.position.y = height+MARGIN;
      if(ship.position.y>height+MARGIN) ship.position.y = -MARGIN;

    for(var i=0; i<asteroids.length; i++) {
      var s = asteroids[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
    }

    asteroids.overlap(bullets, asteroidHit);

    ship.bounce(asteroids, loseLife);

    if(keyDown(LEFT_ARROW) || keyDown('a'))
      ship.rotation -= 4;
    if(keyDown(RIGHT_ARROW) || keyDown('d'))
      ship.rotation += 4;
    if(keyDown(UP_ARROW) || keyDown('w'))
    {
      slowDown = false;
      //shipSpeed = 100;
      ship.addSpeed(100, ship.rotation);
      ship.changeAnimation("thrust");
    }
    else
      ship.changeAnimation("normal");

    if(keyWentUp(UP_ARROW) || keyWentUp('w')){
        slowDown = true;
    }

    if(slowDown){
        shipSpeed--;
        ship.addSpeed(shipSpeed, ship.rotation);
    }

    if(keyWentDown('x'))
    {
      var bullet = createSprite(ship.position.x, ship.position.y);
      bullet.addImage(bulletImage);
      bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
      bullet.life = 50;
      bullets.add(bullet);
    }

    if(asteroids.length <= 0){
        text("YOU WIN", width/2, (height/2)-txtSize);
        text("Press ENTER", width/2, (height/2)+txtSize);
        ship.remove();
        if(keyCode == ENTER){
          this.sceneManager.showScene(scene3);
        }
    }else{
        text("Crashes:" + lives, width/2, height/2);
    }

    drawSprites();
  }

  function createAsteroid(type, x, y){
    var a = createSprite(x, y);
    var img = loadImage("assets/asteroid"+floor(random(0, 3))+".png");
    a.addImage(img);
    a.setSpeed(2.5-(type/2), random(360));
    a.rotationSpeed = 0.5;
    //a.debug = true;
    a.type = type;

    if(type == 2)
      a.scale = 0.6;
    if(type == 1)
      a.scale = 0.3;

    a.mass = 2+a.scale;
    a.setCollider("circle", 0, 0, 50);
    asteroids.add(a);
    return a;
  }

  function asteroidHit(asteroid, bullet){
    var newType = asteroid.type-1;

    if(newType>0) {
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    }

    for(var i=0; i<10; i++) {
      var p = createSprite(bullet.position.x, bullet.position.y);
      p.addImage(particleImage);
      p.setSpeed(random(3, 5), random(360));
      p.friction = 0.95;
      p.life = 15;
    }

      bullet.remove();
      asteroids.remove(asteroid);
      asteroid.remove();
  }

  function loseLife(){
    lives++;

    ship.position.x = width/2;
    ship.position.y = height/2;
  }
}

function scene3() {
  //level 2 "Bullet Storm in Space"
  this.setup = function() {
    //setup for scene3
    console.log("setup for level 2");

    bulletImage = loadImage("assets/asteroids_bullet.png");
    shipImage = loadImage("assets/asteroids_ship0001.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = 0.98;
    ship.setCollider("circle", 0, 0, 20);

    ship.addImage("normal", shipImage);
    ship.addAnimation("thrust", "assets/asteroids_ship0002.png", "assets/asteroids_ship0007.png");

    asteroids = new Group();
    bullets = new Group();

    for(var i = 0; i<8; i++) {
      var ang = random(360);
      var px = width/2 + 1000 * cos(radians(ang));
      var py = height/2+ 1000 * sin(radians(ang));
      createAsteroid(3, px, py);
    }
  }

  this.enter = function() {
    //entering scene3
    console.log("entering level 3");
    lives = 0;
  }

  this.draw = function() {
    background(0);

    fill(255);
    var txtSize = Math.sqrt(width);
    textSize(Math.sqrt(width));
    textAlign(CENTER);
    text("(Bullet Storm in Space)", width/2, 30);
    //text(asteroids.length, width/2, height/2);

    if(shipSpeed < 0){
        slowDown = false;
        shipSpeed = 100;
    }
    //ship.addSpeed(shipSpeed, ship.rotation);

    for(var i=0; i<allSprites.length; i++) {
      var s = allSprites[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
    }

    asteroids.overlap(bullets, asteroidHit);

    ship.bounce(asteroids, loseLife);

    if(keyDown(LEFT_ARROW) || keyDown('a'))
      ship.rotation -= 4;
    if(keyDown(RIGHT_ARROW) || keyDown('d'))
      ship.rotation += 4;
    if(keyDown(UP_ARROW) || keyDown('w'))
    {
      slowDown = false;
      //shipSpeed = 100;
      ship.addSpeed(100, ship.rotation);
      ship.changeAnimation("thrust");
    }
    else
      ship.changeAnimation("normal");

    if(keyWentUp(UP_ARROW) || keyWentUp('w')){
        slowDown = true;
    }

    if(slowDown){
        shipSpeed--;
        ship.addSpeed(shipSpeed, ship.rotation);
    }

    if(keyWentDown('x'))
    {
      var bullet = createSprite(ship.position.x, ship.position.y);
      bullet.addImage(bulletImage);
      bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
      bullets.add(bullet);
    }

    if(asteroids.length <= 0){
        text("YOU WIN", width/2, (height/2)-txtSize);
        text("Press ENTER", width/2, (height/2)+txtSize);
        ship.remove();
        if(keyCode == ENTER){
          this.sceneManager.showScene(scene4);
        }
    }else{
        text("Crashes:" + lives, width/2, height/2);
    }

    drawSprites();
  }

  function createAsteroid(type, x, y){
    var a = createSprite(x, y);
    var img = loadImage("assets/asteroid"+floor(random(0, 3))+".png");
    a.addImage(img);
    a.setSpeed(2.5-(type/2), random(360));
    a.rotationSpeed = 0.5;
    //a.debug = true;
    a.type = type;

    if(type == 2)
      a.scale = 0.6;
    if(type == 1)
      a.scale = 0.3;

    a.mass = 2+a.scale;
    a.setCollider("circle", 0, 0, 50);
    asteroids.add(a);
    return a;
  }

  function asteroidHit(asteroid, bullet){
    var newType = asteroid.type-1;

    if(newType>0) {
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    }

    for(var i=0; i<10; i++) {
      var p = createSprite(bullet.position.x, bullet.position.y);
      p.addImage(particleImage);
      p.setSpeed(random(3, 5), random(360));
      p.friction = 0.95;
      p.life = 15;
    }

      bullet.remove();
      asteroids.remove(asteroid);
      asteroid.remove();
  }

  function loseLife(){
    lives++;

    ship.position.x = width/2;
    ship.position.y = height/2;
  }
}

function scene4() {
  //level 3
  this.setup = function() {
    //setup for scene4
    console.log("setup for To the Left or Right");

    bulletImage = loadImage("assets/asteroids_bullet.png");
    shipImage = loadImage("assets/asteroids_ship0001.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = 0.98;
    ship.setCollider("circle", 0, 0, 20);

    ship.addImage("normal", shipImage);
    ship.addAnimation("thrust", "assets/asteroids_ship0002.png", "assets/asteroids_ship0007.png");

    asteroids = new Group();
    bullets = new Group();

    for(var i = 0; i<8; i++) {
      var ang = random(360);
      var px = width/2 + 1000 * cos(radians(ang));
      var py = height/2+ 1000 * sin(radians(ang));
      createAsteroid(3, px, py);
    }
  }

  this.enter = function() {
    //entering scene4
    console.log("entering level 3");
    lives = 0;
  }

  this.draw = function() {
    background(0);

    fill(255);
    var txtSize = Math.sqrt(width);
    textSize(txtSize);
    textAlign(CENTER);
    text("To the Left or Right", width/2, 30);
    //text(asteroids.length, width/2, height/2);

    //ship.addSpeed(shipSpeed, ship.rotation);

      if(ship.position.x<-MARGIN) ship.position.x = width+MARGIN;
      if(ship.position.x>width+MARGIN) ship.position.x = -MARGIN;
      if(ship.position.y<-MARGIN) ship.position.y = height+MARGIN;
      if(ship.position.y>height+MARGIN) ship.position.y = -MARGIN;

    for(var i=0; i<asteroids.length; i++) {
      var s = asteroids[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
    }

    asteroids.overlap(bullets, asteroidHit);

    ship.bounce(asteroids, loseLife);

    if(keyDown(LEFT_ARROW) || keyDown('a'))
      ship.rotation -= 4;
    if(keyDown(RIGHT_ARROW) || keyDown('d'))
      ship.rotation += 4;
    if(keyDown(UP_ARROW) || keyDown('w'))
    {
      //shipSpeed = 100;
      ship.addSpeed(100, 0);
      ship.changeAnimation("thrust");
    }
    else if(keyDown(DOWN_ARROW) || keyDown('s'))
    {
      ship.addSpeed(100, 180);
      ship.changeAnimation("thrust");
    }
    else{
      ship.changeAnimation("normal");
    }

    if(keyWentDown('x'))
    {
      var bullet = createSprite(ship.position.x, ship.position.y);
      bullet.addImage(bulletImage);
      bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
      bullet.life = 50;
      bullets.add(bullet);
    }

    if(asteroids.length <= 0){
        text("YOU WIN", width/2, (height/2)-txtSize);
        text("Press ENTER", width/2, (height/2)+txtSize);
        ship.remove();
        if(keyCode == ENTER){
          this.sceneManager.showScene(scene5);
        }
    }else{
        text("Crashes:" + lives, width/2, height/2);
    }

    drawSprites();
  }

  function createAsteroid(type, x, y){
    var a = createSprite(x, y);
    var img = loadImage("assets/asteroid"+floor(random(0, 3))+".png");
    a.addImage(img);
    a.setSpeed(2.5-(type/2), random(360));
    a.rotationSpeed = 0.5;
    //a.debug = true;
    a.type = type;

    if(type == 2)
      a.scale = 0.6;
    if(type == 1)
      a.scale = 0.3;

    a.mass = 2+a.scale;
    a.setCollider("circle", 0, 0, 50);
    asteroids.add(a);
    return a;
  }

  function asteroidHit(asteroid, bullet){
    var newType = asteroid.type-1;

    if(newType>0) {
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    }

    for(var i=0; i<10; i++) {
      var p = createSprite(bullet.position.x, bullet.position.y);
      p.addImage(particleImage);
      p.setSpeed(random(3, 5), random(360));
      p.friction = 0.95;
      p.life = 15;
    }

      bullet.remove();
      asteroids.remove(asteroid);
      asteroid.remove();
  }

  function loseLife(){
    lives++;

    ship.position.x = width/2;
    ship.position.y = height/2;
  }
}

function scene5() {
  //level 4
  this.setup = function() {
    //setup for scene5
    console.log("setup for Opposite Day");

    bulletImage = loadImage("assets/asteroids_bullet.png");
    shipImage = loadImage("assets/asteroid0.png");
    particleImage = loadImage("assets/asteroids_particle.png");

    ship = createSprite(width/2, height/2);
    ship.maxSpeed = 6;
    ship.friction = 0.98;
    ship.setCollider("circle", 0, 0, 20);

    ship.addImage("normal", shipImage);

    asteroids = new Group();
    bullets = new Group();

    for(var i = 0; i<8; i++) {
      var ang = random(360);
      var px = width/2 + 1000 * cos(radians(ang));
      var py = height/2+ 1000 * sin(radians(ang));
      createAsteroid(3, px, py);
    }
  }

  this.enter = function() {
    //entering scene5
    console.log("entering level 4");
    lives = 0;
  }

  this.draw = function() {
    background(0);

    fill(255);
    var txtSize = Math.sqrt(width);
    textSize(txtSize);
    textAlign(CENTER);
    text("Opposite Day", width/2, 30);
    //text(asteroids.length, width/2, height/2);

    if(shipSpeed < 0){
        slowDown = false;
        shipSpeed = 100;
    }
    //ship.addSpeed(shipSpeed, ship.rotation);

      if(ship.position.x<-MARGIN) ship.position.x = width+MARGIN;
      if(ship.position.x>width+MARGIN) ship.position.x = -MARGIN;
      if(ship.position.y<-MARGIN) ship.position.y = height+MARGIN;
      if(ship.position.y>height+MARGIN) ship.position.y = -MARGIN;

    for(var i=0; i<asteroids.length; i++) {
      var s = asteroids[i];
      if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
      if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
      if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
      if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
    }

    asteroids.overlap(bullets, asteroidHit);

    ship.bounce(asteroids, loseLife);

    if(keyDown(LEFT_ARROW) || keyDown('a'))
      ship.rotation += 4;
    if(keyDown(RIGHT_ARROW) || keyDown('d'))
      ship.rotation -= 4;
    if(keyDown(DOWN_ARROW) || keyDown('s'))
    {
      slowDown = false;
      //shipSpeed = 100;
      ship.addSpeed(100, ship.rotation);
      ship.changeAnimation("thrust");
    }
    else
      ship.changeAnimation("normal");

    if(keyWentUp(DOWN_ARROW) || keyWentUp('s')){
        slowDown = true;
    }

    if(slowDown){
        shipSpeed--;
        ship.addSpeed(shipSpeed, ship.rotation);
    }

    if(keyWentDown('x'))
    {
      var bullet = createSprite(ship.position.x, ship.position.y);
      bullet.addImage(bulletImage);
      bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
      bullet.life = 50;
      bullets.add(bullet);
    }

    if(asteroids.length <= 0){
        text("YOU WIN", width/2, (height/2)-txtSize);
        text("Press ENTER to Exit", width/2, (height/2)+txtSize);
        ship.remove();
        if(keyCode == ENTER){
          this.sceneManager.showScene(scene1);
        }
    }else{
        text("Crashes:" + lives, width/2, height/2);
    }

    drawSprites();
  }

  function createAsteroid(type, x, y){
    var a = createSprite(x, y);
    var img = loadImage("assets/asteroids_ship000"+floor(random(1, 7))+".png");
    a.addImage(img);
    a.setSpeed(2.5-(type/2), random(360));
    a.rotationSpeed = 0.5;
    //a.debug = true;
    a.type = type;

    if(type == 2)
      a.scale = 0.6;
    if(type == 1)
      a.scale = 0.3;

    a.mass = 2+a.scale;
    a.setCollider("circle", 0, 0, 50);
    asteroids.add(a);
    return a;
  }

  function asteroidHit(asteroid, bullet){
    var newType = asteroid.type-1;

    if(newType>0) {
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
      createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    }

    for(var i=0; i<10; i++) {
      var p = createSprite(bullet.position.x, bullet.position.y);
      p.addImage(particleImage);
      p.setSpeed(random(3, 5), random(360));
      p.friction = 0.95;
      p.life = 15;
    }

      bullet.remove();
      asteroids.remove(asteroid);
      asteroid.remove();
  }

  function loseLife(){
    lives++;

    ship.position.x = width/2;
    ship.position.y = height/2;
  }
}
