//When page is loaded
$(document).ready(async function () {
    //Random equation generation
    var eqY0 = Math.floor(Math.random() * 5) + 1;
    var eqY0Sign = (eqY0 >= 0) ? '+' : '-';
    var eqX0 = Math.floor(Math.random() * 5) + 1;
    var eqX0Sign = (eqX0 >= 0) ? '+' : '-';
    var eqM = Math.floor(Math.random() * 5) + 1;
    var eqX1 = eqX0 * eqM;
    var eqX1Sign = (eqX1 >= 0) ? '+' : '-';
    var eqB = eqX1 - eqY0;
    var eqBSign = (eqB >= 0) ? '+' : '-';
    var grY0 = eqB;
    var grY1 = eqB + eqM;
    var grYmin = eqB - eqM * 5;

    //HTML to render step list
    var steps = '<div class="card"><div class="card-header" id="heading1">'
    + '<h5 class="mb-0"><button class="btn btn-link" data-toggle="collapse"'
    + ' data-target="#collapse1" aria-expanded="false" aria-controls="collapse1">'
    + 'Step 1: Put the equation in slope intercept form: <code>y=mx+b</code>'
    + '</button></h5></div><div id="collapse1" class="collapse"'
    + ' aria-labelledby="heading1"><div class="card-body">'
    + '<code> y ' + eqY0Sign + ' ' + Math.abs(eqY0) + ' = ' + eqM + '(x '
    + eqX0Sign + ' ' + Math.abs(eqX0) + ')</code><br><code> y ' + eqY0Sign
    + ' ' + Math.abs(eqY0) + ' = ' + eqM + 'x ' + eqX1Sign + ' ' +Math.abs(eqX1)
    + '</code><br><code> y = ' + eqM + 'x ' + eqBSign + ' ' + Math.abs(eqB)
    + '</code></div></div></div><div class="card"><div class="card-header"'
    + ' id="heading2"><h5 class="mb-0"><button class="btn btn-link"'
    + ' data-toggle="collapse" data-target="#collapse2" aria-expanded="false"'
    + ' aria-controls="collapse2">'
    + 'Step 2: Find two points by plugging 0 and 1 into the equation as x.'
    + '</button></h5></div><div id="collapse2" class="collapse"'
    + ' aria-labelledby="heading2"><div class="card-body"><table'
    + ' class="table"><thead><tr><th scope="col">X</th><th scope="col">Y</th>'
    + '</tr></thead><tbody><tr><td>0</td><td>' + grY0 + '</td></tr><tr><td>1'
    + '</td><td>' + grY1 + '</td></tr></tbody></table></div></div></div>'
    + '<div class="card"><div class="card-header" id="heading3"><h5 class="mb-0">'
    + '<button class="btn btn-link" data-toggle="collapse"'
    + ' data-target="#collapse3" aria-expanded="false" aria-controls="collapse3">'
    + 'Step 3: Mark the two points on a graph and draw a line through them.'
    + '</button></h5></div><div id="collapse3" class="collapse"'
    + ' aria-labelledby="heading3"><div class="card-body">'
    + '<canvas id="graph" width="400" height="400" style="background-color:black">'
    + '</canvas></div></div></div>'

    //Put HTML on page, wait until done
    await $("#step-list").before(steps);

    //Find out how high graph has to go to render all points
    var docHeight;
    if (Math.abs(grY0) > Math.abs(grY1)) {
        docHeight = Math.abs(grY0) + 1;
    }
    else {
        docHeight = Math.abs(grY1) + 1;
    }

    //Set up canvas for drawing
    var canvas = document.getElementById("graph");
    var ctx = canvas.getContext("2d");
    var mid = canvas.height / 2;
    ctx.translate(mid, mid);

    //Get scale to shift by so line fills canvas
    var scale = canvas.height / 2 / docHeight;

    //Draw
    drawAxes(ctx, canvas.height);
    drawLine(ctx, scale, docHeight);
    drawPoints(ctx, scale, docHeight);
    

    function drawAxes(ctx, height) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "square";
        ctx.strokeStyle = "white";

        //X axis
        ctx.moveTo(0, height / 2);
        ctx.lineTo(0, -height / 2);

        //Y axis
        ctx.moveTo(height / 2, 0);
        ctx.lineTo(-height / 2, 0);

        ctx.stroke();
    }

    function drawLine(ctx, scale, xMinMax) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "square";
        ctx.strokeStyle = "aqua";

        //Find minimum and maximum yvals to draw line
        var yMin = eqM * -xMinMax + eqB;
        var yMax = eqM * xMinMax + eqB;

        ctx.moveTo(-xMinMax * scale, -yMin * scale);
        ctx.lineTo(xMinMax * scale, -yMax * scale);

        ctx.stroke();
    }

    function drawPoints(ctx, scale) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";

        //Find locations to put points
        var y0 = -1 * grY0 * scale;
        var y1 = -1 * grY1 * scale;

        ctx.moveTo(0, y0);
        ctx.lineTo(0, y0);

        ctx.moveTo(scale, y1);
        ctx.lineTo(scale, y1);

        ctx.stroke();
    }
})