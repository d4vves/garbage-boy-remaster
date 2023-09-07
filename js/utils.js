function advanceLevel() {
    messageText.destroy();
    gameAdvance = false;
    stageNumber ++;
    stageText.setText(`stage: ${stageNumber}`);
    garbageBoy.body.reset(745, 285);
    rats.children.iterate(function (rat) {
        rat.body.reset(Phaser.Math.Between(130, 765), Phaser.Math.Between(125, 560));
        rat.setVelocity(-95 - 5 - (stageNumber * 10), -75 - (stageNumber * 10));
        let ratVelocity = -95 - 5 - (stageNumber * 10)
    });
}

function collideCan(garbageBoy, rats) {
    this.physics.pause();
    messageText = this.add.text(400, 300, 'Welcome home, GB!', { fontSize: '32px', fill: '#C6CA53' });
    gameAdvance = true;
}

function collidePowerUps(garbageBoy, powerUp) {
    powerUp.disableBody(true, true);
    hasPowerUp = true;
    inventory = powerUp.body.gameObject.texture.key;
    console.log('INVENTORY: ', inventory)
}

function collideRat(garbageBoy, rats) {
    this.physics.pause();
    messageText = this.add.text(400, 300, 'Ew! A rat!', { fontSize: '32px', fill: '#C6CA53' });
    gameOver = true;
}

function randomPowerUp() {
    return Math.random() < 0.5 ? 'bottle' : 'candy';
}

function resetLevel() {
    messageText.destroy();
    gameOver = false;
    garbageBoy.body.reset(745, 285);
    rats.children.iterate(function (rat) {
        rat.body.reset(Phaser.Math.Between(130, 765), Phaser.Math.Between(125, 560));
        rat.setVelocity(-95, -95);
    });
}

function spaceBarDown(gameAdvance, gameOver) {
    if (gameAdvance) {
        advanceLevel();
    } else if (gameOver) {
        resetLevel();
    } else if (hasPowerUp) {
        usePowerUp(inventory);
    }
}

function usePowerUp(powerUp) {
    if (powerUp == 'bottle') {
            rats.children.iterate(function (rat) {
                rat.body.velocity.setTo((rat.body.velocity.x / 2), (rat.body.velocity.y / 2));
            });
    } else if (powerUp == 'candy')  {
        movementSpeed = movementSpeed * 1.5;
    }
    hasPowerUp = false;
    inventory = '';
}