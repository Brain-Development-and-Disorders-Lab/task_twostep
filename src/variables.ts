/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 *
 * Experiment-wide variables
 */

// Number of trials in a 'block' of trials
export const blockLength = 50;
export const blockCount = 4;

// Number of trial types
export const practicePressingIdx = 5;
export const practicePressingNum = 4; // 4 trials to practice selecting alien
export const practiceRewardIdx = 10 + practicePressingNum;
export const practiceRewardNum = 10; // 10 trials to practice asking alien
export const practiceStochasticIdx = 17 + practicePressingNum + practiceRewardNum;
export const practiceStochasticNum = 10; // 10 trials practice choosing aliens
export const practiceGameIdx = 34 + practicePressingNum + practiceRewardNum + practiceStochasticNum;
export const practiceGameCount = 20; // 20 trials to practice full game

// Transition probability
export const probability = 0.7;

// Display variables
// Global position variables
export const height = window.innerHeight;
export const width = window.innerWidth;

// Overall scaling and picture sizing
export let pictureHeight: number;
export let pictureWidth: number;

if (window.innerWidth / window.innerHeight < 1.34) {
  pictureHeight = window.innerWidth / 1.34;
  pictureWidth = window.innerWidth;
} else {
  pictureHeight = window.innerHeight;
  pictureWidth = window.innerHeight * 1.34;
}

// Image scaling
export const sizeMonster = (pictureHeight * 300) / 758;
export const sizeReward = (pictureHeight * 75) / 758;
export const sizeButton = (pictureHeight * 25) / 758;

// Font size
export const sizeFont = (pictureHeight * 25) / 758;

// Coordinate system for placing stimuli
export const centerX = width / 2;
export const centerY = height / 2;

// Left and right choices
export const choiceY = centerY + 0.22 * pictureHeight - sizeMonster / 2;
export const choiceXRight = centerX + 0.25 * pictureWidth - sizeMonster / 2;
export const choiceXLeft = centerX - 0.25 * pictureWidth - sizeMonster / 2;

// Chosen stimulus location
export const chosenY = centerY - 0.06 * pictureHeight - sizeMonster / 2;
export const chosenX = centerX - sizeMonster / 2;

export const rewardY = centerY - 0.06 * pictureHeight - sizeReward / 2 - sizeMonster / 2;
export const rewardX = centerX - sizeReward / 2;

// Text positioning
export const textX = window.innerWidth / 2;
export const textY = window.innerHeight / 5;
export const textInstructionsY = window.innerHeight / 5;

// Instructions
export const instructions: any[][] = [];

// Black (starting) background
instructions[0] = [
  [
    "Before commencing the task, review the following instructions carefully.",
    "",
    "When you are ready to continue, click the red button in",
    "the lower-right corner of your screen.",
    "Once the button is green, press the Spacebar to continue.",
    "",
    "If you have any questions at any stage of the task, reach out to the research",
    "coordinator.",
  ],
];

// Rocket background
instructions[1] = [
  [
    "Welcome, astronaut! You are now in charge of important exploration missions.",
    "",
    "These missions involve taking one of these two spaceships from Earth",
    "to explore two planets potentially containing resources.",
  ],
];

// Alien background
instructions[2] = [
  [
    "Each planet will have two aliens who are in charge of their own",
    "resource mines.",
  ],
  [
    "On each planet, you must ask one alien to share their resources.",
    "If an alien has resources, it will share them with you.",
    "A mission is successful when an alien shares their treasure.",
  ],
  [
    "To ask the left alien, press '1'. To ask the right alien, press '0'.",
    "The alien you asked will be highlighted.",
    "",
    "You can practice asking aliens for resources now.",
    "Click the red button and press Spacebar to continue.",
  ],
];

// Black background
instructions[3] = [
  [
    "After you ask an alien, they will show you if they have resources to share.",
    "Resources looks like this:",
  ],
  [
    "If the alien doesn't have resources to share this time, you'll see an empty circle.",
    "The circle looks like this:",
  ],
  [
    "If an alien has a good mine it will often have resources to share.",
    "It might not have resources every time you ask, but it will have resources most of the time.",
  ],
  [
    "Another alien might have a bad mine at the moment,",
    "and it won't have resources to share most times you ask.",
  ],
];

// Yellow alien
instructions[4] = [
  [
    "For example, this alien on the yellow planet has a good mine at the moment.",
    "You can now ask it for treasure 10 times. To ask it for treasure, press '1'.",
    "",
    "Click the red button and press Spacebar to continue.",
  ],
  [
    "The alien shared resources most times you asked.",
    "During missions, it may not share resources every time you ask.",
  ],
];

// Black background
instructions[5] = [
  [
    "Aliens have resources in their mines, but they can't share their resources every mission.",
    "",
    "For example, some aliens will share because resources are easier to dig up right now.",
  ],
];

// One alien to the right
instructions[6] = [
  [
    "You can now choose between two aliens to ask for resources.",
    "Pay attention to each alien and try to figure out which alien has more resources to share.",
  ],
];

// One alien to the left
instructions[7] = [["...and sometimes come up on the left."]];

