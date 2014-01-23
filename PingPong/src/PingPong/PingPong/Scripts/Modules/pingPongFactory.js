define(["geometry", "gameEngineFactory"], function (geometry, gameEngineFactory) {

    console.log(geometry);
    console.log(gameEngineFactory);

    function Player(rectangle) {
        this.rectangle = rectangle;

        this.update = function(elapsed) {
        };

        this.draw = function(context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.rect(this.rectangle.left, this.rectangle.top, this.rectangle.width, this.rectangle.height);
            context.stroke();
        };
    }

    function Ball(circle) {

        this.circle = circle;
        this.dx = 500;
        this.dy = 500;

        this.update = function(elapsed) {
            this.circle.offset(this.dx * elapsed,
                               this.dy * elapsed);
        };

        this.draw = function(context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.arc(this.circle.x,
                        this.circle.y,
                        this.circle.radius,
                        0,
                        Math.PI * 2);
            context.stroke();
        };
    }

    function PingPong(canvasId) {

        var canvas = document.getElementById(canvasId);

        var player1 = new Player(new geometry.Rectangle(0, 0, 10, 100));
        player1.rectangle.setCenterPosition(canvas.width / 4, canvas.height / 2);
        var player2 = new Player(new geometry.Rectangle(0, 0, 10, 100));
        player1.rectangle.setCenterPosition(3 * canvas.width / 4, canvas.height / 2);
        var ball = new Ball(new geometry.Circle(100, 100, 50));

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
            ensurePlayerIsOnItsSide(player1, new geometry.Rectangle(0, 0, getCenter(), canvas.height));
            ensurePlayerIsOnItsSide(player2, new geometry.Rectangle(getCenter(), 0, canvas.width / 2, canvas.height));

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

            context.moveTo(getCenter() - 2, 0);
            context.lineTo(getCenter() - 2, canvas.height);
            context.stroke();

            player1.draw(context);
            player2.draw(context);
            ball.draw(context);
        };

        function ensureBallIsOnScreen() {
            if (ball.circle.getLeft() < 0) {
                ball.dx = Math.abs(ball.dx);
            }

            if (ball.circle.getRight() > canvas.width) {
                ball.dx = -Math.abs(ball.dx);
            }

            if (ball.circle.getTop() < 0) {
                ball.dy = Math.abs(ball.dy);
            }

            if (ball.circle.getBottom() > canvas.height) {
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

        var ge = gameEngineFactory.create(update, draw, canvas);
        ge.start();
    }

    return {
        create: function(canvasId) {
            return new PingPong(canvasId);
        }
    };
});