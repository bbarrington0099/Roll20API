/**
 * Message Display Core
 * 
 * Handles the display and rendering of proximity trigger messages.
 * Works for NPCs, traps, environment effects, passive checks, and more.
 */

import { getRandomMessage } from '../utils/messageUtils.js';
import { processMessageDynamics } from '../utils/dynamicContent.js';
import { MonitoredNPC } from '../classes/MonitoredNPC.js';
import { CardStyle } from '../classes/CardStyle.js';

/**
 * Triggers and displays an NPC message with styled card.
 * Handles mode changes (once → off) and applies appropriate styling.
 * Supports dynamic content:
 * - {playerName} - Triggering character's first name
 * - {monitoredName} - NPC's name
 * - {playerName.hp} - Character attributes
 * - {monitoredName.hp} - NPC's attributes
 * - {1d6} - Dice rolls
 * - [Text](message) - Clickable buttons (can include [[rolls]], whispers, API commands)
 * 
 * @param npc - The NPC that was triggered
 * @param state - The ProximityTrigger state
 * @param playerName - The player who triggered the interaction
 * @param triggeringToken - The token that triggered the message (for attribute lookups)
 */
export function triggerNPCMessage(
    npc: MonitoredNPC,
    state: ProximityTriggerState,
    playerName: string = 'Triggerer',
    triggeringToken: Roll20Graphic | null = null
): void {
    if (!npc || npc.mode === 'off') return;

    // Handle 'once' mode
    if (npc.mode === 'once') {
        npc.mode = 'off';
    }

    const selectedMessage = getRandomMessage(npc.messages);

    // Determine card style (priority: message override > NPC default > Default)
    const defaultCardStyle = state.cardStyles.find(style => style.name === 'Default');
    let cardStyle: CardStyle | undefined = defaultCardStyle;

    if (npc.cardStyle) {
        const npcStyle = state.cardStyles.find(style => style.name === npc.cardStyle);
        if (npcStyle) cardStyle = npcStyle;
    }

    if (selectedMessage.cardStyle) {
        const msgStyle = state.cardStyles.find(style => style.name === selectedMessage.cardStyle);
        if (msgStyle) cardStyle = msgStyle;
    }

    // Ensure we have a valid card style
    if (!cardStyle) {
        cardStyle = new CardStyle('Default');
    }

    // Get display name (first name only)
    const displayName = playerName === 'Triggerer'
        ? playerName
        : playerName.split(' ')[0];

    // Process all dynamic content (rolls, attributes, buttons, playerName, monitoredName)
    const messageInfo = processMessageDynamics(
        selectedMessage.content,
        displayName,
        triggeringToken,
        npc,
        cardStyle,
        cardStyle
    );

    // Build styled HTML card
    const card = buildMessageCard(npc, messageInfo.text, cardStyle, cardStyle);

    // Determine whisper target
    const whisperPrefix = getWhisperPrefix(cardStyle.whisper, playerName);

    // Send the card
    sendChat(npc.name, `${whisperPrefix}${card}`);

    // If there are buttons, send all as one Roll20 template card with multiple buttons
    if (messageInfo.buttons && messageInfo.buttons.length > 0) {
        // Build button fields for the template
        const buttonFields = messageInfo.buttons.map((button, index) => {
            // Create a unique button ID for this interaction
            const buttonId = `${npc.name.replace(/\s+/g, '_')}_${Date.now()}_${index}`;

            // Store button data in state for callback
            if (!state.buttonCallbacks) {
                state.buttonCallbacks = {};
            }
            state.buttonCallbacks[buttonId] = {
                message: button.message,
                whisper: whisperPrefix,
                sender: npc.name
            };

            // Return button field for template
            return `{{[${button.text}](!proximitytrigger-button ${buttonId})}}`;
        }).join(' ');

        // Send all buttons as one Roll20 template card
        const buttonTemplate = `&{template:default} {{name=${displayName}'s opportunities}} ${buttonFields}`;
        sendChat(npc.name, `${whisperPrefix}${buttonTemplate}`);
    }
}

/**
 * Builds the HTML for a styled message card.
 * 
 * @param npc - The NPC
 * @param messageContent - The personalized message
 * @param cardStyle - The style to apply
 * @param defaultStyle - Fallback default style
 * @returns HTML string for the card
 */
function buildMessageCard(
    npc: MonitoredNPC,
    messageContent: string,
    cardStyle: CardStyle,
    defaultStyle: CardStyle
): string {
    const borderColor = cardStyle.borderColor || defaultStyle.borderColor;
    const bgColor = cardStyle.backgroundColor || defaultStyle.backgroundColor;
    const bubbleColor = cardStyle.bubbleColor || defaultStyle.bubbleColor;
    const textColor = cardStyle.textColor || defaultStyle.textColor;
    const badgeUrl = cardStyle.badge || defaultStyle.badge;
    const nameForClass = npc.name.trim().split(" ")[0] + "-" || "";

    let html = `<div class="${nameForClass}card" style="background: ${bgColor}; border: 3px solid ${borderColor}; ` +
        `border-radius: 10px; padding: 15px; margin: 10px; ` +
        `box-shadow: 0 4px 8px rgba(0,0,0,0.3);">`;

    // Add image if available
    if (npc.img && npc.img.trim() !== '') {
        html += `<div class="${nameForClass}card-image-container" style="text-align: center; margin-bottom: 10px;">` +
            `<img class="${nameForClass}card-image" src="${npc.img}" style="max-width: 200px; border: 4px solid ${borderColor}; ` +
            `border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">` +
            `</div>`;
    }

    // Add dialog bubble
    html += `<div class="${nameForClass}card-dialog-bubble-container" style="background: ${bubbleColor}; border: 2px solid ${borderColor}; ` +
        `border-radius: 8px; padding: 12px; position: relative;">` +
        `<div class="${nameForClass}card-dialog-bubble-arrow-border" style="position: absolute; top: -10px; left: 20px; width: 0; height: 0; ` +
        `border-left: 10px solid transparent; border-right: 10px solid transparent; ` +
        `border-bottom: 10px solid ${borderColor};"></div>` +
        `<div class="${nameForClass}card-dialog-bubble-arrow" style="position: absolute; top: -7px; left: 21px; width: 0; height: 0; ` +
        `border-left: 9px solid transparent; border-right: 9px solid transparent; ` +
        `border-bottom: 9px solid ${bubbleColor};"></div>` +
        `<p class="${nameForClass}card-dialog-bubble-speaker" style="margin: 0; color: ${textColor}; font-size: 14px; line-height: 1.6; align-items: center;">${badgeUrl ? `<img src="` + badgeUrl + `" style="height: 20px; width: 20px; border: 3px solid ${borderColor}; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"> ` : ''}` +
        `<strong>${npc.name}:</strong></p>` +
        `<p class="${nameForClass}card-dialog-bubble-content" style="margin: 8px 0 0 0; color: ${textColor}; font-size: 14px; ` +
        `line-height: 1.6; font-style: italic;">${messageContent}</p>` +
        `</div></div>`;

    return html;
}

/**
 * Determines the whisper prefix for the message.
 * 
 * @param whisperMode - The whisper setting ('off', 'character', 'gm')
 * @param playerName - The player name
 * @returns The whisper prefix or empty string
 */
function getWhisperPrefix(
    whisperMode: 'off' | 'character' | 'gm',
    playerName: string
): string {
    if (whisperMode === 'off') return '';
    if (whisperMode === 'character') return `/w ${playerName} `;
    if (whisperMode === 'gm') return '/w gm ';
    return '';
}

