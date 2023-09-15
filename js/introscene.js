class IntroScene extends Phaser.Scene {
    constructor () {
        super('IntroScene');

        this.changeScene = () => {
            this.scene.start('GameScene');
        }
    }

    preload() {
        this.load.image('intro1', 'assets/intro1.png');
        this.load.image('intro2', 'assets/intro2.png');
        this.load.image('intro3', 'assets/intro3.png');
    }

    create() {
        this.introImage1 = this.add.image(400, 300, 'intro1');
        this.introImage1.alpha = 0;
        this.tweens.add({
            targets: this.introImage1,
            duration: 4000,
            repeat: 0,
            alpha: 1
        });

        this.introImage2 = this.add.image(400, 300, 'intro2');
        this.introImage2.alpha = 0;
        this.tweens.add({
            targets: this.introImage2,
            duration: 4000,
            repeat: 0,
            alpha: 1,
            delay: 5000
        });

        this.introImage3 = this.add.image(400, 300, 'intro3');
        this.introImage3.alpha = 0;
        this.tweens.add({
            targets: this.introImage3,
            duration: 4000,
            repeat: 0,
            alpha: 1,
            delay: 10000
        });

        this.controlsText = this.add.text(265, 555, 'WASD to move + [space] to use items', { fontSize: '26px', fill: '#C6CA53' });
        this.controlsText.alpha = 0;
        this.tweens.add({
            targets: this.controlsText,
            duration: 1500,
            repeat: -1,
            yoyo: true,
            alpha: 1,
        });

        setTimeout(this.changeScene, 18000);
    }
}