// create our 'main' state that will include the game
var mainState = {
    preload : function(){
        /************************************************* 
        this function will be executed at the beginning
        that's where we load the images and sounds     
        *************************************************/

        // load the bird 
        game.load.image('bird', 'assets/bird.png');
        // load the pipes
        game.load.image('pipe', 'assets/pipe.png');

    },

    create : function(){
        /*************************************************
        this function is called after the preload function
        here we set up the game, display sprites, etc.
        *************************************************/

        //change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';

        // set the physic system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // create an empty group for pipes
        this.pipes = game.add.group();
        
        // display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100,245,'bird');

        // add physics to the bird
        // needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        // add pipes every 1.5 seconds
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // adding score and display in top left 
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
                        { font: "30px Arial", fill: "#fff" }); 
        
    },

    update : function(){
        /*************************************************
        this function is called 60 times per second
        it contains the game logic
        *************************************************/

        // if the bird is out of the screen (too high or too low), call the 'restartGame' function
        if(this.bird.y < 0 || this.bird.y > 490){
            this.restartGame();
        }

        // if bird collides with a pipe, restart game
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

        // rotate bird when jumping
        if(this.bird.angle < 20){
            this.bird.angle += 1;
        }
    },

    jump : function(){
        // add a vertical velocity to the bird
        this.bird.body.velocity.y = -300;

        // create an animation on the bird
        var animation = game.add.tween(this.bird);

        // change the angle of the bird to -20 degrees in 100 milliseconds
        animation.to({angle: -20}, 100);

        // and start the animation
        animation.start();

    },

    restartGame : function(){
        // start the 'main' state, which reestarts the game
        game.state.start('main');
    },

    addOnePipe : function(x, y){
        // create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // add the pipe to our previously create group
        this.pipes.add(pipe);

        // enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes : function(){
        // randomly pick a number between 1 and 5
        // this will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // add the 6 pipes
        // with one big hole at position 'hole' and 'hole +1"
        for (var i = 0; i < 8; i++){
            if(i != hole && i != hole + 1){
                this.addOnePipe(400, i * 60 + 10);
            }
        }
        
        // increase score by 1 each time new pipes are created
        this.score += 1;
        this.labelScore.text = this.score;

    },
};

// initialize phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// start the state to actually start the game
game.state.start('main');