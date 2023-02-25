window.addEventListener('load', function() {
  const canvas = document.querySelector('#gameCanvas');
  const ctx = canvas.getContext('2d') ;
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stokeStyle = 'black';

  class Player {
    //initialize class properties
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.distanceX = 0;
      this.distanceY = 0;
      this.speedModifier = 5;
    }

    draw(context) {
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

    update() {
      this.distanceX = this.game.mouse.x - this.collisionX; //distance between mouse cursor and player position on horizontal axis
      this.distanceY = this.game.mouse.y - this.collisionY; //distance between mouse cursor and player position on vertical axis

      const distance = Math.hypot(this.distanceY, this.distanceX) //calculates the hypotenuse via pythagoras theorem; must list Y first

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
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width; //horizontal center point of obstacle
      this.collisionY = Math.random() * this.game.height; //verritcal center point of obstacle
      this.collisionRadius = 100;
      this.image = document.querySelector('#obstacles');
    }

    draw(context) {
      context.drawImage(this.image, this.collisionX, this.collisionY);
      context.beginPath();
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
      context.save(); //create snapshot of current canvas state
      context.globalAlpha = 0.5;
      context.fill();
      context.restore(); //restores all canvas settings prior to save method
      context.stroke();
    }
  }

  class Game {
    //initialize class properties
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      this.numberOfObstacles = 1;
      this.obstacles = [];
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
    }

    render(context) {
      this.player.draw(context);
      this.player.update();
      this.obstacles.forEach(obstacle => obstacle.draw(context));
    }

    init() {
      //circle packing aka circle collision detection
      //brute force version
      let attempts = 0;

      while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;

        this.obstacles.forEach(obstacle => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;

          if (distance < sumOfRadii) {
            overlap = true;
          }
        });

        if (!overlap) {
          this.obstacles.push(testObstacle);
        }
        attempts++;
      }


      //for (let i = 0; i < this.numberOfObstacles; i++) {
      //  this.obstacles.push(new Obstacle(this));
      //}
    }
  }

  const game = new Game(canvas);
   console.log(game);

   game.init();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas from (0,0) coordinate to (canvas width, canvas height) coordinate
    game.render(ctx);
    requestAnimationFrame(animate) //or can use window.requestAnimationFrame(animate); will create an endless loop
  }

  animate();
})