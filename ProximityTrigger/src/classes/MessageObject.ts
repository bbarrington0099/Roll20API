/**
 * MessageObject
 * 
 * Represents a single message that a proximity trigger can display.
 * Works for NPCs, traps, environment effects, passive checks, and more.
 * Supports weighted random selection and per-message style overrides.
 * 
 * **Dynamic Content Support:**
 * Messages support special syntax for dynamic content:
 * - `{playerName}` - Triggering character's first name
 * - `{monitoredName}` - Monitored entity's name
 * - `{playerName.attributeName}` - Character attribute values (e.g., {playerName.hp})
 * - `{monitoredName.attributeName}` - Monitored entity's character attribute values
 * - `{1d6}`, `{2d20+3}`, `{1d8+2d6}` - Dice rolls (displayed in styled spans)
 * - `[Button Text](message)` - Creates clickable buttons that send messages to chat
 */
export class MessageObject {
    public content: string;
    public weight: number;
    public cardStyle: string | null;

    /**
     * Creates a new MessageObject.
     * 
     * @param content - The message text with optional dynamic placeholders
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

