const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const bs = 40 // block size
const cw = bs*50 // canvas width
const ch = bs*30 // canvas height
canvas.width = cw
canvas.height = ch
const showGrid = true
const gridGap = 5
const startPoint = {x:3,y:27}
const cameraSpeed = 10

var images = ['../img/player1.png','../img/ground1.png','../img/ground3.png','../img/blade1.png','../img/player2.png', '../img/heart2.png', '../img/checkpoint.png']
var currentBuilder = 'ground'
var camera = {x:cw*0.5-startPoint.x*bs,y:ch*0.7-startPoint.y*bs}
camera = {x:0,y:0}
var mouseDown = false
var isDeleteOk = false;
var maps = {
    ground: [],
    blades: [],
    heart: [],
    //Portal: [],
    checkpoint: [],
}
var mouseClick = false
var groundRect = {x:0,y:0,w:0,h:0}
var lastActive = "Ground";

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
            // block(0,0)
        } else {
            loadImg(i+1)
        }
    }
}


CreateMap()
function CreateMap() {

    maps.ground.forEach(data => {
        // let w = data.w
        // let h = data.h
        let x = data.x
        let y = data.y
        shape('img',(x+0.5)*bs,(y+0.5)*bs,bs,bs,images[1]);

        // for (let i = 0; i < w; i++) {
        //     if (x + i >= player.x - 100 & x + i < player.x + 100) {
        //         for (let n = 0; n < h; n++) {
        //             if (n == 0) {
        //                 block(x+i, y+n,true)
        //             } else {
        //                 block(x+i, y+n)
        //             }
        //         }
        //     }
        // }
    });
    maps.heart.forEach(pos => {
        shape('img',(pos.x+0.5)*bs,(pos.y+0.5)*bs,bs,bs,images[5]);
    })

    maps.checkpoint.forEach(pos => {
        shape('img',(pos.x+0.5)*bs,(pos.y+0.5)*bs,bs,bs,images[6]);
    })

    if (showGrid) {
        for (let i = 0; i < 300; i++) {
            line([{x:i*bs*gridGap,y:-10000},{x:i*bs*gridGap,y:10000}],'black',0.5)
            line([{x:-10000,y:i*bs*gridGap},{x:10000,y:i*bs*gridGap}],'black',0.5)
        }
    }
}


$(document).keydown(function(e) {
    const key = e.key
    if (currentBuilder == 'ground') {
        if (key == 'ArrowDown') {
            groundRectBuild(0,1)
        } else if (key == 'ArrowLeft') {
            groundRectBuild(-1,0)
        } else if (key == 'ArrowRight') {
            groundRectBuild(1,0)
        } else if (key == 'ArrowUp') {
            groundRectBuild(0,-1)
        }
    }
    clear()
    CreateMap()
})

function groundRectBuild(dx,dy) {
    groundRect.w += dx
    groundRect.h += dy
    removeOK = true
    if (groundRect.w <= 0) {
        groundRect.w = 1
        removeOK = false
    }
    if (groundRect.h <= 0) {
        groundRect.h = 1
        removeOK = false
    }
    if (dy == 1) {
        for (let i = 0; i < groundRect.w; i++) {
            const b = {y:groundRect.y+groundRect.h-1,x:groundRect.x+i}
            add(b)
        }
    } else if (dx == 1) {
        for (let i = 0; i < groundRect.h; i++) {
            const b = {y:groundRect.y+i,x:groundRect.x+groundRect.w-1}
            add(b)
        }
    } else if (dy == -1 & removeOK) {
        for (let i = 0; i < groundRect.w; i++) {
            const b = {y:groundRect.y+groundRect.h,x:groundRect.x+i}
            remove(b)
        }
    } else if (dx == -1 & removeOK) {
        for (let i = 0; i < groundRect.h; i++) {
            const b = {y:groundRect.y+i,x:groundRect.x+groundRect.w}
            remove(b)
        }
    }
    function add(b) {
        const exists = !!maps.ground.find(b2 => b2.x == b.x & b2.y == b.y)
        if (!exists) {
            maps.ground.push(b)
        }
    }
    function remove(b) {
        var exists = -1
        maps.ground.forEach((p,i) => {
            if (p.x == b.x & p.y == b.y) {
                exists = i
            }
        })
        if (exists != -1) {
            maps.ground.splice(exists, 1);
        }
    }

}

