const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const bs = 40 // block size
const cw = bs*50 // canvas width
const ch = bs*30 // canvas height
canvas.width = cw
canvas.height = ch
const gravity = 0.4
const ysl = 23 // y speed limit
const xsl = 16 // x speed limit
const marg = 0.5
const bladeSpeed = 3
const startPoint = {x:3,y:27}
// const startPoint = {x:23,y:-10}
const showGrid = false
const jforce = 20*bs/50
const pcolors = ['blue','orange','yellow','green']
const immortal = true
const addingBS = 1;
const portalWidth = 2.2;

var editOfsset = {x:0*bs,y:0}
var coinsMaps
var isTouchingCoin
var coins
var player
var bmap
var running
var direction
var xforce
var jump
var bladeAngle
var blades
var particles
var playerLook
var portals
var tportel
var currentPortal
var time
var camera
var isTouchingportal
var freeze
var TOUCHINGAPORTAL
var checkpoints
var checkpoint
var respawn

const dis = (x1,y1,x2,y2) => Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))

function Restart() {
    running = false
    respawn = startPoint
    player = {x:respawn.x,y:respawn.y-6,dx:0,dy:0}
    bmap = [
        {x:-10,y:28,w:210,h:10},
        {x:13,y:28,w:100,h:10},
        {x:10,y:21,w:3,h:10},
        {x:50,y:21,w:3,h:10},
        {x:50,y:13,w:3,h:6},
        {x:80,y:3,w:3,h:24},
        {x:80,y:3,w:5,h:2},
        {x:72,y:16,w:6,h:3},
        {x:61.5,y:17,w:3,h:1},
        {x:56,y:10,w:3,h:1},
        {x:56,y:-5,w:3,h:3},
        {x:52,y:-8,w:3,h:3},
        {x:56,y:-11,w:3,h:3},
        {x:20,y:-14,w:35,h:3},
        {x:18,y:-17,w:1,h:8},
        {x:23,y:-10,w:1,h:9},
        {x:13,y:-10,w:1,h:7},
        {x:5,y:-17,w:2,h:7},
        {x:23,y:-24,w:4,h:1},
        {x:53,y:-24,w:4,h:1},
        {x:57,y:-34,w:1,h:11},
    ]
    blades = [
        {x:11,y:16,r:1},
        {x:9,y:16,r:1},
        {x:13,y:16,r:1},
        {x:15,y:28,r:3,mx:29,my:28,frames:100},
        {x:35,y:28,r:3,mx:35,my:20,frames:40},
        {x:51,y:12,r:4},
        {x:55,y:28,r:1.5,mx:70,my:13,frames:100},
        {x:70,y:28,r:1.5,mx:55,my:13,frames:100},
        {x:55,y:13,r:1.5,mx:70,my:28,frames:100},
        {x:70,y:13,r:1.5,mx:55,my:28,frames:100},
        {x:75,y:8,r:4},
        {x:88,y:18,r:4},
        {x:60,y:-20,r:1.5,mx:60,my:0,frames:130},
        {x:50,y:-25,r:1.5,mx:50,my:-15,frames:30},
        {x:45,y:-15,r:1.5,mx:45,my:-25,frames:30},
        {x:40,y:-25,r:1.5,mx:40,my:-15,frames:30},
        {x:35,y:-15,r:1.5,mx:35,my:-25,frames:30},
        {x:30,y:-25,r:1.5,mx:30,my:-15,frames:30},
        {x:18,y:-20,r:4},
        {x:13,y:-11,r:1},
    ]
    portals = [
        [
            [{x:10,y:25},{x:10,y:28}], // האיבר הראשון תמיד הכי גבוהה (נמוך בויי)
            [{x:21,y:22},{x:23,y:25}],
        ],
        [
            [{x:15,y:25},{x:15,y:28}],
            [{x:35,y:22},{x:35,y:25}],
        ],
        // [
        //     [{x:4,y:27},{x:8,y:27}],
        //     [{x:4,y:0},{x:8,y:0}],
        // ],
    ]
    coinsMap = [
        {x: 7, y: 16}, {x: 28, y: 26.5}, {x: 53.5, y: 17}, {x: 62.5, y: 20.5}, {x: 69, y: 17},
        {x: 59, y: 17}, {x: 83.5, y: 6}, {x: 59.5, y: -4}, {x: 20, y: 10},
    ]
    checkpoints = [
        {x: 62, y: 15},
        {x: 24, y: -16},
        {x: 54, y: -26},
    ]
    checkpoint = 0
    direction = 0
    xforce = 0.3
    coins = 3
    isTouchingCoin = false
    jump = false
    tportal = false
    bladeAngle = 0
    particles = []
    playerLook = 1
    currentPortal = null
    time = 0
    camera = {x:cw*0.5-startPoint.x*bs,y:ch*0.7-startPoint.y*bs}
    isTouchingportal = undefined
    freeze = false
    TOUCHINGAPORTAL = undefined
    clear()
    CreateMap()
    CreatePlayer()
}


