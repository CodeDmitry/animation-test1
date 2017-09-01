(function(window, document, $) {
    "use strict";
    
    window.frames = [];
    
    $(window).one("load", function() {
        var menu = $("#menu-section")[0];
        var canvasSection = $("#canvas-section")[0];
        var timelineSection = $("#timeline-section")[0];
        
        $.get({
            url: "program.js", 
            dataType: "text",
            success: function(data) {
                eval(data);
            }
        });    
    });  
})(window, document, $);