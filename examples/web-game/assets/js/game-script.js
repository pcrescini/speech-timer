window.addEventListener('load', function() {
  const canvas = document.querySelector('#gameCanvas');
  const ctx = canvas.getContext('2d') ;
  const startGameBtn = document.querySelector('#startGame');
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stokeStyle = 'black';

  class Player {
    //initialize class properties
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5; //horizontal centerpoint of player collision circle
      this.collisionY = this.game.height * 0.5; //vertical centerpoint of player collision circle
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.distanceX = 0;
      this.distanceY = 0;
      this.speedModifier = 3;
      this.image = document.querySelector("#bull");
      this.spriteWidth = 255; //width of sprite sheet divided by num columns
      this.spriteHeight = 256; //width of sprite sheet divided by num rows
      this.width = this.spriteWidth; //for future scaling
      this.height = this.spriteHeight; //for future scaling
      this.spriteX; //determines the top left corner of the sprite
      this.spriteY; //determines the top left corner of the sprite
      this.frameX = Math.floor(Math.random() * 59); // use Math.floor() to return an integer that selects a column of the player spritesheet
      this.frameY = Math.floor(Math.random() * 8); // use Math.floor() to return an integer that selects a row of the player spritesheet
    }

    draw(context) {
      context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save(); //create snapshot of current canvas state
        context.globalAlpha = 0.5;
        context.fill();
        context.restore(); //restores all canvas settings prior to save method
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY) //moveTo() method will define the starting x and y coordinates of the line
        context.lineTo(this.game.mouse.x, this.game.mouse.y) //lineTo() method will set the ending x and y coordinates of the line
        context.stroke() //draws the line
      }
    }

    update() {
      this.distanceX = this.game.mouse.x - this.collisionX; //distance between mouse cursor and player position on horizontal axis
      this.distanceY = this.game.mouse.y - this.collisionY; //distance between mouse cursor and player position on vertical axis
      const distance = Math.hypot(this.distanceY, this.distanceX); //calculates the hypotenuse via pythagoras theorem; must list Y first

      //sprite animation in 8 directions
      const angle = Math.atan2(this.distanceY, this.distanceX); //calculates angle between player and mouse cursor, must list Y first, values range from -Pi (-3.14) to Pi (3.14)
      if (angle < -2.74 || angle > 2.74) {
        this.frameY = 6;
      } else if (angle < -1.17) {
        this.frameY = 0;
      } else if (angle < -0.39) {
        this.frameY = 1;
      } else if (angle < 0.39) {
        this.frameY = 2;
      } else if (angle < 1.17) {
        this.frameY = 3;
      } else if (angle < 1.96) {
        this.frameY = 4;
      } else if (angle < 2.74) {
        this.frameY = 5;
      }  else if (angle < -1.96) {
        this.frameY = 7;
      }

      //will only move the player if the distance between the mouse and player is greater than the speed modifier
      if (distance > this.speedModifier) {
        //sets constant speed
        this.speedX = this.distanceX / distance || 0; //prevents undefined values
        this.speedY = this.distanceY / distance || 0; //prevents undefined values
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;

      this.spriteX = this.collisionX - this.width * 0.5; //determines the top left corner of the sprite
      this.spriteY = this.collisionY - this.height * 0.5 - 100; //determines the top left corner of the sprite

      //horizontal boundaries
      if (this.collisionX < 0 + this.collisionRadius) {
        this.collisionX = 0 + this.collisionRadius;
      } else if (this.collisionX > this.game.width - this.collisionRadius) {
        this.collisionX = this.game.width - this.collisionRadius;
      }

      //vertical boundaries
      if (this.collisionY < this.game.topMargin + this.collisionRadius) {
        this.collisionY = this.game.topMargin + this.collisionRadius;
      } else if (this.collisionY > this.game.height - this.collisionRadius) {
        this.collisionY = this.game.height - this.collisionRadius;
      }

      //collisions with obstacles
      this.game.obstacles.forEach((obstacle) => {
        //[distance < sumOfRadii, distance, sumOfRadii, dx, dy];
        let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);

        //pushes player 1 pixel outside the collision radius of the obstacle in the direction away from the centerpoint
        if (collision) {
          const unit_x = dx / distance; //will always be a value between 0 and 1
          const unit_y = dy / distance; //will always be a value between 0 and 1
          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width; //horizontal center point of obstacle
      this.collisionY = Math.random() * this.game.height; //verritcal center point of obstacle
      this.collisionRadius = 40;
      this.image = document.querySelector("#obstacles");
      this.spriteWidth = 250; //width of sprite sheet divided by num columns
      this.spriteHeight = 250; //height of sprite sheet divided by num rows
      this.width = this.spriteWidth; //for future scaling properties
      this.height = this.spriteHeight; //for future scaling properties
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 70;
      this.frameX = Math.floor(Math.random() * 4); // use Math.floor() to return an integer that selects a column of the obstacle spritesheet
      this.frameY = Math.floor(Math.random() * 3); // use Math.floor() to return an integer that selects a row of the obstacle spritesheet
    }

    draw(context) {
      context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save(); //create snapshot of current canvas state
        context.globalAlpha = 0.5;
        context.fill();
        context.restore(); //restores all canvas settings prior to save method
        context.stroke();
      }
    }

    update() {

    }
  }

  class Egg {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 40;
      this.margin = this.collisionRadius * 2;
      this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2)); //horizontal center point of obstacle
      this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin * 0.75)); //verritcal center point of obstacle
      this.image = document.querySelector("#egg");
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
    }

    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save(); //create snapshot of current canvas state
        context.globalAlpha = 0.5;
        context.fill();
        context.restore(); //restores all canvas settings prior to save method
        context.stroke();
      }
    }

    update() {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 30;

      //handles collisions
      let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];

      collisionObjects.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance; //will always be a value between -1 and 1
          const unit_y = dy / distance; //will always be a value between -1 and 1
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.speedX = Math.random() * 5 + 0.5;
      this.image = document.querySelector('#toad');
      this.spriteWidth = 140;
      this.spriteHeight = 260;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin);
      this.spriteX;
      this.spriteY;
    }

    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save(); //create snapshot of current canvas state
        context.globalAlpha = 0.5;
        context.fill();
        context.restore(); //restores all canvas settings prior to save method
        context.stroke();
      }
    }

    update() {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height + 35;
      this.collisionX -= this.speedX;

      //sets horizontal and vertical enemy boundaries
      if (this.spriteX + this.width < 0) {
        this.collisionX =
          this.game.width + this.width + Math.random() * this.game.width * 0.5;
          this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin);
      }

      //handles collisions
      let collisionObjects = [this.game.player, ...this.game.obstacles];

      collisionObjects.forEach((object) => {
        let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);

        if (collision) {
          const unit_x = dx / distance; //will always be a value between -1 and 1
          const unit_y = dy / distance; //will always be a value between -1 and 1
          this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Larva {
    constructor(game, x, y) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.collisionRadius = 30;
      this.image = document.querySelector("#larva");
      this.spriteWidth = 150;
      this.spriteHeight = 150;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.speedY = 1 + Math.random();
      this.frameX = Math.floor(Math.random() * 1)
      this.frameY = Math.floor(Math.random() * 2);
    }

    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save(); //create snapshot of current canvas state
        context.globalAlpha = 0.5;
        context.fill();
        context.restore(); //restores all canvas settings prior to save method
        context.stroke();
      }
    }

    update() {
      this.collisionY -= this.speedY;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5;
    }
  }
  class Game {
    //initialize class properties
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 260;
      this.debug = true;
      this.player = new Player(this);
      this.fps = 70;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.eggTimer = 0;
      this.eggInterval = 1000;
      this.numberOfObstacles = 10;
      this.obstacles = [];
      this.eggs = [];
      this.maxEggs = 10;
      this.gameObjects = [];
      this.enemies = [];
      this.maxEnemies = 3;
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false
      }

      //event listeners
      canvas.addEventListener('mousedown', e => { //must use es6 arrow function to automatically inherit the reference to the 'this' keyword form the parent scope
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });

      canvas.addEventListener('mouseup', e => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });

      canvas.addEventListener('mousemove', e => {
        //will only move player if mouse is pressed
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });

      //enables debug mode
      window.addEventListener('keydown', e => {
        if (e.key === 'd') {
          this.debug = !this.debug;
        }

      });
    }

    render(context, deltaTime) {
      if (this.timer > this.interval) {
        context.clearRect(0, 0, this.width, this.height); //clears canvas from (0,0) coordinate to (canvas width, canvas height) coordinate

        //create game objects array
        this.gameObjects = [...this.eggs, ...this.obstacles, ...this.enemies, this.player];

        //sort game objects by vertical position (objects with higher vertical positon will be drawn before objects with lower vertical position)
        this.gameObjects.sort((a, b) => {
          return a.collisionY - b.collisionY;
        });

        //draws all game objects - obstacles, eggs & player
        this.gameObjects.forEach((object) => {
          object.draw(context);
          object.update();
        });

        this.timer = 0;
      }

      this.timer += deltaTime;

      //add eggs periodically
      if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
        this.addEgg();
        this.eggTimer = 0;
      } else {
        this.eggTimer += deltaTime;
      }
    }

    addEgg() {
      this.eggs.push(new Egg(this));
    }

    addEnemy() {
      this.enemies.push(new Enemy(this));
    }

    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX; //difference between the centerpoint of circle a and circle b on the horizontal axis
      const dy = a.collisionY - b.collisionY; //difference between the centerpoint of circle a and circle b on the vertical axis
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;

      return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy] //returns an array with true if collision, false if no collision as the first index value
    }

    init() {
      //circle packing aka circle collision detection - brute force version

      //creates enemies
      for (let i = 0; i < this.maxEnemies; i++) {
        this.addEnemy();
      }

      //creates obstacles
      let attempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;

        this.obstacles.forEach(obstacle => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150; //obstacle spacing
          const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer;

          if (distance < sumOfRadii) {
            overlap = true;
          }
        });

        //prevents obstacles from overlapping each another and the gaming canvas
        const margin = testObstacle.collisionRadius * 2.5;

        if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) {
          this.obstacles.push(testObstacle);
        }
        attempts++;
      }
    }
  }

  const game = new Game(canvas);
  game.init();

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate) //or can use window.requestAnimationFrame(animate); will create an endless loop
  }

  animate(0);
  //startGameBtn.addEventListener('click', () => animate(0));
});