var images = ['img/player1.png','img/ground1.png','img/ground3.png','img/blade1.png','img/player2.png', 'img/heart2.png', 'img/checkpoint.png']
//var sounds = ['Sounds/grass.mp3']    https://www.youtube.com/watch?v=RShxuHuisWs
var grassAudio = new Audio("Sounds/grass.mp3");
var heartAudio = new Audio("Sounds/heart.mp3");
var portalAudio = new Audio("Sounds/portal.mp3");
var checkpointAudio = new Audio("Sounds/checkpoint.mp3");
var deathAudio = new Audio("Sounds/death1.mp3");
var backgroundAudio = new Audio("Sounds/soundtrack1.mp3");
portalAudio.volume = 0.3
portalAudio.playbackRate = 1.5
heartAudio.volume = 0.3
heartAudio.playbackRate = 1.2
checkpointAudio.volume = 0.3
checkpointAudio.playbackRate = 1.2
deathAudio.volume = 0.25
deathAudio.playbackRate = 1.3
backgroundAudio.volume = 0.03
backgroundAudio.playbackRate = 1

window.onload = function () {
    //if (grassAudio.readyState != 4) check if sound is loaded then load img
    // while (backgroundAudio.readyState != 4) {
    //     //nothing
    // }
    loadImg(0)
}

function loadImg(i) {
    let img = new Image()
    img.src = images[i]
    images[i] = img
    img.onload = () => {
        if (i == images.length-1) {
            Play()
        } else {
            loadImg(i+1)
        }
    }
}

function Play() {
    Restart()
    backgroundAudio.play()
    backgroundAudio.loop = true;
    if (!running) {
        running = true
        animate()
    }
}

function death() {
    deathAudio.play()
    for (let i = 0; i < 70; i++) {
        let deg = 45+Math.random()*360
        let speed = Math.random()*6
        let size = 3+(6-speed)*2
        let frames = 10+Math.random()*40
        particles.push(new Particle((player.x+0.5)*bs,(player.y+0.5)*bs,shape,deg,speed,'e',size*bs/50,'red',frames,0.2))
        // Sound effect
        // sounds[0].play()
    }
    coins--
    if (coins < 1) {
        setTimeout(() => {
            running = false
            setTimeout(Play,10)
        }, 700)
    }
    player = {x:respawn.x,y:respawn.y-6,dx:0,dy:0}
    freeze = true
    setTimeout(() => freeze = false, 700)
}


