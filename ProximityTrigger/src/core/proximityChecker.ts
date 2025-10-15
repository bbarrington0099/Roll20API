/**
 * Proximity Checker Core
 * 
 * Handles proximity detection and activation of trigger messages.
 * Works for NPCs, traps, environment effects, passive checks, and more.
 */

import { calculateDistance } from '../utils/distanceUtils.js';
import { getPlayerNameFromToken } from '../utils/tokenUtils.js';
import { triggerNPCMessage } from './messageDisplay.js';
import { triggeredTokens } from '../state/triggeredTokens.js';

/**
 * Checks all monitored triggers for proximity when a token moves.
 * Activates triggers if tokens are within range and not on cooldown.
 * 
 * @param movedToken - The token that moved
 * @param state - The ProximityTrigger state
 */
export function checkAllProximities(
    movedToken: Graphic,
    state: ProximityTriggerState
): void {
    const movedId = movedToken.id;
    const pageId = movedToken.get('pageid');
    const movedCenterX = movedToken.get('left') + movedToken.get('width') / 2;
    const movedCenterY = movedToken.get('top') + movedToken.get('height') / 2;
    const playerName = getPlayerNameFromToken(movedToken);

    // Check each monitored entity
    Object.entries(state.monitoredNPCs).forEach(([_, npc]) => {
        // Skip if this entity doesn't have any tokens
        if (!npc.tokenIds || npc.tokenIds.length === 0) return;

        // Check each token representing this entity
        npc.tokenIds.forEach(tokenId => {
            // Skip if the moved token is one of this entity's tokens
            if (tokenId === movedId) return;

            const npcToken = getObj('graphic', tokenId) as Graphic | undefined;
            if (!npcToken) return;

            // Skip if not on same page
            if (npcToken.get('pageid') !== pageId) return;

            // Calculate entity token position
            const npcCenterX = npcToken.get('left') + npcToken.get('width') / 2;
            const npcCenterY = npcToken.get('top') + npcToken.get('height') / 2;

            const distance = calculateDistance(npcCenterX, npcCenterY, movedCenterX, movedCenterY);
            const threshold = npc.triggerDistance * npcToken.get('width') + (npcToken.get('width') / 2);

            // Use token ID in the trigger key to track each token separately
            const key = movedId + '_' + tokenId;

            if (distance <= threshold && !triggeredTokens[key]) {
                triggerNPCMessage(npc, state, playerName, movedToken);
                triggeredTokens[key] = true;

                // Set timeout to clear the trigger
                (globalThis as any).setTimeout(() => {
                    if (npc.timeout !== 0) delete triggeredTokens[key];
                }, npc.timeout > 0 ? npc.timeout : 1);
            }
        });
    });
}

