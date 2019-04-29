class Flower {

    constructor(position, rotation, movementVector, movementSpeed, centerRadius, numPetals, petalWidth, petalHeight, centerColor, petalColor) {
        this.position = position;
        this.rotation = rotation;
        this.movementVector = movementVector;
        this.movementSpeed = movementSpeed;
        this.centerRadius = centerRadius;
        this.numPetals = numPetals;
        this.petalWidth = petalWidth;
        this.petalHeight = petalHeight;
        this.centerColor = centerColor;
        this.petalColor = petalColor;

        this.currentRotation = 0;
        this.hitboxRadius = this.centerRadius + this.petalHeight;
        this.movementVector.mult(this.movementSpeed);
    }

    wallReflect(normal) {
        let incidence = p5.Vector.mult(this.movementVector, -1);
        incidence.normalize();

        let dot = incidence.dot(normal);
        this.movementVector.set(
            2 * normal.x * dot - incidence.x,
            2 * normal.y * dot - incidence.y,
            0
        );
        this.movementVector.mult(this.movementSpeed);
    }

    circleReflect(other) {
        let vectorToOther = p5.Vector.sub(this.position, other.position);
        this.movementVector = p5.Vector.mult(vectorToOther.normalize(), this.movementSpeed);
    }

    checkCollisionWindow() {
        var normal;
        if (this.position.x - this.hitboxRadius < 0) {
            normal = createVector(1, 0);
            this.wallReflect(normal);
        } 
        else if (this.position.x + this.hitboxRadius > windowWidth) {
            normal = createVector(-1, 0);
            this.wallReflect(normal);
        }
        else if (this.position.y - this.hitboxRadius < 0) {
            normal = createVector(0, 1);
            this.wallReflect(normal);
        }
        else if (this.position.y + this.hitboxRadius > windowHeight) {
            normal = createVector(0, -1);
            this.wallReflect(normal);
        }
    }

    checkCollision(otherFlower) {
        let dx = this.position.x - otherFlower.position.x;
        let dy = this.position.y - otherFlower.position.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.hitboxRadius + otherFlower.hitboxRadius) {
            this.circleReflect(otherFlower);
            otherFlower.circleReflect(this);
            return true;
        }
        return false;
    }

    draw() {
        translate(this.position.x, this.position.y);
        rotate(this.currentRotation);
        
        // Draw the center of the flower
        stroke(color(this.centerColor));
        fill(color(this.centerColor));
        circle(0, 0, this.centerRadius);

        stroke(color(this.petalColor));
        fill(color(this.petalColor));
        let interval = 360 / this.numPetals;
        for (var i = 0; i < 360; i = i + interval) {
            rotate(i);
            ellipse(0, this.centerRadius + this.petalHeight / 2, this.petalWidth, this.petalHeight);
            rotate(-i);
        }
        
        rotate(-this.currentRotation);
        translate(-this.position.x, -this.position.y);

        this.checkCollisionWindow();

        this.currentRotation += this.rotation;
        this.position.add(this.movementVector);
    }
}