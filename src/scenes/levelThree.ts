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

export default class LevelThree extends Phaser.Scene {
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private key?: Phaser.GameObjects.Sprite;
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private ground?: Phaser.Physics.Arcade.Image;
    private lava?: Phaser.Physics.Arcade.StaticGroup;
    private stones!: Phaser.Physics.Arcade.Group;
    private liftPlatforms!: Phaser.Physics.Arcade.Group;

    private fireball1?: Phaser.Physics.Arcade.Image;
    private fireball2?: Phaser.Physics.Arcade.Image;

    private stone0?: Phaser.Physics.Arcade.Image;
    private stone1?: Phaser.Physics.Arcade.Image;
    private stone2?: Phaser.Physics.Arcade.Image;
    private stone3?: Phaser.Physics.Arcade.Image;
    private stone4?: Phaser.Physics.Arcade.Image;

    private water?: Phaser.GameObjects.Sprite;
    private gasMask?: Phaser.GameObjects.Sprite;
    private sword?: Phaser.GameObjects.Sprite;
    private toolbox?: Phaser.GameObjects.Sprite;
    private chainsaw?: Phaser.GameObjects.Sprite;

    private fire?: Phaser.GameObjects.Sprite;
    private toxicGas?: Phaser.GameObjects.Sprite;
    private gasBarrel?: Phaser.GameObjects.Sprite;
    private skeleton?: Phaser.GameObjects.Sprite;
    private dangerSign?: Phaser.GameObjects.Sprite;
    private liftFloor?: Phaser.Physics.Arcade.Image;
    private liftWall1?: Phaser.Physics.Arcade.Image;
    private liftWall2?: Phaser.Physics.Arcade.Image;
    private tree?: Phaser.GameObjects.Sprite;
    private door?: Phaser.Physics.Arcade.Image;

    private skeletonDirection: number = 1;

    private waterDetectionArea: Phaser.GameObjects.Rectangle;
    private waterHighlightBox: Phaser.GameObjects.Rectangle;
    private gasMaskDetectionArea: Phaser.GameObjects.Rectangle;
    private gasMaskHighlightBox: Phaser.GameObjects.Rectangle;
    private swordDetectionArea: Phaser.GameObjects.Rectangle;
    private swordHighlightBox: Phaser.GameObjects.Rectangle;
    private toolboxDetectionArea: Phaser.GameObjects.Rectangle;
    private toolboxHighlightBox: Phaser.GameObjects.Rectangle;
    private chainsawDetectionArea: Phaser.GameObjects.Rectangle;
    private chainsawHighlightBox: Phaser.GameObjects.Rectangle;
    private keyDetectionArea: Phaser.GameObjects.Rectangle;
    private keyHighlightBox: Phaser.GameObjects.Rectangle;

    private lavaArea: Phaser.GameObjects.Rectangle;
    private toxicGasArea: Phaser.GameObjects.Rectangle;
    private fireArea: Phaser.GameObjects.Rectangle;
    private liftArea: Phaser.GameObjects.Rectangle;
    private treeArea: Phaser.GameObjects.Rectangle;
    private skeletonArea: Phaser.GameObjects.Rectangle;

    private stack: Phaser.GameObjects.Sprite[] = [];
    private collectedItems: Phaser.GameObjects.Sprite[] = []; // To track all collected items (even after they're popped from stack)
    private usedItems: Phaser.GameObjects.Sprite[] = [];
    private keyE?: Phaser.Input.Keyboard.Key;
    private keyF?: Phaser.Input.Keyboard.Key;
    private keyEPressed: boolean = false; // Flag to check if 'E' was pressed to prevent picking up multiple items from one long key press
    private keyFPressed: boolean = false; // Flag to check if 'E' was pressed to prevent using multiple items from one long key press
    private lastDirection: string = "right";
    private isPushingMap: { [key: string]: boolean } = {}; // Flags for each item to make sure you can't pop it while it is being pushed
    private allItems: string[] = [];
    private flashingRed: boolean = false;
    private freePopsLeft: number = 4;
    private freePopsLeftText: Phaser.GameObjects.Text;

    private hearts?: Phaser.GameObjects.Sprite[] = [];
    private lives: number = 3;
    private isColliding: boolean = false;
    private collidingWithDeath: boolean = false;
    private usedSword: boolean = false;
    private skeletonDead: boolean = false;
    private playerLostLife: boolean = false;
    private poppingWrongItem: boolean = false;

    private timerText: Phaser.GameObjects.Text;
    private startTime: number;
    private pausedTime = 0;
    private elapsedTime: number;
    private isPaused: boolean = false;

    private threeStarsPopup: Phaser.GameObjects.Group;
    private twoStarsPopup: Phaser.GameObjects.Group;
    private oneStarPopup: Phaser.GameObjects.Group;
    private starsPopup: Phaser.GameObjects.Group;

    private level0State: number;
    private level1State: number;
    private level2State: number;
    private level3State: number;
    private level0Stars: number;
    private level1Stars: number;
    private level2Stars: number;
    private level3Stars: number;

