

class Bird {
    constructor() {
        this.x = 60;
        this.y = random(height);
        this.yVel = 0;
        this.r = 15;
        this.grav = 0.8;
        this.power = -12;
        this.highlight = false;
        this.score = 0;
        this.fitness = 0;
        this.brain = new NeuralNetwork(5, 10, 2);
    }

    draw() {
        imageMode(CENTER);
        image(birdImg, this.x, this.y, this.r * 2, this.r * 2);
    }

    think(pipes) {
        let currentPipe = pipes.find(pipe => pipe.x + pipe.w > this.x);
        let inputs = [];
        inputs.push(this.y / height);
        inputs.push(this.yVel / 10);
        inputs.push(currentPipe.top / height);
        inputs.push(currentPipe.bottom / height);
        inputs.push(currentPipe.x / width);
        let outputs = this.brain.predict(inputs);
        if(outputs[0] > outputs[1]) {
            this.jump();
        }
    }

    update() {
        this.score++;
        this.yVel += this.grav;
        this.yVel *= 0.9;
        this.y += this.yVel;

        if(this.y > height) {
            this.y = height;
            this.yVel = 0;
        }

        if(this.y < 0) {
            this.y = 0;
            this.yVel = 0;
        }
    }

    jump() {
        this.yVel += this.power;
    }

    hitsPipe(pipe) {
        return (
            (this.y - this.r < pipe.top || this.y + this.r > pipe.bottom) && 
            this.x + this.r > pipe.x && 
            this.x - this.r < pipe.x + pipe.w
        );
    }
}