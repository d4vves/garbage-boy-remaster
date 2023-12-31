class GameScene extends Phaser.Scene {

    constructor () {
        super('GameScene');
        
        this.bigBenSlowdown = false;
        this.bigBenToggle = false;
        this.gameAdvance = false;
        this.gameOver = false;
        this.garbageBoyDirection = 'left';
        this.hasPowerUp = false;
        this.hasTrashPickup = false;
        this.inventory = '';
        this.messageText;
        this.movementSpeed = 150;
        this.ratMovementSpeed = -100;
        this.stageNumber = 1;
        this.stageText;

        this.advanceLevel = () => {
            this.gameAdvance = false;
            this.garbageBoy.body.reset(745, 285);
            this.garbageBoyDirection = 'left';
            this.hasTrashPickup = false;
            this.messageText.destroy();
            this.movementSpeed = 150;
            this.ratMovementSpeed = this.ratMovementSpeed - (this.stageNumber * 10)
            this.stageNumber ++;
            this.stageText.setText(`stage: ${this.stageNumber}`);
            this.powerUps.clear();
            this.powerUps.create(
                Phaser.Math.Between(130, 765),
                Phaser.Math.Between(125, 560),
                Math.random() < 0.5 ? 'bottle' : 'candy'
            );
            this.rats.children.iterate((rat) => {
                rat.body.reset(Phaser.Math.Between(130, 700), Phaser.Math.Between(125, 500));
                rat.setVelocity(this.ratMovementSpeed, this.ratMovementSpeed);
            });
            this.trafficCones.clear(true);
            this.trafficCones.create(Phaser.Math.Between(130, 700), Phaser.Math.Between(125, 560), 'trafficCone');
            this.trafficCones.create(Phaser.Math.Between(130, 700), Phaser.Math.Between(125, 560), 'trafficCone');
            this.physics.resume();
        }

        this.collideCan = () => {
            if (this.hasTrashPickup) {
                this.physics.pause();
                this.messageText = this.add.text(400, 300, 'Welcome home, GB!', { fontSize: '32px', fill: '#C6CA53' });
                this.gameAdvance = true;
            } else {
                this.gameMessage.setVisible(true);
                setTimeout(() => {
                    this.gameMessage.setVisible(false);
                }, 3000)
            }
        }

        this.collidePowerUps = (garbageBoy, powerUp) => {
            this.pickUpPowerUpFx.play();
            this.hasTrashPickup = true;
            powerUp.visible = false;
            if (!this.hasPowerUp) {
                this.hasPowerUp = true;
                this.inventory = powerUp.body.gameObject.texture.key;
            }
        }

        this.collideRat = () => {
            if (this.garbageBoyDirection == 'left') {
                // this.garbageBoy.anims.play('deathLeft', true);
            } else if (this.garbageBoyDirection == 'right') {
                // this.garbageBoy.anims.play('deathRight', true);
            }
            this.physics.pause();
            this.messageText = this.add.text(400, 300, 'Ew! A rat!', { fontSize: '32px', fill: '#C6CA53' });
            this.gameOver = true;
        }

        this.resetLevel = () => {
            this.gameOver = false;
            this.garbageBoy.body.reset(745, 285);
            this.garbageBoyDirection = 'left';
            this.hasPowerUp = false;
            this.hasTrashPickup = false;
            this.inventory = '';
            this.messageText.destroy();
            this.movementSpeed = 150;
            this.powerUps.children.iterate((powerUp) => {
                powerUp.visible = true;
            });
            this.rats.children.iterate((rat) => {
                rat.body.reset(Phaser.Math.Between(130, 700), Phaser.Math.Between(125, 500));
                rat.setVelocity(this.ratMovementSpeed, this.ratMovementSpeed);
            });
            this.physics.resume();
        }

        this.spaceBarDown = () => {
            if (this.gameAdvance) {
                this.advanceLevel(this.physics);
            } else if (this.gameOver) {
                this.resetLevel(this.physics);
            } else if (this.hasPowerUp) {
                this.usePowerUp();
            }
        }
        
        this.usePowerUp = () => {
            if (this.inventory == 'bottle') {
                this.bigBenSlowdown = true;
                this.rats.children.iterate((rat) => {
                    rat.body.velocity.setTo((rat.body.velocity.x / 1.5), (rat.body.velocity.y / 1.5));
                });
            } else if (this.inventory == 'candy')  {
                this.movementSpeed = this.movementSpeed * 1.5;
            }
            this.usePowerUpFx.play();
            this.hasPowerUp = false;
            this.inventory = '';
        }
    }

    preload () {
        this.load.audio('pickUpPowerUp', 'assets/pick_up_powerup.mp3');
        this.load.audio('ratBounce', 'assets/rat_bounce.mp3');
        this.load.audio('usePowerUp', 'assets/use_powerup.mp3');
        this.load.image('background', 'assets/bg.png');
        this.load.image('ben', 'assets/ben.png');
        this.load.image('bottle', 'assets/bottle.png');
        this.load.image('candy', 'assets/candy.png')
        this.load.image('garbageCan', 'assets/garbage.png');
        this.load.image('rat', 'assets/rat.png');
        this.load.image('trafficCone', 'assets/cone.png');
        this.load.spritesheet('garbageBoy', 'assets/garbageboy.png', { frameWidth: 35, frameHeight: 68 });
        // this.load.spritesheet('garbageBoy', 'assets/gboy_sprite.png', { frameWidth: 48, frameHeight: 48 });
        // this.load.spritesheet('garbageBoyDeath', 'assets/gboy_death_sprite.png', { frameWidth: 64, frameHeight: 64 });
    }

    create () {
        /*----- Game Sprites -----*/
        this.add.image(512, 325, 'background');

        this.bigBen = this.physics.add.sprite(70, 325, 'ben');
        this.bigBen.disableBody();
        this.bigBen.visible = false;

        this.garbageBoy = this.physics.add.sprite(989, 325, 'garbageBoy');
        this.garbageBoy.setCollideWorldBounds(true);

        this.garbageCan = this.physics.add.staticGroup();
        this.garbageCan.create(50, 300, 'garbageCan');

        this.trafficCones = this.physics.add.staticGroup();
        this.trafficCones.create(Phaser.Math.Between(250, 900), Phaser.Math.Between(125, 560), 'trafficCone');
        this.trafficCones.create(Phaser.Math.Between(250, 900), Phaser.Math.Between(125, 560), 'trafficCone');

        this.powerUps = this.physics.add.group({
            key: Math.random() < 0.5 ? 'bottle' : 'candy',
            repeat: 0,
            setXY: {
                    x: Phaser.Math.Between(250, 900),
                    y: Phaser.Math.Between(25, 560),
                    stepX: Phaser.Math.Between(40, 150),
                    stepY: Phaser.Math.Between(40, 150),
                }
        });

        this.rats = this.physics.add.group({
            key: 'rat',
            repeat: 1,
            setXY: {
                    x: Phaser.Math.Between(150, 800),
                    y: Phaser.Math.Between(25, 560),
                    stepX: Phaser.Math.Between(40, 150),
                    stepY: Phaser.Math.Between(40, 150),
                }
        });

        this.rats.children.iterate((rat) => {
            rat.setCollideWorldBounds(true);
            rat.setVelocity(this.ratMovementSpeed, this.ratMovementSpeed);
            rat.setBounce(1);
            rat.body.onWorldBounds = true;
        });

        /*----- Inventory -----*/
        this.inventoryBottle = this.add.image(310, 15, 'bottle');
        this.inventoryCandy = this.add.image(310, 15, 'candy');

        /*----- Text & Audio -----*/
        this.gameMessage = this.add.text(400, 300, 'Pick up yer trash!', { fontSize: '32px', fill: '#C6CA53' }).setVisible(false);
        this.inventoryText = this.add.text(150, 0, 'inventory: ', { fontSize: '24px', fill: '#C6CA53' });
        this.stageText = this.add.text(0, 0, 'stage: 1', { fontSize: '24px', fill: '#C6CA53' });

        this.pickUpPowerUpFx = this.sound.add('pickUpPowerUp');
        this.ratBounceFx = this.sound.add('ratBounce');
        this.usePowerUpFx = this.sound.add('usePowerUp');

        /*----- Collisions -----*/
        this.physics.add.collider(this.garbageBoy, this.trafficCones);
        this.physics.add.collider(this.garbageBoy, this.bigBen, this.collideBigBen, null, this);
        this.physics.add.collider(this.garbageBoy, this.garbageCan, this.collideCan, null, this);
        this.physics.add.collider(this.garbageBoy, this.rats, this.collideRat, null, this);
        this.physics.add.overlap(this.garbageBoy, this.powerUps, this.collidePowerUps, null, this);
        this.physics.add.collider(this.rats, this.garbageCan, () => { this.ratBounceFx.play() });
        this.physics.add.collider(this.rats, this.trafficCones, () => { this.ratBounceFx.play() });
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject.texture.key == 'rat') {
                this.ratBounceFx.play();
            }
        });

        /*----- Keys -----*/
        this.keys = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        /*----- Sprite Animations -----*/
        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('garbageBoy', { start: 7, end: 0 }),
        //     frameRate: 10,
        //     repeat: -1
        // });
    
        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('garbageBoy', { start: 8, end: 15 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'idleLeft',
        //     frames: this.anims.generateFrameNumbers('garbageBoy', { start: 16, end: 25 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'idleRight',
        //     frames: this.anims.generateFrameNumbers('garbageBoy', { start: 26, end: 35 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'deathLeft',
        //     frames: this.anims.generateFrameNumbers('garbageBoyDeath', { start: 9, end: 0 }),
        //     frameRate: 10,
        //     repeat: 0
        // });

        // this.anims.create({
        //     key: 'deathRight',
        //     frames: this.anims.generateFrameNumbers('garbageBoyDeath', { start: 10, end: 19 }),
        //     frameRate: 10,
        //     repeat: 0
        // });
    }

    update () {
        /*----- Keybindings -----*/
        if (!this.gameOver) {
            if (this.keys.left.isDown || this.keyA.isDown) {
                this.garbageBoy.setVelocityX(this.movementSpeed * -1);
                this.garbageBoyDirection = 'left';
                // this.garbageBoy.anims.play('left', true);
            } else if (this.keys.right.isDown || this.keyD.isDown) {
                this.garbageBoy.setVelocityX(this.movementSpeed);
                this.garbageBoyDirection = 'right';
                // this.garbageBoy.anims.play('right', true);
            } else if (this.keys.up.isDown || this.keyW.isDown) {
                this.garbageBoy.setVelocityY(this.movementSpeed * -1);
                if (this.garbageBoyDirection == 'left') {
                    // this.garbageBoy.anims.play('left', true);
                } else if (this.garbageBoyDirection == 'right') {
                    // this.garbageBoy.anims.play('right', true);
                }
            } else if (this.keys.down.isDown || this.keyS.isDown) {
                this.garbageBoy.setVelocityY(this.movementSpeed);
                if (this.garbageBoyDirection == 'left') {
                    // this.garbageBoy.anims.play('left', true);
                } else if (this.garbageBoyDirection == 'right') {
                    // this.garbageBoy.anims.play('right', true);
                }
            } else {
                this.garbageBoy.setVelocityX(0);
                this.garbageBoy.setVelocityY(0);
                if (this.garbageBoyDirection == 'left') {
                    // this.garbageBoy.anims.play('idleLeft', true);
                } else if (this.garbageBoyDirection == 'right') {
                    // this.garbageBoy.anims.play('idleRight', true);
                }
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.spaceBarDown()
        }

        /*----- Inventory Display -----*/
        if (this.inventory == 'bottle') {
            this.inventoryBottle.visible = true;
        } else if (this.inventory == 'candy') {
            this.inventoryCandy.visible = true;
        } else {
            this.inventoryBottle.visible = false;
            this.inventoryCandy.visible = false;
        }

        /*----- Big Ben -----*/
        this.bigBenToggle = this.stageNumber % 5 == 0 ? true : false;
        if (this.bigBenToggle) {
            this.bigBen.enableBody();
            this.bigBen.visible = true;
            this.physics.moveToObject(this.bigBen, this.garbageBoy, this.bigBenSlowdown ? 100 : 150);
        } else {
            this.bigBen.disableBody();
            this.bigBen.visible = false;
        }
    }
}