/**
 * PresetNPC
 * 
 * Defines a template/preset for a proximity trigger with pre-configured messages and settings.
 * Used for quick setup of commonly used triggers (NPCs, traps, environment effects, etc.).
 * The name "PresetNPC" is kept for backward compatibility, but applies to all trigger types.
 */

import { MessageObject } from './MessageObject.js';

export class PresetNPC {
    public readonly name: string;
    public readonly distance: number;
    public readonly messages: MessageObject[];
    public readonly img: string | null;
    public readonly cardStyle: string;
    public readonly timeout: number;

    /**
     * Creates a new PresetNPC template.
     * 
     * @param name - The trigger's display name
     * @param distance - Trigger distance in token body widths
     * @param messages - Array of possible messages
     * @param img - URL to portrait/image (null to hide image)
     * @param cardStyle - Default card style name
     * @param timeout - Cooldown in ms (0 = permanent)
     */
    constructor(
        name: string,
        distance: number = 2,
        messages: MessageObject[] = [],
        img: string | null = null,
        cardStyle: string = 'Default',
        timeout: number = 10000
    ) {
        this.name = name;
        this.distance = distance;
        this.messages = messages;
        this.img = img;
        this.cardStyle = cardStyle;
        this.timeout = timeout;
    }
}

