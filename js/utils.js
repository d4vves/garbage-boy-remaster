function advanceLevel(physics) {
    messageText.destroy();
    gameAdvance = false;
    stageNumber ++;
    stageText.setText(`stage: ${stageNumber}`);
    garbageBoy.body.reset(745, 285);
    rats.children.iterate(function (rat) {
        rat.body.reset(Phaser.Math.Between(130, 765), Phaser.Math.Between(125, 560));
        rat.setVelocity(ratMovementSpeed - (stageNumber * 10), ratMovementSpeed - (stageNumber * 10));
    });
    physics.resume();
}

function collideCan(garbageBoy, rats) {
    if (hasTrashPickup) {
        this.physics.pause();
        messageText = this.add.text(400, 300, 'Welcome home, GB!', { fontSize: '32px', fill: '#C6CA53' });
        gameAdvance = true;
    } else {
        gameMessage.setVisible(true);
        setTimeout(() => {
            gameMessage.setVisible(false);
        }, 3000)
    }
}

function collidePowerUps(garbageBoy, powerUp) {
    powerUp.disableBody(true, true);
    hasTrashPickup = true;
    hasPowerUp = true;
    inventory = powerUp.body.gameObject.texture.key;
}

function collideRat(garbageBoy, rats) {
    this.physics.pause();
    messageText = this.add.text(400, 300, 'Ew! A rat!', { fontSize: '32px', fill: '#C6CA53' });
    gameOver = true;
}

function randomPowerUp() {
    return Math.random() < 0.5 ? 'bottle' : 'candy';
}

function resetLevel(physics) {
    messageText.destroy();
    gameOver = false;
    garbageBoy.body.reset(745, 285);
    rats.children.iterate(function (rat) {
        rat.body.reset(Phaser.Math.Between(130, 765), Phaser.Math.Between(125, 560));
        rat.setVelocity(ratMovementSpeed, ratMovementSpeed);
    });
    physics.resume();
}

function spaceBarDown(gameAdvance, gameOver, physics) {
    if (gameAdvance) {
        advanceLevel(physics);
    } else if (gameOver) {
        resetLevel(physics);
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