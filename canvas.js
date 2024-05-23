var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gravity = 0.5;
var dampening = 0.7;
var circles = [];
var lastTime = 0;
var backgroundGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
backgroundGradient.addColorStop(0, '#111');
backgroundGradient.addColorStop(1, '#444');
ctx.fillStyle = backgroundGradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
var Circle = /** @class */ (function () {
    function Circle(x, y, radius) {
        if (radius === void 0) { radius = 20; }
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dy = 0;
        this.trail = [];
    }
    Circle.prototype.draw = function () {
        var gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.3, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(0, 150, 255, 1)');
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0.5)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();
        for (var i = 0; i < this.trail.length; i++) {
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, this.radius, 0, Math.PI * 2, false);
            var trailAlpha = (i + 1) / this.trail.length * 0.5;
            ctx.fillStyle = "rgba(0, 150, 255, ".concat(trailAlpha, ")");
            ctx.fill();
            ctx.closePath();
        }
    };
    Circle.prototype.update = function (deltaTime) {
        var timeFactor = deltaTime / 15;
        if (this.y + this.radius + this.dy * timeFactor > canvas.height) {
            this.dy = -this.dy * dampening;
            this.y = canvas.height - this.radius;
        }
        else {
            this.dy += gravity * timeFactor;
        }
        this.y += this.dy * timeFactor;
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
            this.trail.shift();
        }
        this.draw();
    };
    return Circle;
}());
function tick(currentTime) {
    var deltaTime = currentTime - lastTime;
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function (circle) { return circle.update(deltaTime); });
    lastTime = currentTime;
    requestAnimationFrame(tick);
}
canvas.addEventListener('click', function (event) {
    var x = event.clientX;
    var y = event.clientY;
    circles.push(new Circle(x, y));
});
requestAnimationFrame(function (currentTime) {
    lastTime = currentTime;
    tick(currentTime);
});
