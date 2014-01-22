﻿var pingPongFactory = (function (jQuery, document) {
    function GameEngine(update, draw, canvas) {
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
        this.dx = 500;
        this.dy = 500;

        this.update = function (elapsed) {
            this.rectangle.offset(this.dx * elapsed,
                                  this.dy * elapsed);
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

    function PingPong(canvasId) {

        var canvas = document.getElementById(canvasId);

        var player1 = new Player(new Rectangle(0, 0, 10, 100));
        player1.rectangle.setCenterPosition(canvas.width / 4, canvas.height / 2);
        var player2 = new Player(new Rectangle(0, 0, 10, 100));
        player1.rectangle.setCenterPosition(3 * canvas.width / 4, canvas.height / 2);
        var ball = new Ball(new Rectangle(50, 100, 50, 50));
        
        this.setPlayer1Position = function(x, y) {
            player1.rectangle.setCenterPosition(x, y);
        };

        this.setPlayer2Position = function(x, y) {
            player2.rectangle.setCenterPosition(x, y);
        };

        function getCenter() {
            return canvas.width / 2;
        }

        function update(elapsed) {
            player1.update(elapsed);
            player2.update(elapsed);
            ball.update(elapsed);

            ensureBallIsOnScreen();
            ensurePlayerIsOnItsSide(player1, new Rectangle(0, 0, getCenter(), canvas.height));
            ensurePlayerIsOnItsSide(player2, new Rectangle(getCenter(), 0, canvas.width / 2, canvas.height));

            checkIfPlayerIntersectsBall(player1);
            checkIfPlayerIntersectsBall(player2);
        };

        function checkIfPlayerIntersectsBall(player) {
            if (!player.rectangle.intersectsCircle(ball.rectangle)) {
                return;
            }

            if (player.rectangle.getCenterX() < ball.rectangle.getCenterX()) {
                ball.dx = Math.abs(ball.dx);
            }

            if (player.rectangle.getCenterX() > ball.rectangle.getCenterX()) {
                ball.dx = -Math.abs(ball.dx);
            }

            if (player.rectangle.getCenterY() < ball.rectangle.getCenterY()) {
                ball.dy= Math.abs(ball.dy);
            }

            if (player.rectangle.getCenterX() > ball.rectangle.getCenterX()) {
                ball.dy = -Math.abs(ball.dy);
            }
        }

        function draw(context) {

            context.beginPath();
            context.lineWidth = "4";
            context.strokeStyle = "black";
            
            context.rect(0, 0, canvas.width, canvas.height);

            context.moveTo(getCenter() - 2, 0);
            context.lineTo(getCenter() - 2, canvas.height);
            context.stroke();

            player1.draw(context);
            player2.draw(context);
            ball.draw(context);
        };

        function ensureBallIsOnScreen() {
            if (ball.rectangle.left < 0) {
                ball.dx = Math.abs(ball.dx);
            }

            if (ball.rectangle.left + ball.rectangle.width > canvas.width) {
                ball.dx = -Math.abs(ball.dx);
            }

            if (ball.rectangle.top < 0) {
                ball.dy = Math.abs(ball.dy);
            }

            if (ball.rectangle.top + ball.rectangle.height > canvas.height) {
                ball.dy = -Math.abs(ball.dy);
            }
        }

        function ensurePlayerIsOnItsSide(player, rectangle) {
            if (player.rectangle.left < rectangle.left) {
                player.rectangle.left = rectangle.left;
            }

            if (player.rectangle.top < rectangle.top) {
                player.rectangle.top = rectangle.top;
            }

            if (player.rectangle.getBottom() > rectangle.getBottom()) {
                player.rectangle.setBottom(rectangle.getBottom());
            }

            if (player.rectangle.getRight() > rectangle.getRight()) {
                player.rectangle.setRight(rectangle.getRight());
            }
        }

        var ge = new GameEngine(update, draw, canvas);
        ge.start();
    }

    return {
        init: function(canvasId) {
            return new PingPong(canvasId);
        }
};

})(jQuery, document)