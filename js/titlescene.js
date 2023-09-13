class TitleScene extends Phaser.Scene {
    constructor () {
        super('TitleScene');
    }

    preload() {
        this.load.image('op', 'assets/op.png');
    }

    create() {
        this.add.image(400, 300, 'op');
        this.startText = this.add.text(265, 555, '[click to start]', { fontSize: '26px', fill: '#C6CA53' });
        this.tweens.add({
            targets: this.startText,
            duration: 1500,
            repeat: -1,
            yoyo: true,
            alpha: 0
        });

        this.input.on('pointerup', (pointer) => {
            this.scene.start('GameScene')
        });
    }
}