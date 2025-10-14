/**
 * Trigger Handler
 * 
 * Manually triggers an NPC message display.
 */

import { getTokenFromCall, getTokenEffectiveName } from '../utils/tokenUtils.js';
import { toSafeName, fromSafeName } from '../utils/nameUtils.js';
import { triggerNPCMessage } from '../core/messageDisplay.js';

/**
 * Handles manual triggering of NPC messages.
 * Can trigger from selected token, named NPC, or show selection menu.
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleTrigger(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const args = msg.content.trim().split(/\s+/);
    const token = getTokenFromCall(msg, fromSafeName);

    // If a token is selected → trigger its monitored NPC
    if (token) {
        const tokenName = getTokenEffectiveName(token);
        const safeName = toSafeName(tokenName);
        const monitoredNPC = state.monitoredNPCs[safeName];

        if (!monitoredNPC) {
            sendChat('Proximity Trigger',
                `/w ${who} Token "${tokenName}" is not a monitored NPC.`
            );
            return;
        }

        triggerNPCMessage(monitoredNPC, state);
        return;
    }

    // No token selected → try by name argument
    if (args.length > 2) {
        const safeName = args.slice(2).join('_');
        const monitoredNPC = state.monitoredNPCs[safeName];

        if (monitoredNPC) {
            triggerNPCMessage(monitoredNPC, state);
            return;
        }
    }

    // No token and no matching name → list all monitored NPCs
    const npcEntries = Object.entries(state.monitoredNPCs);
    if (npcEntries.length === 0) {
        sendChat('Proximity Trigger',
            `/w ${who} No monitored NPCs are currently active.`
        );
        return;
    }

    const npcButtons = npcEntries.map(([safeName, npc]) =>
        `{{[${npc.name}](!pt -t ${safeName})}}`
    ).join(' ');

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Trigger a Monitored NPC}} ${npcButtons}`
    );
}

