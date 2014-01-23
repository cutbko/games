define(["geometry", "gameEngineFactory"], function (geometry, gameEngineFactory) {
    var GAME_WIDTH = 16;
    var GAME_HEIGHT = 9;

    var scale = 1;

    function Player(rectangle) {
        this.rectangle = rectangle;

        this.update = function(elapsed) {
        };

        this.draw = function(context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.rect(this.rectangle.left * scale, this.rectangle.top * scale, this.rectangle.width * scale, this.rectangle.height * scale);
            context.stroke();
        };
    }

    function Ball(circle) {

        this.circle = circle;
        this.dx = 5;
        this.dy = 5;

        this.update = function(elapsed) {
            this.circle.offset(this.dx * elapsed,
                               this.dy * elapsed);
        };

        this.draw = function(context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.arc(this.circle.x * scale,
                        this.circle.y * scale,
                        this.circle.radius * scale,
                        0,
                        Math.PI * 2);
            context.stroke();
        };
    }

    function PingPong(canvasId) {

        var canvas = document.getElementById(canvasId);

        var player1 = new Player(new geometry.Rectangle(0, 0, GAME_WIDTH / 64, GAME_HEIGHT / 9));
        player1.rectangle.setCenterPosition(GAME_WIDTH / 4, GAME_HEIGHT / 2);
        var player2 = new Player(new geometry.Rectangle(0, 0, GAME_WIDTH / 64, GAME_HEIGHT / 9));
        player2.rectangle.setCenterPosition(3 * GAME_WIDTH / 4, GAME_HEIGHT / 2);
        var ball = new Ball(new geometry.Circle(GAME_WIDTH / 2, GAME_HEIGHT / 2, Math.sqrt(GAME_WIDTH * GAME_WIDTH + GAME_HEIGHT * GAME_HEIGHT) / 64));

        console.log(player1.rectangle);
        console.log(player2.rectangle);

        this.setPlayer1Position = function(x, y) {
            player1.rectangle.setCenterPosition(x, y);
        };

        this.setPlayer2Position = function(x, y) {
            player2.rectangle.setCenterPosition(x, y);
        };

        function update(elapsed) {
            if (canvas.width / canvas.height - GAME_WIDTH / GAME_HEIGHT > 0.01) {
                throw "canvas must be in proportion 16 : 9";
            }

            scale = canvas.width / GAME_WIDTH;

            player1.update(elapsed);
            player2.update(elapsed);
            ball.update(elapsed);

            ensureBallIsOnScreen();
            ensurePlayerIsOnItsSide(player1, 0, GAME_WIDTH / 2);
            ensurePlayerIsOnItsSide(player2, GAME_WIDTH / 2, GAME_WIDTH);

            checkIfPlayerIntersectsBall(player1);
            checkIfPlayerIntersectsBall(player2);
        };

        function checkIfPlayerIntersectsBall(player) {
            if (!player.rectangle.intersectsCircle(ball.circle)) {
                return;
            }

            if (player.rectangle.getRight() <= ball.circle.x) {
                ball.dx = Math.abs(ball.dx);
            } else if (player.rectangle.left >= ball.circle.x) {
                ball.dx = - Math.abs(ball.dx);
            }

            if (player.rectangle.top >= ball.circle.y) {
                ball.dy = - Math.abs(ball.dy);
            } else if (player.rectangle.getBottom() <= ball.circle.y) {
                ball.dy = Math.abs(ball.dy);
            }
        }

        function draw(context) {

            context.beginPath();
            context.lineWidth = "4";
            context.strokeStyle = "black";

            context.rect(0, 0, canvas.width, canvas.height);

            context.moveTo(canvas.width / 2 - 2, 0);
            context.lineTo(canvas.width / 2 - 2, canvas.height);
            context.stroke();

            player1.draw(context);
            player2.draw(context);
            ball.draw(context);
        };

        function ensureBallIsOnScreen() {
            if (ball.circle.getLeft() < 0) {
                ball.dx = Math.abs(ball.dx);
            }

            if (ball.circle.getRight() > GAME_WIDTH) {
                ball.dx = -Math.abs(ball.dx);
            }

            if (ball.circle.getTop() < 0) {
                ball.dy = Math.abs(ball.dy);
            }

            if (ball.circle.getBottom() > GAME_HEIGHT) {
                ball.dy = -Math.abs(ball.dy);
            }
        }

        function ensurePlayerIsOnItsSide(player, left, right) {
            if (player.rectangle.left < left) {
                player.rectangle.left = left;
            }

            if (player.rectangle.top < 0) {
                player.rectangle.top = 0;
            }

            if (player.rectangle.getBottom() > GAME_HEIGHT) {
                player.rectangle.setBottom(GAME_HEIGHT);
            }

            if (player.rectangle.getRight() > right) {
                player.rectangle.setRight(right);
            }
        }

        var ge = gameEngineFactory.create(update, draw, canvas);
        ge.start();
    }

    return {
        create: function(canvasId) {
            return new PingPong(canvasId);
        }
    };
});