define(["geometry", "gameEngineFactory"], function (geometry, gameEngineFactory) {
    // consts
    var GAME_WIDTH = 16;
    var GAME_HEIGHT = 9;

    var PLAYER_AREA_WIDTH = GAME_WIDTH / 2;
    var PLAYER_AREA_HEIGHT = GAME_HEIGHT;
    var PLAYER_WIDTH = GAME_WIDTH / 64;
    var PLAYER_HEIGHT = GAME_HEIGHT / 9;

    var GOAL_WIDTH = GAME_WIDTH / 128;
    var GOAL_HEIGHT = GAME_HEIGHT / 9;

    var BALL_RADIUS = Math.sqrt(GAME_WIDTH * GAME_WIDTH + GAME_HEIGHT * GAME_HEIGHT) / 64;

    var BALL_SPEED_X = Math.sqrt(GAME_WIDTH * GAME_WIDTH + GAME_HEIGHT * GAME_HEIGHT) / 3;
    var BALL_SPEED_Y = Math.sqrt(GAME_WIDTH * GAME_WIDTH + GAME_HEIGHT * GAME_HEIGHT) / 3;

    var scale = 1;

    function getValueInRange(value, left, right) {
        if (value < left) {
            return left;
        }

        if (value > right) {
            return right;
        }

        return value;
    }

    function PlayerLoginControl(qrCodeUri, rectangle) {
        var self = this;
        self.rectangle = rectangle;
        self.isVisible = true;

        var isImageLoaded = false;
        var left = 0;
        var top = 0;

        var img = new Image;
        img.onload = function () {
            isImageLoaded = true;
        };

        img.src = qrCodeUri;

        this.update = function (elapsed) {
            if (isImageLoaded && self.isVisible) {
                left = rectangle.left + (rectangle.width - img.width / scale) / 2;
                top = rectangle.top + (rectangle.height - img.height / scale) / 2;
            }
        };

        this.draw = function (context) {
            if (isImageLoaded && self.isVisible) {
                context.clearRect(rectangle.left * scale, rectangle.top * scale, rectangle.width * scale, rectangle.height * scale);
                context.drawImage(img, left * scale, top * scale);
            }
        };
    }

    function LoginControl(playerQrUri, loginManager) {
        var player1LoginControl = new PlayerLoginControl(playerQrUri + '&playerId=1', new geometry.Rectangle(0, 0, GAME_WIDTH / 2, GAME_HEIGHT));
        var player2LoginControl = new PlayerLoginControl(playerQrUri + '&playerId=2', new geometry.Rectangle(GAME_WIDTH / 2, 0, GAME_WIDTH / 2, GAME_HEIGHT));

        var loginControlMovingSpeed = 5;

        this.update = function (elapsed) {
            if (loginManager.isPlayer1InGame() && player1LoginControl.rectangle.getRight() > 0) {
                player1LoginControl.rectangle.left -= loginControlMovingSpeed * elapsed;
            } else if (!loginManager.isPlayer1InGame() && player1LoginControl.rectangle.left < 0) {
                player1LoginControl.rectangle.left += loginControlMovingSpeed * elapsed;
            }

            if (loginManager.isPlayer2InGame() && player2LoginControl.rectangle.left < GAME_WIDTH) {
                player2LoginControl.rectangle.left += loginControlMovingSpeed * elapsed;
            } else if (!loginManager.isPlayer2InGame() && player2LoginControl.rectangle.left > GAME_WIDTH / 2) {
                player2LoginControl.rectangle.left -= loginControlMovingSpeed * elapsed;
            }

            player1LoginControl.update(elapsed);
            player2LoginControl.update(elapsed);
        };

        this.draw = function (context) {
            player1LoginControl.draw(context);
            player2LoginControl.draw(context);
        };
    }

    function GameBackground() {
        this.update = function(elapsed) {
        };

        this.draw = function (context) {

            context.beginPath();
            context.lineWidth = "4";
            context.strokeStyle = "black";

            context.rect(0, 0, GAME_WIDTH * scale, GAME_HEIGHT * scale);

            context.moveTo(GAME_WIDTH * scale / 2 - 2, 0);
            context.lineTo(GAME_WIDTH * scale / 2 - 2, GAME_HEIGHT * scale);
            context.stroke();
        };
    }

    function Goal(rectangle) {
        this.rectangle = rectangle;

        this.update = function (elapsed) {
        };

        this.draw = function (context) {
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.rect(this.rectangle.left * scale, this.rectangle.top * scale, this.rectangle.width * scale, this.rectangle.height * scale);
            context.stroke();
        };
    }

    function Player(rectangle, goal) {
        this.rectangle = rectangle;
        this.goal = goal;

        var score = 0;

        this.getScore = function() {
            return score;
        };

        this.incrementScore = function() {
            score++;
        };

        this.update = function (elapsed) {
            this.goal.update(elapsed);
        };

        this.draw = function (context) {
            this.goal.draw(context);

            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle = "black";
            context.rect(this.rectangle.left * scale, this.rectangle.top * scale, this.rectangle.width * scale, this.rectangle.height * scale);
            context.stroke();
        };
    }

    function Ball(circle) {

        this.circle = circle;
        this.dx = BALL_SPEED_X;
        this.dy = BALL_SPEED_Y;

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

    function LoginManager() {
        var player1InGame = false;
        var player2InGame = false;

        this.player1Joined = function () {
            player1InGame = true;
        };

        this.player1Left = function () {
            player1InGame = false;
        };

        this.player2Joined = function () {
            player2InGame = true;
        };

        this.player2Left = function () {
            player2InGame = false;
        };

        this.isPlayer1InGame = function() {
            return player1InGame;
        };

        this.isPlayer2InGame = function() {
            return player2InGame;
        };
    }

    function PingPong(canvasId, playerQrUri) {

        this.loginManager = new LoginManager();

        var loginControl = new LoginControl(playerQrUri, this.loginManager);

        var canvas = document.getElementById(canvasId);

        var gameBackground = new GameBackground();

        var player1 = new Player(geometry.CreateRectangleByCenter(GAME_WIDTH / 4, GAME_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT),
                                 new Goal(geometry.CreateRectangleByCenter(GOAL_WIDTH / 2, GAME_HEIGHT / 2, GOAL_WIDTH, GOAL_HEIGHT)));

        var player2 = new Player(geometry.CreateRectangleByCenter(3 * GAME_WIDTH / 4, GAME_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT),
                                 new Goal(geometry.CreateRectangleByCenter(GAME_WIDTH - GOAL_WIDTH / 2, GAME_HEIGHT / 2, GOAL_WIDTH, GOAL_HEIGHT)));

        var ball = new Ball(new geometry.Circle(GAME_WIDTH / 2, GAME_HEIGHT / 2, BALL_RADIUS));
        
        this.setPlayer1Position = function(x, y) {
            player1.rectangle.setCenterPosition(getValueInRange(x, 0, 1) * PLAYER_AREA_WIDTH,
                                                getValueInRange(y, 0, 1) * PLAYER_AREA_HEIGHT);
        };

        this.setPlayer2Position = function (x, y) {
            player2.rectangle.setCenterPosition(getValueInRange(x + 1, 1, 2) * PLAYER_AREA_WIDTH,
                                                getValueInRange(y, 0, 1) * PLAYER_AREA_HEIGHT);
        };

        function update(elapsed) {
            if (canvas.width / canvas.height - GAME_WIDTH / GAME_HEIGHT > 0.01) {
                throw "canvas must be in proportion " + GAME_WIDTH + ":" + GAME_HEIGHT;
            }

            scale = canvas.width / GAME_WIDTH;

            gameBackground.update(elapsed);

            loginControl.update(elapsed);

            player1.update(elapsed);
            player2.update(elapsed);
            ball.update(elapsed);
            
            ensureBallIsOnScreen();
            ensurePlayerIsOnItsSide(player1, 0, GAME_WIDTH / 2);
            ensurePlayerIsOnItsSide(player2, GAME_WIDTH / 2, GAME_WIDTH);

            checkIfPlayerIntersectsBall(player1);
            checkIfPlayerIntersectsBall(player2);

            checkIfBallIsInGoal(player1, player2);
            checkIfBallIsInGoal(player2, player1);
        };

        function checkIfBallIsInGoal(player, otherPlayer) {
            if (ball.circle.intersectsRectangle(player.goal.rectangle)) {
                otherPlayer.incrementScore();
                ball.circle.x = GAME_WIDTH / 2;
                ball.circle.y = GAME_HEIGHT / 2;
            }
        }

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
            gameBackground.draw(context);
            player1.draw(context);
            player2.draw(context);
            ball.draw(context);
            loginControl.draw(context);
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
        create: function(canvasId, playerQrUri) {
            return new PingPong(canvasId, playerQrUri);
        }
    };
});