/**
 * State Initialization
 * 
 * Initializes the ProximityTrigger state object that persists between sessions.
 */

import { CardStyle } from '../classes/CardStyle.js';

/**
 * Initializes or returns the existing ProximityTrigger state.
 * Roll20 persists the state object between game sessions.
 * 
 * @returns The ProximityTrigger state object
 */
export function initializeState(): ProximityTriggerState {
    if (!state.ProximityTrigger) {
        state.ProximityTrigger = {
            defaultImagePath: '',
            defaultDistance: 2,
            defaultTimeout: 10000,
            monitoredNPCs: {},
            cardStyles: [
                new CardStyle('Default', undefined, undefined, undefined, undefined, "off", "https://raw.githubusercontent.com/bbarrington0099/Roll20API/main/ProximityTrigger/src/ProximityTrigger.png")
            ],
            buttonCallbacks: {}
        };
    }

    // Ensure buttonCallbacks exists for existing state objects
    if (!state.ProximityTrigger.buttonCallbacks) {
        state.ProximityTrigger.buttonCallbacks = {};
    }

    return state.ProximityTrigger;
}

