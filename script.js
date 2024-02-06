const canvas = document.querySelector(".main");
const c = canvas.getContext("2d");
const healthBarDivs = document.querySelectorAll('.healthbar-div')

const timeElem = document.querySelector('#timer')

let timer = 99

let gameover = false

let down = 0

canvas.width = 1024;
canvas.height = 576;

c.fillRect(200, 10, canvas.width, canvas.height);






const gravity = 0.7

class health {
    constructor(parent, indx) {

        this.parent = parent,

            this.indx = indx,

            this.disp = healthBarDivs[this.indx].getContext("2d");



    }

    update() {

        this.disp.fillStyle = 'black'

        this.disp.fillRect(0, 0, healthBarDivs[this.indx].width, healthBarDivs[this.indx].height)

        this.disp.fillStyle = 'red'

        this.disp.fillRect(0, 0, this.parent.health * 3, 150)

        console.log(this.parent.health)

    }

}









class Sprite {
    constructor({ position, velocity }, color, indx) {
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
        this.indx = indx
        this.keys = {

            left: false,
            right: false,
            HJump: false,
            SJump: false,
            attack: false

        }
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



        this.velocity.x = 0


        switch (this.lastkey) {

            case 'right':



                if (this.keys.right) {

                    this.velocity.x = 5

                } else if (this.keys.left) {

                    this.lastkey = 'left'

                }

                break

            case 'left':

                if (this.keys.left) {

                    this.velocity.x = -5

                } else if (this.keys.right) {

                    this.lastkey = 'right'

                }

                break

        }

        if (this.keys.HJump || this.keys.SJump) {

            if (this.position.y + this.height + this.velocity.y >= canvas.height) {

                this.jump(this.keys.HJump)

            }

        }

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

    jump(type) {

        if (type) {

            this.velocity.y = -20

        } else {

            this.velocity.y = -15

        }

    }

    attack() {





        if (this.lastkey === 'right') {

            this.attackBox.width = 150

            this.attackBox.height = 20

        } else {

            this.attackBox.width = -100

            this.attackBox.height = 20


        }


        this.attacking = true;

        this.canSlice = false;

        setTimeout(() => {

            this.attacking = false;

        }, 100);

        setTimeout(() => {

            this.canSlice = true;

        }, 400)

    }

    hitDetect(inp) {
        if (this.position.x < inp.x) {
            if (this.attackBox.position.x <= inp.x + inp.width && this.attackBox.position.x + this.attackBox.width >= inp.x) {

                if (this.attackBox.position.y + this.attackBox.height >= inp.y &&
                    this.attackBox.position.y <= inp.y + inp.height)
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
                    this.attackBox.position.y <= inp.y + 150)
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
            height: this.height,
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


}, 'red', 0);


const enemy = new Sprite({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },

}, 'blue', 1);

const playerBar = new health(player, 0)

const enemyBar = new health(enemy, 1)


const end = function (txt) {


    this.temp = document.querySelector('.match-win')

    this.temp.style.zIndex = 1

    this.temp.textContent = txt

    this.temp.style.color = 'white'

}

document.querySelector('.match-win').style.zIndex = -1



function animate() {



    timeElem.textContent = timer;

    if (timer == 0 || player.health <= 0 || enemy.health <= 0) {

        c.fillStyle = 'black'

        c.fillRect(0, 0, canvas.width, canvas.height);

        enemyBar.update()
        playerBar.update()

        if (timer == 0) {

            if (player.health > enemy.health) {

                end('PLAYER 1 WINS')

            } else if (player.health < enemy.health) {

                end('PLAYER 2 WINS')

            } else {

                end('tie')

            }


        } else {

            if (player.health > enemy.health) {

                end('PLAYER 1 WINS')

            } else {

                end('PLAYER 2 WINS')

            }

        }

        return



    }

    if (down < 60) {

        down++;


    } else if (timer > 0 && down === 60) {

        down = 0;

        timer -= 1;

    }

    enemyBar.update()
    playerBar.update()



    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    enemy.update();



}


if (!gameover) {
    animate();
}

// unimportant
window.addEventListener('keydown', (e) => {

    switch (event.key) {

        //player update
        case 'a':
            player.keys.left = true
            player.lastkey = 'left'
            break
        case 'd':
            player.keys.right = true
            player.lastkey = 'right'
            break
        case 'w':
            player.keys.HJump = true
            break
        case 's':
            player.keys.SJump = true
            break
        case ' ':
            if (player.canSlice) {

                player.attack()

            }
            break
        //enemy update
        case 'ArrowLeft':
            enemy.keys.left = true
            enemy.lastkey = 'left'
            break
        case 'ArrowRight':
            enemy.keys.right = true
            enemy.lastkey = 'right'
            break
        case 'ArrowUp':
            enemy.keys.HJump = true
            break
        case 'ArrowDown':
            enemy.keys.SJump = true
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

        //player update
        case 'a':
            player.keys.left = false

            break
        case 'd':
            player.keys.right = false

            break
        case 'w':
            player.keys.HJump = false
            break
        case 's':
            player.keys.SJump = false
            break

        //enemy update
        case 'ArrowLeft':
            enemy.keys.left = false
            enemy.lastkey = 'left'
            break
        case 'ArrowRight':
            enemy.keys.right = false
            enemy.lastkey = 'right'
            break
        case 'ArrowUp':
            enemy.keys.HJump = false
            break
        case 'ArrowDown':
            enemy.keys.SJump = false
            break

    }

})