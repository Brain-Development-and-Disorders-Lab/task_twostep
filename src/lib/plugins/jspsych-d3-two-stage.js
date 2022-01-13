/**
 *
 * plugin for displaying a stimulus and then a second image
 * given a keyboard response
 *
 * VF 8/2019
 *
 **/
import {select} from 'd3';
import consola from 'consola';

jsPsych.plugins['d3-two-stage'] = (() => {
  const plugin = {};

  plugin.info = {
    name: 'd3-two-stage',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        array: false,
        description: 'The image to be displayed.',
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: [32],
        description: 'Key press we\'re looking for.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.',
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
    },
  };

  plugin.trial = function(display_element, trial) {
    consola.debug(`Running trial:`, trial.type);

    /** WARNING this is manually made to fit robot images 720×540,
     *  will not work on mobile or very small screens
     **/
    const new_html = `
        <div id = 'two-stage'>
          <svg
            id='jspsych-d3-keyboard-response-stimulus-canvas'
            height='720'
            width='540'
          >
            <image xlink:href='${trial.stimuli} height='720' width='540'/>
          </svg>
        </div>
    `;

    // draw
    display_element.innerHTML = new_html;
    const svg = select('svg'); // draw and select svg element

    // store response
    let response = {
      rt: null,
      key: null,
    };

    const responses = {
      rt: [],
      key: [],
    };

    let choice_pressed = 0;

    // function to end trial when it is time
    const end_trial = () => {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      const trial_data = {
        'rt': response.rt,
        'stimulus': trial.stimuli,
        'key_press': response.key,
        'duration': trial.trial_duration,
        'choice_pressed': choice_pressed,
        'rts': responses.rt,
        'keys': responses.key,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    const after_response = (info) => {
      // only record the first response
      if (response.key == null) {
        // only if it is the first press do we want to draw the pressed
        // button and register the press to the subject
        if (trial.choices.indexOf(info.key) > -1) { // changed for array
          response = info;
          choice_pressed = 1;
          // after a valid response, the stimulus will have the
          // CSS class 'responded' which can be used to provide visual
          // feedback that a response was recorded
          display_element.querySelector('#two-stage').className += ' responded';
          // draw the black circle
          svg.append('circle')
              .attr('cx', 269)
              .attr('cy', 362)
              .attr('r', 30)
              .style('fill', 'black');
        }
      }
      responses.rt.push(info.rt);
      responses.key.push(info.key);
    };

    // start the response listener
    const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: jsPsych.ALL_KEYS,
      rt_method: 'date',
      persist: true,
      allow_held_key: false,
    });

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(() => {
        display_element.querySelector('#two-stage').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(() => {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();
