# StackPack Journey

## Elevator Pitch

StackPack Journey is a game that aims to teach students about the stack; the premise is that you have lost your soulmate and your goal is to use your StackPack (a backpack that works like a stack) to navigate through the world by picking up objects to overcome various obstacles to reunite with your soulmate.

## Influences (Brief)

-   Super Mario Bros.:

    -   Medium: Game
    -   Explanation: In Super Mario Bros., when you go through the levels, you see a map view of the world with the different levels and checkpoints. The player goes through this map while completing the levels to reach the end objective. Our game will have a similar map view of the different levels. Each level in Super Mario Bros. also has a different theme focusing on a different part of the world. There are levels with lava, levels that take place in the sky, etc. Our game will have similar themes to that.

-   Farafalla:

    -   Medium: Game
    -   Explanation: In this game, players need to reach the end of a level, but there are different colored barriers preventing them from just walking through. Matching colored balloons are scattered throughout the map, and once you collect a certain color, you can pass through that boundary. Needing specific items to pass obstacles in a level was the inspiration we took from this game.

-   Love You to Bits:
    -   Medium: Game
    -   Explanation: In this mobile game, you are a space explorer looking for the pieces of your robot girlfriend that have gotten spread throughout outer space. The game has a cute, sci-fi aesthetic with visual backgrounds and a tiny main character in this huge world. Our game is taking inspiration from that, as our character will be tiny going through this world trying to find their soulmate by unlocking doors and traveling through the world.

## Core Gameplay Mechanics (Brief)

-   Brief walkthrough tutorial to demonstrate how to play (Level 0)
-   Push objects into the stack using ‘E’ on the keyboard
-   Pop objects off of the stack using ‘F’ on the keyboard
-   Player moves around the world using arrow keys
-   When you obtain the key and use it on the door, you advance to the next level
-   After you complete all of the levels, it displays a (victory) scene of finding your soulmate.

# Learning Aspects

## Learning Domains

-   Introduction to Data Structures (specifically the stack)

## Target Audiences

-   Our learners are students who are taking a data structures course where stacks are a topic of discussion.
-   For those who enjoy adventure/puzzle games

## Target Contexts

-   This would be assigned as an additional (optional) resource to help students grasp the idea of a stack and how it works in a course formally teaching about stacks.
-   This game would not be appropriate as a classroom activity since it will have many levels and, therefore, will take a long time to complete.

## Learning Objectives

-   LIFO: By the end of the game, students will be able to explain the concept of LIFO (Last in first out)
-   Push/Pop: By the end of the game, students will be able to define the terms “push” and “pop.”
-   Visual Representation: By the end of the game, students will be able to illustrate a visual representation of a stack and the process of pushing/popping from that stack.

## Prerequisite Knowledge

-   Prior to the game, players need to be able to follow simple instructions.
-   Prior to the game, players need to be able to define the concept of a stack.
-   Prior to the game, players need to be able to explain the general concept of what push() and pop() operations on a stack are.

## Assessment Measures

We can give a short pre-test and post-test to assess how much the student has learned from playing the game.

-   Given a stack and a list of push and pop operations that are to be performed on the stack, draw how the stack will look after running those operations.

# What sets this project apart?

-   Most introductory computer science games focus on teaching how to code with code blocks, etc; however, this game focuses on teaching an important data structure that many beginner computer science students struggle with.
-   The aesthetics of this game will appeal to the users and make them want to continue playing/learning.
-   Most introductory computer science games also lack a storyline, which makes it unappealing for students to play. This game has a unique and interesting storyline that will compel students to keep playing and learning.
-   The real-time visualization of the stack as the user plays will drive home the point of how pushing and popping works to the user.

# Player Interaction Patterns and Modes

## Player Interaction Pattern

-   This is a one-player game using the keyboard to play, including arrow keys and a few other specified buttons.

## Player Modes

-   Single-player: One player will advance through multiple levels where there will be more items than the previous one.

# Gameplay Objectives

-   Get past an obstacle in a level.

    -   Description: When a player has the correct item at the top of their stack and they use it on an obstacle (ex. A boat in the stack and they use it on a lake) they will be able to get past that obstacle (cross the lake).
    -   Alignment: Doing this successfully shows effective planning, since that item needs to be at the top of the stack to use it.

-   Successfully complete a level.

    -   Description: When the player successfully gets to the end door and unlocks it with the key, they have completed the level.
    -   Alignment: Completing a level shows understanding with the LIFO and Push/Pop concepts, since those are required to use the items in their correct order.

-   Find your Soulmate.
    -   Description: Completing all the levels will lead you to your soulmate, who you lost at the beginning of the game.
    -   Alignment: Since each level has more items than the last, getting past all levels shows a true deep understanding of how a stack works.

# Procedures/Actions

-   You can press ‘E’ when you’re near an item to pick it up and put it into your stack-pack.
-   You can press ‘F’ when you’re near a place where you can use an item to use the item there and overcome the obstacle / open the door.
-   You can move the main character around with the arrow keys.

# Rules

-   If the player tries to use an object in an area that is not permitted, the player will not be able to do so.
-   If the player uses the correct object in the right area, the player will be able to advance through the level.
-   If the player obtains the key and uses it on the door, the player will advance to the next level.
-   Over time, the level of difficulty will increase and evolve to incorporate the following:
    -   Increased number of objects needed to push and pop
    -   More planning needed to complete the levels as the number of obstacles increases

