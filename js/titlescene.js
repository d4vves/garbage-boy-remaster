class TitleScene extends Phaser.Scene {
    constructor () {
        super('TitleScene');
    }

    preload() {
        this.load.audio('theme', 'assets/garbage_boy.mp3');
        this.load.image('op', 'assets/op.png');
    }

    create() {
        this.startImage = this.add.image(400, 300, 'op');
        this.startImage.alpha = 0;
        this.tweens.add({
            targets: this.startImage,
            duration: 3000,
            repeat: 0,
            alpha: 1,
        });

        this.startText = this.add.text(265, 555, '[click to start]', { fontSize: '26px', fill: '#C6CA53' });
        this.startText.alpha = 0;
        this.tweens.add({
            targets: this.startText,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            alpha: 1,
        });

        this.input.on('pointerup', (pointer) => {
            this.themeSong = this.sound.add('theme', { loop: true }).play();
            this.scene.start('IntroScene');
        });
    }
}