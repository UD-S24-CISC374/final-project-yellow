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
export default class LevelOne extends Phaser.Scene {
    // General Assets
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private key?: Phaser.GameObjects.Sprite;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private banana?: Phaser.Physics.Arcade.Sprite;
    private bananaBubble?: Phaser.GameObjects.Image;
    private mushroom?: Phaser.Physics.Arcade.Sprite;
    private vineItem?: Phaser.Physics.Arcade.Sprite;
    private stone?: Phaser.Physics.Arcade.Sprite;
    private ground?: Phaser.Physics.Arcade.Image;
    private monkey?: Phaser.Physics.Arcade.Sprite;
    private river?: Phaser.Physics.Arcade.Sprite;
    private groundRectangle?: Phaser.GameObjects.Rectangle;
    private vineSwing?: Phaser.GameObjects.Sprite;
    private door?: Phaser.GameObjects.Image;
    private mushroomSign?: Phaser.Physics.Arcade.Sprite;

    // Highlight/Detection Boxes
    private stoneDetectionBox?: Phaser.GameObjects.Rectangle;
    private stoneHighlightBox?: Phaser.GameObjects.Rectangle;

    private mushroomDetectionBox?: Phaser.GameObjects.Rectangle;
    private mushroomHighlightBox?: Phaser.GameObjects.Rectangle;
    private mushroomPopped?: boolean = false;

    private bananaDetectionBox?: Phaser.GameObjects.Rectangle;
    private bananaHighlightBox?: Phaser.GameObjects.Rectangle;

    private vineDetectionBox?: Phaser.GameObjects.Rectangle;
    private vineHighlightBox?: Phaser.GameObjects.Rectangle;

    private keyDetectionArea?: Phaser.GameObjects.Rectangle;
    private keyHighlightBox: Phaser.GameObjects.Rectangle;

    private riverDetectionArea?: Phaser.GameObjects.Rectangle;

    private leftRiverBoundary?: Phaser.Physics.Arcade.Sprite;
    private rightRiverBoundary?: Phaser.Physics.Arcade.Sprite;

    // Functionality
    private stack: Phaser.GameObjects.Sprite[] = [];
    private collectedItems: Phaser.GameObjects.Sprite[] = []; // To track all collected items (even after they're popped from stack)
    private usedItems: Phaser.GameObjects.Sprite[] = [];
    private keyE?: Phaser.Input.Keyboard.Key;
    private keyF?: Phaser.Input.Keyboard.Key;
    private keyEPressed: boolean = false; // Flag to check if 'E' was pressed to prevent picking up multiple items from one long key press
    private keyFPressed: boolean = false;
    private isPushingMap: { [key: string]: boolean } = {};
    private allItems: string[] = [];
    private hearts?: Phaser.GameObjects.Sprite[] = [];
    private lives: number = 3;
    private stackY: number = 300;
    private stoneStackImg: Phaser.GameObjects.Image;
    private mushroomStackImg: Phaser.GameObjects.Image;
    private bananaStackImg: Phaser.GameObjects.Image;
    private vineStackImg: Phaser.GameObjects.Image;
    private keyStackImg: Phaser.GameObjects.Image;
    private levelCompleteText?: Phaser.GameObjects.Text;

    private popButton?: Phaser.GameObjects.Image;
    private freePopsLeft: number = 2;
    private freePopsLeftText: Phaser.GameObjects.Text;

    // For Player animations
    private lastDirection: string = "right";
    private isColliding: boolean = false;
    private collidingWithWater: boolean = false;
    private flashingRed: boolean = false;
    private poppingWrongItem: boolean = false;

    // Level States and Stars
    private level0State: number;
    private level1State: number;
    private level2State: number;
    private level3State: number;
    private level0Stars: number;
    private level1Stars: number;
    private level2Stars: number;
    private level3Stars: number;

    // Timer
    private timerText: Phaser.GameObjects.Text;
    private startTime: number;
    private pausedTime = 0;
    private elapsedTime: number;
    private isPaused: boolean = false;

    private threeStarsPopup: Phaser.GameObjects.Group;
    private twoStarsPopup: Phaser.GameObjects.Group;
    private oneStarPopup: Phaser.GameObjects.Group;
    private starsPopup: Phaser.GameObjects.Group;

