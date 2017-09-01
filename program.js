var body = document.body;
var canvas = $('<canvas></canvas>');
var playTimer;

window.fps = 24;

var w = 400;
var h = 250;

canvas[0].width = 400;
canvas[0].height = 250;
window.g = canvas[0].getContext('2d');
window.g.imageSmoothingEnabled = false;

canvas[0].extra = {
    drawing: false,
    xPrev: null,
    yPrev: null,
    pen: '#000000',    
    width: w,
    height: h
};

window.frames.push(g.createImageData(canvas[0].width, canvas[0].height));
window.frame = 0;

function moveproc(evt) {    
    this.drawing = true;
    
    var g = this.getContext('2d');
    var pen = this.extra.pen;
    var c = pen.slice(1);


    var tmp = g.createImageData(1, 1); // only do this once per page
    
    if (this.extra.xPrev != null) {
        console.log('blitting');
        BlitLine (
            g, 
            canvas[0].extra.xPrev, 
            canvas[0].extra.yPrev, 
            evt.offsetX,
            evt.offsetY,
            '#000000'
        );
    }
    
    this.extra.xPrev = evt.offsetX;
    this.extra.yPrev = evt.offsetY;
    window.frames[window.frame] = g.getImageData(0, 0, w, h);    
    
    window.g = g;    
}

function moveprocoff(evt) {
    $(this).off('mousemove', moveproc);
    $(this).off('mouseup', moveprocoff);
    this.drawing = false;
    console.log("drawing done");
    canvas[0].extra.xPrev = null;
    canvas[0].extra.yPrev = null;
}

function touchmoveproc(evt) {    
    menu.style.backgroundColor = 'blue';
    this.drawing = true;
    
    var g = this.getContext('2d');
    var pen = this.extra.pen;
    var c = pen.slice(1);

    var tmp = g.createImageData(1, 1); // only do this once per page
    
    var _x = evt.touches[0].clientX - canvas.position().left;
    var _y = evt.touches[0].clientY - canvas.position().top;
    
    if (this.extra.xPrev != null) {
        console.log('blitting');
        BlitLine (
            g, 
            canvas[0].extra.xPrev, 
            canvas[0].extra.yPrev, 
            _x,
            _y,
            '#000000'
        );
    }
    
    console.log(evt.touches);
    this.extra.xPrev = _x;
    this.extra.yPrev = _y;
    window.frames[window.frame] = g.getImageData(0, 0, w, h);    
    
    window.g = g;    
}

function touchmoveprocoff(evt) {
    menu.style.backgroundColor = 'lightgray';
    $(this).off('touchmove', touchmoveproc);
    this.drawing = false;
    console.log("drawing done");
    canvas[0].extra.xPrev = null;
    canvas[0].extra.yPrev = null;
}


window.BlitPixel = function(hdc, x, y, color)
{
    hdc.fillColor = color;
    hdc.fillRect(x, y, 1, 1);
}
window.BlitPixelDefault = function(hdc, x, y)
{
    hdc.fillRect(x, y, 1, 1);
}

function BlitLine(hdc, x1, y1, x2, y2, color)
{
    console.log(Array.from(arguments));
    hdc.fillStyle = color;
    
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    console.log(dx, dy);
    
    if (dx == 0) {
        for (var i = 0; Math.abs(i) != Math.abs(dy); ++i) {        
            var _x = x1;
            var _y = y1 + Math.sign(dy)*i;
            BlitPixelDefault(hdc, _x, _y);
        }
    } else {    
        for (var i = 0; Math.abs(i) <= Math.abs(dx); ++i) {                        
            var m = dy / dx;
            var _x = Math.trunc(Math.sign(dx)*i);
            var _y = Math.trunc(_x * m);
            
            BlitPixelDefault(hdc, x1 + _x, y1 + _y);
        }

        for (var i = 0; Math.abs(i) <= Math.abs(dy); ++i) {                        
            var m = dx / dy;
            var _y = Math.ceil(Math.sign(dy)*i);
            var _x = Math.ceil(_y * m);
            
            BlitPixelDefault(hdc, x1 + _x, y1 + _y);
        }
    }
}   


canvas.on('mousedown', function(evt) {
    console.log('draw begin');
    canvas.on('mousemove', moveproc);
    canvas.on('mouseup', moveprocoff);
});


canvas.on('touchstart', function(evt) {
    console.log('draw begin');
    canvas.on('touchmove', touchmoveproc);
    canvas.one('touchend', touchmoveprocoff);
});

canvasSection.append(canvas[0]);

window.appendEmptyFrame = function() {
    window.frames.splice(window.frame + 1, 0, g.getImageData(0, 0, w, h));
    window.frames[window.frame + 1].data.fill(0xff);
};
window.prependEmptyFrame = function() {
    window.frames.splice(window.frame, 0, g.getImageData(0, 0, w, h));
    ++window.frame;
    window.frames[window.frame - 1].data.fill(0xff);
};
window.appendDuplicateFrame = function() {
    window.frames.splice(window.frame + 1, 0, g.getImageData(0, 0, w, h));
};
window.prependDuplicateFrame = function() {
    window.frames.splice(window.frame, 0, g.getImageData(0, 0, w, h));
    ++window.frame;
};

window.setFrame = function(x) {        
    window.frame = x;
    console.log(x);
    if (window.frames.length == 0) {
        window.frames.push(g.createImageData(w, h));
    } 
    
    g.putImageData(window.frames[x], 0, 0);
    
    $(menu.querySelector("[name=frame]")).html(x);
}

window.menu = menu;

window.prevFrame = function(evt) {

};
window.nextFrame = function() {    
    if (window.frame + 1 == window.frames.length) {
        console.log('new frame');
        window.appendEmptyFrame();
    }
    window.setFrame(window.frame + 1);
};

window.prevFrame = function() {
    var PrevFrame = window.frame - 1;
    if (window.frame >= 0) {
        window.setFrame(PrevFrame);
    } else {
         if (window.frames.length == 0) {
             window.frames.push(g.createImageData(w, h));
             window.setFrame(0);
         }
    }
};

$(menu.querySelector("[name=prev]")).on("click", function() {
    window.prevFrame();
});
$(menu.querySelector("[name=next]")).on("click", function() {
    window.nextFrame();    
});
$(menu.querySelector("[name=play]")).on("click", function() {
    window.play();
});
$(menu.querySelector("[name=stop]")).on("click", function() {
    window.stop();    
});
$(menu.querySelector("[name=prependEmpty]")).on("click", function() {
    window.prependEmptyFrame();
    window.setFrame(window.frame - 1);
});
$(menu.querySelector("[name=appendEmpty]")).on("click", function() {
    window.appendEmptyFrame();
    window.setFrame(window.frame + 1);
});
$(menu.querySelector("[name=prepend]")).on("click", function() {
    window.prependDuplicateFrame();
    window.setFrame(window.frame - 1);
});
$(menu.querySelector("[name=append]")).on("click", function() {
    window.appendDuplicateFrame();
    window.setFrame(window.frame + 1);
});
$(menu.querySelector("[name=delete]")).on("click", function() {
    window.frames.splice(window.frame, 1);
    window.prevFrame();
    
});
window.play = function() {
    playTimer = window.setInterval(function() {
        var NextFrame = window.frame + 1 == window.frames.length ? 0 : window.frame + 1;
        window.setFrame(NextFrame);
    }, (1000 / fps));
};

window.stop = function() {
    window.clearInterval(playTimer);
};

window.canvas = canvas[0];