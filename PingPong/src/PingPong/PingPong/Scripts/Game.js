var pingPong = (function (jQuery, document) {

    var canvas;

    function Rectangle(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        this.setPosition = function (x, y) {
            this.left = x - width / 2;
            this.top = y - height / 2;
        };

        this.offset = function(dx, dy) {
            this.left += dx;
            this.top += dy;
        };
    }

    function GameEngine(update, draw) {
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
                                             update((currentUpdateTime.getTime() - lastUpdateTime.getTime()) / 1000);
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

    function Player(rectangle) {
        this.rectangle = rectangle;

        this.update = function (elapsed) {
        };

        this.draw = function (context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.rect(this.rectangle.left, this.rectangle.top, this.rectangle.width, this.rectangle.height);
            context.stroke();
        };
    }

    function Ball(rectangle) {

        if (rectangle.width != rectangle.height) {
            throw "Ball should be a round.";
        }

        this.rectangle = rectangle;
        this.dx = 100;
        this.dy = 100;

        this.update = function (elapsed) {
            this.rectangle.offset(this.dx * elapsed,
                                  this.dy * elapsed);

            if (rectangle.left < 0) {
                this.dx = Math.abs(this.dx);
            }

            if (rectangle.left + rectangle.width > canvas.width) {
                this.dx = -Math.abs(this.dx);
            }

            if (rectangle.top < 0) {
                this.dy = Math.abs(this.dy);
            }

            if (rectangle.top + rectangle.height > canvas.height) {
                this.dy = -Math.abs(this.dy);
            }
        };

        this.draw = function (context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.arc(rectangle.left + rectangle.width / 2, 
                        rectangle.top + rectangle.height / 2,
                        rectangle.width / 2,
                        0,
                        Math.PI * 2);
            context.stroke();
        };
    }

    var player1 = new Player(new Rectangle(10, 10, 10, 100));
    var player2 = new Player(new Rectangle(100, 10, 10, 100));
    var ball = new Ball(new Rectangle(50, 100, 50, 50));
    var ge;

    return {
        init: function (canvasId) {
            canvas = document.getElementById(canvasId);
            
            ge = new GameEngine(function (elapsed) {
                                    player1.update(elapsed);
                                    player2.update(elapsed);
                                    ball.update(elapsed);
                                },
                                function (context) {
                                    player1.draw(context);
                                    player2.draw(context);
                                    ball.draw(context);
                                },
                                canvasId);
            ge.start();
        },

        setPlayer1Position: function (x, y) {
            player1.rectangle.setPosition(x, y);
        },

        setPlayer2Position: function (x, y) {
            player2.rectangle.setPosition(x, y);
        }
    };

})(jQuery, document)