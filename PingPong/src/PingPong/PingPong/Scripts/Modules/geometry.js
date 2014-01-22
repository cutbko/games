define(function () {
    function intersects(circle, rectangle) {
        var circleDistanceX = Math.abs(circle.x - rectangle.left);
        var circleDistanceY = Math.abs(circle.y - rectangle.top);

        if (circleDistanceX > (rectangle.width / 2 + circle.radius)) { return false; }
        if (circleDistanceY > (rectangle.height / 2 + circle.radius)) { return false; }

        if (circleDistanceX <= (rectangle.width / 2)) { return true; }
        if (circleDistanceY <= (rectangle.height / 2)) { return true; }

        var cornerDistance_sq = (circleDistanceX - rectangle.width / 2) ^ 2 +
                                (circleDistanceY - rectangle.height / 2) ^ 2;

        return cornerDistance_sq <= circle.radius * circle.radius;
    }

    function Circle(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.intersectsCircle = function(circle) {
            return Math.sqrt(Math.pow(circle.x - this.x, 2) + Math.pow(circle.y - this.y, 2)) <= circle.radius + this.radius;
        };

        this.intersectsRectangle = function(rectangle) {
            return intersects(this, rectangle);
        };
    }

    function Rectangle(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        this.setCenterPosition = function (x, y) {
            this.left = x - this.width / 2;
            this.top = y - this.height / 2;
        };

        this.getCenterX = function () {
            return this.left + this.width / 2;
        };

        this.getCenterY = function () {
            return this.top + this.height / 2;
        };

        this.offset = function (dx, dy) {
            this.left += dx;
            this.top += dy;
        };

        this.getBottom = function () {
            return this.top + this.height;
        };

        this.getRight = function () {
            return this.left + this.width;
        };

        this.setBottom = function (bottom) {
            this.top = bottom - this.height;
        };

        this.setRight = function (right) {
            this.left = right - this.width;
        };

        this.intersectsCircle = function (circle) {
            return intersects(circle, this);
        };

        this.intersectsRectangle = function(rectangle) {
            
        };
    }

    return {
        Circle: Circle,
        Rectangle: Rectangle
    };
});