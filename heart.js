// polyfill (簡化版)
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    return setTimeout(callback, 1000 / 60);
  };

// 全域變數
var canvas, ctx, width, height, koef;
var rand = Math.random;

// 原始愛心參數 (不變)
var traceCount = 50; 
var dr = 0.1;
var pointsOrigin = [];
var targetPoints = [];
var e = [];
var heartPointsCount = 0;
var loaded = false;
var time = 0;
var config = { traceK: 0.3, timeDelta: 0.03 };

// 心形公式
function heartPosition(rad) {
  return [
    Math.pow(Math.sin(rad), 3),
    -(15 * Math.cos(rad) -
      5 * Math.cos(2 * rad) -
      2 * Math.cos(3 * rad) -
      Math.cos(4 * rad))
  ];
}
function scaleAndTranslate(pos, sx, sy, dx, dy) {
  return [dx + pos[0] * sx, dy + pos[1] * sy];
}

// 初始化
function startHeart() {
  if (loaded) return;
  loaded = true;

  canvas = document.getElementById("heart");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  // 原始點集合
  pointsOrigin = [];
  for (var i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
  }
  for (var i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
  }
  for (var i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
  }
  heartPointsCount = pointsOrigin.length;

  targetPoints = new Array(heartPointsCount);

  // 粒子
  e = [];
  for (var i = 0; i < heartPointsCount; i++) {
    var x = rand() * width;
    var y = rand() * height;
    var obj = {
      vx: 0, vy: 0,
      R: 2,
      // 調整這兩個參數來改變速度和聚集效果
      speed: rand() * 40 + 40,  // 增加基礎速度，讓粒子移動更快
      q: ~~(rand() * heartPointsCount),
      D: 2 * (i % 2) - 1,
      force: 0.05 * rand() + 0.90, // 增加力量（減少摩擦力），讓粒子更快達到目標
      f: "hsla(0," + ~~(40 * rand() + 60) + "%," +
        ~~(60 * rand() + 20) + "%,.3)",
      trace: []
    };
    for (var k = 0; k < traceCount; k++) obj.trace[k] = { x: x, y: y };
    e.push(obj);
  }

  // 開始動畫
  requestAnimationFrame(loop);
}

// resize
function resizeCanvas() {
  width = canvas.width = document.documentElement.clientWidth;
  height = canvas.height = document.documentElement.clientHeight;
  
  const heartOriginalWidth = 420;
  const heartOriginalHeight = 26;
  const scaleRatio = Math.min(width / heartOriginalWidth, height / heartOriginalHeight) * 0.8;
  
  koef = scaleRatio / (document.documentElement.clientWidth / heartOriginalWidth);
  
  if (ctx) {
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);
  }
}

// pulse
function pulse(kx, ky) {
  for (var i = 0; i < pointsOrigin.length; i++) {
    targetPoints[i] = [];
    targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
    targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
  }
}

// 主迴圈
function loop() {
  var n = -Math.cos(time);
  pulse((1 + n) * 0.5, (1 + n) * 0.5);
  time += ((Math.sin(time) < 0) ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;

  ctx.fillStyle = "rgba(0,0,0,.1)";
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < e.length; i++) {
    var u = e[i];
    var q = targetPoints[u.q];
    if (!q) continue;
    var dx = u.trace[0].x - q[0];
    var dy = u.trace[0].y - q[1];
    var length = Math.sqrt(dx * dx + dy * dy) || 1;

    if (10 > length) {
      if (0.95 < rand()) {
        u.q = ~~(rand() * heartPointsCount);
      } else {
        if (0.99 < rand()) {
          u.D *= -1;
        }
        u.q += u.D;
        u.q %= heartPointsCount;
        if (u.q < 0) u.q += heartPointsCount;
      }
    }

    u.vx += -dx / length * u.speed * 0.02;
    u.vy += -dy / length * u.speed * 0.02;
    u.trace[0].x += u.vx;
    u.trace[0].y += u.vy;
    u.vx *= u.force;
    u.vy *= u.force;

    for (var k = 0; k < u.trace.length - 1; k++) {
      var T = u.trace[k];
      var N = u.trace[k + 1];
      N.x -= config.traceK * (N.x - T.x);
      N.y -= config.traceK * (N.y - T.y);
    }

    ctx.fillStyle = u.f;
    for (var k = 0; k < u.trace.length; k++) {
      ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
    }
  }

  requestAnimationFrame(loop);
}

// resize 監聽
window.addEventListener("resize", function () {
  if (!canvas) return;
  resizeCanvas();

});






