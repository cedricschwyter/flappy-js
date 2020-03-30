

var width;
var height;

var tiles;
var bird;

function preload() {
    // TODO: load textures
}

function setup() {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    if(width > height)
        width = 4 * height / 3;
    else
        height = 3 * width / 4;
    tiles = [];
    bird = new Bird();
    createCanvas(width, height);
}

function draw() {
    background(255);
    for(tile in tiles)
        tile.update();
    bird.update();
    bird.draw();
}

function keyPressed() {
    if(keyCode == 32) {
        bird.jump();
    }
}