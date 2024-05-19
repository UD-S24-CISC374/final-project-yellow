import Phaser from "phaser";

// Level States: 0 = Locked, 1 = Just Unlocked, 2 = Current Level, 3 = Completed
interface GameMapData {
    level0State: number;
    level1State: number;
    level2State: number;
    level3State: number;
    level0Stars: number;
    level1Stars: number;
    level2Stars: number;
    level3Stars: number;
}

export default class GameMap extends Phaser.Scene {
    private level0State: number;
    private level1State: number;
    private level2State: number;
    private level3State: number;
    private level0Stars: number;
    private level1Stars: number;
    private level2Stars: number;
    private level3Stars: number;
    private backgroundMusic?: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "game-map" });
    }

    preload() {
        this.load.audio("map-music", "assets/Dream.mp3");
        this.load.audio("menu-sound", "assets/sounds/menusound.mp3");

        this.load.image("game-map", "assets/gameMap/game-map.png");
        this.load.image(
            "level0-unlocked",
            "assets/gameMap/level0-button-unlocked.png"
        );
        this.load.image(
            "level0-completed",
            "assets/gameMap/level0-button-completed.png"
        );
        this.load.image(
            "level1-locked",
            "assets/gameMap/level1-button-locked.png"
        );
        this.load.image(
            "level1-unlocked",
            "assets/gameMap/level1-button-unlocked.png"
        );
        this.load.image(
            "level1-completed",
            "assets/gameMap/level1-button-completed.png"
        );
        this.load.image(
            "level2-locked",
            "assets/gameMap/level2-button-locked.png"
        );
        this.load.image(
            "level2-unlocked",
            "assets/gameMap/level2-button-unlocked.png"
        );
        this.load.image(
            "level2-completed",
            "assets/gameMap/level2-button-completed.png"
        );
        this.load.image(
            "level3-locked",
            "assets/gameMap/level3-button-locked.png"
        );
        this.load.image(
            "level3-unlocked",
            "assets/gameMap/level3-button-unlocked.png"
        );
        this.load.image(
            "level3-completed",
            "assets/gameMap/level3-button-completed.png"
        );

        // Stars
        this.load.image("0starsDown", "assets/gameMap/stars/0starsDown.png");
        this.load.image("0starsUp", "assets/gameMap/stars/0starsUp.png");
        this.load.image("1starsDown", "assets/gameMap/stars/1starsDown.png");
        this.load.image("1starsUp", "assets/gameMap/stars/1starsUp.png");
        this.load.image("2starsDown", "assets/gameMap/stars/2starsDown.png");
        this.load.image("2starsUp", "assets/gameMap/stars/2starsUp.png");
        this.load.image("3starsDown", "assets/gameMap/stars/3starsDown.png");
        this.load.image("3starsUp", "assets/gameMap/stars/3starsUp.png");

        this.load.image("star", "assets/star.png");
    }

    create(data: GameMapData) {
        this.level0State = data.level0State | 2;
        this.level1State = data.level1State | 0;
        this.level2State = data.level2State | 0;
        this.level3State = data.level3State | 0;
        this.level0Stars = data.level0Stars | 0;
        this.level1Stars = data.level1Stars | 0;
        this.level2Stars = data.level2Stars | 0;
        this.level3Stars = data.level3Stars | 0;

        console.log(this.level0Stars, data.level0Stars);

        const backgroundImage = this.add
            .image(0, 0, "game-map")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width,
            this.cameras.main.height / backgroundImage.height
        );

        this.backgroundMusic = this.sound.add("map-music");
        this.backgroundMusic.play({
            loop: true,
            volume: 0.8,
        });

        const totalStarsCollected =
            this.level0Stars +
            this.level1Stars +
            this.level2Stars +
            this.level3Stars;

        const starsCollectedText = this.add.text(
            135,
            91,
            `${totalStarsCollected} / 12`,
            {
                fontFamily: "Comic Sans MS",
                fontSize: "32px",
                color: "#ffffff",
                align: "center",
            }
        );
        starsCollectedText.setOrigin(0, 0.5).setDepth(32);

        const star = this.add.image(85, 89, "star");
        star.setScale(0.14);

        const originalScale = 0.43;
        const hoverScale = 0.46;

        // Creating Level Stars
        const level0Stars = this.add
            .image(180, 485, "0starsUp")
            .setScale(0.21)
            .setDepth(2);

        const level1Stars = this.add
            .image(447, 446, "0starsDown")
            .setScale(0.21)
            .setDepth(2);

        const level2Stars = this.add
            .image(768, 535, "0starsDown")
            .setScale(0.21)
            .setDepth(2);

        const level3Stars = this.add
            .image(1058, 196, "0starsUp")
            .setScale(0.21)
            .setDepth(2);

        // If player hasn't played level yet, don't show stars, else, show the number of stars they earned
        // Level 0 Stars
        if (this.level0Stars == 0) {
            level0Stars.setVisible(false);
        } else if (this.level0Stars == 1) {
            level0Stars.setTexture("1starsUp");
        } else if (this.level0Stars == 2) {
            level0Stars.setTexture("2starsUp");
        } else if (this.level0Stars == 3) {
            level0Stars.setTexture("3starsUp");
        }

        // Level 1 Stars
        if (this.level1Stars == 0) {
            level1Stars.setVisible(false);
        } else if (this.level1Stars == 1) {
            level1Stars.setTexture("1starsDown");
        } else if (this.level1Stars == 2) {
            level1Stars.setTexture("2starsDown");
        } else if (this.level1Stars == 3) {
            level1Stars.setTexture("3starsDown");
        }

        // Level 2 Stars
        if (this.level2Stars == 0) {
            level2Stars.setVisible(false);
        } else if (this.level2Stars == 1) {
            level2Stars.setTexture("1starsDown");
        } else if (this.level2Stars == 2) {
            level2Stars.setTexture("2starsDown");
        } else if (this.level2Stars == 3) {
            level2Stars.setTexture("3starsDown");
        }

        // Level 3 Stars
        if (this.level3Stars == 0) {
            level3Stars.setVisible(false);
        } else if (this.level3Stars == 1) {
            level3Stars.setTexture("1starsUp");
        } else if (this.level3Stars == 2) {
            level3Stars.setTexture("2starsUp");
        } else if (this.level3Stars == 3) {
            level3Stars.setTexture("3starsUp");
        }

        // Level 0 Button:
        const level0Button = this.add.image(180, 552, "level0-unlocked");
        level0Button.setScale(originalScale);

        if (this.level0State == 3) {
            level0Button.setTexture("level0-completed");
        }

        level0Button.setInteractive();

        level0Button.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic?.stop();
            this.scene.start("Level0", {
                level0State: this.level0State,
                level1State: this.level1State,
                level2State: this.level2State,
                level3State: this.level3State,
                level0Stars: this.level0Stars,
                level1Stars: this.level1Stars,
                level2Stars: this.level2Stars,
                level3Stars: this.level3Stars,
            });
        });

        // Change scale on hover
        level0Button.on("pointerover", () => {
            this.tweens.add({
                targets: level0Button,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 100, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
            this.tweens.add({
                targets: level0Stars,
                scaleX: 0.24,
                scaleY: 0.24,
                duration: 100, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        // Restore original scale when pointer leaves
        level0Button.on("pointerout", () => {
            this.tweens.add({
                targets: level0Button,
                scaleX: originalScale,
                scaleY: originalScale,
                duration: 100, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
            this.tweens.add({
                targets: level0Stars,
                scaleX: 0.21,
                scaleY: 0.21,
                duration: 100, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        // Level 1 Button:
        const level1Button = this.add.image(419, 355, "level1-locked");
        level1Button.setScale(originalScale);

        // If level 0 just completed, animate the unlocking of level 1
        if (this.level1State == 1) {
            this.tweens.add({
                targets: level1Button,
                alpha: 0.3, // Fade out the locked button
                duration: 500,
                onComplete: () => {
                    level1Button.setTexture("level1-unlocked");
                    level1Button.setScale(originalScale);
                    level1Button.setAlpha(0); // Make the unlocked button invisible initially

                    this.tweens.add({
                        targets: level1Button,
                        alpha: 1, // Fade in the unlocked button
                        duration: 500,
                        ease: "Linear",
                        onComplete: () => {
                            this.level1State = 2; // Now level 1 is the current level
                        },
                    });
                },
            });
        }
        // If level 1 has already been unlocked and is current level
        else if (this.level1State == 2) {
            level1Button.setTexture("level1-unlocked");
        }
        // If level 1 is completed
        else if (this.level1State == 3) {
            level1Button.setTexture("level1-completed");
        }

        // If level 1 is unlocked or completed, make it clickable
        if (this.level1State > 0) {
            level1Button.setInteractive();

            level1Button.on("pointerup", () => {
                this.sound.play("menu-sound");
                this.backgroundMusic?.stop();
                this.scene.start("Level1", {
                    level0State: this.level0State,
                    level1State: this.level1State,
                    level2State: this.level2State,
                    level3State: this.level3State,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            });

            // Change scale on hover
            level1Button.on("pointerover", () => {
                this.tweens.add({
                    targets: level1Button,
                    scaleX: hoverScale,
                    scaleY: hoverScale,
                    duration: 100,
                    ease: "Linear",
                });
                this.tweens.add({
                    targets: level1Stars,
                    scaleX: 0.24,
                    scaleY: 0.24,
                    duration: 100, // Duration of the tween in milliseconds
                    ease: "Linear", // Easing function for the tween
                });
            });

            // Restore original scale when pointer leaves
            level1Button.on("pointerout", () => {
                this.tweens.add({
                    targets: level1Button,
                    scaleX: originalScale,
                    scaleY: originalScale,
                    duration: 100,
                    ease: "Linear",
                });
                this.tweens.add({
                    targets: level1Stars,
                    scaleX: 0.21,
                    scaleY: 0.21,
                    duration: 100, // Duration of the tween in milliseconds
                    ease: "Linear", // Easing function for the tween
                });
            });
        }

        // Level 2 Button:
        const level2Button = this.add.image(780, 460, "level2-locked");
        level2Button.setScale(originalScale);

        // If level 1 just completed, animate the unlocking of level 2
        if (this.level2State == 1) {
            this.tweens.add({
                targets: level2Button,
                alpha: 0.3, // Fade out the locked button
                duration: 500,
                onComplete: () => {
                    level2Button.setTexture("level2-unlocked");
                    level2Button.setScale(originalScale);
                    level2Button.setAlpha(0); // Make the unlocked button invisible initially

                    this.tweens.add({
                        targets: level2Button,
                        alpha: 1, // Fade in the unlocked button
                        duration: 500,
                        ease: "Linear",
                        onComplete: () => {
                            this.level2State = 2; // Now level 2 is the current level
                        },
                    });
                },
            });
        }
        // If level 2 has already been unlocked and is current level
        else if (this.level2State == 2) {
            level2Button.setTexture("level2-unlocked");
        }
        // If level 2 is completed
        else if (this.level2State == 3) {
            level2Button.setTexture("level2-completed");
        }

        // If level 2 is unlocked or completed, make it clickable
        if (this.level2State > 0) {
            level2Button.setInteractive();

            level2Button.on("pointerup", () => {
                this.sound.play("menu-sound");
                this.backgroundMusic?.stop();
                this.scene.start("Level2", {
                    level0State: this.level0State,
                    level1State: this.level1State,
                    level2State: this.level2State,
                    level3State: this.level3State,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            });

            // Change scale on hover
            level2Button.on("pointerover", () => {
                this.tweens.add({
                    targets: level2Button,
                    scaleX: hoverScale,
                    scaleY: hoverScale,
                    duration: 100,
                    ease: "Linear",
                });
                this.tweens.add({
                    targets: level2Stars,
                    scaleX: 0.24,
                    scaleY: 0.24,
                    duration: 100, // Duration of the tween in milliseconds
                    ease: "Linear", // Easing function for the tween
                });
            });

            // Restore original scale when pointer leaves
            level2Button.on("pointerout", () => {
                this.tweens.add({
                    targets: level2Button,
                    scaleX: originalScale,
                    scaleY: originalScale,
                    duration: 100,
                    ease: "Linear",
                });
                this.tweens.add({
                    targets: level2Stars,
                    scaleX: 0.21,
                    scaleY: 0.21,
                    duration: 100, // Duration of the tween in milliseconds
                    ease: "Linear", // Easing function for the tween
                });
            });
        }

        // Level 3 Button:
        const level3Button = this.add.image(1091, 270, "level3-locked");
        level3Button.setScale(originalScale);

        // If level 2 just completed, animate the unlocking of level 3
        if (this.level3State == 1) {
            this.tweens.add({
                targets: level3Button,
                alpha: 0.3, // Fade out the locked button
                duration: 500,
                onComplete: () => {
                    level3Button.setTexture("level3-unlocked");
                    level3Button.setScale(originalScale);
                    level3Button.setAlpha(0); // Make the unlocked button invisible initially

                    this.tweens.add({
                        targets: level3Button,
                        alpha: 1, // Fade in the unlocked button
                        duration: 500,
                        ease: "Linear",
                        onComplete: () => {
                            this.level3State = 2; // Now level 3 is the current level
                        },
                    });
                },
            });
        }
        // If level 3 has already been unlocked and is current level
        else if (this.level3State == 2) {
            level3Button.setTexture("level3-unlocked");
        }
        // If level 3 is completed
        else if (this.level3State == 3) {
            level3Button.setTexture("level3-completed");
        }

        // If level 3 is unlocked or completed, make it clickable
        // this.level3State > 0
        if (this.level3State > 0) {
            level3Button.setInteractive();

            level3Button.on("pointerup", () => {
                this.sound.play("menu-sound");
                this.backgroundMusic?.stop();
                this.scene.start("Level3", {
                    level0State: this.level0State,
                    level1State: this.level1State,
                    level2State: this.level2State,
                    level3State: this.level3State,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            });

            // Change scale on hover
            level3Button.on("pointerover", () => {
                this.tweens.add({
                    targets: level3Button,
                    scaleX: hoverScale,
                    scaleY: hoverScale,
                    duration: 100,
                    ease: "Linear",
                });
                this.tweens.add({
                    targets: level3Stars,
                    scaleX: 0.24,
                    scaleY: 0.24,
                    duration: 100, // Duration of the tween in milliseconds
                    ease: "Linear", // Easing function for the tween
                });
            });

            // Restore original scale when pointer leaves
            level3Button.on("pointerout", () => {
                this.tweens.add({
                    targets: level3Button,
                    scaleX: originalScale,
                    scaleY: originalScale,
                    duration: 100,
                    ease: "Linear",
                });
                this.tweens.add({
                    targets: level3Stars,
                    scaleX: 0.21,
                    scaleY: 0.21,
                    duration: 100, // Duration of the tween in milliseconds
                    ease: "Linear", // Easing function for the tween
                });
            });
        }
    }

    update() {}
}
