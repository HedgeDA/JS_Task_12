'use strict';

const colors = ["#ffffff", "#ffe9c4", "#d4fbff"];
const PI = Math.PI;

let canvas;
let ctx;

function random(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function generateStars() {
  ctx.beginPath();

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let star = 0; star < random(200, 400); star++) {
    ctx.beginPath();
    ctx.fillStyle = colors[random(0, 2)];
    ctx.strokeStyle = ctx.fillStyle;
    ctx.globalAlpha = random(8, 10) / 10;
    ctx.arc(random(1, canvas.width), random(1, canvas.height), random(0, 11) / 10, 0, 2 * PI);
    ctx.fill();
  }
}

function onClick(event) {
  generateStars();
}

function init() {
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.addEventListener('click', onClick);
  ctx = canvas.getContext('2d');

  generateStars();
}

document.addEventListener('DOMContentLoaded', init);