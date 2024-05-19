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

export default class LevelTwo extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private key?: Phaser.GameObjects.Sprite;
    private clouds?: Phaser.Physics.Arcade.StaticGroup;
    private invisiblePot?: Phaser.Physics.Arcade.Image;
    private door?: Phaser.Physics.Arcade.Image;
    private ground?: Phaser.Physics.Arcade.Image;
    private wand?: Phaser.GameObjects.Sprite;
    private club?: Phaser.GameObjects.Sprite;
    private pot?: Phaser.GameObjects.Sprite;
    private seeds?: Phaser.GameObjects.Sprite;
    private wateringCan?: Phaser.GameObjects.Sprite;
    private flyingBird?: Phaser.Physics.Arcade.Sprite;
    private birdPlatform!: Phaser.Physics.Arcade.Group;
    private bird?: Phaser.Physics.Arcade.Image;
    private onBird: boolean = false;
    private smogGroup?: Phaser.Physics.Arcade.StaticGroup;
    private smog4?: Phaser.Physics.Arcade.Sprite;
    private smog5?: Phaser.Physics.Arcade.Sprite;
    private troll?: Phaser.Physics.Arcade.Sprite;
    private trollDirection: number = 1; // 1 for right, -1 for left
    private trollDead?: boolean = false;
    private usedClub?: boolean = false;
    private plant?: Phaser.Physics.Arcade.Sprite;
    private bush?: Phaser.Physics.Arcade.Sprite;

    private stack: Phaser.GameObjects.Sprite[] = [];
    private collectedItems: Phaser.GameObjects.Sprite[] = []; // To track all collected items (even after they're popped from stack)
    private usedItems: Phaser.GameObjects.Sprite[] = [];
    private keyE?: Phaser.Input.Keyboard.Key;
    private keyF?: Phaser.Input.Keyboard.Key;
    private keyEPressed: boolean = false; // Flag to check if 'E' was pressed to prevent picking up multiple items from one long key press
    private keyFPressed: boolean = false; // Flag to check if 'E' was pressed to prevent using multiple items from one long key press
    private lastDirection: string = "right";
    private climbing: boolean = false;
    private clubCollected: boolean = false;
    private isPushingMap: { [key: string]: boolean } = {}; // Flags for each item to make sure you can't pop it while it is being pushed
    private allItems: string[] = [];
    private freePopsLeft: number = 3;
    private freePopsLeftText: Phaser.GameObjects.Text;
    private flashingRed: boolean = false;
    private usingWand: boolean = false;
    private usingClub: boolean = false;

    private keyDetectionArea: Phaser.GameObjects.Rectangle;
    private wandDetectionArea: Phaser.GameObjects.Rectangle;
    private wandHighlightArea: Phaser.GameObjects.Rectangle;
    private clubDetectionArea: Phaser.GameObjects.Rectangle;
    private clubHighlightArea: Phaser.GameObjects.Rectangle;
    private seedsDetectionArea: Phaser.GameObjects.Rectangle;
    private seedsHighlightArea: Phaser.GameObjects.Rectangle;
    private potDetectionArea: Phaser.GameObjects.Rectangle;
    private potHighlightArea: Phaser.GameObjects.Rectangle;
    private canDetectionArea: Phaser.GameObjects.Rectangle;
    private canHighlightArea: Phaser.GameObjects.Rectangle;
    private keyHighlightArea: Phaser.GameObjects.Rectangle;

    private hearts?: Phaser.GameObjects.Sprite[] = [];
    private lives: number = 3;
    private isColliding: boolean = false;
    private collidingWithSmog: boolean = false;
    private poppingWrongItem: boolean = false;

    private level0State: number;
    private level1State: number;
    private level2State: number;
    private level3State: number;
    private level0Stars: number;
    private level1Stars: number;
    private level2Stars: number;
    private level3Stars: number;

    private timerText: Phaser.GameObjects.Text;
    private startTime: number;
    private pausedTime = 0;
    private elapsedTime: number;
    private isPaused: boolean = false;

    private threeStarsPopup: Phaser.GameObjects.Group;
    private twoStarsPopup: Phaser.GameObjects.Group;
    private oneStarPopup: Phaser.GameObjects.Group;
    private starsPopup: Phaser.GameObjects.Group;

    private backgroundMusic: Phaser.Sound.BaseSound;
    private musicMuted: boolean = false;
    private soundMuted: boolean;
    private climbingPlantSound: Phaser.Sound.BaseSound;
    private noMusic: Phaser.GameObjects.Image;
    private noSound: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "Level2" });
    }

    preload() {
        this.load.audio("cloud-music", "assets/level2/Cloud.mp3");
        this.load.audio("collect-sound", "assets/sounds/collectsound.mp3");
        this.load.audio("dooropen-sound", "assets/sounds/dooropensound.mp3");
        this.load.audio("injure-sound", "assets/sounds/injuresound.mp3");
        this.load.audio("wrong-sound", "assets/sounds/wrongsound.mp3");
        this.load.audio("pop-sound", "assets/sounds/popsound.mp3");
        this.load.audio("death-sound", "assets/sounds/playerdiesound.mp3");
        this.load.audio("menu-sound", "assets/sounds/menusound.mp3");
        this.load.audio("win-sound", "assets/sounds/winsound.mp3");
        this.load.audio("wand-sound", "assets/level2/wandsound.mp3");
        this.load.audio("can-sound", "assets/level2/wateringsound.mp3");
        this.load.audio("seed-sound", "assets/level2/seedsound.mp3");
        this.load.audio("club-sound", "assets/level2/clubsound.mp3");
        this.load.audio("troll-sound", "assets/level2/trollsound.wav");
        this.load.audio("pot-sound", "assets/level2/potsound.mp3");
        this.load.audio("plant-sound", "assets/level2/climbingplant.mp3");

        this.load.image(
            "level2-background",
            "assets/level2/level2-background.png"
        );
        this.load.image("stackpack", "assets/stackpack.png");
        this.load.image("wand", "assets/level2/wand.png");
        this.load.image("club", "assets/level2/club.webp");
        this.load.image("pot", "assets/level2/pot.png");
        this.load.image("seeds", "assets/level2/seeds.png");
        this.load.image("watering-can", "assets/level2/watering-can.png");
        this.load.image("smog", "assets/level2/smog.png");
        this.load.image("sign", "assets/level2/toxic-gas.png");
        this.load.image("garden-sign", "assets/level2/garden-sign.png");
        this.load.image("bush", "assets/level2/bushes_png.png");

        this.load.image("EF-keys-black", "assets/EF-keys-black.png");

        this.load.spritesheet("key", "assets/key.png", {
            frameWidth: 768 / 24,
            frameHeight: 32,
        });

        this.load.spritesheet("gal_right", "assets/Pink_Monster_Walk_6.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet(
            "gal_left",
            "assets/Pink_Monster_Walk_Left6.png",
            { frameWidth: 128, frameHeight: 128 }
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
            "gal_jump_right",
            "assets/Pink_Monster_Jump_8.png",
            { frameWidth: 128, frameHeight: 128 }
        );
        this.load.spritesheet("gal_climb", "assets/Pink_Monster_Climb_4.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet(
            "gal_hurt_right",
            "assets/Pink_Monster_Hurt_4.png",
            { frameWidth: 128, frameHeight: 128 }
        );
        this.load.spritesheet(
            "gal_hurt_left",
            "assets/Pink_Monster_Hurt_Left4.png",
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet("bird_right", "assets/level2/bird.png", {
            frameWidth: 1280 / 10,
            frameHeight: 756 / 9,
        });

        this.load.spritesheet("troll", "assets/level2/troll.png", {
            frameWidth: 6618 / 6,
            frameHeight: 4095 / 5,
        });

        this.load.spritesheet("plant", "assets/level2/plant.png", {
            frameWidth: 7488 / 18,
            frameHeight: 416,
        });

        this.load.image("cloud-platform", "assets/level2/cloud-platform.png");
        this.load.image("pinkdoor", "assets/level2/pink-door.png");
        this.load.image("pinkopendoor", "assets/level2/pink-door-open.png");
        this.load.image("heart", "assets/heart_16.png");

        this.load.image("pop-button", "assets/freePop2.png");

        this.load.image("pause-button", "assets/pause2.png");
        this.load.image("pause-popup", "assets/paused-popup.png");
        this.load.image("red-line", "assets/red-line.png");

        this.load.image("3stars", "assets/FullStars.png");
        this.load.image("2stars", "assets/2Stars.png");
        this.load.image("1star", "assets/1Star.png");
    }

    create(data: GameMapData) {
        this.level0State = data.level0State;
        this.level1State = data.level1State;
        this.level2State = data.level2State;
        this.level3State = data.level3State;
        this.level0Stars = data.level0Stars;
        this.level1Stars = data.level1Stars;
        this.level2Stars = data.level2Stars;
        this.level3Stars = data.level3Stars;

        this.resetScene();
        // Resume all animations and tweens
        this.anims.resumeAll();
        this.tweens.resumeAll();
        // Make it so player can enter keyboard input
        if (this.input.keyboard) {
            this.input.keyboard.enabled = true;
        }

        // Temporary fix for time not fully resetting bug
        setTimeout(() => (this.startTime = this.time.now));

        this.lastDirection = "right";

        this.allItems = ["wand", "pot", "can", "seeds", "club", "key"];

        this.soundMuted = this.game.sound.mute;

        const backgroundImage = this.add
            .image(0, 0, "level2-background")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width,
            this.cameras.main.height / backgroundImage.height
        );

        this.backgroundMusic = this.sound.add("cloud-music");
        this.backgroundMusic.play({
            loop: true,
            volume: 0.6,
        });
        if (this.musicMuted) {
            this.backgroundMusic.pause();
        }
        this.climbingPlantSound = this.sound.add("plant-sound");

        this.freePopsLeftText = this.add
            .text(285, 71, `${this.freePopsLeft}`, {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#004f28",
            })
            .setDepth(4);

        const stackpack = this.add
            .image(0, 0, "stackpack")
            .setPosition(1170, 165);
        stackpack.setScale(0.26, 0.26);

        const EFkeys = this.add.image(10, 115, "EF-keys-black").setOrigin(0, 0);
        EFkeys.setScale(0.35);

        this.anims.create({
            key: "turn",
            frames: this.anims.generateFrameNumbers("key", {
                start: 0,
                end: 25,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.player = this.physics.add
            .sprite(50, 200, "gal_right")
            .setScale(0.77, 0.77)
            .setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);

        this.flyingBird = this.physics.add
            .sprite(230, 330, "bird_right")
            .setScale(1)
            .setDepth(1)
            .refreshBody();
        this.flyingBird.setCollideWorldBounds(true);
        this.flyingBird
            .setSize(this.flyingBird.width, this.flyingBird.height - 30)
            .setOffset(0, 0);

        this.birdPlatform = this.physics.add.group({
            immovable: true, // Make immovable by collisions
            allowGravity: false, // Disable gravity
        });
        this.bird = this.birdPlatform.create(
            230,
            335,
            "bird_right"
        ) as Phaser.Physics.Arcade.Image;
        this.bird.setScale(1).refreshBody();
        this.bird
            .setSize(this.bird.width - 44, this.bird.height - 20)
            .setOffset(22, 37);
        this.bird.setVisible(false);

        this.physics.add.collider(this.player, this.birdPlatform);

        // Making bird move back and forth
        this.tweens.add({
            targets: this.birdPlatform.getChildren(),
            x: "+=340",
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: "Linear",
        });
        this.tweens.add({
            targets: this.flyingBird,
            x: "+=340",
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: "Linear",
            onYoyo: () => {
                if (this.flyingBird) {
                    this.flyingBird.flipX = !this.flyingBird.flipX;
                }
            },
            onRepeat: () => {
                if (this.flyingBird) {
                    this.flyingBird.flipX = !this.flyingBird.flipX;
                }
            },
        });

        this.troll = this.physics.add.sprite(250, 800, "troll").setScale(0.3);
        this.troll.body?.setSize(
            this.troll.width - 200,
            this.troll.height - 300
        );
        this.troll.setCollideWorldBounds(true);
        if (this.ground) {
            this.physics.add.overlap(this.troll, this.ground);
        }

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("gal_right", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "gal_right", frame: 1 }],
        });
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("gal_left", {
                start: 0,
                end: 5,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "idle_right",
            frames: this.anims.generateFrameNumbers("gal_idle_right", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "idle_left",
            frames: this.anims.generateFrameNumbers("gal_idle_left", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "jump_right",
            frames: this.anims.generateFrameNumbers("gal_jump_right", {
                start: 0,
                end: 7,
            }),
        });
        this.anims.create({
            key: "climb",
            frames: this.anims.generateFrameNumbers("gal_climb", {
                start: 0,
                end: 3,
            }),
            frameRate: 15,
        });
        this.anims.create({
            key: "hurt_right",
            frames: this.anims.generateFrameNumbers("gal_hurt_right", {
                start: 0,
                end: 1,
            }),
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: "hurt_left",
            frames: this.anims.generateFrameNumbers("gal_hurt_left", {
                start: 4,
                end: 2,
            }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: "fly_right",
            frames: this.anims.generateFrameNumbers("bird_right", {
                start: 70,
                end: 73,
            }),
            frameRate: 9,
            repeat: -1,
        });
        this.flyingBird.play("fly_right");

        this.anims.create({
            key: "troll_right",
            frames: this.anims.generateFrameNumbers("troll", {
                start: 21,
                end: 27,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.troll.play("troll_right");

        this.anims.create({
            key: "troll_attack",
            frames: this.anims.generateFrameNumbers("troll", {
                start: 0,
                end: 6,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "troll_die",
            frames: this.anims.generateFrameNumbers("troll", {
                start: 7,
                end: 13,
            }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: "growing",
            frames: this.anims.generateFrameNumbers("plant", {
                start: 0,
                end: 17,
            }),
            frameRate: 5,
            repeat: 0,
        });

        this.cursors = this.input.keyboard?.createCursorKeys();

        // Create cloud platforms
        this.clouds = this.physics.add.staticGroup();
        this.ground = this.clouds.create(
            650,
            950,
            "cloud-platform"
        ) as Phaser.Physics.Arcade.Image;

        this.ground.setScale(5).refreshBody();
        this.ground.setAlpha(0); // Hide the ground platform

        const cloud1 = this.clouds
            .create(50, 340, "cloud-platform")
            .setScale(0.5);
        const cloud2 = this.clouds
            .create(430, 195, "cloud-platform")
            .setScale(0.75);
        const cloud3 = this.clouds
            .create(910, 220, "cloud-platform")
            .setScale(0.5);

        const birdGroundPlatform = this.physics.add.staticGroup();
        const birdGround = birdGroundPlatform
            .create(520, 380, "cloud-platform")
            .setScale(1.9, 0.5)
            .setVisible(false)
            .refreshBody();

        // Preventing pot and plant from moving
        this.invisiblePot = this.clouds
            .create(1050, 660, "pot")
            .setScale(0.065) as Phaser.Physics.Arcade.Image;
        this.invisiblePot.setSize(115, 200).setOffset(790, 800);
        this.physics.add.collider(this.player, this.invisiblePot);
        this.invisiblePot.disableBody(true, true);
        this.invisiblePot.setVisible(false);

        this.physics.add.collider(this.player, this.clouds);

        // Create objects: key, door, wand, club, pot, seeds, watering can
        this.key = this.add.sprite(1200, 670, "key").setScale(2.5, 2.5);
        this.key.setName("key");
        this.physics.add.collider(this.key, this.clouds);

        this.door = this.physics.add.image(920, 50, "pinkdoor").setScale(0.4);
        this.physics.add.collider(this.door, this.clouds);

        this.wand = this.add.sprite(425, 115, "wand").setScale(0.06);
        this.physics.add.collider(this.wand, this.clouds);
        this.wand.setName("wand");

        this.club = this.add.sprite(450, 415, "club").setScale(0.4);
        this.physics.add.collider(this.club, this.clouds);
        this.club.setName("club");

        this.pot = this.add.sprite(80, 650, "pot").setScale(0.065);
        this.physics.add.collider(this.pot, this.ground);
        this.pot.setName("pot");

        this.seeds = this.add.sprite(850, 680, "seeds").setScale(0.6);
        this.seeds.setName("seeds");

        this.add.image(1050, 670, "garden-sign").setScale(0.07, 0.06);

        this.wateringCan = this.add
            .sprite(650, 655, "watering-can")
            .setScale(0.75)
            .setDepth(1);
        this.wateringCan.setName("can");

        // Make collectable items continuously pulsate
        this.createPulsateEffect(
            this,
            this.wand,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.pot,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.seeds,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.wateringCan,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.club,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );

        // Creating smog
        this.add.image(125, 435, "sign").setScale(0.2);
        this.smogGroup = this.physics.add.staticGroup();
        const smog1 = this.smogGroup.create(250, 430, "smog").setScale(0.5);
        const smog2 = this.smogGroup.create(400, 430, "smog").setScale(-0.5);
        const smog3 = this.smogGroup.create(550, 430, "smog").setScale(0.5);
        this.smog4 = this.smogGroup.create(700, 430, "smog").setScale(-0.5);
        this.smog5 = this.smogGroup.create(850, 430, "smog").setScale(0.5);

        this.physics.add.collider(this.flyingBird, birdGround);
        this.physics.add.collider(this.bird, birdGround);

        // Creating bush
        this.bush = this.physics.add
            .sprite(1200, 670, "bush")
            .setScale(2, 2.8)
            .setAlpha(0);
        this.bush.setCollideWorldBounds(true);
        this.physics.add.collider(this.bush, this.ground);

        this.bush
            .setSize(this.bush.width, this.bush.height - 15)
            .setOffset(0, 15);

        // Creating lives
        this.createHearts();

        // Creating Free Pop Button
        const popButton = this.add.image(225, 80, "pop-button").setScale(0.31);
        popButton.setInteractive();

        const originalScale = popButton.scaleX;
        const hoverScale = originalScale * 1.05;

        // Change scale on hover
        popButton.on("pointerover", () => {
            this.tweens.add({
                targets: popButton,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        // Restore original scale when pointer leaves
        popButton.on("pointerout", () => {
            this.tweens.add({
                targets: popButton,
                scaleX: originalScale,
                scaleY: originalScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        popButton.on("pointerup", () => {
            this.freePop();
            if (this.freePopsLeft <= 0) {
                popButton.setScale(originalScale);
                popButton.disableInteractive();
                popButton.setTint(0x696969);
            }
        });

        // Creating Pause Group for Buttons and Pause Popup
        const pauseGroup = this.add.group();

        // Creating Pause Popup
        const pausePopup = this.add.image(650, 350, "pause-popup");
        pausePopup.setOrigin(0.5);
        pausePopup.setDepth(10);
        pauseGroup.add(pausePopup);

        this.noMusic = this.add.image(582, 215, "red-line");
        this.noMusic
            .setScale(0.32)
            .setOrigin(0.5)
            .setDepth(10)
            .setVisible(false);

        this.noSound = this.add.image(698, 215, "red-line");
        this.noSound
            .setScale(0.32)
            .setOrigin(0.5)
            .setDepth(10)
            .setVisible(false);

        // Exit button for Pause popup
        const exitButton = this.add.rectangle(640, 530, 200, 75).setDepth(10);
        exitButton.setOrigin(0.5);
        exitButton.setInteractive();
        pauseGroup.add(exitButton);

        exitButton.on("pointerover", () => {
            exitButton.setFillStyle(0xffff00).setAlpha(0.5);
        });

        exitButton.on("pointerout", () => {
            exitButton.setFillStyle();
        });

        exitButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.isPaused = false;
            this.resetScene();
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

        // Return button for Pause popup
        const restartButton = this.add
            .rectangle(640, 425, 200, 75)
            .setDepth(10);
        restartButton.setOrigin(0.5);
        restartButton.setInteractive();
        pauseGroup.add(restartButton);

        restartButton.on("pointerover", () => {
            restartButton.setFillStyle(0xffff00).setAlpha(0.5);
        });

        restartButton.on("pointerout", () => {
            restartButton.setFillStyle();
        });

        restartButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            this.resetScene();
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

        // Resume button for Pause popup
        const resumeButton = this.add.rectangle(640, 320, 200, 75).setDepth(10);
        resumeButton.setOrigin(0.5);
        resumeButton.setInteractive();
        pauseGroup.add(resumeButton);

        resumeButton.on("pointerover", () => {
            resumeButton.setFillStyle(0xffff00).setAlpha(0.5);
        });

        resumeButton.on("pointerout", () => {
            resumeButton.setFillStyle();
        });

        resumeButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            pauseGroup.setVisible(false);
            this.noMusic.setVisible(false);
            this.noSound.setVisible(false);
            this.pauseTime();
            // Resume all animations and tweens
            this.anims.resumeAll();
            this.tweens.resumeAll();
            // Make it so player can enter keyboard input
            if (this.input.keyboard) {
                this.input.keyboard.enabled = true;
            }
            // Make it so player can click Free Pop button
            if (this.freePopsLeft > 0) {
                popButton.setInteractive();
            }
        });

        // No music button for Pause popup
        const muteMusic = this.add.rectangle(585, 217, 90, 90).setDepth(10);
        muteMusic.setOrigin(0.5);
        muteMusic.setInteractive();
        pauseGroup.add(muteMusic);

        muteMusic.on("pointerover", () => {
            muteMusic.setFillStyle(0xffff00).setAlpha(0.5);
        });

        muteMusic.on("pointerout", () => {
            muteMusic.setFillStyle();
        });

        // Has to get fixed once we have sound
        muteMusic.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.musicMuted = !this.musicMuted;
            if (this.musicMuted) {
                this.backgroundMusic.pause();
                this.noMusic.setVisible(true);
            } else {
                this.backgroundMusic.resume();
                this.noMusic.setVisible(false);
            }
        });

        // No sound button for Pause popup
        const muteSound = this.add.rectangle(700, 217, 90, 90).setDepth(10);
        muteSound.setOrigin(0.5);
        muteSound.setInteractive();
        pauseGroup.add(muteSound);

        muteSound.on("pointerover", () => {
            muteSound.setFillStyle(0xffff00).setAlpha(0.5);
        });

        muteSound.on("pointerout", () => {
            muteSound.setFillStyle();
        });

        // Has to get fixed once we have sound
        muteSound.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.soundMuted = !this.soundMuted;
            if (this.soundMuted) {
                this.game.sound.mute = true;
                this.noSound.setVisible(true);
            } else {
                this.game.sound.mute = false;
                this.noSound.setVisible(false);
            }
        });

        pauseGroup.setVisible(false);

        // Creating Pause Button
        const pauseButton = this.add
            .image(30, 30, "pause-button")
            .setScale(0.25);
        pauseButton.setInteractive();

        const pauseOriginalScale = pauseButton.scaleX;
        const pauseHoverScale = pauseOriginalScale * 1.05;

        // Change scale on hover
        pauseButton.on("pointerover", () => {
            this.tweens.add({
                targets: pauseButton,
                scaleX: pauseHoverScale,
                scaleY: pauseHoverScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        // Restore original scale when pointer leaves
        pauseButton.on("pointerout", () => {
            this.tweens.add({
                targets: pauseButton,
                scaleX: pauseOriginalScale,
                scaleY: pauseOriginalScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

        pauseButton.on("pointerup", () => {
            if (!this.isPaused) {
                this.sound.play("menu-sound");
                this.pauseTime();
                pauseGroup.setVisible(true);
                if (this.musicMuted) {
                    this.noMusic.setVisible(true);
                }
                if (this.soundMuted || this.game.sound.mute) {
                    this.noSound.setVisible(true);
                }
                // Pause all animations and tweens
                this.anims.pauseAll();
                this.tweens.pauseAll();
                // Make it so player can't enter keyboard input
                if (this.input.keyboard) {
                    this.input.keyboard.enabled = false;
                }
                // Make it so player can't click Free Pop button
                popButton.disableInteractive();
            }
        });

        // Creating timer
        this.timerText = this.add.text(60, 15, "Time: 00:00", {
            fontSize: "32px",
            color: "#000000",
        });
        this.startTime = this.time.now;
        this.pausedTime = 0;

        // Level complete popup
        const completeExitButton = this.add.circle(790, 185, 35).setDepth(10);
        completeExitButton.setInteractive();
        completeExitButton.on("pointerover", () => {
            completeExitButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeExitButton.on("pointerout", () => {
            completeExitButton.setFillStyle();
        });

        const completeReplayButton = this.add.circle(510, 505, 55).setDepth(10);
        completeReplayButton.setInteractive();
        completeReplayButton.on("pointerover", () => {
            completeReplayButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeReplayButton.on("pointerout", () => {
            completeReplayButton.setFillStyle();
        });

        const completeMenuButton = this.add.circle(655, 530, 55).setDepth(10);
        completeMenuButton.setInteractive();
        completeMenuButton.on("pointerover", () => {
            completeMenuButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeMenuButton.on("pointerout", () => {
            completeMenuButton.setFillStyle();
        });

        const completeNextButton = this.add.circle(800, 505, 55).setDepth(10);
        completeNextButton.setInteractive();
        completeNextButton.on("pointerover", () => {
            completeNextButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeNextButton.on("pointerout", () => {
            completeNextButton.setFillStyle();
        });

        this.threeStarsPopup = this.add.group();
        const threeStars = this.add.image(650, 350, "3stars");
        this.threeStarsPopup.add(threeStars);
        this.threeStarsPopup.add(completeExitButton);
        this.threeStarsPopup.add(completeReplayButton);
        this.threeStarsPopup.add(completeMenuButton);
        this.threeStarsPopup.add(completeNextButton);

        this.twoStarsPopup = this.add.group();
        const twoStars = this.add.image(650, 350, "2stars");
        this.twoStarsPopup.add(twoStars);
        this.twoStarsPopup.add(completeExitButton);
        this.twoStarsPopup.add(completeReplayButton);
        this.twoStarsPopup.add(completeMenuButton);
        this.twoStarsPopup.add(completeNextButton);

        this.oneStarPopup = this.add.group();
        const oneStar = this.add.image(650, 350, "1star");
        this.oneStarPopup.add(oneStar);
        this.oneStarPopup.add(completeExitButton);
        this.oneStarPopup.add(completeReplayButton);
        this.oneStarPopup.add(completeMenuButton);
        this.oneStarPopup.add(completeNextButton);

        completeExitButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            if (data.level3State == 0) {
                setTimeout(() => {
                    this.scene.start("game-map", {
                        level0State: this.level0State,
                        level1State: this.level1State,
                        level2State: 3,
                        level3State: 1,
                        level0Stars: this.level0Stars,
                        level1Stars: this.level1Stars,
                        level2Stars: this.level2Stars,
                        level3Stars: this.level3Stars,
                    });
                }, 500);
            } else {
                setTimeout(() => {
                    this.scene.start("game-map", {
                        level0State: this.level0State,
                        level1State: this.level1State,
                        level2State: 3,
                        level3State: this.level3State,
                        level0Stars: this.level0Stars,
                        level1Stars: this.level1Stars,
                        level2Stars: this.level2Stars,
                        level3Stars: this.level3Stars,
                    });
                }, 1000);
            }
        });

        completeReplayButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            this.resetScene();
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

        completeMenuButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            if (data.level3State == 0) {
                setTimeout(() => {
                    this.scene.start("game-map", {
                        level0State: this.level0State,
                        level1State: this.level1State,
                        level2State: 3,
                        level3State: 1,
                        level0Stars: this.level0Stars,
                        level1Stars: this.level1Stars,
                        level2Stars: this.level2Stars,
                        level3Stars: this.level3Stars,
                    });
                }, 500);
            } else {
                setTimeout(() => {
                    this.scene.start("game-map", {
                        level0State: this.level0State,
                        level1State: this.level1State,
                        level2State: 3,
                        level3State: this.level3State,
                        level0Stars: this.level0Stars,
                        level1Stars: this.level1Stars,
                        level2Stars: this.level2Stars,
                        level3Stars: this.level3Stars,
                    });
                }, 1000);
            }
        });

        completeNextButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            if (data.level3State == 0) {
                // If level 3 was locked before, set it to current level status
                this.scene.start("Level3", {
                    level0State: this.level0State,
                    level1State: this.level1State,
                    level2State: 3,
                    level3State: 2,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            } else {
                this.scene.start("Level3", {
                    level0State: this.level0State,
                    level1State: this.level1State,
                    level2State: 3,
                    level3State: this.level3State,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            }
        });

        this.threeStarsPopup.setVisible(false);
        this.twoStarsPopup.setVisible(false);
        this.oneStarPopup.setVisible(false);

        // Set the depth of the character/player sprite to a high value
        this.player.setDepth(3);
        this.bird.setDepth(2);
        this.troll.setDepth(2);

        // Set the depth of other game objects to lower values
        this.key.setDepth(0);
        this.door.setDepth(1);
        this.clouds.setDepth(0);
        this.smogGroup.setDepth(0);

        // Resize collision boxes of player and everything else that can be collided with
        this.player
            .setSize(this.player.width - 64, this.player.height)
            .setOffset(32, 0);

        cloud1.setSize(cloud1.width - 110, cloud1.height - 50).setOffset(0, 35);
        cloud2
            .setSize(cloud2.width - 140, cloud2.height - 30)
            .setOffset(70, 38);
        cloud3
            .setSize(cloud3.width - 220, cloud3.height - 70)
            .setOffset(110, 30);

        this.door
            .setSize(this.door.width, this.door.height - 60)
            .setOffset(0, 30);

        smog1.setSize(smog1.width - 200, smog1.height - 170).setOffset(100, 70);
        smog2.setSize(smog2.width - 200, smog2.height - 170).setOffset(100, 70);
        smog3.setSize(smog3.width - 200, smog3.height - 170).setOffset(100, 70);
        if (this.smog4 && this.smog5) {
            this.smog4
                .setSize(this.smog4.width - 200, this.smog4.height - 170)
                .setOffset(100, 70);
            this.smog5
                .setSize(this.smog4.width - 200, this.smog4.height - 170)
                .setOffset(100, 70);
        }

        // Define keys 'E' and 'F' for collecting and using items respectively
        this.keyE = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );
        this.keyF = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );

        // Creating detection area when using the wand
        this.wandDetectionArea = this.add.rectangle(600, 300, 320, 200);
        // Highlight area for wand
        this.wandHighlightArea = this.add
            .rectangle(780, 435, 275, 60, 0xffff00)
            .setAlpha(0.4)
            .setVisible(false);

        // Creating detection area when using club
        //this.clubDetectionArea = this.add.rectangle(750, 700, 500, 60);
        this.clubDetectionArea = this.add.rectangle(750, 500, 500, 150);
        this.physics.world.enable(this.clubDetectionArea);
        this.physics.add.collider(this.clubDetectionArea, this.ground);

        // Highlight area for club
        this.clubHighlightArea = this.add
            .rectangle(300, 700, 200, 300, 0xffff00)
            .setAlpha(0.4)
            .setVisible(false);

        // Detection area for pot
        this.potDetectionArea = this.add.rectangle(935, 700, 100, 250);

        // Highlight area for pot
        this.potHighlightArea = this.add
            .rectangle(1050, 700, 100, 250, 0xffff00)
            .setAlpha(0.4)
            .setVisible(false);

        // Detection area for seeds
        this.seedsDetectionArea = this.add.rectangle(1050, 700, 100, 250);

        // Highlight area for seeds
        this.seedsHighlightArea = this.add
            .rectangle(1050, 560, 100, 100, 0xffff00)
            .setAlpha(0.4)
            .setVisible(false);

        // Detection area for can
        this.canDetectionArea = this.add.rectangle(1050, 700, 100, 250);

        // Highlight area for can
        this.canHighlightArea = this.add
            .rectangle(1050, 560, 100, 100, 0xffff00)
            .setAlpha(0.4)
            .setVisible(false);

        // Detection area for key
        this.keyDetectionArea = this.add.rectangle(900, 125, 175, 200);

        // Highlight area for key
        this.keyHighlightArea = this.add
            .rectangle(910, 113, 170, 200, 0xffff00)
            .setAlpha(0.4)
            .setVisible(false);
    }

    private updateStackView() {
        const offsetX = 1170; // starting X position for stack items
        const offsetY = 271; // starting Y position for stack items
        const padding = 10;

        let currTotalHeight = 0;

        let stackItemScale = 1;
        if (this.stack.length == 5) {
            stackItemScale = 0.8;
        }

        this.stack.forEach((item) => {
            // Calculate and set (x, y) position of stack items in stackpack view
            item.setOrigin(0.5, 0);
            item.setScale(item.scale * stackItemScale);

            const stackItemX = offsetX;
            const stackItemY =
                offsetY - item.displayHeight - currTotalHeight - padding;
            currTotalHeight += item.displayHeight + padding;

            // Animation to drop the item into its position in the stackpack
            this.tweens.add({
                targets: item,
                x: stackItemX,
                y: stackItemY,
                duration: 800,
                ease: "Cubic.InOut",
                onComplete: () => {
                    this.isPushingMap[item.name] = false;
                },
            });
        });
    }

    private collectItem(item: Phaser.GameObjects.Sprite) {
        if (this.collectedItems.includes(item)) {
            return;
        }
        if (this.usingWand || this.usingClub) {
            return;
        }
        this.sound.play("collect-sound");

        this.isPushingMap[item.name] = true;

        // Save the x and y scales of the collected item
        const currScaleX = item.scaleX;
        const currScaleY = item.scaleY;

        // Animation to make item bigger, then smaller, and then fly up to stackpack
        this.tweens.add({
            targets: item,
            scaleX: currScaleX * 1.5, // Scale up item size for a bit
            scaleY: currScaleY * 1.5,
            duration: 180,
            ease: "Exponential.InOut",
            onComplete: () => {
                this.tweens.add({
                    targets: item,
                    scaleX: currScaleX, // Scale down item back to normal
                    scaleY: currScaleY,
                    duration: 150,
                    ease: "Exponential.InOut",
                    onComplete: () => {
                        // Move item to the stackpack view
                        this.tweens.add({
                            targets: item,
                            x: 1170,
                            y: -10, // Y position of item before it is dropped into its actual position in stackpack
                            scaleX: currScaleX * 0.5, // Scale down the item for stackpack view
                            scaleY: currScaleY * 0.5,
                            rotation: Math.PI * 2, // Rotate the item while moving it to stackpack
                            duration: 940,
                            ease: "Cubic.In",
                            onComplete: () => {
                                // Add the item to the stack
                                this.stack.push(item);
                                this.updateStackView();
                            },
                        });
                    },
                });
            },
        });

        // Add the item to the grand list of collected items
        this.collectedItems.push(item);
        this.stopPulsateEffect();

        this.updateStackView();
    }

    private useItem() {
        for (let i = 0; i < this.allItems.length; i++) {
            if (this.isPushingMap[this.allItems[i]]) {
                return; // Prevent popping if any push is in progress
            }
        }

        // Remove the top item from the stackpack
        const poppedItem = this.stack.pop();

        if (poppedItem) {
            // Add the item to the list of used items
            this.usedItems.push(poppedItem);

            // Animation to fade item out from stackpack and then fade in in its new location
            this.tweens.add({
                targets: poppedItem,
                alpha: 0, // Fade out
                duration: 200,
                onComplete: () => {
                    // Set item origin back to default (center)
                    poppedItem.setOrigin(0.5, 0.5);

                    // Move popped item to location it will be used
                    if (poppedItem.name === "wand") {
                        const wandSound = this.sound.add("wand-sound");
                        wandSound.play();
                        wandSound.setVolume(0.35);
                        // Wand waving
                        if (this.wand) {
                            this.tweens.add({
                                targets: poppedItem,
                                duration: 600, // Adjust the duration of the tween as needed
                                x: "+=50", // Move the wand to the right
                                y: "-=50", // Move the wand upward
                                ease: "Sine.easeInOut", // Use a smooth, sinusoidal ease for a natural waving motion
                                yoyo: true, // Play the tween in reverse after completing
                                onStart: () => {
                                    poppedItem.setDepth(3);
                                    poppedItem.setPosition(750, 350);
                                    this.usingWand = true;
                                },
                                onComplete: () => {
                                    if (
                                        this.smog4 &&
                                        this.smog5 &&
                                        this.smogGroup
                                    ) {
                                        this.smogGroup.remove(this.smog4);
                                        this.smogGroup.remove(this.smog5);
                                        this.smog4.setPosition(5000, 5000);
                                        this.smog5.setPosition(5000, 5000);
                                        this.smog4.setVisible(false);
                                        this.smog5.setVisible(false);
                                    }
                                    poppedItem.setVisible(false);
                                    this.usingWand = false;
                                },
                            });
                        }
                        this.wandHighlightArea.setVisible(false);
                    }
                    if (poppedItem.name === "pot") {
                        this.sound.play("pot-sound");
                        poppedItem.setPosition(1050, 665).setDepth(1);
                        this.invisiblePot?.enableBody(true);
                        this.potHighlightArea.setVisible(false);
                        this.plant = this.physics.add
                            .sprite(1045, 100, "plant")
                            .setScale(-0.5, 1.5)
                            .setVisible(false);
                        this.plant
                            .setSize(
                                this.plant.width * -1,
                                this.plant.height - 0
                            )
                            .setOffset(0, 30);
                        this.plant.setCollideWorldBounds(true);
                        this.plant.setImmovable(true);
                        this.physics.world.enable(this.plant);
                        if (this.pot && this.ground) {
                            const rect = this.add.rectangle(1050, 675, 100, 75);
                            this.physics.world.enable(rect);
                            this.physics.add.collider(rect, this.ground);
                            this.physics.add.collider(this.plant, rect);
                        }
                    }
                    if (poppedItem.name === "can") {
                        const canSound = this.sound.add("can-sound");
                        canSound.play();
                        canSound.setVolume(0.25);
                        this.tweens.add({
                            targets: poppedItem,
                            angle: 75, // Tilt the water to the side
                            duration: 500, // Duration of the tilt animation
                            yoyo: true, // Play the animation in reverse
                            repeat: 0, // No repeat
                            onStart: () => {
                                poppedItem.setPosition(935, 520);
                            },
                            onComplete: () => {
                                poppedItem.setVisible(false);
                                if (this.bush && this.player) {
                                    this.tweens.add({
                                        targets: this.bush,
                                        alpha: 1, // Fade in to fully visible
                                        duration: 3000,
                                        ease: "Power1",
                                    });
                                }
                            },
                        });
                        this.plant?.play("growing");
                        if (this.player && this.plant && this.pot) {
                            this.physics.add.collider(this.player, this.pot);
                        }
                        if (this.bush && this.player) {
                            this.physics.add.collider(this.player, this.bush);
                        }
                        this.canHighlightArea.setVisible(false);
                    }
                    if (poppedItem.name === "seeds") {
                        if (this.player) {
                            this.sound.play("seed-sound");
                            this.tweens.add({
                                targets: poppedItem,
                                x: 970 + 85,
                                y: 660 - 100,
                                duration: 1000,
                                ease: "Power1",
                                onComplete: () => {
                                    // Remove the seeds sprite after the throwing animation completes
                                    poppedItem.setVisible(false);
                                    this.tweens.add({
                                        targets: this.plant,
                                        duration: 1000,
                                        alpha: 1, // Fade in to fully visible
                                        onStart: () => {
                                            // Set the initial alpha to 0 before starting the fade-in
                                            this.plant?.setVisible(true);
                                            this.plant?.setAlpha(0);
                                        },
                                        onComplete: () => {
                                            // Set the frame of the plant sprite
                                            this.plant?.setFrame(0);
                                        },
                                    });
                                },
                            });
                        }
                        this.seedsHighlightArea.setVisible(false);
                    }
                    if (poppedItem.name === "club") {
                        this.usingClub = true;
                        this.usedClub = true;
                        this.trollDead = true;
                        poppedItem.setDepth(5);
                        if (this.club && this.player && this.troll) {
                            // Set the club's initial position to the player's location
                            this.club.setPosition(this.player.x, this.player.y);

                            if (this.troll.x > this.player.x) {
                                // If the troll is to the right of the player, rotate the club to face right
                                this.club.setRotation(
                                    Phaser.Math.DegToRad(132)
                                ); // Facing right
                            } else {
                                // If the troll is to the left of the player, rotate the club to face left
                                this.club.setRotation(
                                    Phaser.Math.DegToRad(-48)
                                ); // Facing left
                            }

                            // Make the club move towards the troll and rotate down after passing it
                            this.sound.play("club-sound");
                            this.tweens.add({
                                targets: this.club,
                                x: this.troll.x + 100,
                                y: this.troll.y,
                                duration: 300,
                                onComplete: () => {
                                    if (this.club) {
                                        this.tweens.add({
                                            targets: this.club,
                                            scaleX: this.club.scaleX * 0.9,
                                            scaleY: this.club.scaleY * 0.9,
                                            x: 20,
                                            y: 950,
                                            rotation: Phaser.Math.DegToRad(222),
                                            duration: 100,
                                            onComplete: () => {
                                                // Play the die animation for the troll
                                                if (
                                                    this.troll &&
                                                    this.player &&
                                                    this.troll.x < this.player.x
                                                ) {
                                                    this.sound.play(
                                                        "troll-sound"
                                                    );
                                                    this.troll.anims.play(
                                                        "troll_die",
                                                        true
                                                    );
                                                    this.troll.flipX = false;
                                                } else if (
                                                    this.troll &&
                                                    this.player &&
                                                    this.troll.x > this.player.x
                                                ) {
                                                    this.troll.anims.play(
                                                        "troll_die",
                                                        true
                                                    );
                                                    this.troll.flipX =
                                                        !this.troll.flipX;
                                                }

                                                // After the die animation completes, remove the troll from the scene
                                                setTimeout(() => {
                                                    this.troll?.setVisible(
                                                        false
                                                    );
                                                    this.troll?.setPosition(
                                                        -600,
                                                        -600
                                                    );
                                                    this.troll?.destroy();
                                                }, 1000);
                                                this.usingClub = false;
                                            },
                                        });
                                    }
                                },
                            });
                        }
                        this.clubHighlightArea.setVisible(false);
                    }
                    if (poppedItem.name === "key") {
                        this.sound.play("dooropen-sound");
                        this.door?.setTexture("pinkopendoor");
                        this.pauseTime();
                        // Make the player get sucked into the door
                        if (this.player && this.door) {
                            this.tweens.add({
                                targets: this.player,
                                scaleX: 0.27,
                                scaleY: 0.27,
                                rotation: Math.PI * 3,
                                x: this.door.x - 10,
                                y: this.door.y + 15,
                                duration: 800,
                                onComplete: () => {
                                    this.sound.play("win-sound");
                                    this.player?.disableBody(true, true);
                                    var completedTime = this.add
                                        .text(
                                            640,
                                            345,
                                            this.formatTime(this.elapsedTime),
                                            {
                                                fontSize: "40px",
                                                color: "#000000",
                                            }
                                        )
                                        .setDepth(11)
                                        .setVisible(false);
                                    // Level popup depends on time it takes to complete
                                    if (this.elapsedTime <= 60000) {
                                        this.starsPopup = this.threeStarsPopup;
                                        this.threeStarsPopup.add(completedTime);
                                        this.threeStarsPopup
                                            .setVisible(true)
                                            .setDepth(10);
                                        this.level2Stars = 3;
                                    }
                                    if (
                                        this.elapsedTime > 60000 &&
                                        this.elapsedTime <= 90000
                                    ) {
                                        this.starsPopup = this.twoStarsPopup;
                                        this.twoStarsPopup.add(completedTime);
                                        this.twoStarsPopup
                                            .setVisible(true)
                                            .setDepth(10);
                                        // Update stars if its better than previous time
                                        if (this.level2Stars < 2) {
                                            this.level2Stars = 2;
                                        }
                                    }
                                    if (this.elapsedTime > 90000) {
                                        this.starsPopup = this.oneStarPopup;
                                        this.oneStarPopup.add(completedTime);
                                        this.oneStarPopup
                                            .setVisible(true)
                                            .setDepth(10);
                                        // Update stars if its better than previous time
                                        if (this.level2Stars < 1) {
                                            this.level2Stars = 1;
                                        }
                                    }
                                    // Animate level complete text
                                    this.tweens.add({
                                        targets: this.starsPopup,
                                        alpha: 1,
                                        duration: 5000,
                                        ease: "Linear",
                                        delay: 1000, // Delay the animation slightly
                                    });

                                    if (this.level3State == 0) {
                                        this.level2State = 3;
                                        this.level3State = 1;
                                    } else {
                                        this.level2State = 3;
                                    }
                                },
                            });
                        }
                    }
                    this.tweens.add({
                        targets: poppedItem,
                        scaleX: poppedItem.scaleX * 2,
                        scaleY: poppedItem.scaleY * 2,
                        alpha: 1, // Fade in
                        duration: 300,
                        onComplete: () => {
                            this.updateStackView();
                        },
                    });
                },
            });
        }
    }

    // Animation for using free pop
    private freePop() {
        if (this.stack.length <= 0) {
            return;
        }
        for (let i = 0; i < this.allItems.length; i++) {
            if (this.isPushingMap[this.allItems[i]]) {
                return; // Prevent popping if any push is in progress
            }
        }
        this.sound.play("pop-sound");

        this.freePopsLeft -= 1;
        this.freePopsLeftText.setText(`${this.freePopsLeft}`);

        // Remove the top item from the stackpack
        const poppedItem = this.stack.pop();

        if (poppedItem && this.lives !== 0) {
            // Remove popped item from grand list of collected items
            const index = this.collectedItems.indexOf(poppedItem);
            if (index !== -1) {
                this.collectedItems.splice(index, 1);
            }

            // Animation to fade item out from stackpack and then fade in in its new location
            this.tweens.add({
                targets: poppedItem,
                alpha: 0, // Fade out
                duration: 800,
                onComplete: () => {
                    // Set item origin back to default (center)
                    poppedItem.setOrigin(0.5, 0.5);

                    let originalScaleX = 0;
                    let originalScaleY = 0;
                    // Move popped item to its original location
                    if (poppedItem.name === "wand") {
                        poppedItem.setPosition(425, 115);
                        originalScaleX = 0.06;
                        originalScaleY = 0.06;
                    }
                    if (poppedItem.name === "club") {
                        this.clubCollected = false;
                        this.clubOnBird();
                        originalScaleX = 0.4;
                        originalScaleY = 0.4;
                    }
                    if (poppedItem.name === "pot") {
                        poppedItem.setPosition(80, 650);
                        originalScaleX = 0.065;
                        originalScaleY = 0.065;
                    }
                    if (poppedItem.name === "seeds") {
                        poppedItem.setPosition(850, 680);
                        originalScaleX = 0.6;
                        originalScaleY = 0.6;
                    }
                    if (poppedItem.name === "can") {
                        poppedItem.setPosition(650, 655);
                        originalScaleX = 0.75;
                        originalScaleY = 0.75;
                    }
                    if (poppedItem.name === "key") {
                        poppedItem.setPosition(1200, 670);
                        originalScaleX = 2.5;
                        originalScaleY = 2.5;
                    }

                    this.tweens.add({
                        targets: poppedItem,
                        scaleX: originalScaleX,
                        scaleY: originalScaleY,
                        alpha: 1, // Fade in
                        duration: 300,
                        onComplete: () => {
                            this.updateStackView();
                            this.createPulsateEffect(
                                this,
                                poppedItem,
                                1.15,
                                1000
                            );
                        },
                    });
                },
            });
        }
    }

    private popWrongItem(usageArea: Phaser.GameObjects.Rectangle) {
        for (let i = 0; i < this.allItems.length; i++) {
            if (this.isPushingMap[this.allItems[i]]) {
                return; // Prevent popping if any push is in progress
            }
        }

        this.poppingWrongItem = true;
        this.loseLife();
        this.poppingWrongItem = false;

        // Remove the top item from the stackpack
        const poppedItem = this.stack.pop();

        if (poppedItem && this.lives !== 0) {
            // Remove popped item from grand list of collected items
            const index = this.collectedItems.indexOf(poppedItem);
            if (index !== -1) {
                this.collectedItems.splice(index, 1);
            }

            // Animation to flash red in location player tried to use item
            this.tweens.add({
                targets: usageArea,
                alpha: 0,
                duration: 300,
                yoyo: true,
                repeat: 1,
                onStart: () => {
                    usageArea.alpha = 0.55;
                    usageArea.fillColor = 0xff0000; // Make area red
                    this.flashingRed = true;
                },
                onComplete: () => {
                    usageArea.alpha = 0.4; // Reset area color and alpha
                    usageArea.fillColor = 0xffff00;
                    this.flashingRed = false;
                },
            });

            // Animation to fade item out from stackpack and then fade in in its new location
            this.tweens.add({
                targets: poppedItem,
                alpha: 0, // Fade out
                duration: 200,
                onComplete: () => {
                    // Set item origin back to default (center)
                    poppedItem.setOrigin(0.5, 0.5);

                    let originalScaleX = 0;
                    let originalScaleY = 0;
                    // Move popped item to its original location
                    if (poppedItem.name === "wand") {
                        poppedItem.setPosition(425, 115);
                        originalScaleX = 0.06;
                        originalScaleY = 0.06;
                    }
                    if (poppedItem.name === "club") {
                        this.clubCollected = false;
                        this.clubOnBird();
                        originalScaleX = 0.4;
                        originalScaleY = 0.4;
                    }
                    if (poppedItem.name === "pot") {
                        poppedItem.setPosition(80, 650);
                        originalScaleX = 0.065;
                        originalScaleY = 0.065;
                    }
                    if (poppedItem.name === "seeds") {
                        poppedItem.setPosition(850, 680);
                        originalScaleX = 0.6;
                        originalScaleY = 0.6;
                    }
                    if (poppedItem.name === "can") {
                        poppedItem.setPosition(650, 655);
                        originalScaleX = 0.75;
                        originalScaleY = 0.75;
                    }
                    if (poppedItem.name === "key") {
                        poppedItem.setPosition(1200, 670);
                        originalScaleX = 2.5;
                        originalScaleY = 2.5;
                    }

                    this.tweens.add({
                        targets: poppedItem,
                        scaleX: originalScaleX,
                        scaleY: originalScaleY,
                        alpha: 1, // Fade in
                        duration: 300,
                        onComplete: () => {
                            this.updateStackView();
                            this.createPulsateEffect(
                                this,
                                poppedItem,
                                1.15,
                                1000
                            );
                        },
                    });
                },
            });
        }
    }

    private createHearts() {
        this.lives = 3;
        this.hearts = [];

        for (let i = 0; i < 3; i++) {
            this.hearts.push(
                this.add.sprite(32 + i * 50, 80, "heart").setScale(0.5)
            );
        }
    }

    private loseLife() {
        if (!this.isColliding && this.player) {
            this.isColliding = true;
            if (this.poppingWrongItem) {
                this.sound.play("wrong-sound");
            } else {
                this.sound.play("injure-sound");
            }

            this.player.setVelocity(0, 0);
            if (this.lastDirection === "right") {
                this.player.anims.play("hurt_right");
            } else {
                this.player.anims.play("hurt_left");
            }
            this.lives--;

            // Removing hearts from free pop
            const heartToRemove = this.hearts?.pop();
            if (heartToRemove) {
                //heartToRemove.destroy();
                this.tweens.add({
                    targets: heartToRemove,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 200,
                    yoyo: true,
                    onComplete: () => {
                        heartToRemove.setTint(0x000000); // Make heart black
                        heartToRemove.setScale(0.5); // Reset the heart's scale
                    },
                });
            }

            if (this.lives === 0) {
                this.playerDie();
            }

            // Reset isColliding flag
            this.time.delayedCall(
                500,
                () => {
                    this.isColliding = false;
                    if (this.collidingWithSmog) {
                        this.player?.setPosition(50, 200); // Reset player's position
                        this.collidingWithSmog = false;
                    }
                },
                [],
                this
            );
        }
    }

    private playerDie() {
        const deathSound = this.sound.add("death-sound");
        deathSound.play();
        deathSound.setVolume(0.3);
        this.player?.setTint(0xff0000);

        this.time.delayedCall(300, () => {
            this.scene.launch("YouDiedScene2", {
                currentLevelKey: this.scene.key,
                level0State: this.level0State,
                level1State: this.level1State,
                level2State: this.level2State,
                level3State: this.level3State,
                level0Stars: this.level0Stars,
                level1Stars: this.level1Stars,
                level2Stars: this.level2Stars,
                level3Stars: this.level3Stars,
            });
            //this.scene.launch("PreloadScene");
            this.player?.clearTint();

            // Reset the stack and collected items
            this.stack = [];
            this.updateStackView();
            this.collectedItems = [];
            this.usedItems = [];
            this.lives = 3;
            this.createHearts();
            this.freePopsLeft = 3;
            this.clubCollected = false;
            this.usedClub = false;
            this.usingWand = false;
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            this.poppingWrongItem = false;
        });
    }

    private resetScene() {
        // Reset the stack and collected items
        this.stack = [];
        this.updateStackView();
        this.collectedItems = [];
        this.usedItems = [];
        this.lives = 3;
        this.createHearts();
        this.freePopsLeft = 3;
        this.startTime = this.time.now;
        this.pausedTime = 0;
        this.isPaused = false;
        this.clubCollected = false;
        this.usedClub = false;
        this.usingWand = false;
        this.trollDead = false;
        this.onBird = false;
        this.climbing = false;
        this.flashingRed = false;
        this.isColliding = false;
        this.collidingWithSmog = false;
        this.poppingWrongItem = false;
    }

    private createPulsateEffect(
        scene: Phaser.Scene,
        target: Phaser.GameObjects.GameObject,
        scaleFactor: number,
        duration: number
    ): Phaser.Tweens.Tween | null {
        // Check if the item has been collected
        if (this.collectedItems.includes(target as Phaser.GameObjects.Sprite)) {
            return null; // Don't create the tween if the item has been collected
        }
        return scene.tweens.add({
            targets: target,
            scaleX: `*=${scaleFactor}`,
            scaleY: `*=${scaleFactor}`,
            duration: duration,
            yoyo: true, // Reverse back to original scale
            repeat: -1, // Repeat indefinitely
        });
    }

    private stopPulsateEffect() {
        // Stop pulsating collected items
        this.collectedItems.forEach((item) => {
            const tween = this.tweens.getTweensOf(item);
            if (tween.length > 1) {
                tween[0].stop();
            }
        });
    }

    private formatTime(milliseconds: number) {
        var mins = Math.floor(milliseconds / 60000);
        var secs = Math.floor((milliseconds % 60000) / 1000);
        return (
            mins.toString().padStart(2, "0") +
            ":" +
            secs.toString().padStart(2, "0")
        );
    }

    private pauseTime() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pausedTime = this.time.now - this.startTime;
        } else {
            this.startTime = this.time.now - this.pausedTime;
        }
    }

    private clubOnBird() {
        if (this.club && this.bird && !this.clubCollected) {
            this.club.x = this.bird.x;
            this.club.y = this.bird.y - this.bird.displayHeight / 2;
        }
    }

    update() {
        // Updating timer
        if (!this.isPaused) {
            var currentTime = this.time.now;
            this.elapsedTime = currentTime - this.startTime;
            this.timerText.setText(
                "Time: " + this.formatTime(this.elapsedTime)
            );
        }

        // Key animation
        if (this.key) {
            this.key.anims.play("turn", true);
        }

        // Move the gal with arrow keys
        // Inside your update function or wherever you handle player movement
        if (this.player && this.cursors) {
            if (!this.isColliding) {
                if (
                    this.cursors.up.isDown &&
                    this.player.body?.touching.down &&
                    !this.climbing
                ) {
                    this.player.anims.play("jump_right", true);
                    this.player.setVelocityY(-530);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(290);
                    this.player.anims.play("right", true);
                    this.lastDirection = "right"; // Update last direction
                } else if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-290);
                    this.player.anims.play("left", true);
                    this.lastDirection = "left"; // Update last direction
                } else if (!this.climbing) {
                    this.player.setVelocityX(0);
                    // Check last direction and play corresponding idle animation
                    if (this.lastDirection === "right") {
                        this.player.anims.play("idle_right", true);
                    } else {
                        this.player.anims.play("idle_left", true);
                    }
                }
            }
        }

        // Collect item if 'E' key is pressed
        if (
            this.player &&
            this.keyE?.isDown &&
            !this.keyEPressed &&
            !this.usingWand
        ) {
            this.keyEPressed = true; // Set the flag for the E key being pressed to true

            // Check if the player is close enough to the key, wand, club, gardening stuff, and if so, collect it
            if (
                this.key &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.key.x,
                    this.key.y
                ) < 30
            ) {
                this.collectItem(this.key);
            }
            if (
                this.wand &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.wand.x,
                    this.wand.y
                ) < 100
            ) {
                this.collectItem(this.wand);
            }
            if (
                this.club &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.club.x,
                    this.club.y
                ) < 100
            ) {
                this.clubCollected = true;
                this.collectItem(this.club);
            }
            if (
                this.seeds &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.seeds.x,
                    this.seeds.y
                ) < 100
            ) {
                this.collectItem(this.seeds);
            }
            if (
                this.pot &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.pot.x,
                    this.pot.y
                ) < 100
            ) {
                this.collectItem(this.pot);
            }
            if (
                this.wateringCan &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.wateringCan.x,
                    this.wateringCan.y
                ) < 100
            ) {
                this.collectItem(this.wateringCan);
            }
        }
        // Check if 'E' key is released
        if (this.keyE?.isUp) {
            this.keyEPressed = false; // Reset the keyEPressed flag when the E key is released
        }

        // Check if 'F' key is released
        if (this.keyF?.isUp) {
            this.keyFPressed = false; // Reset the keyFPressed flag when the F key is released
        }

        // Check if player is near detection area
        if (this.player) {
            // Wand
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.wandDetectionArea.getBounds()
                ) &&
                this.wand &&
                !this.usedItems.includes(this.wand)
            ) {
                // If player overlaps with wand detection area, show the highlight box
                this.wandHighlightArea.setVisible(true);
                if (
                    this.stack.length > 0 &&
                    this.keyF?.isDown &&
                    !this.keyFPressed
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "wand") {
                        // If the top item is wand, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not wand, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.wandHighlightArea);
                    }
                }
            } else if (!this.flashingRed) {
                this.wandHighlightArea.setVisible(false);
            }

            // Club
            this.clubDetectionArea.setPosition(
                this.troll?.x,
                this.clubDetectionArea.y
            );
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.clubDetectionArea.getBounds()
                ) &&
                this.club &&
                !this.usedItems.includes(this.club)
            ) {
                // If player overlaps with club detection area, show the highlight box
                this.clubHighlightArea.setPosition(
                    this.troll?.x,
                    this.clubHighlightArea.y
                );
                this.clubHighlightArea.setVisible(true);
                if (
                    this.stack.length > 0 &&
                    this.keyF?.isDown &&
                    !this.keyFPressed
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "club") {
                        // If the top item is club, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not club, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.clubHighlightArea);
                    }
                }
            } else if (!this.flashingRed) {
                this.clubHighlightArea.setVisible(false);
            }

            // Seeds
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.seedsDetectionArea.getBounds()
                ) &&
                this.seeds &&
                this.pot &&
                !this.usedItems.includes(this.seeds) &&
                !this.potHighlightArea.visible
            ) {
                // If player overlaps with seeds detection area, show the highlight box
                this.seedsHighlightArea.setVisible(true);
                if (
                    this.stack.length > 0 &&
                    this.keyF?.isDown &&
                    !this.keyFPressed
                ) {
                    // If player presses F
                    if (
                        this.stack[this.stack.length - 1].name === "seeds" &&
                        this.usedItems.includes(this.pot)
                    ) {
                        // If the top item is seeds, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not seeds, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.seedsHighlightArea);
                    }
                }
            } else if (!this.flashingRed) {
                this.seedsHighlightArea.setVisible(false);
            }

            // Can
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.canDetectionArea.getBounds()
                ) &&
                this.wateringCan &&
                this.pot &&
                !this.usedItems.includes(this.wateringCan) &&
                !this.potHighlightArea.visible
            ) {
                // If player overlaps with wateringCan detection area, show the highlight box
                this.canHighlightArea.setVisible(true);
                if (
                    this.stack.length > 0 &&
                    this.keyF?.isDown &&
                    !this.keyFPressed
                ) {
                    // If player presses F
                    if (
                        this.stack[this.stack.length - 1].name === "can" &&
                        this.usedItems.includes(this.pot)
                    ) {
                        // If the top item is wateringCan, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not wateringCan, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.canHighlightArea);
                    }
                }
            } else if (!this.flashingRed) {
                this.canHighlightArea.setVisible(false);
            }

            // Pot
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.potDetectionArea.getBounds()
                ) &&
                this.pot &&
                !this.usedItems.includes(this.pot)
            ) {
                // If player overlaps with pot detection area, show the highlight box
                this.potHighlightArea.setVisible(true);
                if (
                    this.stack.length > 0 &&
                    this.keyF?.isDown &&
                    !this.keyFPressed
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "pot") {
                        // If the top item is pot, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not pot, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.potHighlightArea);
                    }
                }
            } else if (!this.flashingRed) {
                this.potHighlightArea.setVisible(false);
            }

            // Key
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.keyDetectionArea.getBounds()
                ) &&
                this.key &&
                !this.usedItems.includes(this.key)
            ) {
                // If player overlaps with key detection area, show highlight box
                this.keyHighlightArea.setVisible(true);
                if (
                    this.stack.length > 0 &&
                    this.keyF?.isDown &&
                    !this.keyFPressed
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "key") {
                        // If the top item is key, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not key, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.keyHighlightArea);
                    }
                }
            } else if (!this.flashingRed) {
                this.keyHighlightArea.setVisible(false);
            }
        }

        // Climbing the plant
        if (
            this.player &&
            this.plant &&
            this.cursors &&
            this.plant.visible &&
            +this.plant.frame.name > 0
        ) {
            // Max distance player can be from plant to climb it
            const xTolerance = 30; // Tolerance for X position
            const yTolerance = 270; // Tolerance for Y position
            // Calculate horizontal and vertical distances between player and ladder
            const deltaX = Math.abs(this.player.x - this.plant.x);
            const deltaY = Math.abs(this.player.y - this.plant.y);

            if (
                this.plant.x === 1045 &&
                deltaX < xTolerance &&
                deltaY < yTolerance &&
                this.cursors.up.isDown
            ) {
                if (!this.climbing) {
                    this.climbingPlantSound.play();
                }
                this.climbing = true;
                this.player.anims.play("climb", true);
                this.player.setVelocityY(-150);
            } else {
                if (this.climbing) {
                    this.climbingPlantSound.stop();
                }
                this.climbing = false;
            }
        }

        // Making troll move back and forth
        const leftBoundary = 250;
        const rightBoundary = 525;
        const chaseThreshold = 400;
        const attackThreshold = 115;
        const trollAttackY = 595;
        if (!this.usedClub && !this.isPaused) {
            if (this.troll && this.player && !this.trollDead) {
                // Calculate the distance between the troll and the player
                const distanceX = Math.abs(this.player.x - this.troll.x);
                const distanceY = Math.abs(this.player.y - this.troll.y);
                // If player is close-ish, move toward player
                if (
                    distanceX < chaseThreshold &&
                    distanceX > attackThreshold &&
                    distanceY < 40
                ) {
                    if (this.troll.x < this.player.x) {
                        this.troll.x += 4; // Move right
                        this.troll.flipX = false;
                        this.troll.anims.play("troll_right", true);
                    } else if (this.troll.x > this.player.x) {
                        this.troll.x -= 4; // Move left
                        this.troll.flipX = true;
                        this.troll.anims.play("troll_right", true);
                    }
                }
                // If player is close enough to hit, attack
                else if (distanceX <= attackThreshold && distanceY < 100) {
                    if (this.troll.x < this.player.x) {
                        this.troll.flipX = false;
                        this.troll.y = trollAttackY;
                        this.troll.anims.play("troll_attack", true); // Attack right
                    } else if (this.troll.x > this.player.x) {
                        this.troll.flipX = true;
                        this.troll.y = trollAttackY;
                        this.troll.anims.play("troll_attack", true); // Attack left
                    }
                    if (!this.collidingWithSmog) {
                        this.time.delayedCall(
                            500,
                            () => {
                                this.collidingWithSmog = true;
                                this.loseLife();
                            },
                            [],
                            this
                        );
                    }
                }
                //If player is not close, just walk back and forth
                else {
                    if (
                        this.troll.x <= rightBoundary &&
                        this.trollDirection === 1
                    ) {
                        this.troll.x += 1.5;
                        this.troll.anims.play("troll_right", true);
                    } else if (
                        this.troll.x >= leftBoundary &&
                        this.trollDirection === -1
                    ) {
                        this.troll.x -= 1.5;
                        this.troll.flipX = true;
                        this.troll.anims.play("troll_right", true);
                    }
                    // If the troll reaches the right boundary, change direction to left
                    else if (this.troll.x > rightBoundary) {
                        this.troll.flipX = true;
                        this.trollDirection = -1;
                    }
                    // If the troll reaches the left boundary, change direction to right
                    else if (this.troll.x < leftBoundary) {
                        this.troll.flipX = false;
                        this.trollDirection = 1;
                    }
                }
            }
        }

        // Club on top of bird
        this.clubOnBird();

        if (
            this.player &&
            this.bird &&
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.bird.x,
                this.bird.y
            ) < 80
        ) {
            this.onBird = true;
        } else {
            this.onBird = false;
        }

        // Making player fly on bird
        if (
            this.onBird &&
            this.player &&
            this.bird &&
            this.player.y <= this.bird.y
        ) {
            this.player.x = this.bird.x;
        }

        // Check if player touches smog
        if (this.player && this.smogGroup) {
            this.physics.add.collider(
                this.player,
                this.smogGroup,
                () => {
                    this.collidingWithSmog = true;
                    this.loseLife();
                },
                undefined,
                this
            );
        }
    }
}
