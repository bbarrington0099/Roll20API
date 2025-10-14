/**
 * List Card Styles Handler
 * 
 * Displays all available card styles with edit links.
 */

import { toSafeName } from '../utils/nameUtils.js';

/**
 * Lists all card styles or allows creation of new ones.
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleListCardStyles(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const list = state.cardStyles.map(s =>
        `{{[${s.name}](!pt -C ${toSafeName(s.name)})}}`
    ).join(' ');

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Card Styles}} ` +
        `{{[Create New](!pt -C new)}} ${list}`
    );
}

