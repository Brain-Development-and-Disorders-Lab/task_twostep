/**
 * Configure the experiment and create the timeline
 */
// Logging library
import consola, {LogLevel} from 'consola';

// Wrapper library
import {Experiment} from 'jspsych-wrapper';

// Experiment variables
import {
  blockLength,
  timeChoice,
  blockCount,
  rocketSides,
  practiceGameNum,
  practiceGameIdx,
  pracRocketSides,
  keyLeft,
  keyRight,
  redPlanetFirstRocket,
  displayOrderRed,
  displayOrderGreen,
  displayOrderYellow,
  displayOrderPurple,
  probability,
  practicePressingNum,
  practicePressingIdx,
  practiceRewardNum,
  practiceRewardIdx,
  payoffReward,
  practiceStochasticNum,
  practiceStochasticIdx,
  payoffInstructions,
} from './lib/variables';

// Import the instructions
import {
  firstBreak,
  instructions,
  secondBreak,
  thirdBreak,
} from './lib/instructions';

// Configuration
import {configuration} from './configuration';

// General jsPsych imports
import 'jspsych';
import 'jspsych/plugins/jspsych-preload';

// Import all our plugins
import './lib/plugins/two-step-choice';
import './lib/plugins/two-step-instructions';
import './lib/plugins/two-step-fixation';

// Import the data
import practiceProbData from './data/masterprobtut.csv';
import probData from './data/masterprob4.csv';

// Styling
import './css/styles.css';

// Instantiate the Experiment wrapper class
export const experiment = new Experiment({
  name: 'Two-step game',
  studyName: 'task_twostep',
  manipulations: {},
  stimuli: configuration.stimuli,
  seed: '',
  allowParticipantContact: false,
  contact: 'henry.burgess@wustl.edu',
  logging: LogLevel.Info,
  state: {
    practiceReward: 0,
    realReward: 0,
  },
});