function CreateMap() {
    blades.forEach(b => {
        let t = time/b.frames%2
        if (t > 1) {
            t = 2-t
        }
        let x
        let y
        if (b.mx == undefined) {
            x = b.x+0.5
            y = b.y+0.5
        } else {
            x = b.x+0.5+(b.mx-b.x)*t
            y = b.y+0.5+(b.my-b.y)*t
        }
        shape('img',x*bs,y*bs,b.r*2*bs,b.r*2*bs,images[3],bladeAngle)
    })

    bmap.forEach(data => {
        let w = data.w
        let h = data.h
        let x = data.x
        let y = data.y

        for (let i = 0; i < w; i++) {
            if (x + i >= player.x - 100 & x + i < player.x + 100) {
                for (let n = 0; n < h; n++) {
                    if (n == 0) {
                        block(x+i, y+n,true)
                    } else {
                        block(x+i, y+n)
                    }
                }
            }
        }
    })

    coinsMap.forEach(pos => {
        shape('img',(pos.x+0.5)*bs,(pos.y+0.5)*bs,bs,bs,images[5]);
    })

    portals.forEach((pair,i) => {
        pair.forEach(p => {
            const points = [{x:p[0].x*bs,y:p[0].y*bs},{x:p[1].x*bs,y:p[1].y*bs}]
            line(points,pcolors[i],20)
            // line(points,'cyan',10)
        })
    })

    if (showGrid) {
        for (let i = 0; i < 10; i++) {
            line([{x:i*bs*10,y:-10000},{x:i*bs*10,y:10000}])
            line([{x:-10000,y:i*bs*10},{x:10000,y:i*bs*10}])
        }
    }
}

function CreatePlayer() {
    let img = images[0]
    if (playerLook == 1) {
        img = images[4]
    }
    shape('img',(player.x+0.5)*bs,(player.y+0.5)*bs,bs,bs,img)
}

function block(x,y,grass) {
    let img = images[1]
    if (grass) {
        img = images[2]
    }
    shape('img',(x+0.5)*bs,(y+0.5)*bs,bs,bs,img);
}

function checkpointsCollision() {
    for (let i = checkpoint; i < checkpoints.length; i++) {
        let p = checkpoints[i]
        if (dis(player.x,player.y,p.x,p.y) < 0.8) {
            checkpointAudio.play()
            checkpoint = i+1
            respawn = checkpoints[i]
        }
        shape('img',(p.x+0.7)*bs,(p.y+0.5)*bs,bs*0.8,bs,images[6],0)
    }
}

function collision() {
    let px = player.x
    let py = player.y
    var result = {l:0,r:0,t:0,b:0}
    
    bmap.forEach(data => {
        let w = data.w
        let h = data.h
        let x = data.x
        let y = data.y
        if (px >= x-1 & px <= x+w & py >= y-1 & py <= y+h) {
            let mid1
            let mid2

            if (w > h) {
                mid1 = {x:x+h/2-0.5,y:y+h/2-0.5}
                mid2 = {x:x+w-h/2-0.5,y:y+h/2-0.5}
                if (px < mid1.x) {
                    checkSide(mid1)
                } else if (px > mid2.x) {
                    checkSide(mid2)
                } else if (py < mid1.y) {
                    bottom()
                } else {
                    top()
                }
            } else {
                mid1 = {x:x+w/2-0.5,y:y+w/2-0.5}
                mid2 = {x:x+w/2-0.5,y:y+h-w/2-0.5}
                if (py < mid1.y) {
                    checkSide(mid1)
                } else if (py > mid2.y) {
                    checkSide(mid2)
                } else if (px > mid1.x) {
                    left()
                } else {
                    right()
                }
            }
            
            function checkSide(loc) {
                if (Math.abs(px-loc.x) > Math.abs(py-loc.y)) {
                    if (px < loc.x) {
                        right()
                    } else {
                        left()
                    }
                } else {
                    if (py < loc.y) {
                        bottom()
                    } else {
                        top()
                    }
                }
            }

            function top() {
                result.t = 1
                player.y = y+h
                if (player.dy < 0) {
                    player.dy = 0
                }
            }

            function bottom() {
                result.b = 1
                player.y = y-1
                if (player.dy > 0) {
                    if (player.dy > 0.5) {
                        grassAudio.volume = player.dy*0.01
                        grassAudio.play()
                    }
                    if (player.dy > 15) {
                        for (let i = 0; i < 10; i++) {
                            let deg = 0+Math.random()*180
                            let speed = Math.random()*3
                            let size = 3+(6-speed)*1
                            let frames = 10+Math.random()*20
                            particles.push(new Particle((player.x+0.5)*bs,(player.y+1)*bs,shape,deg,speed,'e',size*bs/50,'green',frames,0.2))
                        }
                    }
                    player.dy = 0
                }
            }
            
            function left() {
                result.l = 1
                player.x = x+w
                if (player.dx < 0) {
                    player.dx = 0
                }
            }

            function right() {
                result.r = 1
                player.x = x-1
                if (player.dx > 0) {
                    player.dx = 0
                }
            }
        }
    })

    return result
}