    // Music and sounds
    private backgroundMusic: Phaser.Sound.BaseSound;
    private musicMuted: boolean = false;
    private soundMuted: boolean;
    private injureSound: Phaser.Sound.BaseSound;
    private noMusic: Phaser.GameObjects.Image;
    private noSound: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "Level1" });
    }

    preload() {
        this.load.audio("jungle-music", "assets/level1/Jungle.wav");
        this.load.audio("collect-sound", "assets/sounds/collectsound.mp3");
        this.load.audio("dooropen-sound", "assets/sounds/dooropensound.mp3");
        this.load.audio("injure-sound", "assets/sounds/injuresound.mp3");
        this.load.audio("wrong-sound", "assets/sounds/wrongsound.mp3");
        this.load.audio("pop-sound", "assets/sounds/popsound.mp3");
        this.load.audio("death-sound", "assets/sounds/playerdiesound.mp3");
        this.load.audio("menu-sound", "assets/sounds/menusound.mp3");
        this.load.audio("bounce-sound", "assets/level1/boing.mp3");
        this.load.audio("splash-sound", "assets/level1/watersplash.mp3");
        this.load.audio("win-sound", "assets/sounds/winsound.mp3");
        this.load.audio("monkey-sound", "assets/level1/monkeysound.wav");
        this.load.audio("swing-sound", "assets/level1/swingsound.mp3");

        this.load.image(
            "level1Background",
            "assets/level1/Level1Background.jpg"
        );
        this.load.image("stackpack", "assets/stackpack.png");
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
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "gal_idle_right",
            "assets/Pink_Monster_Idle_4.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "gal_idle_left",
            "assets/Pink_Monster_Idle_Left4.png",
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
        this.load.spritesheet("gal_climb", "assets/Pink_Monster_Climb_4.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet(
            "gal_hurt_right",
            "assets/Pink_Monster_Hurt_4.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.spritesheet(
            "gal_hurt_left",
            "assets/Pink_Monster_Hurt_Left4.png",
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        );
        this.load.image("banana", "assets/level1/banana.png");
        this.load.image("bananaBubble", "assets/level1/bananaBubble.png");
        this.load.image("LgPlatform", "assets/level1/LgPlatform.png");
        this.load.image("MdPlatform", "assets/level1/MdPlatform.png");
        this.load.image("SmPlatform", "assets/level1/SmPlatform.png");
        this.load.image("monkey", "assets/level1/monkey.png");
        this.load.image("mushroom", "assets/level1/mushroom.png");
        this.load.image("vineItem", "assets/level1/vineItem.png");
        this.load.image("stone", "assets/level1/stone.png");
        this.load.image("river", "assets/level1/river.png");
        this.load.image("heart", "assets/heart_16.png");
        this.load.image("vineHook", "assets/level1/vineHook.png");
        this.load.image("vine", "assets/level1/vine.png");
        this.load.image("stackKey", "assets/level1/stackKey.png");
        this.load.image("brown-door", "assets/level1/brown-door.png");
        this.load.image("brown-openDoor", "assets/level1/brown-door-open.png");
        this.load.image("mushroomSign", "assets/level1/mushroomSign.png");

        this.load.image(
            "FreePopInstructions",
            "assets/FreePop-Instructions.png"
        );
        this.load.image("EF-keys-black", "assets/EF-keys-black.png");

        this.load.image("pop-button", "assets/freePop2.png");

        this.load.image("pause-button", "assets/pause2.png");
        this.load.image("pause-popup", "assets/paused-popup.png");
        this.load.image("red-line", "assets/red-line.png");

        this.load.image("3stars", "assets/FullStars.png");
        this.load.image("2stars", "assets/2Stars.png");
        this.load.image("1star", "assets/1Star.png");
    }

    create(data: GameMapData) {
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

        this.level0State = data.level0State;
        this.level1State = data.level1State;
        this.level2State = data.level2State;
        this.level3State = data.level3State;
        this.level0Stars = data.level0Stars;
        this.level1Stars = data.level1Stars;
        this.level2Stars = data.level2Stars;
        this.level3Stars = data.level3Stars;

        this.allItems = ["stone", "mushroom", "banana", "vineItem", "key"];

        this.soundMuted = this.game.sound.mute;

        const backgroundImage = this.add
            .image(0, 0, "level1Background")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width,
            this.cameras.main.height / backgroundImage.height
        );

        this.backgroundMusic = this.sound.add("jungle-music");
        this.backgroundMusic.play({
            loop: true,
            volume: 0.25,
        });
        if (this.musicMuted) {
            this.backgroundMusic.pause();
        }
        this.injureSound = this.sound.add("injure-sound");

        const EFkeys = this.add.image(390, 60, "EF-keys-black");
        EFkeys.setScale(0.35);

        const stackpack = this.add
            .image(0, 0, "stackpack")
            .setPosition(1170, 165);
        stackpack.setScale(0.26, 0.26);

        this.add.image(640, 70, "vineHook").setScale(0.6, 0.6);

        this.freePopsLeftText = this.add
            .text(18, 174, `Pops Left: ${this.freePopsLeft}`, {
                fontFamily: "Arial",
                fontSize: 18,
                color: "#FFFFFF",
            })
            .setDepth(4);

        this.player = this.physics.add
            .sprite(100, 600, "gal_right")
            .setScale(0.77, 0.77)
            .setOrigin(0.5, 0.5)
            .setDepth(4);
        this.player.setCollideWorldBounds(true);

        // KEY ANIM
        this.anims.create({
            key: "turn",
            frames: this.anims.generateFrameNumbers("key", {
                start: 0,
                end: 25,
            }),
            frameRate: 8,
            repeat: -1,
        });

        // PLAYER ANIMS
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

        this.cursors = this.input.keyboard?.createCursorKeys();

        // PLATFORMS
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.platforms.create(
            600,
            770,
            "LgPlatform"
        ) as Phaser.Physics.Arcade.Image;
        this.ground.setSize(this.ground.width + 1100, this.ground.height - 370);

        this.groundRectangle = this.add.rectangle(
            600,
            770,
            1400,
            200,
            0x172808
        );

        this.groundRectangle.depth = 99;

        const platform1 = this.platforms
            .create(290, 585, "SmPlatform")
            .setScale(0.7, 0.7);
        const platform2 = this.platforms
            .create(350, 340, "MdPlatform")
            .setScale(0.7, 0.7);
        const platform3 = this.platforms
            .create(810, 450, "LgPlatform")
            .setScale(1.3, 0.75);
        const platform4 = this.platforms
            .create(900, 250, "SmPlatform")
            .setScale(0.7, 0.7);
        platform1
            .setSize(platform1.width - 210, platform1.height - 550)
            .setOffset(110, 260);
        platform2
            .setSize(platform2.width - 150, platform2.height - 550)
            .setOffset(75, 260);
        platform3
            .setSize(platform2.width + 60, platform2.height - 550)
            .setOffset(-30, 260);
        platform4
            .setSize(platform2.width - 210, platform2.height - 550)
            .setOffset(105, 260);
        this.physics.add.collider(this.player, this.platforms);

        // KEY ITEM
        this.key = this.add.sprite(245, 270, "key").setScale(2.5, 2.5);
        this.physics.add.collider(this.key, this.platforms);
        this.key.setSize(this.key.width - 100, this.key.height - 100);
        this.key.setName("key");

        this.player
            .setSize(this.player.width - 64, this.player.height - 12)
            .setOffset(32, 10);

        // ALL ITEMS SPAWNING
        this.banana = this.physics.add
            .sprite(900, 380, "banana")
            .setScale(0.5, 0.5);
        this.physics.add.collider(this.banana, this.platforms);
        this.banana.setSize(this.banana.width - 100, this.banana.height - 400);
        this.banana.setName("banana");

        this.stone = this.physics.add
            .sprite(300, 620, "stone")
            .setScale(0.3, 0.3);
        this.physics.add.collider(this.stone, this.platforms);
        this.stone.setSize(this.stone.width + 200, this.stone.height + 30);
        this.stone.setName("stone");

        this.mushroom = this.physics.add
            .sprite(300, 500, "mushroom")
            .setScale(0.5, 0.5);
        this.physics.add.collider(this.mushroom, this.platforms);
        this.mushroom.setSize(
            this.mushroom.width - 100,
            this.mushroom.height - 400
        );
        this.mushroom.setName("mushroom");
        this.mushroom.setPushable(false);

        this.monkey = this.physics.add
            .sprite(300, 200, "monkey")
            .setScale(0.5, 0.5);
        this.physics.add.collider(this.monkey, this.platforms);
        this.monkey.setSize(this.monkey.width - 300, this.monkey.height - 200);
        this.monkey.setName("monkey");
        this.monkey.setPushable(false);
        this.physics.add.collider(this.monkey, this.player);

        this.vineItem = this.physics.add
            .sprite(700, 350, "vineItem")
            .setScale(0.5, 0.5);
        this.physics.add.collider(this.vineItem, this.platforms);
        this.vineItem.setSize(
            this.vineItem.width - 100,
            this.vineItem.height - 350
        );
        this.vineItem.setName("vineItem");

        this.river = this.physics.add
            .sprite(700, 630, "river")
            .setScale(0.8, 0.8);
        this.physics.add.collider(this.river, this.platforms);
        this.river
            .setSize(this.river.width - 20, this.river.height - 440)
            .setOffset(10, 200);
        this.river.setPushable(false);
        this.river.setName("river");

        this.mushroomSign = this.physics.add.sprite(1100, 550, "mushroomSign");
        this.physics.add.collider(this.mushroomSign, this.platforms);
        this.physics.add.collider(this.mushroomSign, this.player);
        this.mushroomSign.setPushable(false);
        this.mushroomSign
            .setSize(
                this.mushroomSign.width - 250,
                this.mushroomSign.height - 355
            )
            .setScale(0.5, 0.5);

        this.leftRiverBoundary = this.physics.add.sprite(580, 550, "mushroom");
        this.physics.add.collider(this.leftRiverBoundary, this.platforms);
        this.physics.add.collider(this.leftRiverBoundary, this.player);
        this.leftRiverBoundary.setPushable(false);
        this.leftRiverBoundary.setVisible(false);
        this.leftRiverBoundary.setSize(
            this.leftRiverBoundary.width - 420,
            this.leftRiverBoundary.height - 470
        );
        this.rightRiverBoundary = this.physics.add.sprite(820, 550, "mushroom");
        this.physics.add.collider(this.rightRiverBoundary, this.platforms);
        this.physics.add.collider(this.rightRiverBoundary, this.player);
        this.rightRiverBoundary.setPushable(false);
        this.rightRiverBoundary.setVisible(false);
        this.rightRiverBoundary.setSize(
            this.rightRiverBoundary.width - 410,
            this.rightRiverBoundary.height - 500
        );

        this.bananaBubble = this.add
            .image(200, 140, "bananaBubble")
            .setScale(0.66, 0.66);

        this.vineSwing = this.add.sprite(655, 140, "vine").setScale(0.35, 0.35);
        this.vineSwing.setOrigin(0.5, 0);
        this.vineSwing.setAngle(this.vineSwing.angle + 60);
        this.vineSwing.setVisible(false);

        this.door = this.add
            .image(910, 140, "brown-door")
            .setScale(0.35, 0.35)
            .setDepth(2);

        // Handling Pushing.Popping
        this.keyE = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );
        this.keyF = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );

        // PULSATING
        this.createPulsateEffect(
            this,
            this.mushroom,
            1.1, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.banana,
            1.1, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.vineItem,
            1.1, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.stone,
            1.1, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );

        // Create Lives
        this.createHearts();

        // Invisible check boxes

        this.stoneDetectionBox = this.add.rectangle(540, 600, 100, 150);
        this.physics.world.enable(this.stoneDetectionBox);
        this.physics.add.collider(this.stoneDetectionBox, this.ground);
        this.physics.add.collider(this.stoneDetectionBox, this.river);

        this.stoneHighlightBox = this.add.rectangle(
            700,
            600,
            100,
            80,
            0xffff00
        );
        this.stoneHighlightBox.setAlpha(0.3);
        this.stoneHighlightBox.setVisible(false);

        this.mushroomDetectionBox = this.add.rectangle(1070, 600, 100, 150);
        this.physics.world.enable(this.mushroomDetectionBox);
        this.physics.add.collider(this.mushroomDetectionBox, this.ground);

        this.mushroomHighlightBox = this.add.rectangle(
            1160,
            640,
            100,
            150,
            0xffff00
        );
        this.mushroomHighlightBox.setAlpha(0.3);
        this.mushroomHighlightBox.setVisible(false);

        this.bananaDetectionBox = this.add.rectangle(350, 200, 30, 150);
        this.physics.world.enable(this.bananaDetectionBox);
        this.physics.add.collider(this.bananaDetectionBox, this.platforms);

        this.bananaHighlightBox = this.add.rectangle(
            200,
            125,
            80,
            80,
            0xffff00
        );
        this.bananaHighlightBox.setAlpha(0.3);
        this.bananaHighlightBox.setVisible(false);

        this.vineDetectionBox = this.add.rectangle(490, 200, 30, 150);
        this.physics.world.enable(this.vineDetectionBox);
        this.physics.add.collider(this.vineDetectionBox, this.platforms);

        this.vineHighlightBox = this.add.rectangle(647, 130, 50, 50, 0xffff00);
        this.vineHighlightBox.setAlpha(0.5);
        this.vineHighlightBox.setVisible(false);

        this.keyDetectionArea = this.add.rectangle(890, 100, 100, 150);
        this.physics.world.enable(this.keyDetectionArea);
        this.physics.add.collider(this.keyDetectionArea, this.platforms);

        this.keyHighlightBox = this.add.rectangle(900, 140, 170, 190, 0xffff00);
        this.keyHighlightBox.setAlpha(0.25);
        this.keyHighlightBox.setVisible(false);

        this.riverDetectionArea = this.add.rectangle(700, 600, 200, 20);
        this.physics.world.enable(this.riverDetectionArea);
        this.physics.add.collider(this.riverDetectionArea, this.platforms);

        // setting depths
        this.stone.depth = 1;
        this.river.depth = 0;

        // Level complete stuff
        this.levelCompleteText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "Level Complete!",
            { fontSize: "96px", color: "#03572a", fontFamily: "Verdana" }
        );
        this.levelCompleteText.setOrigin(0.5);
        this.levelCompleteText.setVisible(false);

        // Set initial properties for animation
        this.levelCompleteText.setScale(0);
        this.levelCompleteText.setAlpha(0);

        // Free Pop stuff
        const popButton = this.add.image(65, 140, "pop-button").setScale(0.31);
        popButton.setInteractive();

        const originalScale = popButton.scaleX;
        const hoverScale = originalScale * 1.05;
        popButton.on("pointerover", () => {
            this.tweens.add({
                targets: popButton,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 115, // Duration of the tween in milliseconds
                ease: "Linear", // Easing function for the tween
            });
        });

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

        // Pause Buttons
        const pauseGroup = this.add.group();

        // Creating Pause Popup
        const pausePopup = this.add.image(650, 350, "pause-popup");
        pausePopup.setOrigin(0.5);
        pausePopup.setDepth(9);
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

        // Level complete popup - still working
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
            if (data.level2State == 0) {
                setTimeout(() => {
                    this.scene.start("game-map", {
                        level0State: this.level0State,
                        level1State: 3,
                        level2State: 1,
                        level3State: this.level3State,
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
                        level1State: 3,
                        level2State: this.level2State,
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

        completeMenuButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            if (data.level2State == 0) {
                setTimeout(() => {
                    this.scene.start("game-map", {
                        level0State: this.level0State,
                        level1State: 3,
                        level2State: 1,
                        level3State: this.level3State,
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
                        level1State: 3,
                        level2State: this.level2State,
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
            if (data.level2State == 0) {
                // If level 2 was locked before, set it to current level status
                this.scene.start("Level2", {
                    level0State: this.level0State,
                    level1State: 3,
                    level2State: 2,
                    level3State: this.level3State,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            } else {
                this.scene.start("Level2", {
                    level0State: this.level0State,
                    level1State: 3,
                    level2State: this.level2State,
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
    }

    // HELPER FUNCTIONS

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

    private vineSwingStart() {
        if (this.vineSwing && this.player) {
            this.vineSwing.setOrigin(0.5, 0);
            this.tweens.add({
                targets: this.vineSwing,
                angle: this.vineSwing.angle - 120,
            });
            this.tweens.add({
                targets: this.player,
                x: 800,
                y: 180,
                onComplete: () => {
                    this.tweens.add({
                        targets: this.player,
                        x: 890,
                        y: 100,
                        onComplete: () => {
                            this.vineSwing?.setVisible(false);
                        },
                    });
                },
            });
        }
    }

    private imageViewInStack(item: Phaser.GameObjects.Sprite) {
        const buffer = 60;
        if (item.name === "stone") {
            this.stoneStackImg = this.add
                .image(1170, this.stackY - buffer, item.name)
                .setScale(0.15, 0.15)
                .setSize(80, 80);
        } else if (item.name === "mushroom") {
            this.mushroomStackImg = this.add
                .image(1170, this.stackY - buffer, item.name)
                .setScale(0.25, 0.25)
                .setSize(80, 80);
        } else if (item.name === "banana") {
            this.bananaStackImg = this.add
                .image(1170, this.stackY - buffer, item.name)
                .setScale(0.25, 0.25)
                .setSize(80, 80);
        } else if (item.name === "vineItem") {
            this.vineStackImg = this.add
                .image(1170, this.stackY - buffer, item.name)
                .setScale(0.25, 0.25)
                .setSize(80, 80);
        } else if (item.name === "key") {
            this.keyStackImg = this.add
                .image(1170, this.stackY - buffer, "stackKey")
                .setScale(1.4, 1.4)
                .setSize(80, 80);
        }
        this.stackY -= buffer;
        this.isPushingMap[item.name] = false;
    }

    private imageViewOutStack(item: Phaser.GameObjects.Sprite) {
        if (item.name === "stone") {
            this.stoneStackImg.setVisible(false);
            this.stackY = this.stackY + 60;
        } else if (item.name === "mushroom") {
            this.mushroomStackImg.setVisible(false);
            this.stackY = this.stackY + 60;
        } else if (item.name === "banana") {
            this.bananaStackImg.setVisible(false);
            this.stackY = this.stackY + 60;
        } else if (item.name === "vineItem") {
            this.vineStackImg.setVisible(false);
            this.stackY = this.stackY + 60;
        } else if (item.name === "key") {
            this.keyStackImg.setVisible(false);
            this.stackY = this.stackY + 60;
        }
    }

    private updateStackView() {
        const offsetX = 1170; // starting X position for stack items
        const offsetY = 270; // starting Y position for stack items
        const padding = 20;

        let currTotalHeight = 0;

        this.stack.forEach((item) => {
            // Calculate and set (x, y) position of stack items in stackpack view
            item.setOrigin(0.5, 0);
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
                                //this.updateStackView();
                                item.setVisible(false);
                                this.imageViewInStack(item);
                                // put them back in original position for free pop
                                if (item.name === "stone") {
                                    item.setPosition(300, 620);
                                } else if (item.name === "mushroom") {
                                    item.setPosition(300, 500);
                                } else if (item.name === "banana") {
                                    item.setPosition(900, 380);
                                } else if (item.name === "vineItem") {
                                    item.setPosition(700, 350);
                                } else if (item.name === "key") {
                                    item.setPosition(245, 270);
                                }
                            },
                        });
                    },
                });
            },
        });

        // Add the item to the grand list of collected items
        this.collectedItems.push(item);
        this.stopPulsateEffect();

        //this.updateStackView();
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
                    if (
                        poppedItem.name === "stone" &&
                        this.player &&
                        this.stone
                    ) {
                        this.sound.play("splash-sound");
                        poppedItem.setPosition(700, 560).setScale(0.22, 0.22);
                        this.stoneHighlightBox?.setVisible(false);
                        this.stone.setVisible(true);
                        this.physics.add.collider(this.player, this.stone);
                        this.stone.setPushable(false);
                    }
                    if (poppedItem.name === "mushroom") {
                        this.sound.play("bounce-sound");
                        poppedItem.setPosition(1160, 500);
                        //poppedItem.setPosition(1160, 560);
                        poppedItem.setSize(
                            poppedItem.width - 200,
                            poppedItem.height - 400
                        );
                        this.mushroomHighlightBox?.setVisible(false);
                        this.mushroomPopped = true;
                        if (this.player) {
                            this.physics.add.collider(this.player, poppedItem);
                        }
                        this.mushroom?.setVisible(true);
                        this.mushroomSign?.setVisible(false);
                        this.mushroomSign?.disableBody();
                    }
                    if (poppedItem.name === "banana") {
                        this.sound.play("monkey-sound");
                        if (this.banana) {
                            this.banana.setVelocity(0, 0);
                        }
                        poppedItem.setVisible(false);
                        this.bananaHighlightBox?.setVisible(false);
                        this.bananaBubble?.setVisible(false);
                        this.monkey?.disableBody(true, true);
                    }
                    if (poppedItem.name === "vineItem") {
                        this.sound.play("swing-sound");
                        poppedItem.setVisible(false);
                        this.vineHighlightBox?.setVisible(false);
                        this.vineSwing?.setVisible(true);
                        this.vineSwingStart();
                    }
                    if (poppedItem.name === "key") {
                        this.sound.play("dooropen-sound");
                        this.keyHighlightBox.setVisible(false);
                        poppedItem.setVisible(false);
                        this.door?.setTexture("brown-openDoor");
                        this.pauseTime();
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
                                    if (this.input.keyboard) {
                                        this.input.keyboard.enabled = false;
                                    }
                                    this.player?.setVisible(false);
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
                                    if (this.elapsedTime <= 30000) {
                                        this.starsPopup = this.threeStarsPopup;
                                        this.threeStarsPopup.add(completedTime);
                                        this.threeStarsPopup
                                            .setVisible(true)
                                            .setDepth(10);
                                        this.level1Stars = 3;
                                    }
                                    if (
                                        this.elapsedTime > 30000 &&
                                        this.elapsedTime <= 120000
                                    ) {
                                        this.starsPopup = this.twoStarsPopup;
                                        this.twoStarsPopup.add(completedTime);
                                        this.twoStarsPopup
                                            .setVisible(true)
                                            .setDepth(10);
                                        // Update stars if its better than previous time
                                        if (this.level1Stars < 2) {
                                            this.level1Stars = 2;
                                        }
                                    }
                                    if (this.elapsedTime > 120000) {
                                        this.starsPopup = this.oneStarPopup;
                                        this.oneStarPopup.add(completedTime);
                                        this.oneStarPopup
                                            .setVisible(true)
                                            .setDepth(10);
                                        // Update stars if its better than previous time
                                        if (this.level1Stars < 1) {
                                            this.level1Stars = 1;
                                        }
                                    }
                                    this.tweens.add({
                                        targets: this.starsPopup,
                                        alpha: 1,
                                        duration: 5000,
                                        ease: "Linear",
                                        delay: 1000, // Delay the animation slightly
                                    });

                                    if (this.level2State == 0) {
                                        this.level1State = 3;
                                        this.level2State = 1;
                                    } else {
                                        this.level1State = 3;
                                    }
                                },
                            });
                        }
                    }
                    this.imageViewOutStack(poppedItem);

                    this.tweens.add({
                        targets: poppedItem,
                        scaleX: poppedItem.scaleX * 2,
                        scaleY: poppedItem.scaleY * 2,
                        alpha: 1, // Fade in
                        duration: 300,
                        onComplete: () => {
                            //this.imageViewOutStack(poppedItem);
                            //this.updateStackView();
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
                    usageArea.alpha = 0.25; // Reset area color and alpha
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
                    if (poppedItem.name === "stone") {
                        poppedItem.setPosition(300, 590);
                        originalScaleX = 0.3;
                        originalScaleY = 0.3;
                    }
                    if (poppedItem.name === "mushroom") {
                        poppedItem.setPosition(300, 470);
                        originalScaleX = 0.5;
                        originalScaleY = 0.5;
                    }
                    if (poppedItem.name === "banana") {
                        poppedItem.setPosition(900, 310);
                        originalScaleX = 0.5;
                        originalScaleY = 0.5;
                    }
                    if (poppedItem.name === "vineItem") {
                        poppedItem.setPosition(700, 310);
                        originalScaleX = 0.5;
                        originalScaleY = 0.5;
                    }
                    if (poppedItem.name === "key") {
                        poppedItem.setPosition(245, 270);
                        originalScaleX = 2.5;
                        originalScaleY = 2.5;
                    }
                    poppedItem.setVisible(true);
                    this.tweens.add({
                        targets: poppedItem,
                        scaleX: originalScaleX,
                        scaleY: originalScaleY,
                        alpha: 1, // Fade in
                        duration: 300,
                        onComplete: () => {
                            this.imageViewOutStack(poppedItem);
                            this.createPulsateEffect(
                                this,
                                poppedItem,
                                1.1,
                                1000
                            );
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
        this.freePopsLeftText.setText(`Pops Left: ${this.freePopsLeft}`);

        // Remove the top item from the stackpack and from grand list of collected items
        const poppedItem = this.stack.pop();
        this.collectedItems.pop();

        if (poppedItem && this.lives !== 0) {
            const index = this.collectedItems.indexOf(poppedItem);
            if (index !== -1) {
                this.collectedItems.splice(index, 1);
            }
            // Animation to fade item out from stackpack and then fade in in its new location
            this.tweens.add({
                targets: poppedItem,
                alpha: 0, // Fade out
                duration: 200,
                onComplete: () => {
                    // Set item origin back to default (center)
                    //poppedItem.setOrigin(0.5, 0.5);

                    let originalScaleX = 0;
                    let originalScaleY = 0;
                    // Move popped item to its original location
                    if (poppedItem.name === "stone") {
                        poppedItem.setPosition(300, 590);
                        originalScaleX = 0.3;
                        originalScaleY = 0.3;
                    }
                    if (poppedItem.name === "mushroom") {
                        poppedItem.setPosition(300, 470);
                        originalScaleX = 0.5;
                        originalScaleY = 0.5;
                    }
                    if (poppedItem.name === "banana") {
                        poppedItem.setPosition(900, 310);
                        originalScaleX = 0.5;
                        originalScaleY = 0.5;
                    }
                    if (poppedItem.name === "vineItem") {
                        poppedItem.setPosition(700, 310);
                        originalScaleX = 0.5;
                        originalScaleY = 0.5;
                    }
                    if (poppedItem.name === "key") {
                        poppedItem.setPosition(245, 270);
                        originalScaleX = 2.5;
                        originalScaleY = 2.5;
                    }
                    poppedItem.setOrigin(0.5, 0.5);

                    poppedItem.setVisible(true);
                    this.tweens.add({
                        targets: poppedItem,
                        scaleX: originalScaleX,
                        scaleY: originalScaleY,
                        alpha: 1, // Fade in
                        duration: 300,
                        onComplete: () => {
                            //this.updateStackView();
                            this.imageViewOutStack(poppedItem);
                            this.createPulsateEffect(
                                this,
                                poppedItem,
                                1.1,
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
                this.injureSound.play();
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
                    if (this.collidingWithWater) {
                        this.player?.setPosition(100, 450); // Reset player's position
                        this.collidingWithWater = false;
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
            this.scene.launch("YouDiedScene1", {
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
            this.player?.clearTint();

            // Reset the stack and collected items
            this.stack = [];
            this.collectedItems = [];
            this.usedItems = [];
            this.lives = 3;
            this.createHearts();
            this.freePopsLeft = 2;
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
        this.freePopsLeft = 2;
        this.startTime = this.time.now;
        this.pausedTime = 0;
        this.isPaused = false;
        this.stackY = 300;
        this.mushroomPopped = false;
        this.isColliding = false;
        this.collidingWithWater = false;
        this.flashingRed = false;
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

    update() {
        // KEY TURN
        if (this.key) {
            this.key.anims.play("turn", true);
        }

        // PLAYER ANIMS
        if (this.player && this.cursors) {
            if (!this.isColliding) {
                if (this.cursors.up.isDown && this.player.body?.touching.down) {
                    this.player.anims.play("jump_right", true);
                    this.player.setVelocityY(-470);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(290);
                    this.player.anims.play("right", true);
                    this.lastDirection = "right"; // Update last direction
                } else if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-290);
                    this.player.anims.play("left", true);
                    this.lastDirection = "left"; // Update last direction
                } else {
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

        // ITEM COLLECTION
        if (this.player && this.keyE?.isDown && !this.keyEPressed) {
            this.keyEPressed = true; // Set the flag for the E key being pressed to true

            // Check if the player is close enough to the key, ladder, or plank, and if so, collect it
            if (
                this.key &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.key.x,
                    this.key.y
                ) < 100
            ) {
                this.collectItem(this.key);
            }
            if (
                this.stone &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.stone.x,
                    this.stone.y
                ) < 100
            ) {
                this.collectItem(this.stone);
            }
            if (
                this.mushroom &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.mushroom.x,
                    this.mushroom.y
                ) < 100
            ) {
                this.collectItem(this.mushroom);
            }
            if (
                this.banana &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.banana.x,
                    this.banana.y
                ) < 100
            ) {
                this.collectItem(this.banana);
            }
            if (
                this.vineItem &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.vineItem.x,
                    this.vineItem.y
                ) < 100
            ) {
                this.collectItem(this.vineItem);
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

        // Detection Box Checks for popping
        if (
            this.player &&
            this.stoneDetectionBox &&
            this.mushroomDetectionBox &&
            this.bananaDetectionBox &&
            this.keyDetectionArea &&
            this.stoneHighlightBox &&
            this.mushroomHighlightBox &&
            this.bananaHighlightBox &&
            this.stone &&
            this.mushroom &&
            this.banana &&
            this.vineItem &&
            this.key
        ) {
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.stoneDetectionBox.getBounds()
                ) &&
                !this.usedItems.includes(this.stone)
            ) {
                this.stoneHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    if (this.stack[this.stack.length - 1].name === "stone") {
                        this.stoneDetectionBox.setVisible(false);
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        this.keyFPressed = true;
                        this.popWrongItem(this.stoneHighlightBox);
                    }
                }
            } else if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.mushroomDetectionBox.getBounds()
                ) &&
                !this.usedItems.includes(this.mushroom)
            ) {
                this.mushroomHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    if (this.stack[this.stack.length - 1].name === "mushroom") {
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        this.keyFPressed = true;
                        this.popWrongItem(this.mushroomHighlightBox);
                    }
                }
            } else if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.bananaDetectionBox.getBounds()
                ) &&
                !this.usedItems.includes(this.banana)
            ) {
                this.bananaHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    if (this.stack[this.stack.length - 1].name === "banana") {
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        this.keyFPressed = true;
                        this.popWrongItem(this.bananaHighlightBox);
                    }
                }
            } else if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.keyDetectionArea.getBounds()
                ) &&
                !this.usedItems.includes(this.key)
            ) {
                this.keyHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    if (this.stack[this.stack.length - 1].name === "key") {
                        this.keyFPressed = true;
                        this.useItem();
                        this.tweens.add({
                            targets: this.levelCompleteText,
                            scale: 1,
                            alpha: 1,
                            duration: 1000,
                            ease: "Bounce",
                            delay: 500, // Delay the animation slightly
                        });
                    } else {
                        this.keyFPressed = true;
                        this.popWrongItem(this.keyHighlightBox);
                    }
                }
            } else {
                this.stoneHighlightBox.setVisible(false);
                this.mushroomHighlightBox.setVisible(false);
                this.bananaHighlightBox.setVisible(false);
                this.keyHighlightBox.setVisible(false);
            }
        }

        if (
            this.player &&
            this.vineDetectionBox &&
            this.vineItem &&
            this.vineHighlightBox
        ) {
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.vineDetectionBox.getBounds()
                ) &&
                !this.usedItems.includes(this.vineItem)
            ) {
                this.vineHighlightBox.setVisible(true); // replace with vine highlight box
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    if (this.stack[this.stack.length - 1].name === "vineItem") {
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        this.keyFPressed = true;
                        this.popWrongItem(this.vineHighlightBox);
                    }
                }
            } else {
                this.vineHighlightBox.setVisible(false);
            }
        }

        // On top of Mushroom Check
        if (this.player && this.mushroom) {
            let playerBounds = this.player.getBounds();
            let mushroomBounds = this.mushroom.getBounds();
            if (
                playerBounds.bottom > mushroomBounds.top + 100 &&
                playerBounds.left > mushroomBounds.left &&
                playerBounds.right < mushroomBounds.right &&
                this.mushroomPopped
            ) {
                this.sound.play("bounce-sound");
                this.player.setVelocityY(-640);
            }
        }

        // Checking for collision with water (drown)
        if (this.player && this.riverDetectionArea) {
            this.physics.add.collider(
                this.player,
                this.riverDetectionArea,
                () => {
                    this.collidingWithWater = true;
                    this.loseLife();
                },
                undefined,
                this
            );
        }

        // Timer
        if (!this.isPaused) {
            var currentTime = this.time.now;
            this.elapsedTime = currentTime - this.startTime;
            this.timerText.setText(
                "Time: " + this.formatTime(this.elapsedTime)
            );
        }
    }
}
