const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

class Sprite {
    constructor({ position, velocity }, color) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.width = 50;
        this.height = 150;
        this.lastkey = '';
        this.attacking = false;
        this.canSlice = true;
        this.health = 100;
        this.o = 0;
        this.attackBox = {

            position: {

                x: this.position.x,
                y: this.position.y,

            },
            width: 150,
            height: 20,


        }




    }

    draw() {
        if (this.health > 0) {
            c.fillStyle = this.color;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);

            //attackbox
            if (this.attacking) {
                c.fillStyle = 'green'
                c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
            }
        }
    }

    update() {



        this.attackBox.position.x = this.position.x
        this.attackBox.position.y = this.position.y

        this.draw();


        if (this.health <= 0) {

            this.attacking = false

        }


        if (this.position.y + this.height + this.velocity.y >= canvas.height) {

            this.velocity.y = 0;

            this.position.y = canvas.height - this.height

        } else {

            this.velocity.y += gravity

        }

        this.position.y += this.velocity.y;

        this.position.x += this.velocity.x
        if (this.attacking) {
            switch (this) {

                case player:

                    this.o = enemy.returnXY()
                    this.hitDetect(this.o)

                    break
                case enemy:

                    this.o = player.returnXY()
                    this.hitDetect(this.o)


                    break

            }
        }


    }

    damage(opponent) {

        opponent.health -= 10

    }

    attack() {




        if (this === enemy) {
            if (this.lastkey === 'right') {

                this.attackBox.width = 150

                this.attackBox.height = 20

            } else {

                this.attackBox.width = -100

                this.attackBox.height = 20


            }
        } else {

            if (this.lastkey === 'a') {

                this.attackBox.width = -100

                this.attackBox.height = 20


            } else {

                this.attackBox.width = 150

                this.attackBox.height = 20


            }

        }

        this.attacking = true;

        this.canSlice = false;

        setTimeout(() => {

            this.attacking = false;

        }, 100);

        setTimeout(() => {

            this.canSlice = true;

        }, 300)

    }

    hitDetect(inp) {
        if (this.position.x < inp.x) {
            if (this.attackBox.position.x <= inp.x + inp.width && this.attackBox.position.x + this.attackBox.width >= inp.x) {

                if (this.attackBox.position.y + this.attackBox.height >= inp.y &&
                    this.attackBox.position.y <= inp.y)
                    if (this === enemy) {

                        this.damage(player)

                    } else {

                        this.damage(enemy)

                    }
                this.attacking = false
            }
        } else {

            if (this.attackBox.position.x >= inp.x + inp.width && this.attackBox.position.x + this.attackBox.width <= inp.x + inp.width) {

                if (this.attackBox.position.y + this.attackBox.height >= inp.y &&
                    this.attackBox.position.y <= inp.y)
                    if (this === enemy) {

                        this.damage(player)

                    } else {

                        this.damage(enemy)

                    }
                this.attacking = false
            }

        }

    }

    returnXY() {

        return ({
            x: this.position.x,
            y: this.position.y,
            health: this.health,
            width: this.width,
            height: this.health,
        })


    }




}


const player = new Sprite({
    position: {
        x: 100,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    }


}, 'red');

player.draw();

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },

}, 'blue');

enemy.draw();

console.log(player);

const keys = {

    a: {

        pressed: false

    },

    d: {

        pressed: false

    },

    w: {

        pressed: false

    },

    s: {

        pressed: false

    },

    left: {

        pressed: false

    },

    right: {

        pressed: false

    },

    up: {

        pressed: false

    },

    down: {

        pressed: false

    }

}

player.attackBox.position.y += 10

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    enemy.update();


    player.update();



    if (keys.a.pressed && player.lastkey === 'a') {


        player.velocity.x = -5

    } else if (keys.d.pressed && player.lastkey === 'd') {

        player.velocity.x = 5


    } else if (player.lastkey === 'a' && keys.d.pressed) {

        player.lastkey = 'd'

    } else if (player.lastkey === 'd' && keys.a.pressed) {

        player.lastkey = 'a'

    } else {

        player.velocity.x = 0

    }

    if (keys.w.pressed) {

        if (player.position.y >= canvas.height - player.height) {


            player.velocity.y = -20


        }


    }

    if (keys.s.pressed) {
        if (player.position.y >= canvas.height - player.height) {


            player.velocity.y = -15


        }
    }

    //enemy moving
    if (keys.left.pressed && enemy.lastkey === 'left') {


        enemy.velocity.x = -5


    } else if (keys.right.pressed && enemy.lastkey === 'right') {

        enemy.velocity.x = 5

    } else if (enemy.lastkey === 'left' && keys.right.pressed) {

        enemy.lastkey = 'right'

    } else if (enemy.lastkey === 'right' && keys.left.pressed) {

        enemy.lastkey = 'left'

    } else {

        enemy.velocity.x = 0

    }



    if (keys.up.pressed) {

        if (enemy.position.y >= canvas.height - enemy.height) {


            enemy.velocity.y = -20


        }


    }

    if (keys.down.pressed) {

        if (enemy.position.y >= canvas.height - enemy.height) {


            enemy.velocity.y = -15

        }
    }
    //detect for weapon collision







}



animate();


window.addEventListener('keydown', (e) => {



    switch (event.key) {

        case 'w':

            keys.w.pressed = true

            break
        case 'd':

            keys.d.pressed = true

            player.lastkey = 'd'

            break
        case 'a':

            keys.a.pressed = true

            player.lastkey = 'a'

            break
        case 's':

            keys.s.pressed = true

            break

        case ' ':
            if (player.canSlice) {
                player.attack()
            }
            break

        //arrow keys
        case 'ArrowUp':

            keys.up.pressed = true

            break
        case 'ArrowRight':

            keys.right.pressed = true

            enemy.lastkey = 'right'

            break
        case 'ArrowLeft':

            keys.left.pressed = true

            enemy.lastkey = 'left'

            break

        case 'ArrowDown':

            keys.down.pressed = true

            break
        case '0':
            if (enemy.canSlice) {
                enemy.attack()

            }
            break


    }

})

window.addEventListener('keyup', (e) => {



    switch (event.key) {

        case 'd':

            keys.d.pressed = false

            if (keys.a.pressed === true) {

                lastkey = 'a'

            }

            break
        case 'a':

            keys.a.pressed = false

            if (keys.d.pressed === true) {

                lastkey = 'd'

            }
            break
        case 'w':

            keys.w.pressed = false
            break

        case 's':

            keys.s.pressed = false

            break
        //arrow keys
        case 'ArrowUp':

            keys.up.pressed = false

            break
        case 'ArrowRight':

            keys.right.pressed = false

            if (keys.right.pressed === true) {

                enemy.lastkey = 'left'

            }

            break
        case 'ArrowLeft':

            keys.left.pressed = false

            if (keys.left.pressed === true) {

                enemy.lastkey = 'right'

            }

            break

        case 'ArrowDown':

            keys.down.pressed = false

            break


    }

})