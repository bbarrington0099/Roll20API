/**
 * MessageObject
 * 
 * Represents a single message that a proximity trigger can display.
 * Works for NPCs, traps, environment effects, passive checks, and more.
 * Supports weighted random selection and per-message style overrides.
 */
export class MessageObject {
    public content: string;
    public weight: number;
    public cardStyle: string | null;

    /**
     * Creates a new MessageObject.
     * 
     * @param content - The message text (supports {playerName} placeholder)
     * @param weight - Relative probability weight (0 = disabled, higher = more likely)
     * @param cardStyle - Optional style override for this specific message
     */
    constructor(
        content: string,
        weight: number = 1,
        cardStyle: string | null = null
    ) {
        this.content = content;
        this.weight = weight;
        this.cardStyle = cardStyle;
    }
}