function coinColl() {
    for (var i =0; i< coinsMap.length;i++) {
        let coin = coinsMap[i]
        if (player.x + 1 >= coin.x && player.x - 1 <= coin.x && player.y + 1 >= coin.y && player.y - 1 <= coin.y) {
            if (!isTouchingCoin) {
                isTouchingCoin = true;
                coins += 1;
                coinsMap.splice(i, 1); 
                i--;
                let coinInput = document.getElementById('coinsInput')
                coinInput.value = coins
                heartAudio.play()
                grassAudio.play()
            }
        } else {
            isTouchingCoin = false;
        }
    }
}

function orderTopHearts() {
    for (let i = 0; i < coins; i++) {
        size = 1.3
        distance = 1.2
        shape('img', (i*distance+1)*bs,1*bs,bs*size,bs*size,images[5],0,false)
    }
}

function portalCheck() {
    const rad = Math.PI/180
    let px = player.x
    let py = player.y
    
    // portals = [
    //     [
    // pa        [{x:10,y:25},{x:10,y:28}, {color: 'green'}],  // pair[0] pair  = portal[0]
    // ir        [{x:30,y:22},{x:30,y:25}], // pair[1]
    //     ],
    //     [
    //         [{x:15,y:25},{x:15,y:28}],
    //         [{x:35,y:22},{x:35,y:25}],
    //     ],
    // ]

    portals.forEach((pair,i) => {
        let lastIs = false;
        pair.forEach((line,n) => {
            if (!lastIs) {
                // // if (TOUCHINGAPORTAL && TOUCHINGAPORTAL.pair == pair && TOUCHINGAPORTAL.currentline == line) {
                // //     if (( ( px-0.5 >= line[0].x+addingBS || px+0.5 <= line[0].x-addingBS ) || ( px-0.5 >= line[1].x+addingBS || px+0.5 <= line[1].x-addingBS ) ) || (py+0.5 <= line[0].y-addingBS*0.5 || py-0.5 >= line[1].y + addingBS*0.5)) {
                // //         TOUCHINGAPORTAL = undefined
                // //     }
                // // } 
               
                    const slope = (line[1].y-line[0].y)/(line[1].x-line[0].x)
                    const b = -(slope*line[0].x-line[0].y)
                    let smallDistance = Math.abs(slope*px-py+b)/Math.sqrt(slope*slope+1)
                    if (Math.abs(slope) > 10000) {
                        smallDistance = Math.abs(player.x-line[0].x)
                    }
                    const mid = {x:(line[0].x+line[1].x)/2,y:(line[0].y+line[1].y)/2}
                    let slope2 = 10000000
                    if (slope != 0) {
                        slope2 = -1/slope
                    }
                    const abc = [slope2,-1,-slope2*mid.x+mid.y]
                    const bigDistance = Math.abs(abc[0]*px+abc[1]*py+abc[2])/Math.sqrt(abc[0]*abc[0]+abc[1]*abc[1])
                    const portalLength = Math.sqrt(Math.pow(line[0].x-line[1].x,2) + Math.pow(line[0].y-line[1].y,2))
                    let touching = smallDistance*2 < portalWidth && bigDistance*2 < portalLength
                    
                    // if (i == 2 && n == 0) {
                    //     console.log(abc)
                    // }


                    if (TOUCHINGAPORTAL && TOUCHINGAPORTAL.pair == pair && TOUCHINGAPORTAL.currentline == line) {
                        if (!touching) {
                            TOUCHINGAPORTAL = undefined
                        }
                    } 
                    if (TOUCHINGAPORTAL == undefined || TOUCHINGAPORTAL.pair != pair){
                        if (touching) {
                            const id = pair.indexOf(line)
                            const otherLine = pair[Math.abs(id-1)]
                            player.x = (otherLine[1].x-otherLine[0].x)/2 + otherLine[0].x
                            player.y = (otherLine[1].y-otherLine[0].y)/2 + otherLine[0].y
                            TOUCHINGAPORTAL = {pair: pair, currentline: otherLine} // להוסיף את הזה הפוראל שהוא נוגע בוא כדי לשים באיף הארוך
                            lastIs = true
                            portalAudio.play()

                            const deg1 = -Math.atan2(line[0].y-line[1].y,line[0].x-line[1].x)/rad
                            const deg2 = -Math.atan2(otherLine[0].y-otherLine[1].y,otherLine[0].x-otherLine[1].x)/rad
                            const polar = {r: Math.sqrt(player.dy*player.dy+player.dx*player.dx), a:-Math.atan2(player.dy,player.dx)/rad}
                            const polar2 = {r:polar.r,a:polar.a+deg2%360-deg1%360}
                            const cartes = {x:Math.cos(polar2.a*rad)*polar2.r,y:Math.sin(polar2.a*rad)*polar2.r}
                            player.dx = cartes.x
                            player.dy = -cartes.y
                        }
                    } 
            }
        });
    });
}

