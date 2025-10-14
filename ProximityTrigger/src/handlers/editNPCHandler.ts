/**
 * Edit NPC Handler
 * 
 * Handles editing properties of monitored NPCs.
 */

import { toSafeName, fromSafeName } from '../utils/nameUtils.js';
import { showEditMonitorNPCDialog } from './monitorHandler.js';
import { MonitoredNPC } from '../classes/MonitoredNPC.js';

/**
 * Edits properties of a monitored NPC via chat command.
 * Usage: !pt -e <NPC_Name> <prop> <value>
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleEditNPC(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const args = msg.content.trim().split(' ');
    const safeName = args[2];
    const npcName = fromSafeName(safeName);
    const npc = state.monitoredNPCs[safeName];

    if (!npc) {
        sendChat('Proximity Trigger', `/w ${who} Monitored NPC "${npcName}" not found.`);
        return;
    }

    // If no property given, open edit dialog
    if (args.length < 4) {
        // Try to get one of the tokens for this NPC
        let token: Graphic | null = null;
        if (npc.tokenIds && npc.tokenIds.length > 0) {
            token = getObj('graphic', npc.tokenIds[0]) as Graphic | null;
        }
        showEditMonitorNPCDialog({ who: who, content: msg.content } as ChatMessage, token, state);
        return;
    }

    const property = args[3].toLowerCase();

    // Show input prompts if no value provided
    if (args.length < 5) {
        showPropertyInputPrompt(msg, npc, property, state);
        return;
    }

    // Set the property value
    const value = args.slice(4).join(' ').trim();
    setNPCProperty(msg, npc, property, value, state);
}

/**
 * Shows an input prompt for a specific NPC property.
 * 
 * @param msg - The chat message object
 * @param npc - The NPC being edited
 * @param property - The property to edit
 * @param state - The ProximityTrigger state
 */
function showPropertyInputPrompt(
    msg: ChatMessage,
    npc: MonitoredNPC,
    property: string,
    state: ProximityTriggerState
): void {
    const who = msg.who || 'gm';
    const safeName = toSafeName(npc.name);

    switch (property) {
        case 'cardstyle':
            // List all styles for user to pick
            const styleList = state.cardStyles.map(s =>
                `{{[${s.name}](!pt -e ${safeName} cardStyle ${s.name})}}`
            ).join(' ');
            sendChat('Proximity Trigger',
                `/w ${who} &{template:default} ` +
                `{{name=Select Card Style for ${npc.name}}} ${styleList}`
            );
            break;

        case 'triggerdistance':
            const currDist = npc.triggerDistance;
            sendChat('Proximity Trigger',
                `/w ${who} &{template:default} {{name=Set Distance for ${npc.name}}} ` +
                `{{Current: ${currDist}}} ` +
                `{{Distance (token widths)=[Click Here](!pt -e ${safeName} triggerDistance ?{Distance|${currDist}})}}`
            );
            break;

        case 'timeout':
            const currTimeout = npc.timeout;
            sendChat('Proximity Trigger',
                `/w ${who} &{template:default} {{name=Set Timeout for ${npc.name}}} ` +
                `{{Current: ${currTimeout} ms}} ` +
                `{{Timeout (ms)=[Click Here](!pt -e ${safeName} timeout ?{Timeout|${currTimeout}})}}`
            );
            break;

        case 'img':
            const imgUrl = npc.img || 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/GuildEmblem.png';
            sendChat('Proximity Trigger',
                `/w ${who} &{template:default} {{name=Set Image URL for ${npc.name}}} ` +
                `{{Current: [Link](${npc.img || 'none'})}} ` +
                `{{New URL=[Click Here](!pt -e ${safeName} img ?{Enter new image URL|${imgUrl}})}}`
            );
            break;

        case 'mode':
            const currMode = npc.mode || 'on';
            sendChat('Proximity Trigger',
                `/w ${who} &{template:default} {{name=Set Mode for ${npc.name}}} ` +
                `{{Current: ${currMode}}} ` +
                `{{New Mode=[Click Here](!pt -e ${safeName} mode ?{Enter new Mode ^on, off, once^|${currMode}})}}`
            );
            break;

        default:
            sendChat('Proximity Trigger', `/w ${who} Unknown property "${property}".`);
    }
}

/**
 * Sets an NPC property to a new value.
 * 
 * @param msg - The chat message object
 * @param npc - The NPC being edited
 * @param property - The property to set
 * @param value - The new value
 * @param state - The ProximityTrigger state
 */
function setNPCProperty(
    msg: ChatMessage,
    npc: MonitoredNPC,
    property: string,
    value: string,
    state: ProximityTriggerState
): void {
    const who = msg.who || 'gm';
    const tokenCount = npc.tokenIds ? npc.tokenIds.length : 0;
    const tokenInfo = tokenCount > 0
        ? ` (Applied to ${tokenCount} token${tokenCount !== 1 ? 's' : ''})`
        : '';

    switch (property) {
        case 'triggerdistance':
            const dist = parseFloat(value);
            if (isNaN(dist) || dist <= 0) {
                sendChat('Proximity Trigger',
                    `/w ${who} Invalid distance. Using default ${state.defaultDistance}.`
                );
                npc.triggerDistance = state.defaultDistance || 2;
            } else {
                npc.triggerDistance = dist;
                sendChat('Proximity Trigger',
                    `/w ${who} ${npc.name} trigger distance set to ${dist}${tokenInfo}.`
                );
            }
            break;

        case 'timeout':
            const timeout = parseInt(value);
            if (isNaN(timeout) || timeout < 0) {
                sendChat('Proximity Trigger',
                    `/w ${who} Invalid timeout. Using default ${state.defaultTimeout}.`
                );
                npc.timeout = state.defaultTimeout || 10000;
            } else {
                npc.timeout = timeout;
                sendChat('Proximity Trigger',
                    `/w ${who} ${npc.name} timeout set to ${timeout}ms${tokenInfo}.`
                );
            }
            break;

        case 'img':
            npc.img = value;
            sendChat('Proximity Trigger',
                `/w ${who} ${npc.name} image URL updated${tokenInfo}.`
            );
            break;

        case 'cardstyle':
            const style = state.cardStyles.find(s =>
                s.name.toLowerCase() === value.toLowerCase()
            );
            if (!style) {
                sendChat('Proximity Trigger',
                    `/w ${who} Card style "${value}" not found. ` +
                    `Use --cardstyles to list available styles.`
                );
            } else {
                npc.cardStyle = style.name;
                sendChat('Proximity Trigger',
                    `/w ${who} ${npc.name} style set to ${style.name}${tokenInfo}.`
                );
            }
            break;

        case 'mode':
            const mode = value.toLowerCase() as 'on' | 'off' | 'once';
            if (mode !== 'on' && mode !== 'off' && mode !== 'once') {
                sendChat('Proximity Trigger',
                    `/w ${who} Mode ${value} not supported, defaulting to 'on'.`
                );
                npc.mode = 'on';
            } else {
                npc.mode = mode;
                sendChat('Proximity Trigger',
                    `/w ${who} ${npc.name} mode set to ${npc.mode}${tokenInfo}.`
                );
            }
            break;

        default:
            sendChat('Proximity Trigger', `/w ${who} Unknown property "${property}".`);
    }
}

