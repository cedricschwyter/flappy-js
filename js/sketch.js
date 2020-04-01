

var SPEED  = 5;       // the game speed (how many pixels per iteration it shifts)
const POWER  = 30;      // the jump power of the bird (initial upwards velocity for jump)
const BOUNCE = 0.65;    // percentage of the jump energy to get inverted on impact with floor or ceiling

var WIDTH;
var HEIGHT;

var tiles;
var bird;

var score = 0;
var highscore = 0;

var bounced = 0;

var startMode = true;
var deathMode = false;
var drugMode = false;

var bgcolor = color(240,240,240);

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
    tiles.push(new Tile(0, false));
    tiles.push(new Tile(1, false));
    tiles.push(new Tile(2));
    tiles.push(new Tile(3)); 
    tiles.push(new Tile(4));
    tiles.push(new Tile(5));
    tiles.push(new Tile(6));

    let canvas = createCanvas(width, height);
    canvas.position(WIDTH / 4, 0, "fixed");
	if (startMode){
		background(240);
		tiles.forEach(_tile => {
			_tile.update();
			_tile.draw();
			if(_tile.get_outofbounds()){
				tiles.push(new Tile(5));
				tiles.shift();
			}
		});
		bird.update();
		bird.draw();
		textSize(64);
		fill(0, 0, 255);
		text('PRESS SPACE TO START', width/4, height/2);
	}
}

function draw() {
	if(!startMode && !deathMode){
		background(240);
		tiles.forEach(_tile => {
			_tile.update();
			_tile.draw();
			if(_tile.get_outofbounds()){
				tiles.push(new Tile(5));
				tiles.shift();
			}
		});
		bird.update();
		bird.draw();
		
		if(drugMode && millis() % 1000){
			SPEED = random(1,20);
		}
		
		textSize(64);
		fill(0, 0, 255);
		text(score, 0, 60);
	}
	if(deathMode){
		textSize(64);
		fill(0, 0, 255);
		text('SCORE:' + score + ' HIGHSCORE: ' + highscore, width/4, height/2);
	}
}


function keyPressed() {
    if(keyCode == 32){
		if(!startMode && !deathMode){
			bird.jump();
			bounced = millis();
		}
		if(startMode){
			startMode = false;
		}
		if(deathMode){
			score = 0;
			deathMode = false;
			startMode = true;
			setup();
		}
	}
	if(keyCode == 68){
		drugMode = true;
	}
	
}