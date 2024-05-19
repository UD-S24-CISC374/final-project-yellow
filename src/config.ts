import Phaser from "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import TitleScreen from "./scenes/titleScreen";
import GameMap from "./scenes/gameMap";
import LevelZero from "./scenes/levelZero";
import youDiedScene from "./scenes/youDiedScene";
import LevelOne from "./scenes/levelOne";
import LevelThree from "./scenes/levelThree";
import LevelTwo from "./scenes/levelTwo";
import youDiedScene3 from "./scenes/youDiedScene3";
import youDiedScene1 from "./scenes/youDiedScene1";
import youDiedScene2 from "./scenes/youDiedScene2";
import EndCutScene from "./scenes/endCutScene";
import StartCutScene from "./scenes/startCutScene";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

export const CONFIG = {
    title: "StackPack Journey",
    version: "0.0.1",
    type: Phaser.AUTO,
    backgroundColor: "#ffffff",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [
        PreloadScene,
        MainScene,
        TitleScreen,
        GameMap,
        LevelZero,
        youDiedScene,
        LevelOne,
        LevelThree,
        LevelTwo,
        youDiedScene3,
        youDiedScene1,
        youDiedScene2,
        EndCutScene,
        StartCutScene,
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 900 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
};