function ButtonDelete() {
    isDeleteOk = !isDeleteOk
    let deleteSpan = document.getElementById('deleteChange');
    if (deleteSpan.innerText == "Edit Mode") {
        deleteSpan.innerText = "Delete Mode"
        deleteSpan.style.color = "#b71836";
    } else {
        deleteSpan.innerText = "Edit Mode";
        deleteSpan.style.color = "#0a72cd";
    }
}

function Click(e) {
    if (currentBuilder == undefined) {
        return;
    }
    const canvasPosNotInBS = getMousePos(canvas, e);
    const canvasPosInBS = { x: canvasPosNotInBS.x/bs, y: canvasPosNotInBS.y/bs };
    let pos = {x:canvasPosInBS.x+camera.x,y:canvasPosInBS.y+camera.y}
    if (currentBuilder == 'ground') {
        pos = {x:Math.round(pos.x-0.5), y:Math.round(pos.y-0.5)}
    } else {
        pos = {x:Math.round(pos.x*2-1)/2, y:Math.round(pos.y*2-1)/2}
    }
    var exists = -1
    if (currentBuilder == "Blade") {
        let data = addBladeAfterClick();
    } else {
        maps[currentBuilder.toLowerCase()].forEach((p,i) => {
            if (p.x == pos.x & p.y == pos.y) {
                exists = i
            }
        })  
    }

    
    if (!isDeleteOk) {
        if (exists == -1) {
            maps[currentBuilder.toLowerCase()].push(pos)  
            groundRect = {x:pos.x,y:pos.y,w:1,h:1}
        }
    } else {
        if (exists != -1) {
            maps[currentBuilder.toLowerCase()].splice(exists, 1);
        }
    }
}

function ButtonOnChange(e) {
    currentBuilder = e.id;
    document.getElementById(lastActive).classList.remove('active');
    e.classList.add('active');
    lastActive = e.id;
}

canvas.addEventListener('contextmenu', event => event.preventDefault());

canvas.addEventListener("mousedown", function (e){ 
    const canvasPosNotInBS = getMousePos(canvas, e);
    const canvasPosInBS = { x: canvasPosNotInBS.x/bs, y: canvasPosNotInBS.y/bs };
    mouseDown = [camera,canvasPosInBS]
    mouseClick = true
    clear()
    CreateMap()
})

canvas.addEventListener("mouseup", function (e){ 
    const canvasPosNotInBS = getMousePos(canvas, e);
    const canvasPosInBS = { x: canvasPosNotInBS.x/bs, y: canvasPosNotInBS.y/bs };
    mouseDown = false
    if (mouseClick) {
        mouseClick = false
        Click(e)
    }
    clear()
    CreateMap()
});

$('body').bind('mousemove',function(e){   
    const canvasPosNotInBS = getMousePos(canvas, e);
    const canvasPosInBS = { x: canvasPosNotInBS.x/bs, y: canvasPosNotInBS.y/bs };
    if (canvasPosInBS.x < 0 | canvasPosInBS.y < 0 | canvasPosInBS.x > cw/bs | canvasPosInBS.y > ch/bs) {
        mouseDown = false
    } else if (mouseDown) {
        dx = canvasPosInBS.x-mouseDown[1].x
        dy = canvasPosInBS.y-mouseDown[1].y
        if (Math.abs(dx) > 1 | Math.abs(dy) > 1) {
            mouseClick = false
            camera = {x:mouseDown[0].x-dx,y:mouseDown[0].y-dy}
        } else {
            mouseClick = true
            camera = mouseDown[0]
        }
        
        clear()
        CreateMap()
    }
});


const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);


function addBladeAfterClick(pos) {
    Size = document.getElementById('Size').value
    Rate = document.getElementById('Rate').value

}

function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

function shape (type, x, y, w, h, color = 'black', deg = 0, cameraMoving = true) {
    if (cameraMoving) {
        x -= camera.x*bs
        y -= camera.y*bs
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
    ctx.moveTo(points[0].x - camera.x*bs, points[0].y - camera.y*bs)
    for (let i in points) {
        if (i > 0) {
            ctx.lineTo(points[i].x - camera.x*bs, points[i].y - camera.y*bs)
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