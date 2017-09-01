var body = document.body;
var canvas = $('<canvas></canvas>');
var playTimer;

window.fps = 24;

canvas[0].width = 550;
canvas[0].height = 400;
window.g = canvas[0].getContext('2d');
window.g.imageSmoothingEnabled = false;

canvas[0].extra = {
    drawing: false,
    xPrev: null,
    yPrev: null,
    pen: '#000000',    
    width: 550,
    height: 400
};

window.frames.push(g.createImageData(canvas[0].width, canvas[0].height));
window.frame = 0;

function moveproc(evt) {    
    this.drawing = true;
    
    var g = this.getContext('2d');
    var pen = this.extra.pen;
    var c = pen.slice(1);


    var tmp = g.createImageData(1, 1); // only do this once per page
    /*
    var d  = tmp.data;                        // only do this once per page
    d[0]   = 0;//parseInt('0x' + c.slice(0, 2));
    d[1]   = 0;//parseInt('0x' + c.slice(2, 4));
    d[2]   = 0;//parseInt('0x' + c.slice(4, 6));
    d[3]   = 0xff;
    */
    
      
//    BlitPixel(g, evt.offsetX, evt.offsetY, '#000000');
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
    
    
//    g.fillRect(evt.offsetX, evt.offsetY, 1, 1);
    
    /*
    if (canvas[0].extra.xPrev != null) {
        console.log('ok');
        g.putImageData(tmp, evt.offsetX, evt.offsetY);    
        g.lineWidth = 1;
        g.beginPath();
        g.strokeStyle = "#000000";
        g.moveTo(canvas[0].extra.xPrev, canvas[0].extra.yPrev);
        g.lineTo(evt.offsetX, evt.offsetY);
        g.stroke();
        window.frames[window.frame] = g.getImageData(0, 0, 550, 400);
    }*/
    
    this.extra.xPrev = evt.offsetX;
    this.extra.yPrev = evt.offsetY;
    window.frames[window.frame] = g.getImageData(0, 0, 550, 400);
    
    
    window.g = g;    
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
    
/*    var start_x = Math.min(x1, x2);
//    var start_y = Math.min(y1, y2);
//    var end_x = Math.max(x1, x2);
//    var end_y = Math.max(y1, y2);    
    
    var dx = end_x - start_x;
    var dy = end_y - start_y;
    var m = dy / dx;
    
    if (dx == 0) {
        console.log('vert');
        for (var i = start_y; i < end_y; ++i) {
            //BlitPixelDefault(hdc, start_x, i);
        }
    
        return;
    } else { 
        for (var i = 0; i < dx; ++i) {
            var _x = start_x + Math.trunc(i);
            var _y = start_y + Math.trunc(m * _x); 
            BlitPixelDefault(hdc, _x, _y);
            console.log('->', _x, _y);
        }
    }
*/

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

function moveprocoff(evt) {
    $(this).off('mousemove', moveproc);
    $(this).off('mouseup', moveprocoff);
    this.drawing = false;
    console.log("drawing done");
    canvas[0].extra.xPrev = null;
    canvas[0].extra.yPrev = null;
}

canvas.on('mousedown', function(evt) {
    console.log('draw begin');
    canvas.on('mousemove', moveproc);
    canvas.on('mouseup', moveprocoff);
});

canvasSection.append(canvas[0]);

window.appendEmptyFrame = function() {
    window.frames.splice(window.frame + 1, 0, g.getImageData(0, 0, 550, 400));
    window.frames[window.frame + 1].data.fill(0xff);
};
window.prependEmptyFrame = function() {
    window.frames.splice(window.frame, 0, g.getImageData(0, 0, 550, 400));
    ++window.frame;
    window.frames[window.frame - 1].data.fill(0xff);
};
window.appendDuplicateFrame = function() {
    window.frames.splice(window.frame + 1, 0, g.getImageData(0, 0, 550, 400));
};
window.prependDuplicateFrame = function() {
    window.frames.splice(window.frame, 0, g.getImageData(0, 0, 550, 400));
    ++window.frame;
};

window.setFrame = function(x) {        
    window.frame = x;
    console.log(x);
    if (window.frames.length == 0) {
        window.frames.push(g.createImageData(550, 400));
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
             window.frames.push(g.createImageData(550, 400));
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