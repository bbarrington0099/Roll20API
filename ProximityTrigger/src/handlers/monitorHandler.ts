/**
 * Monitor Handler
 * 
 * Handles adding/editing NPCs to the monitoring system.
 */

import { MonitoredNPC } from '../classes/MonitoredNPC.js';
import { getTokenFromCall, getTokenEffectiveName, getBestTokenImage } from '../utils/tokenUtils.js';
import { toSafeName, fromSafeName } from '../utils/nameUtils.js';

/**
 * Handles the --monitor command.
 * Can create new monitored NPCs or open edit dialogs for existing ones.
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleMonitor(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who;
    const token = getTokenFromCall(msg, fromSafeName);

    if (token) {
        const tokenName = getTokenEffectiveName(token);
        const safeName = toSafeName(tokenName);

        // Create or edit monitored entry
        if (!state.monitoredNPCs[safeName]) {
            createMonitoredNPCFromToken(msg, token, state);
        } else {
            showEditMonitorNPCDialog(msg, token, state);
        }
        return;
    }

    // If no token given, show a menu of tokens on the page
    const tokens = findObjs({ type: 'graphic', subtype: 'token', layer: 'objects' }) as Graphic[];
    if (tokens.length === 0) {
        sendChat('Proximity Trigger', `/w ${who} No tokens found to monitor on this page.`);
        return;
    }

    const menu = tokens.map(t => {
        const name = getTokenEffectiveName(t);
        if (!name) return ''; // Skip tokens with no name
        return `{{[${name}](!pt -M ${toSafeName(name)})}}`;
    }).filter(item => item !== '').join(' ');

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Select Token to Monitor}} ${menu}`
    );
}

/**
 * Creates a new MonitoredNPC from a token and opens its edit dialog.
 * 
 * @param msg - The chat message object
 * @param token - The token to monitor
 * @param state - The ProximityTrigger state
 */
function createMonitoredNPCFromToken(
    msg: ChatMessage,
    token: Graphic,
    state: ProximityTriggerState
): void {
    const name = getTokenEffectiveName(token);
    if (!name) {
        sendChat('Proximity Trigger',
            `/w ${msg.who} Token has no name and doesn't represent a named character.`
        );
        return;
    }

    const safeName = toSafeName(name);

    // Check if this NPC already exists
    if (state.monitoredNPCs[safeName]) {
        // Add this token to the existing NPC if not already there
        const monitoredNPC = state.monitoredNPCs[safeName];
        if (!monitoredNPC.tokenIds.includes(token.id)) {
            monitoredNPC.tokenIds.push(token.id);
            sendChat('Proximity Trigger',
                `/w ${msg.who} Added token to existing monitored NPC "${name}".`
            );
        }
    } else {
        // Create a new monitored NPC with this token
        state.monitoredNPCs[safeName] = new MonitoredNPC(
            name,
            state.defaultDistance || 2,
            [token.id],
            state.defaultTimeout || 10000,
            getBestTokenImage(token, state),
            [],
            state.cardStyles[0].name || 'Default',
            'on'
        );
    }

    showEditMonitorNPCDialog(msg, token, state);
}

/**
 * Displays the edit dialog for a monitored NPC with clickable property fields.
 * 
 * @param msg - The chat message object
 * @param token - Optional token (can also look up by name)
 * @param state - The ProximityTrigger state
 */
export function showEditMonitorNPCDialog(
    msg: ChatMessage,
    token: Graphic | null,
    state: ProximityTriggerState
): void {
    let npc: MonitoredNPC | undefined;
    let safeName: string;

    if (token) {
        const tokenName = getTokenEffectiveName(token);
        safeName = toSafeName(tokenName);
        npc = state.monitoredNPCs[safeName];
        if (!npc) {
            sendChat('Proximity Trigger',
                `/w ${msg.who} Token "${tokenName}" is not monitored.`
            );
            return;
        }
    } else {
        // Try to find NPC by name from message args
        const args = msg.content.trim().split(' ');
        if (args.length > 2) {
            const npcName = fromSafeName(args[2]);
            safeName = toSafeName(npcName);
            npc = state.monitoredNPCs[safeName];
            if (!npc) {
                sendChat('Proximity Trigger',
                    `/w ${msg.who} NPC "${npcName}" is not monitored.`
                );
                return;
            }
        } else {
            sendChat('Proximity Trigger', `/w ${msg.who} Please specify an entity to edit.`);
            return;
        }
    }

    // Build clickable fields for each property
    const properties = [
        { label: 'Mode', attr: 'mode' },
        { label: 'Trigger Distance ^in token widths^', attr: 'triggerDistance' },
        { label: 'Timeout (ms)', attr: 'timeout' },
        { label: 'Image URL', attr: 'img' },
        { label: 'Card Style', attr: 'cardStyle' },
        { label: 'Messages', attr: 'messages' }
    ];

    const buttons = properties.map(prop =>
        `{{[${prop.label}](!pt -M ${safeName} ${prop.attr})}}`
    ).join(' ');

    const tokenCount = npc.tokenIds ? npc.tokenIds.length : 0;
    sendChat('Proximity Trigger',
        `/w ${msg.who} &{template:default} {{name=Edit NPC: ${npc.name}}} ` +
        `{{Tokens: ${tokenCount}}} ${buttons} ` +
        `{{[Delete Monitor](!pt -D ${safeName})}}`
    );
}

