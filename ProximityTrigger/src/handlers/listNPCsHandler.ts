/**
 * List Triggers Handler
 * 
 * Displays all currently monitored triggers with their settings.
 */

import { toSafeName } from '../utils/nameUtils.js';

/**
 * Lists all monitored triggers with clickable links to edit them.
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleListNPCs(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const monitored = Object.values(state.monitoredNPCs);

    if (monitored.length === 0) {
        sendChat('Proximity Trigger',
            `/w ${who} No triggers are currently monitored. Use !pt --monitor to add one.`
        );
        return;
    }

    const list = monitored.map(npc => {
        const safeName = toSafeName(npc.name);
        return `{{[${npc.name}](!pt -M ${safeName})=` +
            `(Mode: ${npc.mode}, Dist: ${npc.triggerDistance}, ` +
            `Timeout: ${npc.timeout}ms, Messages: ${npc.messages.length}, ` +
            `Style: ${npc.cardStyle})}}`;
    }).join(' ');

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Monitored Triggers}} ${list}`
    );
}

