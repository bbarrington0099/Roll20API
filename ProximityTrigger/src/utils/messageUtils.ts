/**
 * Message Utilities
 * 
 * Functions for selecting and personalizing proximity trigger messages.
 */

import { MessageObject } from '../classes/MessageObject.js';

/**
 * Selects a random message from an array using weighted probability.
 * Messages with weight 0 or negative are excluded from selection.
 * 
 * @param messages - Array of message objects with weights
 * @returns The selected message (or default if none available)
 */
export function getRandomMessage(messages: MessageObject[]): MessageObject {
    if (!messages || messages.length === 0) {
        return new MessageObject('They are lost in thought...', 1);
    }

    // Filter out messages with weight 0 or negative
    const validMessages = messages.filter(m => {
        const weight = (m.weight !== undefined && m.weight !== null) ? m.weight : 1;
        return weight > 0;
    });

    if (validMessages.length === 0) {
        return new MessageObject('They are lost in thought...', 1);
    }

    // Build weighted pool for random selection
    const pool: MessageObject[] = [];
    validMessages.forEach(m => {
        const weight = (m.weight !== undefined && m.weight !== null) ? m.weight : 1;
        for (let i = 0; i < weight; i++) {
            pool.push(m);
        }
    });

    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Personalizes a message by replacing placeholders with actual values.
 * Currently supports {playerName} placeholder.
 * 
 * @param messageContent - The message template with placeholders
 * @param playerName - The player name to insert
 * @returns The personalized message
 */
export function personalizeMessage(
    messageContent: string,
    playerName: string
): string {
    // Use first name only if full name provided
    const firstName = playerName === 'Guild Member'
        ? playerName
        : playerName.split(' ')[0];

    return messageContent.replace(/{playerName}/g, firstName);
}

