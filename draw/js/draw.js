'use strict';

const draw = {}

function repaint () {
  draw.ctx.clearRect(0, 0, draw.canvas.width, draw.canvas.height);

  draw.curves.forEach((curve) => {
    draw.ctx.beginPath();
    draw.ctx.arc(curve[0][0], curve[0][1], curve[0][3] / 2, 0, 2 * Math.PI);
    draw.ctx.fillStyle = 'hsl(' + curve[0][2]  + ', 100%, 50%)';
    draw.ctx.strokeStyle = draw.ctx.fillStyle;
    draw.ctx.fill();

    draw.ctx.beginPath();
    draw.ctx.lineJoin = 'round';
    draw.ctx.lineCap = 'round';
    draw.ctx.lineWidth = curve[0][3];
    draw.ctx.moveTo(curve[0][0], curve[0][1]);

    for (let index = 1; index < curve.length - 1; index++) {
      draw.ctx.lineTo(curve[index + 1][0], curve[index + 1][1]);
      draw.ctx.stroke();

      draw.ctx.beginPath();
      draw.ctx.lineJoin = 'round';
      draw.ctx.lineCap = 'round';
      draw.ctx.lineWidth = curve[index + 1][3];
      draw.ctx.moveTo(curve[index + 1][0], curve[index + 1][1]);
      draw.ctx.strokeStyle = 'hsl(' + curve[index + 1][2] + ', 100%, 50%)';
    }
  });

  draw.repaint = false;
}

function onMousedown(event) {
  draw.drawing = true;
  draw.repaint = true;

  draw.brushColor = Math.floor(Math.random() * 360);

  draw.curves.push([[event.offsetX, event.offsetY, draw.brushColor, draw.brushRadius]]);
}

function onMousemove() {
  if (draw.drawing) {
    draw.repaint = true;

    draw.curves[draw.curves.length - 1].push([event.offsetX, event.offsetY, draw.brushColor, draw.brushRadius]);
  }
}

function onMouseup() {
  draw.drawing = false;
}

function onKeyDown(event) {
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  if (event.key === 'Shift') {
    draw.shift = true;
  }
}

function onKeyUp(event) {
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  if (event.key === 'Shift') {
    draw.shift = false;
  }
}

function initDraw(){
  draw.canvas = document.getElementById('draw');
  draw.canvas.width = window.innerWidth;
  draw.canvas.height = window.innerHeight;

  draw.drawing = false;
  draw.repaint = false;
  draw.shift = false;

  draw.brushRadius = 100;
  draw.decrease = true;

  draw.curves = [];

  draw.ctx = draw.canvas.getContext('2d');
  draw.ctx.clearRect(0, 0, draw.canvas.width, draw.canvas.height);
}

function tick() {
  if (!draw.shift) {
    draw.brushColor < 359 ? draw.brushColor++ : draw.brushColor = 0;
  } else {
    draw.brushColor > 0 ? draw.brushColor-- : draw.brushColor = 359;
  }

  if (draw.decrease) {
    if (draw.brushRadius > 5) {
      draw.brushRadius--
    } else {
      draw.decrease = !draw.decrease;
    }
  } else {
    if (draw.brushRadius < 100) {
      draw.brushRadius++
    } else {
      draw.decrease = !draw.decrease;
    }
  }

  if (draw.repaint) {
    repaint();
  }

  window.requestAnimationFrame(tick);
}

function init() {
  initDraw();

  window.addEventListener('resize', initDraw);
  draw.canvas.addEventListener("dblclick", initDraw);

  draw.canvas.addEventListener("mousedown", onMousedown);
  draw.canvas.addEventListener("mouseup", onMouseup);
  draw.canvas.addEventListener("mouseleave", onMouseup);
  draw.canvas.addEventListener("mousemove", onMousemove);

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  tick();
}

document.addEventListener('DOMContentLoaded', init);
