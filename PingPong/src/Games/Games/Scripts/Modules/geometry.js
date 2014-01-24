define(function () {

    function intersects(circle, rectangle) {
        return rectangle.containsPoint(circle.x, circle.y) ||
               distanceToSegment(circle, { x: rectangle.left, y: rectangle.top }, { x: rectangle.left, y: rectangle.getBottom() }) <= circle.radius ||
               distanceToSegment(circle, { x: rectangle.left, y: rectangle.top }, { x: rectangle.getRight(), y: rectangle.top }) <= circle.radius ||
               distanceToSegment(circle, { x: rectangle.getRight(), y: rectangle.getBottom() }, { x: rectangle.left, y: rectangle.getBottom() }) <= circle.radius ||
               distanceToSegment(circle, { x: rectangle.getRight(), y: rectangle.getBottom() }, { x: rectangle.getRight(), y: rectangle.top }) <= circle.radius;
    }

    function sqr(x) {
         return x * x;
    }

    function distanceSquared(v, w) {
         return sqr(v.x - w.x) + sqr(v.y - w.y);
    }

    function distanceToSegmentSquared(p, v, w) {
        var l2 = distanceSquared(v, w);
        if (l2 == 0) return distanceSquared(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) return distanceSquared(p, v);
        if (t > 1) return distanceSquared(p, w);
        return distanceSquared(p, {
            x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y)
        });
    }

    function distanceToSegment(p, v, w) {
         return Math.sqrt(distanceToSegmentSquared(p, v, w));
    }

    function Circle(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.getLeft = function() {
            return this.x - this.radius;
        };

        this.getTop = function() {
            return this.y - this.radius;
        };

        this.getRight = function() {
            return this.x + this.radius;
        };

        this.getBottom = function() {
            return this.y + this.radius;
        };

        this.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };

        this.intersectsCircle = function(circle) {
            return Math.sqrt(distanceSquared(circle, this)) <= circle.radius + this.radius;
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

        this.containsPoint = function(x, y) {
            return this.left <= x &&
                   this.getRight() >= x &&
                   this.top <= y &&
                   this.getBottom() >= y;
        };

        this.intersectsRectangle = function (rectangle) {

            function isInRange(x, rangeLeft, rangeRight) {
                return rangeLeft <= x && x <= rangeRight;
            }

            return (isInRange(rectangle.left, this.left, this.getRight()) || isInRange(rectangle.getRight(), this.left, this.getRight())) &&
                   (isInRange(rectangle.top, this.top, this.getBottom()) || isInRange(rectangle.getBottom(), this.top, this.getBottom()))
                   ||
                   (isInRange(this.left, rectangle.left, rectangle.getRight()) || isInRange(this.getRight(), rectangle.left, rectangle.getRight())) &&
                   (isInRange(this.top, rectangle.top, rectangle.getBottom()) || isInRange(this.getBottom(), rectangle.top, rectangle.getBottom()));;
        };
    }

    return {
        Circle: Circle,
        Rectangle: Rectangle
    };
});