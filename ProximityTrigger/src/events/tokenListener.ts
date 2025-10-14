/**
 * Token Listener
 * 
 * Handles token-related events (movement, creation, destruction).
 */

import { checkAllProximities } from '../core/proximityChecker.js';
import { getTokenEffectiveName } from '../utils/tokenUtils.js';
import { toSafeName } from '../utils/nameUtils.js';
import { triggeredTokens } from '../state/triggeredTokens.js';

/**
 * Sets up all token-related event listeners.
 * 
 * @param state - The ProximityTrigger state
 */
export function setupTokenListeners(state: ProximityTriggerState): void {
    // Monitor token movement
    on('change:graphic', function (token: Graphic, prev: any) {
        // Only check tokens that have moved
        if (token.get('left') !== prev.left || token.get('top') !== prev.top) {
            checkAllProximities(token, state);
        }
    });

    // Monitor when new graphics are added to the page
    on('add:graphic', function (token: Graphic) {
        if (token.get('subtype') !== 'token') return;

        const tokenName = getTokenEffectiveName(token);
        if (!tokenName) return; // Skip if no name found

        const safeName = toSafeName(tokenName);

        // Check if this token should be monitored
        const monitoredNPC = state.monitoredNPCs[safeName];
        if (monitoredNPC) {
            // Add this token ID to the monitored trigger if not already there
            if (!monitoredNPC.tokenIds.includes(token.id)) {
                monitoredNPC.tokenIds.push(token.id);
                log(`Added token ${token.id} to monitored trigger ${tokenName}`);
            }
        }
    });

    // Monitor when graphics are destroyed
    on('destroy:graphic', function (token: Graphic) {
        if (token.get('subtype') !== 'token') return;

        const tokenName = getTokenEffectiveName(token);
        if (!tokenName) return; // Skip if no name found

        const safeName = toSafeName(tokenName);

        // Remove this token ID from the monitored NPC if it exists
        const monitoredNPC = state.monitoredNPCs[safeName];
        if (monitoredNPC && monitoredNPC.tokenIds) {
            const index = monitoredNPC.tokenIds.indexOf(token.id);
            if (index > -1) {
                monitoredNPC.tokenIds.splice(index, 1);
                log(`Removed token ${token.id} from monitored NPC ${tokenName}`);

                // Clear any triggered tokens for this token
                Object.keys(triggeredTokens).forEach(key => {
                    if (key.includes(token.id)) {
                        delete triggeredTokens[key];
                    }
                });
            }
        }
    });
}