var key
$(document).keydown(function(e) {
    key = e.key
    if (key == 'ArrowDown') {
        jump = false
    } else if (key == 'ArrowLeft') {
        direction = -1
    } else if (key == 'ArrowRight') {
        direction = 1
    } else if (key == 'ArrowUp' | key == ' ') {
        jump = true
    } else if (key == 'd') {
        editOfsset.x+=-20*bs
    } else if (key == 'a') {
        editOfsset.x+=20*bs
    } else if (key == 'w') {
        editOfsset.y+=20*bs
    } else if (key == 's') {
        editOfsset.y+=-20*bs
    }
})

$(document).keyup(function(e) {
    if (e.key == 'ArrowLeft' | e.key == 'ArrowRight') {
        
        direction = 0
    }
})

function shape (type, x, y, w, h, color = 'black', deg = 0, cameraMoving = true) {
    if (cameraMoving) {
        x += camera.x + editOfsset.x
        y += camera.y + editOfsset.y
    }
    const rad = -deg * Math.PI / 180
    ctx.fillStyle = color
    if (type == 'r') {
        x -= w/2
        y -= h/2
        ctx.save()
        ctx.translate(x + w/2, y + h/2);
        ctx.rotate(rad);
        ctx.fillRect(-w/2, -h/2, w, h)
        ctx.restore()
    } else if (type == 'e') {
        ctx.beginPath();
        ctx.ellipse(x, y, w/2, h/2, rad, 0, 2 * Math.PI);
        ctx.fill()
    } else if (type == 'img') {
        x -= w/2
        y -= h/2
        ctx.save()
        ctx.translate(x + w/2, y + h/2);
        ctx.rotate(rad);
        ctx.drawImage(color, -w/2, -h/2, w, h)
        ctx.restore()
    }
    ctx.fillStyle = 'black'
}

function line(points, color = 'black', w = 2, fillColor) {
    ctx.strokeStyle = color
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(points[0].x + camera.x + editOfsset.x, points[0].y + camera.y + editOfsset.y)
    for (let i in points) {
        if (i > 0) {
            ctx.lineTo(points[i].x + camera.x + editOfsset.x, points[i].y + camera.y + editOfsset.y)
        }
    }
    if (fillColor) {
        ctx.closePath()
        ctx.fillStyle = fillColor
        if (fillColor) {
            ctx.fill()
        }
    }
    ctx.stroke()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
