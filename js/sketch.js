

const SPEED  = 5;       // the game speed (how many pixels per iteration it shifts)
const POWER  = 50;      // the jump power of the bird (initial upwards velocity for jump)
const BOUNCE = 0.65;    // percentage of the jump energy to get inverted on impact with floor or ceiling

var WIDTH;
var HEIGHT;

var tiles;
var bird;

var bounced = 0;

var startCondition = true;

function preload() {
    // TODO: load textures
}

function setup() {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    // keep aspect ratio at 4:3, such that always exactly 
    // 4 elements with width = width / 4 fit on screen
	// add start conditition 
    if(width > height)
        width = 4 * height / 3; 
    else
        height = 3 * width / 4;
    bird = new Bird();
    tiles = [];
	if(startCondition == true){	//hacky
		tiles.push(new Tile(0,false));
		tiles.push(new Tile(1,false));
		tiles.push(new Tile(2));
		tiles.push(new Tile(3)); 
		tiles.push(new Tile(4));
		startCondition = false;
	}else{
		for(i = 0; i < 5; i++)      // 5 elements (4 on screen and 1 moving in)
			tiles.push(new Tile(i));
	}

    createCanvas(width, height);
}

function draw() {
    background(255);
    tiles.forEach(_tile => {
        _tile.update();
        _tile.draw();
		if(_tile.get_outofbounds() == true){
			tiles.push(new Tile(4));
			tiles.shift();
		}
    });
    bird.update();
    bird.draw();
}

function keyPressed() {
    if(keyCode == 32){
        bird.jump();
		bounced = millis();
	}
		
}