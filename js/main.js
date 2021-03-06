var mainState = {
	preload: function(){
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		game.load.image('bird','assets/bird.png');
		game.load.image('pipe','assets/pipe.png');
		game.load.image('bird2','assets/pipe.png');
		game.load.audio('jump','assets/jump.wav');
		game.load.audio('collision','assets/col.wav');	
		
	},	
	
	create: function(){
		
		game.stage.backgroundColor = '#71c5cf';
		
		game.physics.startSystem(Phaser.Physics.Arcade);
		this.bird = game.add.sprite(100,100,'bird');
		
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;
		
		this.bird2 = game.add.sprite(100,-50,'bird2');
		game.physics.arcade.enable(this.bird2);
		this.bird2.body.immovable = true;
		
		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump,this);
		game.input.onTap.add(this.jump,this);
		
		
		this.pipes = game.add.group();
		this.timer = game.time.events.loop(1500,this.addRowOfPipes,this);
		
		this.score = -1;
		this.labelScore = game.add.text(20,20,'0',{font: '30px Arial',fill:'black'});
		
		
		this.highScore1 = game.add.text(20,50,' ',{font: '20px Calibri ',fill:'black'});

		game.load.audio('jump','assets/jump.wav');
		this.jumpSound = game.add.audio('jump');
		
		game.load.audio('collision','assets/col.wav');
		this.collisionsSound = game.add.audio('collision');
		

	},
	
	update: function(){
		
		game.physics.arcade.collide(this.bird, this.bird2);

		
		if (this.bird.y>490){
			this.restartGame();
		}
		
		game.physics.arcade.overlap(this.bird,this.pipes,this.hitPipe,null,this);
		
		if(this.bird.angle < 20){
			this.bird.angle += 1;
		}
		
		this.highScore1.text = 'High Score: '+highScore[highScore.length - 1]

		
		
	},
	
	
	jump: function(){
		if (this.bird.alive == false){
			return;
		}
		this.bird.body.velocity.y = -350;
		var animation = game.add.tween(this.bird);
		animation.to({angle:-20},100);
		animation.start();
		this.jumpSound.play();
	
	},
	
	restartGame: function(){
		game.state.start('main');
		
		highScore.push(this.score);
		highScore.sort(function(a, b){return a-b});
		


	},
	
	addOnePipe: function(x,y){
		var pipe = game.add.sprite(x,y,'pipe');
		this.pipes.add(pipe);
		game.physics.arcade.enable(pipe);
		pipe.body.velocity.x = -200;
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	
	},
	addRowOfPipes: function(){
		var hole = Math.floor(Math.random()*5) +1;
		
		for (var i = 0; i<8; i++){
			if (i!=hole && i!= hole+1 && i!=hole+2){
				this.addOnePipe(400,i*60+10);
			}
		}
		this.score += 1;
		this.labelScore.text = this.score;
	},
	
	hitPipe: function() {
		if(this.bird.alive == false){
			return;
		}
		this.bird.alive = false;
		game.time.events.remove(this.timer);
		this.pipes.forEach(function(p){
			p.body.velocity.x = 0;
		},this);
		this.collisionsSound.play();

	},
};



var highScore = [0];


var game = new Phaser.Game(400,490);
game.state.add('main',mainState);
game.state.start('main');