// Black background
instructions[8] = [
  [
    "It does not matter which side of your screen an alien appears on.",
    "For example: the left side is not luckier than the right side.",
  ],
  [
    "You now have 10 practice missions to try to figure out which alien has a good mine.",
    "To ask the left alien for resources, press '1'. To ask the right alien for resources, press '0'.",
  ],
  [
    "Click the red button and press Spacebar to begin the practice missions.",
  ],
];

// Black background
instructions[9] = [
  [
    "You may have discovered that this alien had resources to share more often.",
    "Even if this alien had a better mine,",
    "you couldn't be sure if it had resources to share all the time.",
  ],
  [
    "Each alien is like a game of chance, you can never be sure but",
    "you can guess.",
    "",
    "The amount resources an alien can share will change during the missions.",
  ],
  [
    "An alien with a good mine in previous missions may dig in a part of their",
    "mine that has few resources.",
    "",
    "Another alien with few resources in previous missions may discover a lot of resources.",
  ],
  [
    "Any changes in an alien's mine will happen slowly across multiple missions.",
    "It is best to focus on retrieving as much resources as possible.",
  ],
  [
    "An alien with a good resource mine right now will",
    "continue to have a good mine for a while.",
    "",
    "To find the alien with the best mine during each mission",
    "you must concentrate.",
  ],
];

// Rockets
instructions[10] = [
  [
    "Now that you know have practiced asking aliens for treasure, you can",
    "learn how to launch and navigate your spaceship.",
    "",
    "In each mission, you will travel from Earth to one of two planets.",
  ],
];

// Green planet
instructions[11] = [["This is the green planet."]];

// Yellow planet
instructions[12] = [["This is the yellow planet."]];

// Rockets
instructions[13] = [
  [
    "First, you must select the spaceship to launch.",
    "",
    "The spaceships can fly to either planet, but each spaceship has but one spaceship will fly mostly",
    "to the green planet, and the other spaceship will fly mostly to the yellow planet.",
  ],
  [
    "The planet a spaceship flies to most often won't change during the game.",
    "",
    "You should choose the spaceship that you think will take you to the alien",
    "with the best mine, but remember, sometimes you'll",
    "go to the other planet!",
  ],
];

// Rockets
instructions[14] = [
  [
    "Let's practice choosing spaceships before doing the full game.",
    "",
    "Remember, you still want to find as much space treasure as you can",
    "by asking an alien to share their treasure with you.",
  ],
  [
    "The aliens share somewhat randomly,",
    "but you can find the alien with the best mine at any point",
    "in the game by asking it to share!",
  ],
  [
    "How much bonus money you make is based on how much space treasure you find.",
    "",
    "This is just a practice round of 20 flights, you're not playing for money now.",
  ],
  [
    "You will have three seconds to make each choice. If you are too slow,",
    "you will see a large X appear on each rocket or alien and that choice will be over.",
  ],
  ["Don't feel rushed, but please try to make a choice every time."],
  ["Good luck! Remember that '1' selects left and '0' selects right."],
];

// Black background
instructions[15] = [
  [
    "That is the end of the practice games.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

// Hints
instructions[16] = [
  [
    "This is nearly the end of the tutorial!",
    "",
    "In the real game, the planets, aliens, and spaceships will be new colors,",
    "but the rules will be the same.",
    "",
    "The game is hard, so you will need to concentrate,",
    "but don't be afraid to trust your instincts.",
    "",
    "Here are three hints on how to play the game.",
  ],
  [
    "Hint #1:",
    "Remember which aliens have treasure. How good a mine is changes slowly,",
    "so an alien that has a lot of treasure to share now,",
    "will probably be able to share a lot in the near future.",
  ],
  [
    "Hint #2:",
    "Remember, each alien has its own mine. Just because one alien has a bad ",
    "mine and can't share very often, does not mean another has a good mine.",
    "",
    "The aliens are not trying to trick you!",
    "",
    "Your actions do not change how good a mine is," +
    "and the aliens will not hide treasure from you if they have it available.",
  ],
  [
    "Hint #3:",
    "The spaceship you choose is important because often an alien on one planet ",
    "may be better than the ones on another planet.",
    "",
    "You can find more treasure by finding the spaceship",
    "that is most likely to take you to right planet.",
  ],
];

// Pre-attention-check
instructions[17] = [
  [
    "Now it's time to make sure you know how to play.",
    "",
    "Please respond 'True' or 'False' to the questions on the next few pages.",
  ],
];

// Pre-game
instructions[18] = [
  [
    "OK! Now you know how to play.",
    "",
    "In the real game we'll count how many pieces of space treasure",
    "you find and show you at the end.",
    "",
    "Ready? Now its time to play the game! Good luck space traveler!",
  ],
];

export const firstBreak = [
  [
    `Great job so far! You have completed 1 out of 4 rounds.`,
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

export const secondBreak = [
  [
    "Awesome! You are halfway through the game.",
    "",
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

export const thirdBreak = [
  [
    "Almost done! Just 1 more round to go.",
    "",
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];
