var pingPong = (function (jQuery, document) {

    var canvas;

    function gameEngine(update, draw) {
        this.frameRate = 60;
        
        var context = canvas.getContext("2d");

        var isPaused = false;
        var lastUpdateTime = null;
        var intervalId;

        this.start = function() {
            intervalId = setInterval(function() {
                                         var currentUpdateTime = new Date();
                                         if (!isPaused && lastUpdateTime != null) {
                                             context.clearRect(0, 0, canvas.width, canvas.height);
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

    function player(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        this.setPosition = function(x, y) {
            this.left = x - width / 2;
            this.top = y - height / 2;
        };

        this.update = function (elapsed) {
        };

        this.draw = function (context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.rect(this.left, this.top, this.width, this.height);
            context.stroke();
        };
    }

    var player1 = new player(10, 10, 20, 50);
    var player2 = new player(100, 10, 20, 50);
    var ge;

    return {
        init: function (canvasId) {
            canvas = document.getElementById(canvasId);
            
            ge = new gameEngine(function (elapsed) {
                                    player1.update(elapsed);
                                    player2.update(elapsed);
                                },
                                function (context) {
                                    player1.draw(context);
                                    player2.draw(context);
                                },
                                canvasId);
            ge.start();
        },

        setPlayer1Position: function (x, y) {
            player1.setPosition(x, y);
        },

        setPlayer2Position: function (x, y) {
            player2.setPosition(x, y);
        }
    };

})(jQuery, document)