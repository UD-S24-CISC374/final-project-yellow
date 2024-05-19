import Phaser from "phaser";

interface GameMapData {
    level0State: number;
    level1State: number;
    level2State: number;
    level3State: number;
}

export default class StartCutScene extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private dude?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private door?: Phaser.GameObjects.Image;
    private openDoor?: Phaser.GameObjects.Image;
    private ground?: Phaser.Physics.Arcade.Image;
    private stackpack?: Phaser.GameObjects.Image;
    private heart1?: Phaser.GameObjects.Image;
    private heart2?: Phaser.GameObjects.Image;

    private flower?: Phaser.GameObjects.Image;
    private portal?: Phaser.GameObjects.Image;

    private questionMark1?: Phaser.GameObjects.Text;
    private questionMark2?: Phaser.GameObjects.Text;

    private exclamationPoint1?: Phaser.GameObjects.Text;
    private exclamationPoint2?: Phaser.GameObjects.Text;

    private galMove: string = "right";
    private dudeMove: string = "left";
    private galLastDirection: string = "right";
    private dudeLastDirection: string = "right";

    private delay: number;

    private level0State: number;
    private level1State: number;
    private level2State: number;
    private level3State: number;

    private backgroundMusic: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "StartCutScene" });
    }

    preload() {
        this.load.audio("intro-music", "assets/sounds/intro.mp3");
        this.load.image(
            "end-cutscene-background",
            "assets/end-cutscene/end-background1.jpeg"
        );
        this.load.image("just-stackpack", "assets/backpack.png");

        this.load.image("cutscene-heart", "assets/end-cutscene/heart.png");

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
        /*this.load.spritesheet(
            "gal_jump_right",
            "assets/Pink_Monster_Jump_8.png",
            { frameWidth: 128, frameHeight: 128 }
        );*/

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
        this.load.spritesheet(
            "gal_jump_right",
            "assets/Pink_Monster_Jump_8.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );

        this.load.image("level0-platform", "assets/level0/platform.png");
        this.load.image("skipButton", "assets/start-cutscene/SkipButton.png");
        this.load.image("picnic", "assets/start-cutscene/picnic.png");
        this.load.image("grass", "assets/start-cutscene/grassStrip.png");
        this.load.image("flower", "assets/start-cutscene/flower.png");
        this.load.image("portal", "assets/start-cutscene/portal.png");
        this.load.image(
            "cutsceneDoor",
            "assets/start-cutscene/purple-door.png"
        );
        this.load.image(
            "cutsceneDoorOpen",
            "assets/start-cutscene/purple-open-door.png"
        );
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

        this.galMove = "";
        this.dudeMove = "";
        this.galLastDirection = "right";
        this.dudeLastDirection = "right";

        this.delay = 0;

        const backgroundImage = this.add
            .image(0, 0, "end-cutscene-background")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width + 0.1,
            this.cameras.main.height / backgroundImage.height
        );

        this.backgroundMusic = this.sound.add("intro-music");
        this.backgroundMusic.play({
            volume: 0.75,
        });

        const skipButton = this.add.image(150, 100, "skipButton");
        skipButton.setScale(0.8);
        skipButton.setSize(skipButton.width - 100, skipButton.height - 200);

        skipButton.setInteractive();

        const originalScale = skipButton.scaleX;
        const hoverScale = originalScale * 1.05;

        skipButton.on("pointerover", () => {
            this.tweens.add({
                targets: skipButton,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 115,
                ease: "Linear",
            });
        });

        skipButton.on("pointerout", () => {
            this.tweens.add({
                targets: skipButton,
                scaleX: originalScale,
                scaleY: originalScale,
                duration: 115,
                ease: "Linear",
            });
        });

        skipButton.on("pointerup", () => {
            this.backgroundMusic.stop();
            this.scene.start("game-map");
        });

        this.heart1 = this.add.image(300, 300, "cutscene-heart");
        this.heart1.setDepth(20);
        this.heart1.setScale(0.15, 0.15);
        this.heart1.setVisible(false);
        this.heart2 = this.add.image(600, 300, "cutscene-heart");
        this.heart2.setDepth(20);
        this.heart2.setScale(0.15, 0.15);
        this.heart2.setVisible(false);

        // Creating Gal
        this.player = this.physics.add
            .sprite(120, 430, "gal_walk_right")
            .setScale(1.2, 1.2)
            .setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "jump_right",
            frames: this.anims.generateFrameNumbers("gal_jump_right", {
                start: 0,
                end: 7,
            }),
        });

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
            .sprite(220, 430, "dude_run_right")
            .setScale(1.2, 1.2)
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

        const grass = this.add.image(650, 630, "grass");
        grass.setScale(this.cameras.main.width + 10 / grass.width, 1.4);

        this.add.image(600, 600, "picnic");
        this.flower = this.add.image(850, 600, "flower");
        this.flower.setScale(0.25, 0.25);

        this.portal = this.add.image(1000, 260, "portal");
        this.portal.setScale(0);
        this.portal.setVisible(false);

        this.door = this.add.image(1000, 200, "cutsceneDoor");
        this.door.setScale(0.1, 0.1);
        this.door.setVisible(false);

        this.openDoor = this.add.image(1000, 450, "cutsceneDoorOpen");
        this.openDoor.setScale(0.42, 0.42);
        this.openDoor.setVisible(false);

        this.stackpack = this.add
            .image(850, 400, "just-stackpack")
            //.setPosition(100, 551)
            .setOrigin(0.5, 1);
        this.stackpack.setScale(0.05, 0.05);
        this.stackpack.setVisible(false);

        this.questionMark1 = this.add.text(780, 350, "?", {
            fontFamily: "Arial",
            fontSize: 60,
            color: "#000000",
        });

        this.exclamationPoint1 = this.add.text(500, 300, "!", {
            fontFamily: "Arial",
            fontSize: 60,
            color: "#000000",
        });

        this.questionMark2 = this.add.text(480, 350, "?", {
            fontFamily: "Arial",
            fontSize: 60,
            color: "#000000",
        });

        this.exclamationPoint2 = this.add.text(800, 300, "!", {
            fontFamily: "Arial",
            fontSize: 60,
            color: "#000000",
        });
        this.questionMark1.setVisible(false);
        this.questionMark2.setVisible(false);
        this.exclamationPoint1.setVisible(false);
        this.exclamationPoint2.setVisible(false);

        // Resize collision boxes of player and everything else that can be collided with
        this.player
            .setSize(this.player.width - 64, this.player.height)
            .setOffset(32, 0)
            .setDepth(10);

        this.dude
            .setSize(this.dude.width - 64, this.dude.height)
            .setOffset(32, 0)
            .setDepth(10);

        this.animateStart();
    }

    private animateStart() {
        this.delay = 600; // Wait 600 millisseconds before starting

        // GAL AND DUDE WALK TO PICNIC
        setTimeout(() => {
            // Tween for the player
            this.tweens.add({
                targets: this.player,
                x: 500,
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
                x: 800,
                duration: 1500,
                onStart: () => {
                    this.dudeMove = "right";
                },
                onComplete: () => {
                    this.dudeMove = "";
                },
            });
        }, this.delay);

        this.delay += 2500;

        // DUDE PICKS FLOWER, TURNS LEFT
        setTimeout(() => {
            this.flower?.setX(860).setY(500);
            this.flower?.setDepth(11);
        }, this.delay);
        this.delay += 1000;

        setTimeout(() => {
            this.dudeLastDirection = "left";
            this.flower?.setX(740).setY(500);
        }, this.delay);
        this.delay += 1000;

        // HEARTS APPEAR
        setTimeout(() => {
            this.heart1?.setVisible(true);
            this.heart2?.setVisible(true);
            this.heart1?.setX(500).setY(350);
            this.tweens.add({
                targets: this.heart1,
                scaleX: `*=${1.2}`,
                scaleY: `*=${1.2}`,
                duration: 500,
                yoyo: true, // Reverse back to original scale
                repeat: -1,
            });
            this.heart2?.setX(800).setY(350);
            this.tweens.add({
                targets: this.heart2,
                scaleX: `*=${1.2}`,
                scaleY: `*=${1.2}`,
                duration: 500,
                yoyo: true, // Reverse back to original scale
                repeat: -1,
            });
        }, this.delay);
        this.delay += 1000;

        setTimeout(() => {
            this.heart1?.setVisible(false);
            this.heart2?.setVisible(false);
            this.flower?.setVisible(false);
        }, this.delay);
        this.delay += 500;

        // PORTAL APPEARS AND THEY HAVE QUESTION MAKRS
        setTimeout(() => {
            this.portal?.setVisible(true);
            this.tweens.add({
                targets: this.portal,
                scaleX: 1,
                scaleY: 1,
            });
            this.tweens.add({
                targets: this.portal,
                rotation: Math.PI * 3,
                duration: 1000,
                repeat: -1,
            });
        }, this.delay);
        this.delay += 1000;

        setTimeout(() => {
            this.dudeLastDirection = "right";
            this.questionMark1?.setVisible(true);
            this.questionMark2?.setVisible(true);
            this.tweens.add({
                targets: this.questionMark1,
                scaleX: 1.2,
                scaleY: 1.2,
                y: 300,
                alpha: 0,
            });
            this.tweens.add({
                targets: this.questionMark2,
                scaleX: 1.2,
                scaleY: 1.2,
                y: 300,
                alpha: 0,
            });
        }, this.delay);
        this.delay += 1000;

        setTimeout(() => {
            this.questionMark1?.setVisible(false);
            this.questionMark2?.setVisible(false);
        }, this.delay);
        this.delay += 100;

        // DUDE GETS SPIRALED UP, EXCLAMATION POINT
        setTimeout(() => {
            if (this.portal) {
                this.tweens.add({
                    targets: this.dude,
                    scaleX: 0.27,
                    scaleY: 0.27,
                    rotation: Math.PI * 3,
                    x: this.portal.x - 10,
                    y: this.portal.y - 15,
                    duration: 1200,
                    onComplete: () => {
                        this.dude?.setVisible(false);
                        this.portal?.setVisible(false);
                    },
                });
            }
        }, this.delay);
        this.delay += 600;
        setTimeout(() => {
            this.exclamationPoint1?.setVisible(true);
            this.galMove = "jump";
            this.tweens.add({
                targets: this.exclamationPoint1,
                scaleX: 1.2,
                scaleY: 1.2,
                y: 300,
            });
        }, this.delay);
        this.delay += 1800;

        setTimeout(() => {
            this.exclamationPoint1?.setVisible(false);
            this.galMove = "";
        }, this.delay);
        this.delay += 100;

        // DOOR AND STACKPACK APPEAR
        setTimeout(() => {
            if (this.platforms) {
                this.door?.setVisible(true);
                this.stackpack?.setVisible(true);
                this.tweens.add({
                    targets: this.door,
                    scaleX: 0.42,
                    scaleY: 0.42,
                    y: 450,
                });
                this.tweens.add({
                    targets: this.stackpack,
                    scaleX: 0.08,
                    scaleY: 0.08,
                    y: 550,
                });
            }
        }, this.delay);
        this.delay += 1600;

        // GAL PICKS UP STACKPACK, GOES IN DOOR, MAIN MENU POPS UP
        setTimeout(() => {
            this.tweens.add({
                targets: this.player,
                x: 830,
                duration: 1000,
                onStart: () => {
                    this.galMove = "right";
                },
                onComplete: () => {
                    this.galMove = "";
                    this.tweens.add({
                        targets: this.stackpack,
                        x: this.player?.x, // Move towards the player's x position
                        y: this.player?.y,
                        scaleX: 0.03, // Shrink horizontally
                        scaleY: 0.03, // Shrink vertically
                        duration: 500, // Duration of animation
                        onComplete: () => {
                            this.stackpack?.setVisible(false);
                            this.tweens.add({
                                targets: this.player,
                                x: 1000,
                                duration: 1000,
                                onStart: () => {
                                    this.galMove = "right";
                                },
                                onComplete: () => {
                                    this.galMove = "";
                                    this.openDoor?.setVisible(true);
                                    this.tweens.add({
                                        targets: this.player,
                                        alpha: 0,
                                        onComplete: () => {
                                            this.backgroundMusic.stop();
                                            this.scene.start("game-map");
                                        },
                                    });
                                },
                            });
                        },
                    });
                },
            });
        }, this.delay);
        this.delay += 1000;

        // DOOR OPEN, GAL GO THROUGH, MAIN MENU SCREEN
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
            } else if (this.galMove == "jump") {
                this.player.anims.play("jump_right", true);
                this.galLastDirection = "right";
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