    private backgroundMusic: Phaser.Sound.BaseSound;
    private musicMuted: boolean = false;
    private soundMuted: boolean;
    private noMusic: Phaser.GameObjects.Image;
    private noSound: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "Level3" });
    }

    preload() {
        this.load.audio("cave-music", "assets/level3/Dark-chamber.mp3");
        this.load.audio("collect-sound", "assets/sounds/collectsound.mp3");
        this.load.audio("dooropen-sound", "assets/sounds/dooropensound.mp3");
        this.load.audio("injure-sound", "assets/sounds/injuresound.mp3");
        this.load.audio("wrong-sound", "assets/sounds/wrongsound.mp3");
        this.load.audio("pop-sound", "assets/sounds/popsound.mp3");
        this.load.audio("death-sound", "assets/sounds/playerdiesound.mp3");
        this.load.audio("menu-sound", "assets/sounds/menusound.mp3");
        this.load.audio("win-sound", "assets/sounds/winsound.mp3");
        this.load.audio("gas-sound", "assets/level3/gassound.mp3");
        this.load.audio("bucket-sound", "assets/level3/bucketsound.mp3");
        this.load.audio("chainsaw-sound", "assets/level3/chainsawsound.mp3");
        this.load.audio("toolbox-sound", "assets/level3/toolboxsound.mp3");
        this.load.audio("sword-sound", "assets/level3/swordsound.mp3");
        this.load.audio("skeleton-sound", "assets/level3/skeletonsound.wav");

        this.load.image(
            "level3-background",
            "assets/level3/level3-background.jpg"
        );
        this.load.image("stackpack", "assets/stackpack.png");

        this.load.image("EF-keys-white", "assets/EF-keys-white.png");

        // Key
        this.load.spritesheet("key", "assets/key.png", {
            frameWidth: 768 / 24,
            frameHeight: 32,
        });

        // Player
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

        // Skeleton
        this.load.spritesheet(
            "walk_right",
            "assets/level3/Skeleton_With_VFX/Skeleton_01_White_Walk.png",
            {
                frameWidth: 96,
                frameHeight: 64,
            }
        );
        this.load.spritesheet(
            "walk_left",
            "assets/level3/Skeleton_With_VFX/Skeleton_01_White_Walk_left.png",
            {
                frameWidth: 96,
                frameHeight: 64,
            }
        );
        this.load.spritesheet(
            "attack_right",
            "assets/level3/Skeleton_With_VFX/Skeleton_01_White_Attack1.png",
            {
                frameWidth: 96,
                frameHeight: 64,
            }
        );
        this.load.spritesheet(
            "attack_left",
            "assets/level3/Skeleton_With_VFX/Skeleton_01_White_Attack1_left.png",
            {
                frameWidth: 96,
                frameHeight: 64,
            }
        );
        this.load.spritesheet(
            "die_right",
            "assets/level3/Skeleton_With_VFX/Skeleton_01_White_Die.png",
            {
                frameWidth: 96,
                frameHeight: 64,
            }
        );
        this.load.spritesheet(
            "die_left",
            "assets/level3/Skeleton_With_VFX/Skeleton_01_White_Die_left.png",
            {
                frameWidth: 96,
                frameHeight: 64,
            }
        );

        this.load.image("ground", "assets/level3/first-platform.png");
        this.load.image("level3-platform", "assets/level3/lava-platform.png");
        this.load.image(
            "level3-platform-small",
            "assets/level3/lava-platform-small.png"
        );
        this.load.image("lava", "assets/level3/lava.png");
        this.load.image("fireball", "assets/level3/fireball.png");
        this.load.image("stone1", "assets/level3/stone1.png");
        this.load.image("stone2", "assets/level3/stone2.png");
        this.load.image("stone3", "assets/level3/stone3.png");

        // Collectable items
        this.load.image("water", "assets/level3/water-bucket.png");
        this.load.image("gas-mask", "assets/level3/gas-mask.png");
        this.load.image("sword", "assets/level3/sword.png");
        this.load.image("toolbox", "assets/level3/toolbox.png");
        this.load.image("chainsaw", "assets/level3/chainsaw.png");

        // Usage areas
        this.load.image("fire", "assets/level3/fire.png");
        this.load.image("toxic-gas", "assets/level3/toxic-gas.png");
        this.load.image("barrel", "assets/level3/toxic-gas-barrel.png");
        this.load.image("skeleton", "assets/level3/skeleton-man.png");
        this.load.image(
            "danger-sign",
            "assets/level3/electric-danger-sign.png"
        );
        this.load.image("lift-off", "assets/level3/lift-off.png");
        this.load.image("lift-on", "assets/level3/lift-on.png");
        this.load.image("tree", "assets/level3/dead-tree.png");
        this.load.image("tree-cut", "assets/level3/dead-tree-cut.png");

        this.load.image("red-door", "assets/level3/red-door.png");
        this.load.image("red-opendoor", "assets/level3/red-door-open.png");
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

        setTimeout(() => (this.startTime = this.time.now));

        this.lastDirection = "right";
        this.usedSword = false;

        this.allItems = [
            "gas-mask",
            "water",
            "toolbox",
            "chainsaw",
            "sword",
            "key",
        ];

        this.soundMuted = this.game.sound.mute;

        this.freePopsLeftText = this.add
            .text(285, 71, `${this.freePopsLeft}`, {
                fontFamily: "Arial",
                fontSize: 20,
                color: "#D0F4DC",
            })
            .setDepth(4);

        const backgroundImage = this.add
            .image(0, 0, "level3-background")
            .setOrigin(0, 0);
        backgroundImage.setScale(
            this.cameras.main.width / backgroundImage.width,
            this.cameras.main.height / backgroundImage.height
        );

        this.backgroundMusic = this.sound.add("cave-music");
        this.backgroundMusic.play({
            loop: true,
            volume: 0.85,
        });
        if (this.musicMuted) {
            this.backgroundMusic.pause();
        }

        const stackpack = this.add
            .image(0, 0, "stackpack")
            .setPosition(1170, 165);
        stackpack.setScale(0.26, 0.26);

        const EFkeys = this.add.image(10, 115, "EF-keys-white").setOrigin(0, 0);
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
            .sprite(300, 550, "gal_right")
            .setScale(0.77, 0.77)
            .setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);

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

        // Creating lives
        this.createHearts();

        // Creating Free Pop Button
        const popButton = this.add.image(225, 80, "pop-button").setScale(0.31);
        popButton.setInteractive();

        const originalScale = popButton.scaleX;
        const hoverScale = originalScale * 1.05;

        // Pop button hover animation
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

        // Define keys 'E' and 'F' for collecting and using items respectively
        this.keyE = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );
        this.keyF = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.F
        );

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.platforms.create(
            150,
            720,
            "ground"
        ) as Phaser.Physics.Arcade.Image;
        const floor = this.platforms.create(
            300,
            770,
            "ground"
        ) as Phaser.Physics.Arcade.Image;

        this.ground.setScale(0.5).refreshBody();
        this.ground.setAlpha(1); // Hide the ground platform

        floor.setScale(3, 0.5).refreshBody().setAlpha(0);

        const platform1 = this.platforms
            .create(580, 695, "level3-platform-small")
            .setScale(0.27, 0.3)
            .refreshBody();
        const platform2 = this.platforms
            .create(820, 695, "level3-platform-small")
            .setScale(0.27, 0.3)
            .refreshBody();
        const platform3 = this.platforms
            .create(1140, 600, "level3-platform")
            .setScale(0.38, 0.3)
            .refreshBody();
        const platform4 = this.platforms
            .create(220, 485, "level3-platform")
            .setScale(0.6, 0.3)
            .refreshBody();
        const platform5 = this.platforms
            .create(670, 260, "level3-platform")
            .setScale(0.77, 0.26)
            .refreshBody();

        this.physics.add.collider(this.player, this.platforms);

        this.stones = this.physics.add.group({
            immovable: true,
            allowGravity: false,
        });
        this.stone0 = this.stones.create(
            552,
            470,
            "stone2"
        ) as Phaser.Physics.Arcade.Image;
        this.stone0.setScale(0.045, 0.045).refreshBody();
        this.stone0.setFlipX(true);
        this.stone1 = this.stones.create(
            630,
            475,
            "stone1"
        ) as Phaser.Physics.Arcade.Image;
        this.stone1.setScale(0.04, 0.04).refreshBody();
        this.stone2 = this.stones.create(
            700,
            470,
            "stone2"
        ) as Phaser.Physics.Arcade.Image;
        this.stone2.setScale(0.04, 0.04).refreshBody();
        this.stone3 = this.stones.create(
            795,
            473,
            "stone3"
        ) as Phaser.Physics.Arcade.Image;
        this.stone3.setScale(0.04, 0.04).refreshBody();
        this.stone4 = this.stones.create(
            885,
            489,
            "stone1"
        ) as Phaser.Physics.Arcade.Image;
        this.stone4.setScale(0.04, 0.035).refreshBody();

        this.physics.add.collider(this.player, this.stones);

        // Make stones fall when player jumps on them
        const stonesArray = [
            this.stone4,
            this.stone3,
            this.stone2,
            this.stone1,
            this.stone0,
        ];
        stonesArray.forEach((stone) => {
            // Create a sensor above each stone to detect player overlap
            const sensor = this.physics.add
                .sprite(stone.x, stone.y + 20, "sensor")
                .setAlpha(0);
            sensor.body.setSize(stone.width * 0.02, 10).setOffset(-15, -40); // Adjust sensor size and offset as needed
            //sensor.body.setAllowGravity(false);
            this.physics.add.collider(sensor, this.stones);
            if (this.player) {
                // Make stones fall if player touches the sensors
                this.physics.add.overlap(sensor, this.player, () => {
                    this.makeStonesFall.call(this);
                });
            }
        });

        // Create lift platform
        this.liftPlatforms = this.physics.add.group({
            immovable: true, // Make all platforms immovable by collisions
            allowGravity: false, // Disable gravity for platforms
        });

        this.liftFloor = this.liftPlatforms.create(
            95,
            430,
            "lift-off"
        ) as Phaser.Physics.Arcade.Image;
        this.liftFloor.setScale(0.23, 0.35).refreshBody();
        this.liftFloor
            .setSize(this.liftFloor.width - 270, this.liftFloor.height - 195)
            .setOffset(135, 130);
        this.liftFloor.setVisible(true);

        this.liftWall1 = this.liftPlatforms.create(
            32,
            425,
            "lift-off"
        ) as Phaser.Physics.Arcade.Image;
        this.liftWall1.setScale(0.02, 0.2).refreshBody();
        this.liftWall1.setVisible(false);

        this.liftWall2 = this.liftPlatforms.create(
            159,
            425,
            "lift-off"
        ) as Phaser.Physics.Arcade.Image;
        this.liftWall2.setScale(0.02, 0.2).refreshBody();
        this.liftWall2.setVisible(false);

        // Add collision between player and platforms
        this.physics.add.collider(this.player, this.liftPlatforms);

        this.lava = this.physics.add.staticGroup();
        this.lava.create(360, 650, "lava").setScale(0.75, 0.75);
        this.lava.create(360 + 192, 650, "lava").setScale(0.75, 0.75);
        this.lava.create(360 + 2 * 192, 650, "lava").setScale(0.75, 0.75);
        this.lava.create(360 + 3 * 192, 650, "lava").setScale(0.75, 0.75);
        this.lava.create(360 + 4 * 192, 650, "lava").setScale(0.75, 0.75);
        this.lava.create(360 + 5 * 192, 650, "lava").setScale(0.75, 0.75);

        this.fireball1 = this.add.image(
            465,
            800,
            "fireball"
        ) as Phaser.Physics.Arcade.Image;
        this.fireball1.setScale(0.07, -0.07);

        this.fireball2 = this.add.image(
            700,
            800,
            "fireball"
        ) as Phaser.Physics.Arcade.Image;
        this.fireball2.setScale(0.07, -0.07);

        // Creating collectable items: water, gas mask, sword, toolbox, chainsaw, key
        this.water = this.add.sprite(1230, 510, "water").setScale(0.2, 0.2);
        this.water.setName("water");

        this.gasMask = this.add.sprite(160, 610, "gas-mask").setScale(0.4, 0.4);
        this.gasMask.setName("gas-mask");

        this.sword = this.add.sprite(50, 600, "sword").setScale(0.2, 0.2);
        this.sword.setRotation(Phaser.Math.DegToRad(10));
        this.sword.setName("sword");

        this.toolbox = this.add.sprite(820, 610, "toolbox").setScale(0.2, 0.2);
        this.toolbox.setName("toolbox");

        this.chainsaw = this.add
            .sprite(245, 385, "chainsaw")
            .setScale(0.45, 0.45);
        this.chainsaw.setRotation(Phaser.Math.DegToRad(85));
        this.chainsaw.setName("chainsaw");

        this.key = this.add.sprite(580, 610, "key").setScale(2.5, 2.5);
        this.key.setName("key");

        // Creating usage areas: fire, toxic gas, skeleton, danger sign, lift, tree, door
        this.fire = this.add.sprite(340, 410, "fire").setScale(0.5, 0.5);
        this.fire.setName("fire");

        this.toxicGas = this.add
            .sprite(1100, 373, "toxic-gas")
            .setScale(0.28, 0.28);
        this.toxicGas.setName("toxic-gas");

        this.gasBarrel = this.add
            .sprite(1125, 500, "barrel")
            .setScale(0.25, 0.25);
        this.gasBarrel.setName("barrel");

        this.skeleton = this.add
            .sprite(830, 150, "walk_right")
            .setScale(2.6, 2.6);
        this.skeleton.setName("skeleton");

        // Create animation from the sprite sheet
        this.anims.create({
            key: "walk_right", // Animation key
            frames: this.anims.generateFrameNumbers("walk_right", {
                start: 0,
                end: 9,
            }), // Define frames for animation
            frameRate: 8, // Frame rate of the animation
            repeat: -1, // Repeat indefinitely
        });
        this.anims.create({
            key: "walk_left", // Animation key
            frames: this.anims.generateFrameNumbers("walk_left", {
                start: 9,
                end: 0,
            }), // Define frames for animation
            frameRate: 8, // Frame rate of the animation
            repeat: -1, // Repeat indefinitely
        });
        this.anims.create({
            key: "attack_right", // Animation key
            frames: this.anims.generateFrameNumbers("attack_right", {
                start: 0,
                end: 9,
            }), // Define frames for animation
            frameRate: 10, // Frame rate of the animation
            repeat: -1, // Repeat indefinitely
        });
        this.anims.create({
            key: "attack_left", // Animation key
            frames: this.anims.generateFrameNumbers("attack_left", {
                start: 9,
                end: 0,
            }), // Define frames for animation
            frameRate: 10, // Frame rate of the animation
            repeat: -1, // Repeat indefinitely
        });
        this.anims.create({
            key: "die_right", // Animation key
            frames: this.anims.generateFrameNumbers("die_right", {
                start: 0,
                end: 12,
            }), // Define frames for animation
            frameRate: 12, // Frame rate of the animation
            repeat: -1, // Repeat indefinitely
        });
        this.anims.create({
            key: "die_left", // Animation key
            frames: this.anims.generateFrameNumbers("die_left", {
                start: 12,
                end: 0,
            }), // Define frames for animation
            frameRate: 12, // Frame rate of the animation
            repeat: -1, // Repeat indefinitely
        });

        this.dangerSign = this.add
            .sprite(95, 355, "danger-sign")
            .setScale(0.38, 0.4);
        this.dangerSign.setName("danger-sign");

        this.liftFloor.setName("lift");

        this.tree = this.add.sprite(480, 130, "tree").setScale(0.5, 0.5);
        this.tree.setName("tree");

        this.door = this.physics.add
            .image(880, 100, "red-door")
            .setScale(0.1, 0.1);
        this.physics.add.collider(this.door, this.platforms);

        // Set the depth of the player and skeleton sprites to a high value
        this.player.setDepth(6);
        this.skeleton.setDepth(4);

        this.liftFloor.setDepth(7);
        this.toxicGas.setDepth(3);

        // Set the depth of other game objects to lower values
        this.gasBarrel.setDepth(2);
        this.ground.setDepth(2);
        this.lava.setDepth(1);
        this.fireball1.setDepth(0);
        this.fireball2.setDepth(0);
        //this.door.setDepth(1);

        // Resize collision boxes of player and everything that can be collided with
        this.player
            .setSize(this.player.width - 64, this.player.height)
            .setOffset(32, 0);

        this.ground
            .setSize(
                this.ground.width * 0.5 - 30,
                this.ground.height * 0.5 - 10
            )
            .setOffset(15, 5);
        platform1
            .setSize(platform1.width * 0.27 - 16, platform1.height * 0.3 - 28)
            .setOffset(8, 7);
        platform2
            .setSize(platform2.width * 0.27 - 16, platform2.height * 0.3 - 28)
            .setOffset(8, 7);
        platform3
            .setSize(platform3.width * 0.35 - 24, platform3.height * 0.3 - 75)
            .setOffset(12, 9);
        platform4
            .setSize(platform4.width * 0.6 - 34, platform4.height * 0.3 - 75)
            .setOffset(17, 6);
        platform5
            .setSize(platform5.width * 0.77 - 50, platform5.height * 0.3 - 75)
            .setOffset(25, 6);
        this.stone0
            .setSize(
                this.stone0.width * 0.72 - 30,
                this.stone0.height * 0.045 - 20
            )
            .setOffset(330, 120);
        this.stone1
            .setSize(
                this.stone1.width * 0.75 - 30,
                this.stone1.height * 0.04 - 20
            )
            .setOffset(270, 250);
        this.stone2
            .setSize(
                this.stone2.width * 0.72 - 26,
                this.stone2.height * 0.04 - 15
            )
            .setOffset(390, 90);
        this.stone3
            .setSize(
                this.stone3.width * 0.92 - 26,
                this.stone3.height * 0.04 - 25
            )
            .setOffset(150, 220);
        this.stone4
            .setSize(
                this.stone4.width * 0.78 - 30,
                this.stone4.height * 0.035 - 34
            )
            .setOffset(270, 130);

        this.door
            .setSize(this.door.width, this.door.height - 60)
            .setOffset(0, 0);

        // Make collectable items continuously pulsate
        this.createPulsateEffect(
            this,
            this.water,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.gasMask,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.sword,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.toolbox,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );
        this.createPulsateEffect(
            this,
            this.chainsaw,
            1.15, // Scale factor for pulsating effect
            1000 // Duration of each tween cycle in milliseconds
        );

        // Creating detection area for using gas mask
        this.gasMaskDetectionArea = this.add.rectangle(1005, 400, 130, 170);
        this.physics.world.enable(this.gasMaskDetectionArea);
        this.physics.add.collider(this.gasMaskDetectionArea, this.platforms);

        // Creating a highlighted rectangle to indicate where to use gas mask
        this.gasMaskHighlightBox = this.add.rectangle(
            1119,
            440,
            120,
            280,
            0xffff00
        );
        this.gasMaskHighlightBox.setAlpha(0.25);
        this.gasMaskHighlightBox.setVisible(false);

        // Creating detection area for using water
        this.waterDetectionArea = this.add.rectangle(450, 360, 110, 170);
        this.physics.world.enable(this.waterDetectionArea);
        this.physics.add.collider(this.waterDetectionArea, this.platforms);

        // Creating a highlighted rectangle to indicate where to use water
        this.waterHighlightBox = this.add.rectangle(
            340,
            410,
            130,
            120,
            0xffff00
        );
        this.waterHighlightBox.setAlpha(0.25);
        this.waterHighlightBox.setVisible(false);

        // Creating detection area for using toolbox
        this.toolboxDetectionArea = this.add.rectangle(205, 360, 90, 170);
        this.physics.world.enable(this.toolboxDetectionArea);
        this.physics.add.collider(this.toolboxDetectionArea, this.platforms);

        // Creating a highlighted rectangle to indicate where to use toolbox
        this.toolboxHighlightBox = this.add.rectangle(
            95,
            370,
            160,
            180,
            0xffff00
        );
        this.toolboxHighlightBox.setAlpha(0.25);
        this.toolboxHighlightBox.setVisible(false);

        // Creating detection area for using chainsaw
        this.chainsawDetectionArea = this.add.rectangle(385, 80, 100, 170);
        this.physics.world.enable(this.chainsawDetectionArea);
        this.physics.add.collider(this.chainsawDetectionArea, this.platforms);

        // Creating a highlighted rectangle to indicate where to use chainsaw
        this.chainsawHighlightBox = this.add.rectangle(
            510,
            130,
            180,
            240,
            0xffff00
        );
        this.chainsawHighlightBox.setAlpha(0.25);
        this.chainsawHighlightBox.setVisible(false);

        // Creating detection area for using sword
        this.swordDetectionArea = this.add.rectangle(815, 100, 430, 170);
        this.physics.world.enable(this.swordDetectionArea);
        this.physics.add.collider(this.swordDetectionArea, this.platforms);

        // Creating a highlighted rectangle to indicate where to use sword
        this.swordHighlightBox = this.add.rectangle(
            830,
            170,
            110,
            130,
            0xffff00
        );
        this.swordHighlightBox.setAlpha(0.25);
        this.swordHighlightBox.setVisible(false);

        // Creating detection area for using key
        this.keyDetectionArea = this.add.rectangle(870, 105, 130, 200);
        this.physics.world.enable(this.keyDetectionArea);
        this.physics.add.collider(this.keyDetectionArea, this.platforms);

        // Creating a highlighted rectangle to indicate where to use key
        this.keyHighlightBox = this.add.rectangle(870, 135, 170, 200, 0xffff00);
        this.keyHighlightBox.setAlpha(0.25);
        this.keyHighlightBox.setVisible(false);

        // Defining lava area for dying
        this.lavaArea = this.add.rectangle(840, 670, 940, 20);
        this.physics.world.enable(this.lavaArea);
        this.physics.add.collider(this.lavaArea, floor);

        // Defining toxic gas area for dying
        this.toxicGasArea = this.add.rectangle(1125, 400, 45, 250);
        this.physics.world.enable(this.toxicGasArea);
        this.physics.add.collider(this.toxicGasArea, this.platforms);

        // Defining fire area for dying
        this.fireArea = this.add.rectangle(340, 380, 80, 100);
        this.physics.world.enable(this.fireArea);
        this.physics.add.collider(this.fireArea, this.platforms);

        // Defining lift area for dying
        this.liftArea = this.add.rectangle(95, 340, 100, 150);
        this.physics.world.enable(this.liftArea);
        this.physics.add.collider(this.liftArea, this.platforms);

        // Defining tree area for dying
        this.treeArea = this.add.rectangle(510, 100, 100, 200);
        this.physics.world.enable(this.treeArea);
        this.physics.add.collider(this.treeArea, this.platforms);

        // Make fireballs jump out every few seconds after jumping once at beginning
        if (!this.isPaused) {
            this.animateBothFireballs();
        }

        // Pause Menu & Level Complete Menu
        // Creating Pause Group for Buttons and Pause Popup
        const pauseGroup = this.add.group();

        // Creating Pause Popup
        const pausePopup = this.add.image(650, 350, "pause-popup");
        pausePopup.setOrigin(0.5);
        pausePopup.setDepth(20);
        pauseGroup.add(pausePopup);

        this.noMusic = this.add.image(582, 215, "red-line");
        this.noMusic
            .setScale(0.32)
            .setOrigin(0.5)
            .setDepth(20)
            .setVisible(false);

        this.noSound = this.add.image(698, 215, "red-line");
        this.noSound
            .setScale(0.32)
            .setOrigin(0.5)
            .setDepth(20)
            .setVisible(false);

        // Exit button for Pause popup
        const exitButton = this.add.rectangle(640, 530, 200, 75).setDepth(20);
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
            .setDepth(20);
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

        // Resume button for Pause popup
        const resumeButton = this.add.rectangle(640, 320, 200, 75).setDepth(20);
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
        const muteMusic = this.add.rectangle(585, 217, 90, 90).setDepth(20);
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
        const muteSound = this.add.rectangle(700, 217, 90, 90).setDepth(20);
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
        this.timerText = this.add.text(60, 15, "Time: 0", {
            fontSize: "32px",
            color: "#ffffff",
        });
        this.startTime = this.time.now;
        this.pausedTime = 0;

        // Level complete popup - still working
        const completeExitButton = this.add.circle(790, 185, 35).setDepth(20);
        completeExitButton.setInteractive();
        completeExitButton.on("pointerover", () => {
            completeExitButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeExitButton.on("pointerout", () => {
            completeExitButton.setFillStyle();
        });

        const completeReplayButton = this.add.circle(510, 505, 55).setDepth(20);
        completeReplayButton.setInteractive();
        completeReplayButton.on("pointerover", () => {
            completeReplayButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeReplayButton.on("pointerout", () => {
            completeReplayButton.setFillStyle();
        });

        const completeMenuButton = this.add.circle(655, 530, 55).setDepth(20);
        completeMenuButton.setInteractive();
        completeMenuButton.on("pointerover", () => {
            completeMenuButton.setFillStyle(0xffff00).setAlpha(0.5);
        });
        completeMenuButton.on("pointerout", () => {
            completeMenuButton.setFillStyle();
        });

        const completeNextButton = this.add.circle(800, 505, 55).setDepth(20);
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
            this.backgroundMusic.destroy();
            // Transition to ending cut scene if level 3 completed for the first time
            if (data.level3State != 3) {
                setTimeout(() => {
                    this.scene.start("EndCutScene", {
                        level0State: this.level0State,
                        level1State: this.level1State,
                        level2State: this.level2State,
                        level3State: 3,
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
                        level2State: this.level2State,
                        level3State: 3,
                        level0Stars: this.level0Stars,
                        level1Stars: this.level1Stars,
                        level2Stars: this.level2Stars,
                        level3Stars: this.level3Stars,
                    });
                }, 500);
            }
        });

        completeReplayButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            this.resetScene();
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

        completeMenuButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            // Transition to ending cut scene if level 3 completed for the first time
            if (data.level3State != 3) {
                setTimeout(() => {
                    this.scene.start("EndCutScene", {
                        level0State: this.level0State,
                        level1State: this.level1State,
                        level2State: this.level2State,
                        level3State: 3,
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
                        level2State: this.level2State,
                        level3State: 3,
                        level0Stars: this.level0Stars,
                        level1Stars: this.level1Stars,
                        level2Stars: this.level2Stars,
                        level3Stars: this.level3Stars,
                    });
                }, 500);
            }
        });

        completeNextButton.on("pointerup", () => {
            this.sound.play("menu-sound");
            this.backgroundMusic.stop();
            this.backgroundMusic.destroy();
            // Transition to ending cut scene
            setTimeout(() => {
                this.scene.start("EndCutScene", {
                    level0State: this.level0State,
                    level1State: this.level1State,
                    level2State: this.level2State,
                    level3State: 3,
                    level0Stars: this.level0Stars,
                    level1Stars: this.level1Stars,
                    level2Stars: this.level2Stars,
                    level3Stars: this.level3Stars,
                });
            }, 500);
        });

        this.threeStarsPopup.setVisible(false);
        this.twoStarsPopup.setVisible(false);
        this.oneStarPopup.setVisible(false);
    }

    private updateStackView() {
        const offsetX = 1170; // starting X position for stack items
        const offsetY = 270; // starting Y position for stack items
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
                    if (poppedItem.name === "gas-mask") {
                        this.sound.play("gas-sound");
                        poppedItem.setDepth(10);
                        // Move the gas mask towards the player
                        poppedItem.setPosition(1005, 400);
                        // Scale down the gas mask to make it disappear
                        this.tweens.add({
                            targets: poppedItem,
                            x: this.player?.x,
                            y: this.player?.y,
                            scaleX: 0.2,
                            scaleY: 0.2,
                            duration: 300,
                            delay: 500,
                            onComplete: () => {
                                poppedItem.setVisible(false);
                            },
                        });
                        this.tweens.add({
                            targets: [this.toxicGas, this.gasBarrel],
                            alpha: 0, // Fade out
                            duration: 1200,
                        });
                        this.toxicGasArea.setPosition(-100, -100);
                        this.gasMaskHighlightBox.setVisible(false);
                    }
                    if (poppedItem.name === "water") {
                        this.sound.play("bucket-sound");
                        // Play animation to tilt the water to the side
                        this.tweens.add({
                            targets: poppedItem,
                            angle: -75, // Tilt the water to the side
                            duration: 500, // Duration of the tilt animation
                            yoyo: true, // Play the animation in reverse
                            repeat: 0, // No repeat
                            onStart: () => {
                                poppedItem.setPosition(400, 315);
                            },
                            onComplete: () => {
                                poppedItem.setVisible(false);
                                this.tweens.add({
                                    targets: this.fire,
                                    alpha: 0, // Fade out
                                    duration: 500,
                                });
                            },
                        });
                        this.fireArea.setPosition(-100, -100);
                        this.waterHighlightBox.setVisible(false);
                    }
                    if (poppedItem.name === "toolbox") {
                        this.sound.play("toolbox-sound");
                        poppedItem.setVisible(false);
                        this.tweens.add({
                            targets: this.dangerSign,
                            alpha: 0, // Fade out
                            duration: 500,
                            onComplete: () => {
                                this.liftFloor?.setTexture("lift-on");
                                // Start the lift
                                this.tweens.add({
                                    targets: this.liftPlatforms.getChildren(), // Move all platforms in the group
                                    y: "-=190", // Move the lift platforms up
                                    delay: 600,
                                    duration: 2200, // Duration of the movement
                                    yoyo: true, // Platforms will return to their original position
                                    repeat: -1, // Repeat indefinitely
                                    ease: "Linear",
                                });
                            },
                        });
                        this.liftArea.setPosition(-100, -100);
                        this.toolboxHighlightBox.setVisible(false);
                    }
                    if (poppedItem.name === "chainsaw") {
                        this.sound.play("chainsaw-sound");
                        // Play animation to rotate and move the chainsaw side to side
                        if (this.chainsaw) {
                            this.tweens.add({
                                targets: poppedItem,
                                angle: 45, // Rotate the chainsaw to the side
                                x: 570 + 20, // Move the chainsaw a bit to the right
                                duration: 500, // Duration of the rotation and movement
                                yoyo: true, // Play the animation in reverse
                                repeat: 0, // No repeat
                                onStart: () => {
                                    poppedItem.setDepth(3);
                                    poppedItem.setPosition(570, 170);
                                },
                                onComplete: () => {
                                    // Execute callback function after animation finishes
                                    poppedItem.setVisible(false);
                                    this.tree?.setScale(0.25);
                                    this.tree?.setPosition(537, 205);
                                    this.tree?.setTexture("tree-cut");
                                },
                            });
                        }
                        this.treeArea.setPosition(-100, -100);
                        this.chainsawHighlightBox.setVisible(false);
                    }
                    if (poppedItem.name === "sword") {
                        this.usedSword = true;
                        this.skeletonDead = true;
                        poppedItem.setDepth(5);
                        if (this.sword && this.player && this.skeleton) {
                            // Set the sword's initial position to the player's location
                            this.sword.setPosition(
                                this.player.x,
                                this.player.y
                            );

                            if (this.skeleton.x > this.player.x) {
                                // If the skeleton is to the right of the player, rotate the sword to face right
                                this.sword.setRotation(
                                    Phaser.Math.DegToRad(132)
                                ); // Facing right
                            } else {
                                // If the skeleton is to the left of the player, rotate the sword to face left
                                this.sword.setRotation(
                                    Phaser.Math.DegToRad(-48)
                                ); // Facing left
                            }

                            // Make the sword move towards the skeleton and rotate down after passing it
                            this.sound.play("sword-sound");
                            this.tweens.add({
                                targets: this.sword,
                                x: this.skeleton.x + 100,
                                y: this.skeleton.y,
                                duration: 300, // Adjust duration as needed
                                onComplete: () => {
                                    if (this.sword) {
                                        this.tweens.add({
                                            targets: this.sword,
                                            scaleX: this.sword.scaleX * 0.9,
                                            scaleY: this.sword.scaleY * 0.9,
                                            x: 1000,
                                            y: 170,
                                            rotation: Phaser.Math.DegToRad(222),
                                            duration: 100,
                                            onComplete: () => {
                                                // Play the die animation for the skeleton
                                                if (
                                                    this.skeleton &&
                                                    this.player &&
                                                    this.skeleton.x <
                                                        this.player.x
                                                ) {
                                                    this.sound.play(
                                                        "skeleton-sound"
                                                    );
                                                    this.skeleton.anims.play(
                                                        "die_right",
                                                        true
                                                    );
                                                } else if (
                                                    this.skeleton &&
                                                    this.player &&
                                                    this.skeleton.x >
                                                        this.player.x
                                                ) {
                                                    this.sound.play(
                                                        "skeleton-sound"
                                                    );
                                                    this.skeleton.anims.play(
                                                        "die_left",
                                                        true
                                                    );
                                                }

                                                // After the die animation completes, remove the skeleton from the scene
                                                setTimeout(() => {
                                                    this.skeleton?.setVisible(
                                                        false
                                                    );
                                                    this.skeleton?.setPosition(
                                                        -600,
                                                        -600
                                                    );
                                                    this.skeleton?.destroy();
                                                }, 1000);
                                            },
                                        });
                                    }
                                },
                            });
                        }
                        this.swordHighlightBox.setVisible(false);
                    }
                    if (poppedItem.name === "key") {
                        this.sound.play("dooropen-sound");
                        this.keyHighlightBox.setVisible(false);
                        this.door?.setTexture("red-opendoor");
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
                                    if (this.input.keyboard) {
                                        this.input.keyboard.enabled = false;
                                    }
                                    this.player?.setVisible(false);
                                    // TODO: Transition to game map OR to ending cut scene: set level 3 to completed status
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
                                        .setDepth(21)
                                        .setVisible(false);
                                    // Level popup depends on time it takes to complete
                                    if (this.elapsedTime <= 30000) {
                                        this.starsPopup = this.threeStarsPopup;
                                        this.threeStarsPopup.add(completedTime);
                                        this.threeStarsPopup
                                            .setVisible(true)
                                            .setDepth(20);
                                        this.level3Stars = 3;
                                    }
                                    if (
                                        this.elapsedTime > 30000 &&
                                        this.elapsedTime <= 60000
                                    ) {
                                        this.starsPopup = this.twoStarsPopup;
                                        this.twoStarsPopup.add(completedTime);
                                        this.twoStarsPopup
                                            .setVisible(true)
                                            .setDepth(20);
                                        // Update stars if its better than previous time
                                        if (this.level3Stars < 2) {
                                            this.level3Stars = 2;
                                        }
                                    }
                                    if (this.elapsedTime > 60000) {
                                        this.starsPopup = this.oneStarPopup;
                                        this.oneStarPopup.add(completedTime);
                                        this.oneStarPopup
                                            .setVisible(true)
                                            .setDepth(20);
                                        // Update stars if its better than previous time
                                        if (this.level3Stars < 1) {
                                            this.level3Stars = 1;
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

                                    this.level3State = 3;
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
                    if (poppedItem.name === "gas-mask") {
                        poppedItem.setPosition(160, 610);
                        originalScaleX = 0.4;
                        originalScaleY = 0.4;
                    }
                    if (poppedItem.name === "water") {
                        poppedItem.setPosition(1230, 510);
                        originalScaleX = 0.2;
                        originalScaleY = 0.2;
                    }
                    if (poppedItem.name === "toolbox") {
                        poppedItem.setPosition(820, 610);
                        originalScaleX = 0.2;
                        originalScaleY = 0.2;
                    }
                    if (poppedItem.name === "chainsaw") {
                        poppedItem.setPosition(245, 385);
                        originalScaleX = 0.45;
                        originalScaleY = 0.45;
                    }
                    if (poppedItem.name === "sword") {
                        poppedItem.setPosition(50, 600);
                        originalScaleX = 0.2;
                        originalScaleY = 0.2;
                    }
                    if (poppedItem.name === "key") {
                        poppedItem.setPosition(580, 610);
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
                    if (poppedItem.name === "gas-mask") {
                        poppedItem.setPosition(160, 610);
                        originalScaleX = 0.4;
                        originalScaleY = 0.4;
                    }
                    if (poppedItem.name === "water") {
                        poppedItem.setPosition(1230, 510);
                        originalScaleX = 0.2;
                        originalScaleY = 0.2;
                    }
                    if (poppedItem.name === "toolbox") {
                        poppedItem.setPosition(820, 610);
                        originalScaleX = 0.2;
                        originalScaleY = 0.2;
                    }
                    if (poppedItem.name === "chainsaw") {
                        poppedItem.setPosition(245, 385);
                        originalScaleX = 0.45;
                        originalScaleY = 0.45;
                    }
                    if (poppedItem.name === "sword") {
                        poppedItem.setPosition(50, 600);
                        originalScaleX = 0.2;
                        originalScaleY = 0.2;
                    }
                    if (poppedItem.name === "key") {
                        poppedItem.setPosition(580, 610);
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

            console.log(this.lives);
            if (this.lives === 0) {
                this.playerDie();
                console.log("dying");
            }

            // Reset isColliding flag
            this.time.delayedCall(
                500,
                () => {
                    this.isColliding = false;
                    if (this.collidingWithDeath) {
                        this.player?.setPosition(300, 550); // Reset player's position
                        // Reset stone bridge if it has fallen
                        if (
                            this.stone0 &&
                            this.stone1 &&
                            this.stone2 &&
                            this.stone3 &&
                            this.stone4
                        ) {
                            if (
                                this.stone0.y > 470 ||
                                this.stone1.y > 475 ||
                                this.stone2.y > 470 ||
                                this.stone3.y > 473 ||
                                this.stone4.y > 489
                            ) {
                                this.resetStones();
                            }
                        }
                        this.collidingWithDeath = false;
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
            this.scene.launch("YouDiedScene3", {
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
            this.updateStackView();
            this.collectedItems = [];
            this.usedItems = [];
            this.lives = 3;
            this.createHearts();
            this.freePopsLeft = 4;
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
        this.freePopsLeft = 4;
        this.isPaused = false;
        this.skeletonDead = false;
        this.flashingRed = false;
        this.isColliding = false;
        this.collidingWithDeath = false;
        this.usedSword = false;
        this.playerLostLife = false;
        this.poppingWrongItem = false;
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

    // Make stones fall
    private makeStonesFall() {
        // Delay between each stone falling
        const delayBetweenStones = 410;

        // Array containing references to the stones in the desired falling order
        const stonesArray = [
            this.stone4,
            this.stone3,
            this.stone2,
            this.stone1,
            this.stone0,
        ];

        stonesArray.forEach((stone, index) => {
            // Add a delay based on the index to create a sequence
            const delay = index * delayBetweenStones;
            this.time.delayedCall(delay, () => {
                if (stone && stone.body && !this.playerLostLife) {
                    // Make stones fall down but stop if player lost life
                    stone.body.velocity.y = 120;
                }
            });
        });
    }

    // Reset stones
    private resetStones() {
        this.playerLostLife = true;
        // Define initial positions of the stones
        const initialPositions = [
            { x: 885, y: 489 },
            { x: 795, y: 473 },
            { x: 700, y: 470 },
            { x: 630, y: 475 },
            { x: 552, y: 470 },
        ];

        // Array containing references to the stones
        const stonesArray = [
            this.stone4,
            this.stone3,
            this.stone2,
            this.stone1,
            this.stone0,
        ];

        // Loop through stones and reset their positions
        stonesArray.forEach((stone, index) => {
            if (stone && stone.body) {
                // Stop making stones fall down
                stone.body.velocity.y = 0;

                // Set stone position to initial position
                stone.setPosition(
                    initialPositions[index].x,
                    initialPositions[index].y
                );

                // Recreate a sensor above each stone to detect player overlap
                const sensor = this.physics.add
                    .sprite(stone.x, stone.y + 20, "sensor")
                    .setAlpha(0);
                sensor.body.setSize(stone.width * 0.02, 10).setOffset(-15, -40); // Adjust sensor size and offset as needed
                this.physics.add.collider(sensor, this.stones);
                if (this.player) {
                    // Make stones fall if player touches the sensors
                    this.physics.add.overlap(sensor, this.player, () => {
                        this.makeStonesFall.call(this);
                    });
                }
            }
        });

        this.time.delayedCall(1000, () => {
            this.playerLostLife = false;
        });
    }

    animateFireball(fireball: Phaser.Physics.Arcade.Image) {
        this.tweens.add({
            targets: fireball,
            y: "-=210",
            delay: 200,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut",
            onYoyo: () => {
                // Flip vertically when reaching the top or bottom
                fireball.scaleY *= -1;
            },
            onRepeat: () => {
                fireball.scaleY *= -1;
            },
        });
    }

    animateBothFireballs() {
        if (this.fireball1 && this.fireball2) {
            this.animateFireball(this.fireball1);
            this.animateFireball(this.fireball2);
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

        // Skeleton walking animation
        const rightBoundary = 1000;
        const leftBoundary = 715;
        const chaseThreshold = 300;
        const attackThreshold = 70;
        if (!this.usedSword && !this.isPaused) {
            if (this.skeleton && this.player && !this.skeletonDead) {
                // Calculate the distance between the skeleton and the player
                const distanceX = Math.abs(this.player.x - this.skeleton.x);
                const distanceY = Math.abs(this.player.y - this.skeleton.y);

                // If player is close-ish, move toward player
                if (
                    distanceX < chaseThreshold &&
                    distanceX > attackThreshold &&
                    distanceY < 40
                ) {
                    if (this.skeleton.x < this.player.x) {
                        this.skeleton.x += 4.3; // Move right
                        this.skeleton.anims.play("walk_right", true);
                    } else if (this.skeleton.x > this.player.x) {
                        this.skeleton.x -= 4.3; // Move left
                        this.skeleton.anims.play("walk_left", true);
                    }
                }
                // If player is close enough to hit, attack
                else if (distanceX <= attackThreshold && distanceY < 100) {
                    if (this.skeleton.x < this.player.x) {
                        this.skeleton.anims.play("attack_right", true); // Attack right
                    } else if (this.skeleton.x > this.player.x) {
                        this.skeleton.anims.play("attack_left", true); // Attack left
                    }
                    if (!this.collidingWithDeath) {
                        this.time.delayedCall(
                            500,
                            () => {
                                this.collidingWithDeath = true;
                                this.loseLife();
                            },
                            [],
                            this
                        );
                    }
                }
                // If player is not close, just walk back and forth
                else {
                    if (
                        this.skeleton.x <= rightBoundary &&
                        this.skeletonDirection === 1
                    ) {
                        this.skeleton.x += 1.5;
                        this.skeleton.anims.play("walk_right", true);
                    } else if (
                        this.skeleton.x >= leftBoundary &&
                        this.skeletonDirection === -1
                    ) {
                        this.skeleton.x -= 1.5;
                        this.skeleton.anims.play("walk_left", true);
                    }
                    // If the skeleton reaches the right boundary, change direction to left
                    else if (this.skeleton.x > rightBoundary) {
                        this.skeletonDirection = -1;
                    }
                    // If the skeleton reaches the left boundary, change direction to right
                    else if (this.skeleton.x < leftBoundary) {
                        this.skeletonDirection = 1;
                    }
                }
            }
        }

        // Move the gal with arrow keys
        if (this.player && this.cursors) {
            if (!this.isColliding) {
                if (this.cursors.up.isDown && this.player.body?.touching.down) {
                    this.player.anims.play("jump_right", true);
                    this.player.setVelocityY(-450);
                } else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(280);
                    this.player.anims.play("right", true);
                    this.lastDirection = "right"; // Update last direction
                } else if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-280);
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

        // Collect item if 'E' key is pressed
        if (this.player && this.keyE?.isDown && !this.keyEPressed) {
            this.keyEPressed = true; // Set the flag for the E key being pressed to true

            // Check if the player is close enough to the water, gas mask, sword, toolbox, chainsaw, or key, and if so, collect it
            if (
                this.sword &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.sword.x,
                    this.sword.y
                ) < 60
            ) {
                this.collectItem(this.sword);
            }
            if (
                this.gasMask &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.gasMask.x,
                    this.gasMask.y
                ) < 60
            ) {
                this.collectItem(this.gasMask);
            }
            if (
                this.toolbox &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.toolbox.x,
                    this.toolbox.y
                ) < 100
            ) {
                this.collectItem(this.toolbox);
            }
            if (
                this.water &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.water.x,
                    this.water.y
                ) < 100
            ) {
                this.collectItem(this.water);
            }
            if (
                this.chainsaw &&
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.chainsaw.x,
                    this.chainsaw.y
                ) < 100
            ) {
                this.collectItem(this.chainsaw);
            }
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
            // Gas Mask
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.gasMaskDetectionArea.getBounds()
                ) &&
                this.gasMask &&
                !this.usedItems.includes(this.gasMask)
            ) {
                // If player overlaps with gas mask detection area, show the highlight box
                this.gasMaskHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "gas-mask") {
                        // If the top item is gas mask, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not gas mask, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.gasMaskHighlightBox);
                    }
                }
            } else if (!this.flashingRed) {
                this.gasMaskHighlightBox.setVisible(false);
            }

            // Water
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.waterDetectionArea.getBounds()
                ) &&
                this.water &&
                !this.usedItems.includes(this.water)
            ) {
                // If player overlaps with water detection area, show the highlight box
                this.waterHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "water") {
                        // If the top item is water, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not water, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.waterHighlightBox);
                    }
                }
            } else if (!this.flashingRed) {
                this.waterHighlightBox.setVisible(false);
            }

            // Toolbox
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.toolboxDetectionArea.getBounds()
                ) &&
                this.toolbox &&
                !this.usedItems.includes(this.toolbox)
            ) {
                // If player overlaps with toolbox detection area, show highlight box
                this.toolboxHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "toolbox") {
                        // If the top item is toolbox, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not toolbox, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.toolboxHighlightBox);
                    }
                }
            } else if (!this.flashingRed) {
                this.toolboxHighlightBox.setVisible(false);
            }

            // Chainsaw
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.chainsawDetectionArea.getBounds()
                ) &&
                this.chainsaw &&
                !this.usedItems.includes(this.chainsaw)
            ) {
                // If player overlaps with chainsaw detection area, show highlight box
                this.chainsawHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "chainsaw") {
                        // If the top item is chainsaw, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not chainsaw, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.chainsawHighlightBox);
                    }
                }
            } else if (!this.flashingRed) {
                this.chainsawHighlightBox.setVisible(false);
            }

            // Sword
            this.swordDetectionArea.setPosition(
                this.skeleton?.x,
                this.swordDetectionArea.y
            );
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.player.getBounds(),
                    this.swordDetectionArea.getBounds()
                ) &&
                this.sword &&
                !this.usedItems.includes(this.sword)
            ) {
                // If player overlaps with sword detection area, show the highlight box
                this.swordHighlightBox.setPosition(
                    this.skeleton?.x,
                    this.swordHighlightBox.y
                );
                this.swordHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "sword") {
                        // If the top item is sword, use it
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not sword, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.swordHighlightBox);
                    }
                }
            } else if (!this.flashingRed) {
                this.swordHighlightBox.setVisible(false);
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
                this.keyHighlightBox.setVisible(true);
                if (
                    this.keyF?.isDown &&
                    !this.keyFPressed &&
                    this.stack.length > 0 &&
                    this.skeletonDead
                ) {
                    // If player presses F
                    if (this.stack[this.stack.length - 1].name === "key") {
                        // If the top item is key and player killed skeleton, open door
                        this.keyFPressed = true;
                        this.useItem();
                    } else {
                        // If the top item is not key, pop it and lose life
                        this.keyFPressed = true;
                        this.popWrongItem(this.keyHighlightBox);
                    }
                }
            } else if (!this.flashingRed) {
                this.keyHighlightBox.setVisible(false);
            }
        }

        // Lose life if player touches lava
        if (this.player) {
            this.physics.add.collider(
                this.player,
                this.lavaArea,
                () => {
                    this.collidingWithDeath = true;
                    this.loseLife();
                },
                undefined,
                this
            );
        }
        // Lose life if player touches fireballs
        if (this.player && this.fireball1 && this.fireball2) {
            // Fireball 1
            const distX1 = Math.abs(this.player.x - this.fireball1.x);
            const distY1 = Math.abs(this.player.y - this.fireball1.y);
            if (distX1 < 40 && distY1 < 90) {
                this.collidingWithDeath = true;
                this.loseLife();
            }
            // Fireball 2
            const distX2 = Math.abs(this.player.x - this.fireball2.x);
            const distY2 = Math.abs(this.player.y - this.fireball2.y);
            if (distX2 < 40 && distY2 < 90) {
                this.collidingWithDeath = true;
                this.loseLife();
            }
        }
        // Lose life if player touches toxic gas
        if (
            this.player &&
            Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                this.toxicGasArea.getBounds()
            )
        ) {
            this.collidingWithDeath = true;
            this.loseLife();
        }
        // Lose life if player touches fire
        if (
            this.player &&
            Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                this.fireArea.getBounds()
            )
        ) {
            this.collidingWithDeath = true;
            this.loseLife();
        }
        // Lose life if player touches lift (while it's not repaired)
        if (
            this.player &&
            Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                this.liftArea.getBounds()
            )
        ) {
            this.collidingWithDeath = true;
            this.loseLife();
        }
        if (
            this.player &&
            Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                this.treeArea.getBounds()
            )
        ) {
            this.collidingWithDeath = true;
            this.loseLife();
        }
    }
}
