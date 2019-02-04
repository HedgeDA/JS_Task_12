'use strict';

const PI = Math.PI;
const wall = {};
const nextPointFunctions = [
  (x, y, time) => {
    return [
      x + Math.sin((50 + x + (time / 10)) / 100) * 3,
      y + Math.sin((45 + x + (time / 10)) / 100) * 4
    ]
  },
  (x, y, time) => {
    return [
      x + Math.sin((x + (time / 10)) / 100) * 5,
      y + Math.sin((10 + x + (time / 10)) / 100) * 2
    ]
  }
];

function random(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function moveElements() {
  wall.elements.forEach((element) => {
    element.position = element.nextPoint(element.x, element.y, new Date());

    if (element.angle > 0) {
      element.angle += element.rotation;

      if (element.angle < 0) {
        element.angle = 360;
      }
      if (element.angle > 360) {
        element.angle = 0;
      }
    }
  });
}

function repaint() {
  wall.ctx.clearRect(0, 0, wall.canvas.width, wall.canvas.height);

  wall.elements.forEach((element) => {
    element.draw();
  });
}

function fillElements() {
  wall.elements = [];
  for (let index = 0; index < random(50, 200); index++) {
    let element = {
      'x': random(0, wall.canvas.width),
      'y': random(0, wall.canvas.height),
      'size': random(1, 6) / 10,
      'nextPoint': nextPointFunctions[random(0, nextPointFunctions.length - 1)]
    };

    if (index % 2) {
      element.draw = drawCircle;
      element.angle = -1;
    } else {
      element.draw = drawCross;
      element.angle = random(0, 360);
      element.rotation = random(0, 1) === 0 ? 0.2 : -0.2;
    }

    element.position = [element.x, element.y];

    wall.elements.push(element);
  }
}

function drawCircle() {
  wall.ctx.beginPath();
  wall.ctx.lineWidth = this.size * 5;
  wall.ctx.arc(...this.position, this.size * 12, 0, 2 * PI);
  wall.ctx.stroke();
}

function drawCross() {
  wall.ctx.beginPath();
  wall.ctx.save();

  wall.ctx.translate( ...this.position );
  wall.ctx.rotate(this.angle * PI / 180);
  wall.ctx.lineWidth = this.size * 5;

  wall.ctx.moveTo(-this.size * 10, 0);
  wall.ctx.lineTo(this.size * 10, 0);
  wall.ctx.moveTo(0, -this.size * 10);
  wall.ctx.lineTo(0, this.size * 10);
  wall.ctx.stroke();

  wall.ctx.restore();
}

function initWall() {
  wall.canvas = document.getElementById('wall');
  wall.canvas.width = window.innerWidth;
  wall.canvas.height = window.innerHeight;

  wall.ctx = wall.canvas.getContext('2d');
  wall.ctx.strokeStyle = '#ffffff';

  fillElements();
}

function tick() {
  moveElements();

  repaint();

  window.requestAnimationFrame(tick);
}

function init() {
  initWall();

  tick();
}

document.addEventListener('DOMContentLoaded', init);