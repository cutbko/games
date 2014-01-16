var gameCreator = (function (jQuery, document) {

    function gameEngine(update, draw, canvasId) {
        this.frameRate = 60;
        
        var context = document.getElementById(canvasId)
                              .getContext("2d");

        var isPaused = false;
        var lastUpdateTime = null;
        var intervalId;

        this.start = function() {
            intervalId = setInterval(function() {
                                         var currentUpdateTime = new Date();
                                         if (!isPaused && lastUpdateTime != null) {
                                             context.clearRect(0, 0, 500, 500);
                                             update(currentUpdateTime.getTime() - lastUpdateTime.getTime());
                                             draw(context);
                                         }
                                         lastUpdateTime = currentUpdateTime;
                                     },
                                     1000 / this.frameRate);
        };

        this.stop = function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        this.pause = function() {
            isPaused = true;
        };

        this.unpause = function() {
            isPaused = false;
        };
    }

    return {
        create: function (canvasId) {
            var timeForFrame;
            var ge = new gameEngine(function(elapsed) {
                                        timeForFrame = elapsed;
                                    },
                                    function(context) {
                                        context.fillText(timeForFrame, 10, 10);
                                    },
                                    canvasId);
            ge.start();

            return {

            };
        }
    };

})(jQuery, document)