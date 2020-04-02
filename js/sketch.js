const CANV_SIZE = Math.min(window.innerHeight, window.innerWidth);
let NUM_BIRDS = 500;
const birdSrc = 'https://raw.githubusercontent.com/D3PSI/flappy-ai/master/res/textures/bird1.png';
const pipeSrc = 'https://raw.githubusercontent.com/D3PSI/flappy-ai/master/res/textures/pipe.png'
//const pipeSrc1 = 'https://raw.githubusercontent.com/D3PSI/flappy-ai/master/res/textures/pipe1.png'
const bgSrc = 'https://raw.githubusercontent.com/D3PSI/flappy-ai/master/res/textures/bg.png';
let birds = [];
let oldGen = [];
let pipes = [];
let highScore = 0;
let counter = 0;
let gen = 1;
let speedSlider;
let popSizeSlider;
let birdImg;
let pipeImg;
let pipeImg1;
let bgImg;

function preload() {
	birdImg = loadImage(birdSrc);
	pipeImg = loadImage(pipeSrc);
	//pipeImg1 = loadImage(pipeSrc1);
	bgImg = loadImage(bgSrc);
}

function setup() {
	createCanvas(CANV_SIZE, 3 * CANV_SIZE / 4);
    createP('Lerning Speed (tab may freeze if set too high):');
	speedSlider = createSlider(1, 100, 1, 1);
    createP('Population size:');
	popSizeSlider = createSlider(1, 1000, 300);
    newGeneration(true);
}

function draw() {
	textSize(32);
	fill(0);
	text('Learning speed:', CANV_SIZE, CANV_SIZE - 20);
	NUM_BIRDS = popSizeSlider.value();
	imageMode(CORNER);
	for(i = 0; i < width; i++)
		image(bgImg, (i - 1) * 100, 0, i * 100, height);
    for(let i = 0; i < speedSlider.value(); i++) {
        if(counter % 50 === 0) {
			pipes.push(new Pipe());
        }
        birds.forEach(bird => {
            bird.think(pipes);
            bird.update();
            if(bird.score > highScore) {
                highScore = bird.score;
            }
        });
        for(let i = pipes.length - 1; i >= 0; i--){
            let pipe = pipes[i];
            pipe.update();
            if(pipe.isOffscreen()) {
                pipes.splice(i, 1);
            }
            for(let j = birds.length - 1; j >= 0; j--){
                let bird = birds[j];
                if(bird.hitsPipe(pipe) || 
                    bird.y - bird.r < 0 ||
                    bird.y + bird.r > height) {
                    oldGen.push(birds.splice(j, 1)[0]);
                }
            }
        }
        counter++;
        endOfGen();
    }
    background('#00a8ff');
    birds.forEach(bird => {
        bird.draw();
    });
    pipes.forEach(pipe => {
        pipe.draw();
    });
    fill(255);
    rect(0, height - 30, width, height);
    fill(0);
    textSize(20);
    text(`Score: ${birds[0].score.toString().padStart(10, ' ')}, Generation: ${gen}, Highest Score: ${highScore}`, 20, height - 10);
}

function newGeneration(genOne) {
    for(let i = 0; i < NUM_BIRDS; i++) {
        birds.push(genOne ? new Bird() : birdsPickOne());
    }
}

function endOfGen() {
    if(birds.length === 0) {
        calculateFitness();
        newGeneration();
        oldGen = [];
        pipes = [];
        counter = 0;
        gen++;
    }
}

function birdsPickOne() {
    let index = 0;
    let r = random(1);
    while(r > 0) {
        r -= oldGen[index].fitness;
        index++;
	}
    index--;
    let newBird = new Bird();
    let pickedBird = oldGen[index];
    pickedBird.brain.mutate(mutate);
    newBird.brain = pickedBird.brain.copy();
    return newBird;
}

function calculateFitness() {
    let sum = oldGen.reduce((total, bird) => total += bird.score, 0);

    oldGen.forEach(bird => {
        bird.fitness = bird.score / sum;
    });
}

function mutate(val) {
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5;
        return val + offset;;
    } else {
        return val;
    }
}

// Code by Daniel Shiffman on TheCodingTrain
// Other techniques for learning
// Simple, highly specialized implementation of a ML-library with genetic algorithm

class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  // TODO: document what a, b, c are
  constructor(a, b, c) {
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  train(input_array, target_array) {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(this.activation_function.func);

    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, this.activation_function.dfunc);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }

  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }
}

// let m = new Matrix(3,2);


class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols) {
      console.log('Columns and Rows of A must match Columns and Rows of B.');
      return;
    }

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.');
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  print() {
    console.table(this.data);
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}
