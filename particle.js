class Particle {
    constructor (x,y,shape,deg=90,speed=3,type='e',size=20,color='black',frames=50,gravity=0) {
        this.x = x
        this.y = y
        this.shape = shape
        this.type = type
        this.size = size
        this.color = color
        this.frames = frames
        this.gravity = gravity
        let radians = deg*Math.PI/180
        this.dx = Math.cos(radians)*speed
        this.dy = Math.sin(radians)*speed
    }

    print() {
        this.shape(this.type,this.x,this.y,this.size,this.size,this.color)
    }

    move() {
        this.frames--
        this.x += this.dx
        this.y -= this.dy
        this.dy -= this.gravity
    }
}