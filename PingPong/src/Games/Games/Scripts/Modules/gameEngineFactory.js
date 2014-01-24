define(function() {
    function GameEngine(update, draw, canvas) {
        this.frameRate = 60;

        var context = canvas.getContext("2d");

        var isPaused = false;
        var lastUpdateTime = null;
        var intervalId;

        this.start = function () {
            intervalId = setInterval(function () {
                                         var currentUpdateTime = new Date();
                                         if (!isPaused && lastUpdateTime != null) {
                                             context.clearRect(0, 0, canvas.width, canvas.height);
                                             update((currentUpdateTime.getTime() - lastUpdateTime.getTime()) / 1000);
                                             draw(context);
                                         }
                                     
                                         lastUpdateTime = currentUpdateTime;
                                     },
                                     1000 / this.frameRate);
        };

        this.stop = function () {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        this.pause = function () {
            isPaused = true;
        };

        this.unpause = function () {
            isPaused = false;
        };
    }

    return {
        create: function (update, draw, canvas) {
            return new GameEngine(update, draw, canvas);
        }
    };
});