/**
 * CardStyle
 * 
 * Represents a visual style configuration for proximity trigger message cards.
 * Defines colors, formatting, and whisper behavior for message display.
 * Used for all trigger types: NPCs, traps, environment effects, and more.
 */
export class CardStyle {
    public readonly name: string;
    public borderColor: string;
    public backgroundColor: string;
    public bubbleColor: string;
    public textColor: string;
    public whisper: 'off' | 'character' | 'gm';

    /**
     * Creates a new CardStyle with customizable appearance.
     * 
     * @param name - The unique name identifier for this style
     * @param borderColor - Border color (hex or CSS color name)
     * @param backgroundColor - Background color
     * @param bubbleColor - Speech bubble interior color
     * @param textColor - Text color for readability
     * @param whisper - Whisper mode: 'character', 'gm', or 'off'
     */
    constructor(
        name: string,
        borderColor: string = '#8b4513',
        backgroundColor: string = '#f4e8d8',
        bubbleColor: string = '#ffffff',
        textColor: string = '#2c1810',
        whisper: 'off' | 'character' | 'gm' = 'off'
    ) {
        this.name = name;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.bubbleColor = bubbleColor;
        this.textColor = textColor;
        this.whisper = whisper;
    }
}

