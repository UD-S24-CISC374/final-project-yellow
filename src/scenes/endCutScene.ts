import Phaser from "phaser";

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

export default class EndCutScene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private dude?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private door?: Phaser.Physics.Arcade.Image;
    private ground?: Phaser.Physics.Arcade.Image;
    private stackpack?: Phaser.GameObjects.Image;
    private heart?: Phaser.GameObjects.Image;
    private heartSmall?: Phaser.GameObjects.Image;

    private galMove: string = "right";
    private dudeMove: string = "left";
    private galLastDirection: string = "right";
    private dudeLastDirection: string = "right";

    private delay: number;

    private level0State: number;
    private level1State: number;
    private level2State: number;
    private level3State: number;
    private level0Stars: number;
    private level1Stars: number;
    private level2Stars: number;
    private level3Stars: number;

    private backgroundMusic: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "EndCutScene" });
    }

    preload() {
        this.load.audio("endMusic", "assets/end-cutscene/sweet-love.mp3");
        this.load.audio("menu-sound", "assets/sounds/menusound.mp3");

        this.load.image(
            "end-cutscene-background",
            "assets/end-cutscene/end-background1.jpeg"
        );
        this.load.image(
            "final-background",
            "assets/end-cutscene/final-background.jpg"
        );
        this.load.image("just-stackpack", "assets/backpack.png");

        this.load.image("cutscene-heart", "assets/end-cutscene/heart.png");

        this.load.image(
            "play-again-button",
            "assets/end-cutscene/play-again-button.png"
        );
        this.load.image(
            "world-map-button",
            "assets/end-cutscene/world-map-button.png"
        );

        this.load.spritesheet(
            "gal_idle_right",
            "assets/Pink_Monster_Idle_4.png",
            { frameWidth: 128, frameHeight: 128 }
        );
        this.load.spritesheet(
            "gal_idle_left",
            "assets/Pink_Monster_Idle_Left4.png",
            { frameWidth: 128, frameHeight: 128 }
        );
        this.load.spritesheet(
            "gal_walk_right",
            "assets/Pink_Monster_Walk_6.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "gal_walk_left",
            "assets/Pink_Monster_Walk_Left6.png",
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet(
            "dude_idle_right",
            "assets/Dude_Monster_Idle_4.png",
            { frameWidth: 128, frameHeight: 128 }
        );
        this.load.spritesheet(
            "dude_idle_left",
            "assets/Dude_Monster_Idle_Left4.png",
            { frameWidth: 128, frameHeight: 128 }
        );
        this.load.spritesheet(
            "dude_walk_right",
            "assets/Dude_Monster_Walk_6.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "dude_walk_left",
            "assets/Dude_Monster_Walk_Left6.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "dude_run_right",
            "assets/Dude_Monster_Run_6.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "dude_run_left",
            "assets/Dude_Monster_Run_Left6.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );

        this.load.image("level0-platform", "assets/level0/platform.png");

        //this.load.image("red-opendoor", "assets/level3/red-door-open.png");
        this.load.image("star", "assets/star.png");
    }

    create(data: GameMapData) {
        // Resume all animations and tweens
        this.anims.resumeAll();
        this.tweens.resumeAll();
        // Make it so player can enter keyboard input
        if (this.input.keyboard) {
            this.input.keyboard.enabled = true;
        }

        this.level0State = data.level0State;
        this.level1State = data.level1State;
        this.level2State = data.level2State;
        this.level3State = data.level3State;
        this.level0Stars = data.level0Stars;
        this.level1Stars = data.level1Stars;
        this.level2Stars = data.level2Stars;
        this.level3Stars = data.level3Stars;

        this.galMove = "";
        this.dudeMove = "";
        this.galLastDirection = "right";
        this.dudeLastDirection = "left";

        this.delay = 0;

        const backgroundImage = this.add
            .image(0, 0, "end-cutscene-background")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width + 0.1,
            this.cameras.main.height / backgroundImage.height
        );

        this.backgroundMusic = this.sound.add("endMusic");
        this.backgroundMusic.play({
            loop: true,
            volume: 0.1,
        });

        this.stackpack = this.add
            .image(100, 150, "just-stackpack")
            //.setPosition(100, 551)
            .setOrigin(0.5, 1);
        this.stackpack.setScale(0.1, 0.1);

        this.heart = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "cutscene-heart"
        );
        this.heart.setDepth(20);
        this.heart.setScale(0);

        this.heartSmall = this.add.image(
            this.cameras.main.centerX,
            300,
            "cutscene-heart"
        );
        this.heartSmall.setDepth(20);
        this.heartSmall.setScale(0.2, 0.2);
        this.heartSmall.setVisible(false);

        // Creating Gal
        this.player = this.physics.add
            .sprite(120, 150, "gal_walk_right")
            .setScale(1.5, 1.5)
            .setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "gal_walk_right",
            frames: this.anims.generateFrameNumbers("gal_walk_right", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "gal_walk_left",
            frames: this.anims.generateFrameNumbers("gal_walk_left", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "gal_idle_right",
            frames: this.anims.generateFrameNumbers("gal_idle_right", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "gal_idle_left",
            frames: this.anims.generateFrameNumbers("gal_idle_left", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        // Creating Guy
        this.dude = this.physics.add
            .sprite(this.cameras.main.width - 120, 430, "dude_run_right")
            .setScale(1.5, 1.5)
            .setOrigin(0.5, 0.5);
        this.dude.setCollideWorldBounds(true);

        this.anims.create({
            key: "dude_idle_right",
            frames: this.anims.generateFrameNumbers("dude_idle_right", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "dude_idle_left",
            frames: this.anims.generateFrameNumbers("dude_idle_left", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "dude_walk_right",
            frames: this.anims.generateFrameNumbers("dude_walk_right", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "dude_walk_left",
            frames: this.anims.generateFrameNumbers("dude_walk_left", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "dude_run_right",
            frames: this.anims.generateFrameNumbers("dude_run_right", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "dude_run_left",
            frames: this.anims.generateFrameNumbers("dude_run_left", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });

        this.cursors = this.input.keyboard?.createCursorKeys();

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.platforms.create(
            650,
            633,
            "level0-platform"
        ) as Phaser.Physics.Arcade.Image;

        this.ground.setScale(5).refreshBody();
        this.ground.setAlpha(0); // Hide the ground platform

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.dude, this.platforms);

        // Resize collision boxes of player and everything else that can be collided with
        this.player
            .setSize(this.player.width - 64, this.player.height)
            .setOffset(32, 0)
            .setDepth(10);

        this.dude
            .setSize(this.dude.width - 64, this.dude.height)
            .setOffset(32, 0)
            .setDepth(10);

        this.animateEnding();
    }

    private animateEnding() {
        // Make stackpack drop to floor
        this.tweens.add({
            targets: this.stackpack,
            y: 551,
            duration: 900,
        });

        this.delay = 1000; // Wait 1000 millisseconds before starting

        // Step 1: Both player and dude run to the middle of the screen
        setTimeout(() => {
            // Tween for the player
            this.tweens.add({
                targets: this.player,
                x: this.cameras.main.centerX - 60,
                duration: 1200,
                onStart: () => {
                    this.galMove = "right";
                },
                onComplete: () => {
                    this.galMove = "";
                },
            });

            // Tween for the dude
            this.tweens.add({
                targets: this.dude,
                x: this.cameras.main.centerX + 60,
                duration: 1500,
                onStart: () => {
                    this.dudeMove = "left";
                },
                onComplete: () => {
                    this.dudeMove = "";
                },
            });
        }, this.delay);

        this.delay += 1700;
        setTimeout(() => {
            this.heartSmall?.setVisible(true);
            this.heartSmall?.setX(this.cameras.main.centerX).setY(300);
            this.tweens.add({
                targets: this.heartSmall,
                scaleX: `*=${1.3}`,
                scaleY: `*=${1.3}`,
                duration: 500,
                yoyo: true, // Reverse back to original scale
                repeat: 1,
                onComplete: () => {
                    this.heartSmall?.setVisible(false);
                },
            });
        }, this.delay);

        this.delay += 2700;
        // Step 2: Player looks left
        setTimeout(() => {
            this.galLastDirection = "left";
        }, this.delay);

        this.delay += 1000;
        // Step 3: Player looks back right to the dude
        setTimeout(() => {
            this.galLastDirection = "right";
        }, this.delay);

        this.delay += 500;
        // Step 4: Player walks to the left and collects the stackpack
        setTimeout(() => {
            this.tweens.add({
                targets: this.player,
                x: 220,
                duration: 1200,
                onStart: () => {
                    this.galMove = "left";
                },
                onComplete: () => {
                    this.galMove = "";
                    // Collect stackpack
                    this.tweens.add({
                        targets: this.stackpack,
                        x: this.player?.x, // Move towards the player's x position
                        y: this.player?.y,
                        scaleX: 0.03, // Shrink horizontally
                        scaleY: 0.03, // Shrink vertically
                        duration: 500, // Duration of animation
                        onComplete: () => {
                            this.stackpack?.setVisible(false);
                        },
                    });
                },
            });
        }, this.delay);

        this.delay += 1700;
        // Step 5: Player walks back to the dude
        setTimeout(() => {
            this.tweens.add({
                targets: this.player,
                x: this.cameras.main.centerX - 45,
                duration: 1500,
                onStart: () => {
                    this.galMove = "right";
                },
            });
        }, this.delay);

        this.delay += 1500;
        // Step 6: Player and dude walk to the right together
        setTimeout(() => {
            // Player
            this.player?.setVelocityX(150);
            this.galMove = "right";

            // Dude
            this.dude?.setVelocityX(150);
            this.dudeMove = "rightWalk";
        }, this.delay);

        this.delay += 500;
        // Step 7: A heart appears and fills the whole screen
        setTimeout(() => {
            this.tweens.add({
                targets: this.heart,
                scaleX: 3,
                scaleY: 3,
                duration: 2300,
                onComplete: () => {
                    // Step 8: Display last scene
                    this.displayLastScene();
                },
            });
        }, this.delay);
    }

    private displayLastScene() {
        // After the cutscene
        const newBackgroundImage = this.add
            .image(0, 0, "final-background")
            .setOrigin(0, 0)
            .setDepth(30);
        newBackgroundImage.setScale(
            this.cameras.main.width / newBackgroundImage.width,
            this.cameras.main.height / newBackgroundImage.height
        );

        const thankYouText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 230,
            "Thank you for Playing",
            {
                fontFamily: "Comic Sans MS",
                fontSize: "90px",
                color: "#253347",
                align: "center",
                fontStyle: "bold",
            }
        );
        thankYouText.setOrigin(0.5).setDepth(32);

        const authorText = this.add.text(
            this.cameras.main.centerX + 55,
            this.cameras.main.centerY + 265,
            "A game by Aparna Roy, Sam Glover & Emilie Barniak",
            {
                fontFamily: "Comic Sans MS",
                fontSize: "34px",
                color: "#253347",
                align: "center",
            }
        );
        authorText.setOrigin(0.5).setDepth(32);

        const totalStarsCollected =
            this.level0Stars +
            this.level1Stars +
            this.level2Stars +
            this.level3Stars;
        const starsCollectedText = this.add.text(
            557,
            222,
            `Earned: ${totalStarsCollected} / 12`,
            {
                fontFamily: "Comic Sans MS",
                fontSize: "32px",
                color: "#253347",
                align: "center",
            }
        );
        starsCollectedText.setOrigin(0, 0.5).setDepth(32);
        const star = this.add.image(517, 220, "star");
        star.setScale(0.13).setDepth(32);

        this.stackpack
            ?.setVisible(true)
            .setScale(0.06)
            .setDepth(35)
            .setPosition(230, 655);

        this.galMove = "";
        this.dudeMove = "";
        this.galLastDirection = "right";
        this.dudeLastDirection = "left";
        this.player?.setVelocityX(0);
        this.dude?.setVelocityX(0);
        this.player?.setDepth(31);
        this.player?.setPosition(this.cameras.main.centerX - 80, 345);
        this.dude?.setDepth(31);
        this.dude?.setPosition(this.cameras.main.centerX + 80, 345);
        this.ground?.setPosition(650, 530).refreshBody();

        const playAgainButton = this.add
            .image(
                this.cameras.main.centerX - 180,
                this.cameras.main.centerY + 165,
                "play-again-button"
            )
            .setDepth(30);
        playAgainButton.setScale(0.4, 0.4);
        playAgainButton.setInteractive();

        const worldMapButton = this.add
            .image(
                this.cameras.main.centerX + 180,
                this.cameras.main.centerY + 165,
                "world-map-button"
            )
            .setDepth(30);
        worldMapButton.setScale(0.4, 0.4);
        worldMapButton.setInteractive();

        const originalScale = playAgainButton.scaleX;
        const hoverScale = originalScale * 1.06;

        playAgainButton.on("pointerover", () => {
            this.tweens.add({
                targets: playAgainButton,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 115,
                ease: "Linear",
            });
        });

        playAgainButton.on("pointerout", () => {
            this.tweens.add({
                targets: playAgainButton,
                scaleX: originalScale,
                scaleY: originalScale,
                duration: 115,
                ease: "Linear",
            });
        });

        playAgainButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            window.location.reload(); // Reload the page
        });

        worldMapButton.on("pointerover", () => {
            this.tweens.add({
                targets: worldMapButton,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 115,
                ease: "Linear",
            });
        });

        worldMapButton.on("pointerout", () => {
            this.tweens.add({
                targets: worldMapButton,
                scaleX: originalScale,
                scaleY: originalScale,
                duration: 115,
                ease: "Linear",
            });
        });

        worldMapButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.scene.start("game-map", {
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
    }

    update() {
        // Gal animations
        if (this.player) {
            if (this.galMove == "up") {
                this.player.setVelocityY(-530);
            } else if (this.galMove == "right") {
                this.player.anims.play("gal_walk_right", true);
                this.galLastDirection = "right"; // Update last direction
            } else if (this.galMove == "left") {
                this.player.anims.play("gal_walk_left", true);
                this.galLastDirection = "left"; // Update last direction
            } else {
                this.player.setVelocityX(0);
                // Check last direction and play corresponding idle animation
                if (this.galLastDirection === "right") {
                    this.player.anims.play("gal_idle_right", true);
                } else {
                    this.player.anims.play("gal_idle_left", true);
                }
            }
        }

        // Guy animations
        if (this.dude) {
            if (this.dudeMove == "up") {
                this.dude.anims.play("dude_idle_right", true);
                this.dude.setVelocityY(-530);
            } else if (this.dudeMove == "right") {
                this.dude.anims.play("dude_run_right", true);
                this.dudeLastDirection = "right"; // Update last direction
            } else if (this.dudeMove == "left") {
                this.dude.anims.play("dude_run_left", true);
                this.dudeLastDirection = "left"; // Update last direction
            } else if (this.dudeMove == "rightWalk") {
                this.dude.anims.play("dude_walk_right", true);
                this.dudeLastDirection = "right"; // Update last direction
            } else {
                this.dude.setVelocityX(0);
                // Check last direction and play corresponding idle animation
                if (this.dudeLastDirection === "right") {
                    this.dude.anims.play("dude_idle_right", true);
                } else {
                    this.dude.anims.play("dude_idle_left", true);
                }
            }
        }
    }
}
