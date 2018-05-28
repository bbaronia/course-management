var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");
var midX = canvas.height / 2;
var midY = canvas.width / 2;
ctx.translate(midX, midY);

drawAxes(ctx, canvas.width, canvas.height);

function drawAxes(ctx, width, height) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = "square";
    ctx.strokeStyle = "white";
    ctx.moveTo(0, height / 2);
    ctx.lineTo(0, -height / 2);

    ctx.moveTo(width / 2, 0);
    ctx.lineTo(-width / 2, 0);
    ctx.stroke();
}