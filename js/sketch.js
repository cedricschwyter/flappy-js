

const SPEED  = 5;       // the game speed (how many pixels per iteration it shifts)
const POWER  = 50;      // the jump power of the bird (initial upwards velocity for jump)
const BOUNCE = 0.65;    // percentage of the jump energy to get inverted on impact with floor or ceiling

var WIDTH;
var HEIGHT;

var tiles;
var bird;

function preload() {
    // TODO: load textures
}

function setup() {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    // keep aspect ratio at 4:3, such that always exactly 
    // 4 elements with width = width / 4 fit on screen
    if(width > height)
        width = 4 * height / 3; 
    else
        height = 3 * width / 4;
    bird = new Bird();
    tiles = [];
    for(i = 0; i < 5; i++)      // 5 elements (4 on screen and 1 moving in)
        tiles.push(new Tile(i));
    createCanvas(width, height);
}

function draw() {
    background(255);
    tiles.forEach(_tile => {
        _tile.update();
        _tile.draw();
    });
    bird.update();
    bird.draw();
}

function keyPressed() {
    if(keyCode == 32)
        bird.jump();
}