# Objects/Entities

In a Level:

-   There will be a main character that the player can control
-   There will be a visible stack that shows your current “inventory” of items in the stack
-   There will be platforms across the screen that the player can walk across
-   There will be objects players can collect
-   There will be obstacles throughout the level
-   There will be a highlighted box that shows up when the player gets close enough to an obstacle, letting them know they can use an item on that obstacle

On Map (showing all levels):

-   There will be a spot for each level in the game, with completed levels colored green, incomplete/inaccessible levels grayed out, and the current level colored blue.

## Core Gameplay Mechanics (Detailed)

-   “Level 0”: Players will have to complete Level 0 - a short introductory walkthrough that demonstrates the basic mechanics of the game. It will force players to pick objects up and push or pop them off the stack.

-   “Pushing”: (aka. Collecting items) Players will be able to push objects to their stack using the letter ‘E’ when standing over an object. When that prompt is shown and E is pressed, the object will visually appear in the player’s stack-pack.

-   “Popping”: (aka. Using items) Players will be able to pop objects from their stack using the letter ‘F’ when standing over an obstacle to use the objects throughout the levels. When that prompt is shown and the valid object is at the top of the stack, the action is performed (Ex. unlocking the door at the end of the level if the key is at the top of the stack).

-   “Movement”: Players will be able to move around the 2D world using all four arrow keys. Left moves left, right moves right, and up will be used to climb things like ladders.

-   “Next Level”: Players will be able to advance to the next level only if they use the key on the door. The door will swing open and players will go through the door.

-   “All Levels Complete”: When the player completes all of the levels, a victory cutscene will display showing the player finally reconnecting with their soulmate.

## Feedback

-   When you try to use an object in an area where it’s not supposed to be used, the area will flash red indicating that you can’t do that with a sound effect.
-   When you correctly use an object to overcome an area’s obstacle, the area will visibly change (animations) to show the object being used and appropriate sound effects will play based on what the item is.
-   When you complete a level by using the correct key on the door, the door will swing open and text will show up saying you did it. A victory sound effect will also play.
-   When you complete a level, the next level will “unlock” in the game map (it will be colored blue). Also, the level you just completed will become green showing that you finished it.
-   When you win the game by finishing the last level and getting to your soulmate, a big victory message will appear and you will see an animation showing the main character reunite with the soulmate, and sound effects will also play accompanying it.

# Story and Gameplay

## Presentation of Rules

Text shown on the main game screen explains the objective and interaction instructions. Also, Level 0 will interactively show how the game works and how to control the character.

## Presentation of Content

-   There will be a “Level 0” which will be a walkthrough of the gameplay and core mechanics. The player controls movement, and small boxes show up to guide the player into making the right choices.
    -   Ex: “-> to walk left”; “walk over this key”; “e to push key onto stack”; “walk over the door”; “e to pop key and unlock door”
    -   Covers core mechanics movement, pushing, and popping

## Story (Brief)

While traveling through this strange, new world together, you and your soulmate suddenly get separated. You must finish traveling throughout the world solo, collecting objects and completing obstacles to reconnect with your lost soulmate.

## Storyboarding

![Stack Pack Story Board](https://github.com/UD-S24-CISC374/final-project-yellow/blob/main/assets/stackpack-storyboard.png?raw=true "Story Board")

Example of a Potential Harder Level: (the numbers represent the order in which you would pick up or use items)
![Stack Pack Harder Level](https://github.com/UD-S24-CISC374/final-project-yellow/blob/241ec885bdf1db4cf54fa24d2dbbc6e61d8eed40/assets/stackpack-mockup.png?raw=true "Harder Level")

# Assets Needed

## Aesthetics

-   The aesthetics of this game will be cartoonish/cutesy for a stress-free environment. Players should not feel pressure when playing the game, but rather relaxed.

## Graphical

-   Characters List

    -   Main player: A female non-scary (cute) creature, with animations for movement
    -   The soulmate: A non-scary (cute) creature
    -   Note: Might add bad-guy NPC characters to later levels

-   Textures: N/A

-   Environment Art/Textures:
    -   Level 0 Background: Basic grassy background
    -   Level 1 Background: Forest-y background with trees and sun
    -   Level 2 Background: Cloud background, up in the air
    -   Level 3 Background: Lava/Volcano background
    -   Note: Aiming for 3 really good levels, after that is if we have time
    -   Victory Scene: Cutesy background

## Audio

-   Music List (Ambient sound)
    -   Level 0: Basic pleasant gameplay music that you normally hear in the background of tutorials
    -   Level 1: Leaves rustling, wind, forest-vibe music
    -   Level 2: Dreamy, idyllic music as you are in a cloud dreamworld
    -   Level 3: Intense, fast-paced music, since this is the final level
    -   Victory Scene: Dramatic, upbeat, congratulatory music as you just found your soulmate
-   Sound List (SFX)
    -   Jumping
    -   Door Unlock (door swinging sound)
    -   Using objects/items (different for each object)
    -   Hitting an enemy (the enemy’s response to getting hit)

# Metadata

-   Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
-   Version 0.0.3
