function animate() {
    if (running) {
        requestAnimationFrame(animate)
    }
    clear()
    CreateMap()
    CreatePlayer()

    particles.forEach((p,i) => {
        if (p.frames > 0) {
            p.print()
            p.move()
        } else {
            particles.splice(i,1)
        }
    })
    
    // portalCheck()
    const col = collision()

    if ((col.r | col.l) & player.dy > 0) {
        player.dy += gravity/2
    } else {
        player.dy += gravity
    }
    if (player.dy > ysl) {
        player.dy = ysl
    } else if (player.dy < -ysl) {
        player.dy = -ysl
    }
    player.dx += direction * xforce
    if (player.dx > xsl) {
        player.dx = xsl
    } else if (player.dx < -xsl) {
        player.dx = -xsl
    }
    player.y += player.dy/bs
    player.x += player.dx/bs
    
    if (player.dx > -xforce & player.dx < xforce) {
        player.dx = 0
    }
    if (direction == 0 & player.dx != 0) {
        if (player.dx > 0) {
            player.dx -= xforce
        } else {
            player.dx += xforce
        }
        // player.dx *= 0.95
    }


    
    if (jump & col.b == 1) {
        player.dy = -jforce
    } else if (jump & col.r == 1) {
        player.dy = -jforce*0.8
        player.dx = -jforce*0.4
    } else if (jump & col.l == 1) {
        player.dy = -jforce*0.8
        player.dx = jforce*0.4
    }
    jump = false

    if (direction == 1) {
        pastdir = 1
    } else if (direction == -1) {
        pastdir = -1
    }

    bladeAngle += bladeSpeed

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
        if (dis(player.x,player.y,x,y) < b.r+0.5 & !immortal) {
            death()
        }
    })
    if (player.y > 50) {
        death()
    }
    // function PrintBlades() {
    //     bladeAngle += bladeSpeed
    
    //     blades.forEach(b => {
    //         let t = time/b.frames%2
    //         if (t > 1) {
    //             t = 2-t
    //         }
    //         let x = b.x+0.5+(b.mx-b.x)*t
    //         let y = b.y+0.5+(b.my-b.y)*t
    //         if (dis(player.x,player.y,x,y) < b.r+0.5) {
    //             death()
    //         }
    //     })
    // }

    if (direction != 0) {
        playerLook = direction
    }

    let x = (-player.x)*bs+cw*0.5
    let y = (-player.y)*bs+ch*0.7
    if (!freeze) {
        camera.x += (x-camera.x)*0.06
        camera.y += (y-camera.y)*0.1
    }
    
    // camera = {x:0,y:0}
    portalCheck()
    collision()
    coinColl()
    time++
}