//global objects
var mgr;

var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup(){
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent('sketch-holder');
  mgr = new SceneManager();

  // Preload scenes. Preloading is normally optional
  // ... but needed if showNextScene() is used.
  mgr.addScene (scene1);
  mgr.addScene (scene2);
  mgr.addScene (scene3);
  mgr.addScene (scene4);
  mgr.showNextScene();
}

function draw(){
  // pass the current draw function into the SceneManager
  mgr.draw();
}

function keyPressed()
{
    // You can optionaly handle the key press at global level...
    switch(key)
    {
        case '1':
            mgr.showScene( scene1 );
            break;
        case '2':
            mgr.showScene( scene2 );
            break;
        case '3':
            mgr.showScene( scene3 );
            break;
        case '4':
            mgr.showScene( scene4 );
            break;
    }

    // ... then dispatch via the SceneManager.
    mgr.handleEvent("keyPressed");
}

function keyReleased() {
  mgr.handleEvent("keyReleased");
}
