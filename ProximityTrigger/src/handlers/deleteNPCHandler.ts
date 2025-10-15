/**
 * Delete NPC Handler
 * 
 * Removes a monitored entity from monitoring and clears its triggers.
 */

import { toSafeName, fromSafeName } from '../utils/nameUtils.js';
import { triggeredTokens } from '../state/triggeredTokens.js';

/**
 * Deletes a monitored NPC or shows a menu of NPCs to delete.
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleDeleteNPC(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const args = msg.content.trim().split(' ');

    // If no name provided, list NPCs to delete
    if (args.length < 3) {
        const entries = Object.values(state.monitoredNPCs);
        if (entries.length === 0) {
            sendChat('Proximity Trigger', `/w ${who} No NPCs are monitored.`);
            return;
        }

        const menu = entries.map(npc =>
            `{{[${npc.name}](!pt -D ${toSafeName(npc.name)})}}`
        ).join(' ');

        sendChat('Proximity Trigger',
            `/w ${who} &{template:default} {{name=Delete Monitored NPC}} ${menu}`
        );
        return;
    }

    const safeName = args[2];
    const name = fromSafeName(safeName);
    const npc = state.monitoredNPCs[safeName];

    if (!npc) {
        sendChat('Proximity Trigger', `/w ${who} Monitored NPC "${name}" not found.`);
        return;
    }

    // Clear any pending triggers for all tokens of this NPC
    if (npc.tokenIds) {
        npc.tokenIds.forEach(tokenId => {
            Object.keys(triggeredTokens).forEach(key => {
                if (key.includes(tokenId)) {
                    delete triggeredTokens[key];
                }
            });
        });
    }

    delete state.monitoredNPCs[safeName];
    sendChat('Proximity Trigger', `/w ${who} Removed "${npc.name}" from monitoring.`);
}

