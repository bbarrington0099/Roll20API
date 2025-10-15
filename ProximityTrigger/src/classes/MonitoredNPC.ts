/**
 * MonitoredNPC
 * 
 * Represents an actively monitored proximity trigger in the game.
 * Can be used for NPCs, traps, environment effects, passive checks, and more.
 * Multiple tokens can share the same trigger configuration.
 * The name "MonitoredNPC" is kept for backward compatibility.
 */

import { MessageObject } from './MessageObject.js';

export class MonitoredNPC {
    public readonly name: string;
    public triggerDistance: number;
    public tokenIds: string[];
    public timeout: number;
    public img: string | null;
    public messages: MessageObject[];
    public cardStyle: string;
    public mode: 'on' | 'off' | 'once';

    /**
     * Creates a new MonitoredNPC.
     * 
     * @param name - The trigger's display name
     * @param triggerDistance - Trigger distance in token body widths
     * @param tokenIds - Array of Roll20 token IDs representing this trigger
     * @param timeout - Cooldown in ms before re-triggering (0 = permanent)
     * @param img - Portrait/image URL (null to hide image)
     * @param messages - Array of possible messages
     * @param cardStyle - Card style name for this trigger
     * @param mode - Operating mode: 'on', 'off', or 'once'
     */
    constructor(
        name: string,
        triggerDistance: number = 2,
        tokenIds: string[] = [],
        timeout: number = 10000,
        img: string | null = 'https://raw.githubusercontent.com/bbarrington0099/Roll20API/main/ProximityTrigger/src/ProximityTrigger.png',
        messages: MessageObject[] = [],
        cardStyle: string = 'Default',
        mode: 'on' | 'off' | 'once' = 'on'
    ) {
        this.name = name;
        this.triggerDistance = triggerDistance;
        this.tokenIds = tokenIds;
        this.timeout = timeout;
        this.img = img;
        this.messages = messages;
        this.cardStyle = cardStyle;
        this.mode = mode;
    }
}

