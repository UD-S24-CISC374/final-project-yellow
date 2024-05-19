import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private dude?: Phaser.Physics.Arcade.Sprite;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private ground?: Phaser.Physics.Arcade.Image;

    constructor() {
        super({ key: "title-screen" });
    }

    preload() {
        this.load.audio("start-sound", "assets/sounds/startsound.mp3");
        this.load.image("title-screen", "assets/title-screen.png");
        this.load.image("play-button", "assets/play-button.png");

        this.load.spritesheet(
            "gal_idle_right",
            "assets/Pink_Monster_Idle_4.png",
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet(
            "dude_idle_left",
            "assets/Dude_Monster_Idle_Left4.png",
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.image("level0-platform", "assets/level0/platform.png");
    }

    create() {
        // Creating Gal
        this.player = this.physics.add
            .sprite(360, 580, "gal_idle_right")
            .setScale(1.3, 1.3)
            .setDepth(35)
            .setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "gal_idle_right",
            frames: this.anims.generateFrameNumbers("gal_idle_right", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.player.anims.play("gal_idle_right", true);

        // Creating Guy
        this.dude = this.physics.add
            .sprite(this.cameras.main.width - 360, 580, "dude_idle_left")
            .setScale(1.3, 1.3)
            .setDepth(35)
            .setOrigin(0.5, 1);
        this.dude.setCollideWorldBounds(true);

        this.anims.create({
            key: "dude_idle_left",
            frames: this.anims.generateFrameNumbers("dude_idle_left", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.dude.anims.play("dude_idle_left", true);

        // Create platform
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.platforms.create(
            650,
            663,
            "level0-platform"
        ) as Phaser.Physics.Arcade.Image;

        this.ground.setScale(5).refreshBody();
        this.ground.setAlpha(0); // Hide the ground platform

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.dude, this.platforms);

        const backgroundImage = this.add
            .image(0, 0, "title-screen")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width,
            this.cameras.main.height / backgroundImage.height
        );

        // Go to levels map on play button click
        const playButton = this.add.image(
            this.cameras.main.width / 2,
            545,
            "play-button"
        );
        playButton.setScale(0.42);

        playButton.setInteractive();

        const originalScale = playButton.scaleX;
        const hoverScale = originalScale * 1.09;

        const originalPlayerPosition = { x: this.player.x, y: this.player.y };
        const originalDudePosition = { x: this.dude.x, y: this.dude.y };

        // Change scale on hover
        playButton.on("pointerover", () => {
            this.sound.play("start-sound");
            this.tweens.add({
                targets: playButton,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });

            // Tween animation for moving player towards playButton
            this.tweens.add({
                targets: this.player,
                x: playButton.x - 190,
                duration: 1000, // Duration of the tween in milliseconds
                ease: "Sine", // Easing function for the tween
            });

            // Tween animation for moving dude towards playButton
            this.tweens.add({
                targets: this.dude,
                x: playButton.x + 190,
                duration: 1000, // Duration of the tween in milliseconds
                ease: "Sine", // Easing function for the tween
            });
        });

        // Restore original scale when pointer leaves
        playButton.on("pointerout", () => {
            this.tweens.add({
                targets: playButton,
                scaleX: originalScale,
                scaleY: originalScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });

            // Tween animation for moving player back to original position
            this.tweens.add({
                targets: this.player,
                x: originalPlayerPosition.x,
                y: originalPlayerPosition.y,
                duration: 1000, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });

            // Tween animation for moving dude back to original position
            this.tweens.add({
                targets: this.dude,
                x: originalDudePosition.x,
                y: originalDudePosition.y,
                duration: 1000, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        playButton.on("pointerup", () => {
            this.scene.start("StartCutScene");
        });
    }

    update() {}
}