experiment.load().then(() => {
  consola.info(`Experiment loaded, continuing...`);

  // Instantiate the timeline variables for the main trials
  const timelineVar = [];
  let trial = 0;

  // Reward and no reward stimuli
  const rewardString = experiment.getStimuli().getImage('t.png');
  const nullString = experiment.getStimuli().getImage('nothing.png');

  // Set the rocket configuration in the main trials
  for (let j = 0; j < blockCount; j++) {
    timelineVar.push([]);
    for (let i = 0; i < blockLength; i++) {
      // Randomize sides of rockets for each subject
      if (rocketSides) {
        timelineVar[j].push({
          right_text: 'rocket2',
          left_text: 'rocket1',
          trial: trial,
        });
      } else {
        timelineVar[j].push({
          right_text: 'rocket1',
          left_text: 'rocket2',
          trial: trial,
        });
      }
      trial = trial + 1;
    };
  };

  // Instantiate the timeline variables for the practice trials
  const practiceTimelineVar = [];
  trial = 0;

  // Set the rocket configuration in the practice trials
  for (let i = 0; i < practiceGameNum; i++) {
    // Randomize sides of rockets for each subject
    if (pracRocketSides) {
      practiceTimelineVar.push({
        right_text: 'tutrocket2',
        left_text: 'tutrocket1',
        trial: trial,
      });
    } else {
      practiceTimelineVar.push({
        right_text: 'tutrocket1',
        left_text: 'tutrocket2',
        trial: trial,
      });
    }
    trial = trial + 1;
  };

  let currStageTwo = [];

  /**
   * createBlock function
   * @param {any} currVariables variables
   * @param {any} currProbData probability data related to the
   * trials of the block
   * @param {boolean} practice whether or not the block of trials
   * are practice trials
   * @return {any} ?
   */
  const createBlock = (currVariables, currProbData, practice) => {
    // Create the generic experimental procedure for a single trial.
    // Consists of the first and second choices.
    const expProcedure = {
      timeline: [
        {
          // Instantiate the first choice
          type: 'two-step-choice',
          trial_stage: '1',
          choices: [keyLeft, keyRight],
          planet_text: experiment.getStimuli().getImage('earth.jpg'),
          right_text: jsPsych.timelineVariable('right_text'),
          left_text: jsPsych.timelineVariable('left_text'),

          // Specify if this is a practice trial or not
          practice_trial: function() {
            if (practice === false) {
              return 'real';
            }
          },

          // Define the 'on_start' callback
          on_start: function() {
            currStageTwo = [];
          },

          // Define the 'on_start' callback
          on_finish: function(data) {
            // Specify the choice made in the data
            if (data.key_press == keyLeft) {
              data.choice = 1;
            };
            if (data.key_press == keyRight) {
              data.choice = 2;
            };

            // Calcuate the transition and then the second location
            currStageTwo = calculateTransition(data.chosenText, practice);
            if (currStageTwo == null) {
              currStageTwo = [
                data.right_text,
                data.left_text,
                experiment.getStimuli().getImage('earth.jpg'),
                null,
              ];
            }
          },

          // Specify a trial duration
          trial_duration: timeChoice,
        },
        {
          // Instantiate the second choice
          type: 'two-step-choice',
          trial_stage: '2',
          choices: [keyLeft, keyRight],

          // Specify if this is a practice trial or not
          practice_trial: () => {
            if (practice === false) {
              return 'real';
            }
          },

          // Specify the trial data
          trialRow: () => {
            return currProbData[jsPsych.timelineVariable('trial', true)];
          },

          // Specify the second planet
          planet_text: () => {
            return currStageTwo[2];
          },

          // Specify the left alien?
          right_text: () => {
            return currStageTwo[0];
          },

          // Specify the right alien?
          left_text: () => {
            return currStageTwo[1];
          },

          // Specify the reward outcome
          center_text: () => {
            return currStageTwo[3];
          },

          // Specify the transition type
          transition_type: () => {
            return currStageTwo[4];
          },

          // Specify a trial duration
          trial_duration: () => {
            if (currStageTwo[3] == null) {
              return 0;
            } else {
              return timeChoice;
            }
          },

          // Define the 'on_finish' callback
          on_finish: (data) => {
            if (data.reward_text === rewardString) {
              if (practice === false) {
                experiment.setGlobalStateValue(
                    'realReward',
                    experiment.getGlobalStateValue('realReward') + 1,
                );
              } else {
                experiment.setGlobalStateValue(
                    'practiceReward',
                    experiment.getGlobalStateValue('practiceReward') + 1,
                );
              }
            }

            // Specify the choice made in the data
            if (data.key_press == keyLeft) {
              data.choice = 1;
            }
            if (data.key_press == keyRight) {
              data.choice = 2;
            }

            // Specify the transition type in the data
            if (data.transition_type == true) {
              data.transition = 'common';
            }
            if (data.transition_type == false) {
              data.transition = 'rare';
            }

            // Specify the reward outcome in the data
            if (data.reward_text ==
                experiment.getStimuli().getImage('t.png')) {
              data.reward = 1;
            } else {
              data.reward = 0;
            }

            // Store the timestamp
            const timestamp = (new Date).toISOString()
                .replace(/z|t/gi, ' ')
                .trim();
            jsPsych.data.addDataToLastTrial({timestamp});
          },
        },
        {
          // Instantiate the fixation stage
          type: 'two-step-fixation',
          stimulus: experiment.getStimuli().getImage('earth.jpg'),
          text: '+',
          trial_duration: 1000,
        },
      ],

      // Specify the timeline variables
      timeline_variables: currVariables,
    };

    return expProcedure;
  };

  /**
   * calculateTransition function
   * @param {string} chosenString chosenString
   * @param {boolean} practice practice
   * @return {any}
   */
  const calculateTransition = (chosenString, practice) => {
    let firstPlanet = '';
    let secondPlanet = '';

    if (chosenString == '') {
      return null;
    } else {
      if (practice == true) {
        firstPlanet = 'green';
        secondPlanet = 'yellow';
      } else {
        firstPlanet = 'red';
        secondPlanet = 'purple';
      }
      const firstShipChosen = (chosenString.slice(-1) == 1);
      const goodTransition = (Math.random() < probability);
      let planet = '';
      if (firstShipChosen && redPlanetFirstRocket) {
        if (goodTransition) {
          planet = firstPlanet;
        } else {
          planet = secondPlanet;
        }
      } else if (~firstShipChosen && redPlanetFirstRocket) {
        if (goodTransition) {
          planet = secondPlanet;
        } else {
          planet = firstPlanet;
        }
      } else if (firstShipChosen && ~redPlanetFirstRocket) {
        if (goodTransition) {
          planet = secondPlanet;
        } else {
          planet = firstPlanet;
        }
      } else if (~firstShipChosen && ~redPlanetFirstRocket) {
        if (goodTransition) {
          planet = firstPlanet;
        } else {
          planet = secondPlanet;
        }
      }

      let displayOrder = (1);
      if (planet === 'red') {
        if (calculateTransition==false) {
          displayOrder = displayOrderRed;
        }

        if (displayOrder) {
          return [
            'alien2',
            'alien1',
            experiment.getStimuli().getImage('redplanet1.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'alien1',
            'alien2',
            experiment.getStimuli().getImage('redplanet1.jpg'),
            chosenString,
            goodTransition,
          ];
        }
      } else if (planet === 'purple') {
        if (calculateTransition==false) {
          displayOrder = displayOrderPurple;
        }

        if (displayOrder) {
          return [
            'alien4',
            'alien3',
            experiment.getStimuli().getImage('purpleplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'alien3',
            'alien4',
            experiment.getStimuli().getImage('purpleplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        }
      } else if (planet === 'green') {
        if (calculateTransition==false) {
          displayOrder = displayOrderGreen;
        }

        if (displayOrder) {
          return [
            'tutalien2',
            'tutalien1',
            experiment.getStimuli().getImage('tutgreenplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'tutalien1',
            'tutalien2',
            experiment.getStimuli().getImage('tutgreenplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        }
      } else if (planet === 'yellow') {
        if (calculateTransition==false) {
          displayOrder = displayOrderYellow;
        }

        if (displayOrder) {
          return [
            'tutalien4',
            'tutalien3',
            experiment.getStimuli().getImage('tutyellowplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'tutalien3',
            'tutalien4',
            experiment.getStimuli().getImage('tutyellowplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        }
      } else {
        consola.error('Error in transition calculation!');
        return null;
      }
    }
  };

  // Setup the experiment timeline
  let expTimeline = [];

  // Prepare the resource collections
  const imagesLeft = [];
  const imagesRight = [];
  const imagesCenter = [];
  const imagesReward = [];
  const filesAudio = [];
  const imagesButton = [];

  // Instantiate the resource collections that accompany each
  // page of instructions
  let currInstructs;
  for (let i = 0; i < instructions.length; i += 1) {
    currInstructs = instructions[i];
    imagesLeft[i] = [];
    imagesRight[i] = [];
    imagesReward[i] = [];
    imagesCenter[i] = [];
    filesAudio[i] = [];
    imagesButton[i] = [];
    for (let j = 0; j < currInstructs.length; j += 1) {
      imagesLeft[i][j] = null;
      imagesRight[i][j] = null;
      imagesCenter[i][j] = null;
      imagesReward[i][j] = null;
      imagesButton[i][j] =
          experiment.getStimuli().getImage('button.jpeg');
    }
  }

  // Reward and no reward images
  imagesReward[3][0] = rewardString;
  imagesReward[3][1] = nullString;

  // Center images
  imagesCenter[4][0] =
      experiment.getStimuli().getImage('tutalien3_norm.png');
  imagesCenter[4][1] =
      experiment.getStimuli().getImage('tutalien3_norm.png');
  imagesCenter[9][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');

  // Rockets
  imagesRight[1][0] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesLeft[1][0] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');

  // Aliens, both sides
  imagesRight[2][0] =
      experiment.getStimuli().getImage('tutalien1_norm.png');
  imagesLeft[2][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');
  imagesRight[2][1] =
      experiment.getStimuli().getImage('tutalien1_norm.png');
  imagesLeft[2][1] =
      experiment.getStimuli().getImage('tutalien2_norm.png');
  imagesRight[2][2] =
      experiment.getStimuli().getImage('tutalien1_norm.png');
  imagesLeft[2][2] =
      experiment.getStimuli().getImage('tutalien2_norm.png');

  // Aliens, right side
  imagesRight[6][0] =
      experiment.getStimuli().getImage('tutalien1_norm.png');
  imagesRight[7][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');

  // Aliens, left side
  imagesLeft[6][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');
  imagesLeft[7][0] =
      experiment.getStimuli().getImage('tutalien1_norm.png');

  // Rockets, right side
  imagesRight[13][0] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesRight[13][1] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesRight[14][0] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesRight[14][1] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesRight[14][2] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesRight[14][3] =
      experiment.getStimuli().getImage('tutrocket1_sp.png');
  imagesRight[14][4] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesRight[14][5] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');

  // Rockets, left side
  imagesLeft[13][0] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');
  imagesLeft[13][1] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');
  imagesLeft[14][0] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');
  imagesLeft[14][1] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');
  imagesLeft[14][2] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');
  imagesLeft[14][3] =
      experiment.getStimuli().getImage('tutrocket2_sp.png');
  imagesLeft[14][4] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');
  imagesLeft[14][5] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');

  // Backgrounds used throughout the instructions
  const instructionsBackgrounds = [
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('tutyellowplanet.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('tutyellowplanet.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
  ];

  let t;
  let currPage;
  let currSide;

  /**
   * Utility function to assemble instructions, combining text and images
   * @param {string} image stimulus
   * @param {string[]} texts main prompt used
   * @param {string[]} sectRightTexts right stimulus
   * @param {string[]} sectLeftTexts left stimulus
   * @param {string[]} sectCenterTexts center stimulus
   * @param {string[]} sectRewardTexts reward stimlus
   * @return {any[]}
   */
  const createInstructions = (
      image, texts, sectRightTexts,
      sectLeftTexts, sectCenterTexts, sectRewardTexts,
  ) => {
    'use strict';

    // Instantitate and create the pages of the instructions
    const instructionPages = [];
    for (t = 0; t < texts.length; t += 1) {
      // Collate the specifict texts and images
      // for the instruction page
      currPage = {
        type: 'two-step-instructions',
        stimulus: image,
        right_text: sectRightTexts[t],
        left_text: sectLeftTexts[t],
        center_text: sectCenterTexts[t],
        rewardString: sectRewardTexts[t],
        choices: jsPsych.ALL_KEYS,
        prompt: texts[t],
      };
      instructionPages.push(currPage);
    }

    return instructionPages;
  };

  // Create all instruction pages
  let currInstructions = [];
  for (let i = 0; i < instructions.length; i += 1) {
    currInstructions = currInstructions.concat(
        createInstructions(
            instructionsBackgrounds[i],
            instructions[i],
            imagesRight[i],
            imagesLeft[i],
            imagesCenter[i],
            imagesReward[i],
            imagesButton[i],
        ),
    );
  }

  // Create practice trials for selecting between aliens
  for (let i = 0; i < (practicePressingNum - 1); i += 1) {
    currInstructions.splice(practicePressingIdx, 0, {
      type: 'two-step-choice',
      timeout: false,
      choices: [keyLeft, keyRight],
      planet_text:
        experiment.getStimuli().getImage('tutgreenplanet.jpg'),
      right_text: 'tutalien1',
      left_text: 'tutalien2',
      prompt: ['Now try another one!'],
      trial_duration: timeChoice,
    });
  }

  currInstructions.splice(practicePressingIdx, 0, {
    type: 'two-step-choice',
    timeout: false,
    choices: [keyLeft, keyRight],
    planet_text: experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    right_text: 'tutalien1',
    left_text: 'tutalien2',
    trial_duration: timeChoice,
  });

  // Create practice trials to select a single alien and view reward outcome
  for (let i = 0; i < practiceRewardNum; i += 1) {
    currInstructions.splice(practiceRewardIdx, 0, {
      type: 'two-step-choice',
      timeout: false,
      trialRow: payoffReward,
      choices: [keyLeft, keyRight],
      planet_text:
        experiment.getStimuli().getImage('tutyellowplanet.jpg'),

      // Right alien image
      right_text: () => {
        if (currSide === true) {
          return 'tutalien3';
        }
        return null;
      },

      // Left alien image
      left_text: () => {
        if (currSide === true) {
          return null;
        }
        return 'tutalien3';
      },
      trial_duration: timeChoice,
    });
  }

  // Create practice trials for selecting between aliens
  for (let i = 0; i < practiceStochasticNum; i += 1) {
    currInstructions.splice(practiceStochasticIdx, 0, {
      type: 'two-step-choice',
      timeout: false,
      trialRow: payoffInstructions,
      choices: [keyLeft, keyRight],
      planet_text:
        experiment.getStimuli().getImage('tutgreenplanet.jpg'),
      right_text: 'tutalien1',
      left_text: 'tutalien2',
      trial_duration: timeChoice,
    });
  }

  // Insert practice trials into instructions
  currInstructions.splice(practiceGameIdx, 0,
      createBlock(practiceTimelineVar, practiceProbData, true));

  // Insert the three quizzes before the last element in `currInstructions`
  // currInstructions.push(createInstructions(
  //     experiment.getStimuli().getImage('blackbackground.jpg'),
  //     breakText[0],
  // ));

  // Instantiate the experiment timeline with the instructions and
  // practice trials
  expTimeline = currInstructions;

  // Create the remaining blocks of the timeline
  expTimeline.push(createBlock(timelineVar[0], probData, false));

  // Insert break 1
  expTimeline.push(createInstructions(
      experiment.getStimuli().getImage('blackbackground.jpg'),
      firstBreak,
      [], [], [], [],
  )[0]);

  expTimeline.push(createBlock(timelineVar[1], probData, false));

  // Insert break 2
  expTimeline.push(createInstructions(
      experiment.getStimuli().getImage('blackbackground.jpg'),
      secondBreak,
      [], [], [], [],
  )[0]);

  expTimeline.push(createBlock(timelineVar[2], probData, false));

  // Insert break 3
  expTimeline.push(createInstructions(
      experiment.getStimuli().getImage('blackbackground.jpg'),
      thirdBreak,
      [], [], [], [],
  )[0]);

  expTimeline.push(createBlock(timelineVar[3], probData, false));
  // Question about the rockets
  // Finish

  // Start the experiment
  consola.info('Experiment timeline:', expTimeline);
  experiment.start({
    timeline: expTimeline,
  });
});
