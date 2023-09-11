function advanceLevel(physics) {
    gameAdvance = false;
    garbageBoy.body.reset(745, 285);
    hasTrashPickup = false;
    messageText.destroy();
    movementSpeed = 150;
    stageNumber ++;
    stageText.setText(`stage: ${stageNumber}`);
    powerUps.clear(destroyChild = true);
    powerUps.create(
        Phaser.Math.Between(130, 765),
        Phaser.Math.Between(125, 560),
        randomPowerUp()
    );
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
    hasTrashPickup = true;
    powerUp.visible = false;
    if (!hasPowerUp) {
        hasPowerUp = true;
        inventory = powerUp.body.gameObject.texture.key;
    }
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
    gameOver = false;
    garbageBoy.body.reset(745, 285);
    hasPowerUp = false;
    hasTrashPickup = false;
    inventory = '';
    messageText.destroy();
    powerUps.children.iterate(function (powerUp) {
        powerUp.visible = true;
    });
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