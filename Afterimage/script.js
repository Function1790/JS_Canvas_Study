const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const PI = Math.PI
const WIDTH = canvas.width
const HEIGHT = canvas.height

class RGB {
    constructor(r, g, b, a = 1) {
        this.R = r
        this.G = g
        this.B = b
        this.A = a
    }
    toString() {
        return `rgb(${this.R}, ${this.G}, ${this.B}, ${this.A})`
    }
    alpha(value) {
        return new RGB(this.R, this.G, this.B, value)
    }
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    clone() {
        return new Vector(this.x, this.y)
    }
}

function selectColor(color) {
    ctx.beginPath()
    ctx.fillStyle = color.toString()
}

function abs(n){
    if(n<0){
        return -n
    }
    return n
}

class Ball {
    constructor(x, y, v_x, v_y, radius) {
        this.AFTERIMG_COUNT = 40
        this.DECREASE = 1 / this.AFTERIMG_COUNT

        //Position
        this.pos = new Vector(x, y)

        //Velocity
        this.v = new Vector(v_x, v_y)

        this.radius = radius

        //Position
        this.afterimg = []

        this.color = new RGB(255, 125, 120)
    }
    //Afterimage Count
    setAfterCount(count) {
        this.AFTERIMG_COUNT = count
        this.DECREASE = 1 / this.AFTERIMG_COUNT
    }
    draw() {
        selectColor(this.color)
        ctx.arc(this.pos.x, this.pos.y, this.radius,
            0, PI * 2, false)
        ctx.fill()
        for (var i = 0; i < this.afterimg.length; i++) {
            selectColor(this.color.alpha(i * this.DECREASE / 10))
            ctx.arc(this.afterimg[i].x, this.afterimg[i].y,
                this.radius * i * this.DECREASE, 0, PI * 2, false)
            ctx.fill()
        }
    }
    move() {
        this.afterimg.push(this.pos.clone())
        while (this.afterimg.length > this.AFTERIMG_COUNT) {
            this.afterimg.shift()
        }
        this.processWall()
        const count = abs(this.v.x) + abs(this.v.y)
        this.setAfterCount(count * 4)
        this.pos.x += this.v.x
        this.pos.y += this.v.y
    }
    processWall() {
        if (this.pos.x < 0) {
            this.pos.x = 0
            this.v.x *= -1
        } else if (this.pos.x + this.radius > WIDTH) {
            this.pos.x = WIDTH - this.radius
            this.v.x *= -1
        }
        if (this.pos.y < 0) {
            this.pos.y = 0
            this.v.y *= -1
        } else if (this.pos.y + this.radius > WIDTH) {
            this.pos.y = WIDTH - this.radius
            this.v.y *= -1
        }
    }
}

const ball1 = new Ball(100, 100, 5, 4, 20)

function render() {
    ctx.clearRect(0, 0, 800, 800)
    ball1.draw()
    ball1.move()
    requestAnimationFrame(render)
}

render()