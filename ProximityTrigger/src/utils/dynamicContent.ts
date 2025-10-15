/**
 * Dynamic Content Processing
 * 
 * Handles dynamic replacements in messages:
 * - {playerName} - Triggering character's first name
 * - {monitoredName} - NPC's name who is speaking
 * - {playerName.attributeName} - Character attribute values
 * - {monitoredName.attributeName} - NPC's character attribute values
 * - {1d6}, {2d20+3}, {1d8+2d6} - Dice rolls (styled)
 * - [Button Text](message) - Clickable buttons that send messages to chat
 */

import { MonitoredNPC } from '../classes/MonitoredNPC.js';
import { CardStyle } from '../classes/CardStyle.js';

/**
 * Result of a dice roll operation
 */
export interface DiceRollResult {
    result: number;
    expression: string;
    details: string;
    success: boolean;
}

/**
 * Information about a button extracted from message text
 */
export interface ButtonInfo {
    text: string;
    message: string;
}

/**
 * Result of extracting buttons from text
 */
export interface ButtonExtraction {
    text: string;
    buttonCommands: ButtonInfo[];
}

/**
 * Result of processing dynamic message content
 */
export interface ProcessedMessage {
    text: string;
    buttons: ButtonInfo[];
}

/**
 * Parses and executes a dice roll expression (e.g., "1d6", "2d20+3", "1d8+2d6").
 * 
 * @param rollExpression - The dice roll expression to parse
 * @returns Object with result, expression, details, and success flag
 */
export function parseDiceRoll(rollExpression: string): DiceRollResult {
    try {
        // Clean up the expression
        const expr = rollExpression.trim().replace(/\s+/g, '');
        const originalExpr = expr;

        // Pattern to match dice notation: XdY where X and Y are numbers
        const dicePattern = /(\d+)d(\d+)/gi;
        let workingExpr = expr;
        const detailParts: string[] = [];

        // Collect all matches first
        const matches: Array<{
            fullMatch: string;
            numDice: number;
            numSides: number;
            index: number;
        }> = [];

        let match;
        while ((match = dicePattern.exec(expr)) !== null) {
            matches.push({
                fullMatch: match[0],
                numDice: parseInt(match[1]),
                numSides: parseInt(match[2]),
                index: match.index
            });
        }

        // Process each dice roll
        let lastIndex = 0;
        let offset = 0;

        matches.forEach(m => {
            // Validate dice parameters
            if (m.numDice <= 0 || m.numDice > 100 || m.numSides <= 0 || m.numSides > 1000) {
                throw new Error('Invalid dice parameters');
            }

            // Roll the dice
            let rollTotal = 0;
            const rolls: number[] = [];
            for (let i = 0; i < m.numDice; i++) {
                const roll = Math.floor(Math.random() * m.numSides) + 1;
                rolls.push(roll);
                rollTotal += roll;
            }

            // Add any text before this dice roll to detail
            const beforeText = originalExpr.substring(lastIndex, m.index);
            if (beforeText) {
                detailParts.push(beforeText);
            }

            // Add the dice roll detail
            detailParts.push(`${m.numDice}d${m.numSides}=[${rolls.join(',')}]`);
            lastIndex = m.index + m.fullMatch.length;

            // Replace in working expression
            const replaceIndex = m.index + offset;
            workingExpr = workingExpr.substring(0, replaceIndex) +
                rollTotal.toString() +
                workingExpr.substring(replaceIndex + m.fullMatch.length);
            offset += rollTotal.toString().length - m.fullMatch.length;
        });

        // Add any remaining text after the last dice roll
        if (lastIndex < originalExpr.length) {
            detailParts.push(originalExpr.substring(lastIndex));
        }

        // Evaluate the final mathematical expression
        // Only allow numbers, +, -, *, /, (, ) for safety
        if (!/^[\d+\-*/().\s]+$/.test(workingExpr)) {
            return { result: 0, expression: rollExpression, details: '', success: false };
        }

        const result = eval(workingExpr);

        return {
            result: Math.round(result),
            expression: rollExpression,
            details: detailParts.join(''),
            success: true
        };
    } catch (error) {
        log(`Error parsing dice roll "${rollExpression}": ${error}`);
        return { result: 0, expression: rollExpression, details: '', success: false };
    }
}

/**
 * Retrieves the character object from a token.
 * 
 * @param token - The token to get the character from
 * @returns The character object or null if not found
 */
export function getCharacterFromToken(token: Roll20Graphic | null): Roll20Character | null {
    if (!token) return null;

    const charId = token.get('represents');
    if (charId) {
        const char = getObj('character', charId);
        return char as Character | undefined || null;
    }
    return null;
}

/**
 * Searches within a JSON object for a value by key name (case-insensitive, recursive).
 * 
 * @param obj - The object to search
 * @param keyName - The key name to find
 * @param depth - Current recursion depth (internal use)
 * @returns The value if found, null otherwise
 */
export function searchJsonForKey(obj: any, keyName: string, depth: number = 0): any {
    if (!obj || typeof obj !== 'object') return null;

    const lowerKeyName = keyName.toLowerCase();

    // Check current level keys
    for (const key in obj) {
        if (key.toLowerCase() === lowerKeyName) {
            return obj[key];
        }
    }

    // Recursively search nested objects (limit depth to avoid infinite loops)
    if (depth < 10) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                const result = searchJsonForKey(obj[key], keyName, depth + 1);
                if (result !== null && result !== undefined) return result;
            }
        }
    }

    return null;
}

/**
 * Gets a character attribute value by name.
 * Supports various attribute naming conventions and JSON attributes.
 * 
 * @param character - The character object
 * @param attrName - The attribute name to look up
 * @returns The attribute value or a fallback message
 */
export function getCharacterAttribute(
    character: Roll20Character | null,
    attrName: string
): string {
    if (!character) {
        return '[No Character]';
    }

    try {
        // Get all attributes for this character
        const attrs = findObjs({
            _type: 'attribute',
            _characterid: character.id
        });

        // Try exact match first
        let attr = attrs.find((a: Roll20Attribute) => a.get('name') === attrName);

        // If not found, try case-insensitive match
        if (!attr) {
            attr = attrs.find((a: Roll20Attribute) =>
                a.get('name').toLowerCase() === attrName.toLowerCase()
            );
        }

        if (attr) {
            const current = attr.get('current');
            return current !== undefined && current !== null ? current.toString() : '[Empty]';
        }

        // Build list of possible attribute name variations
        const namesToTry: string[] = [attrName];
        const lowerAttr = attrName.toLowerCase();

        // Add common variations for HP
        if (lowerAttr === 'hp') {
            namesToTry.push('currentHP', 'current_hp', 'hitpoints', 'hit_points', 'HP', 'health');
        }

        // Add common variations for max HP
        if (lowerAttr === 'maxhp' || lowerAttr === 'max_hp') {
            namesToTry.push('maximumWithoutTemp', 'hp_max', 'maximum_hp', 'maxhp', 'max_hp');
        }

        // Add common variations for gold
        if (lowerAttr === 'gold' || lowerAttr === 'gp') {
            namesToTry.push('gold', 'gp', 'goldPieces', 'gold_pieces');
        }

        // Add common variations for level
        if (lowerAttr === 'level' || lowerAttr === 'lvl') {
            namesToTry.push('level', 'characterLevel', 'character_level', 'lvl');
        }

        // Add common variations for AC
        if (lowerAttr === 'ac') {
            namesToTry.push('ac', 'armorClass', 'armor_class', 'armour_class', 'AC');
        }

        // Add common variations for inspiration
        if (lowerAttr === 'inspiration' || lowerAttr === 'inspired') {
            namesToTry.push('inspiration', 'isInspired', 'is_inspired', 'inspired');
        }

        // Add common variations for ability scores
        const abilityAliases: Record<string, string[]> = {
            'str': ['str', 'strength', 'STR', 'Strength'],
            'dex': ['dex', 'dexterity', 'DEX', 'Dexterity'],
            'con': ['con', 'constitution', 'CON', 'Constitution'],
            'int': ['int', 'intelligence', 'INT', 'Intelligence'],
            'wis': ['wis', 'wisdom', 'WIS', 'Wisdom'],
            'cha': ['cha', 'charisma', 'CHA', 'Charisma']
        };

        for (const [shortName, variations] of Object.entries(abilityAliases)) {
            if (lowerAttr === shortName || lowerAttr === variations[1].toLowerCase()) {
                namesToTry.push(...variations);
                break;
            }
        }

        // Add modifiers
        const modAliases: Record<string, string[]> = {
            'strength_mod': ['strength_mod', 'str_mod', 'strengthMod', 'strMod'],
            'dexterity_mod': ['dexterity_mod', 'dex_mod', 'dexterityMod', 'dexMod'],
            'constitution_mod': ['constitution_mod', 'con_mod', 'constitutionMod', 'conMod'],
            'intelligence_mod': ['intelligence_mod', 'int_mod', 'intelligenceMod', 'intMod'],
            'wisdom_mod': ['wisdom_mod', 'wis_mod', 'wisdomMod', 'wisMod'],
            'charisma_mod': ['charisma_mod', 'cha_mod', 'charismaMod', 'chaMod']
        };

        for (const [modName, variations] of Object.entries(modAliases)) {
            if (lowerAttr === modName || lowerAttr === variations[1]) {
                namesToTry.push(...variations);
                break;
            }
        }

        // Search common JSON container attributes
        const jsonContainers = ['store', 'builder', 'data', 'character', 'stats'];
        for (const containerName of jsonContainers) {
            const containerAttr = attrs.find((a: Roll20Attribute) => a.get('name') === containerName);
            if (containerAttr) {
                const value = containerAttr.get('current');
                try {
                    const parsed = typeof value === 'string' ? JSON.parse(value) : value;

                    // Try all name variations
                    for (const nameVariant of namesToTry) {
                        const found = searchJsonForKey(parsed, nameVariant);
                        if (found !== null && found !== undefined) {
                            return found.toString();
                        }
                    }
                } catch (e) {
                    // Not JSON or parse error, continue to next container
                }
            }
        }

        // If still not found, return a fallback
        return `[${attrName}?]`;
    } catch (error) {
        log(`ProximityTrigger ERROR getting attribute "${attrName}": ${error}`);
        return '[Error]';
    }
}

/**
 * Extracts buttons from text and creates clickable chat buttons.
 * Buttons send messages to chat when clicked.
 * 
 * @param text - The text containing button syntax [Button Text](message)
 * @returns Object with cleaned text and array of button info
 */
export function extractButtons(text: string): ButtonExtraction {
    // Pattern to match [Button Text](message)
    const buttonPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const buttonCommands: ButtonInfo[] = [];

    // Extract all buttons
    let match;
    while ((match = buttonPattern.exec(text)) !== null) {
        const buttonText = match[1].trim();
        const message = match[2].trim();

        // Store the button info
        buttonCommands.push({
            text: buttonText,
            message: message
        });
    }

    // Remove button syntax from text
    const cleanText = text.replace(buttonPattern, '');

    return { text: cleanText, buttonCommands: buttonCommands };
}

/**
 * Processes all dynamic replacements in a message (rolls, attributes, buttons).
 * 
 * @param messageContent - The raw message content with placeholders
 * @param displayName - The player name for display (first name only)
 * @param triggeringToken - The token that triggered the message (optional)
 * @param npc - The NPC that is speaking
 * @param cardStyle - The card style for styling dice rolls
 * @param defaultStyle - The default card style
 * @returns Object with processed text and buttons
 */
export function processMessageDynamics(
    messageContent: string,
    displayName: string,
    triggeringToken: Roll20Graphic | null,
    npc: MonitoredNPC,
    cardStyle: CardStyle,
    defaultStyle: CardStyle
): ProcessedMessage {
    let processed = messageContent;

    // Get the character from the triggering token (if available)
    const character = triggeringToken ? getCharacterFromToken(triggeringToken) : null;

    // Get the full character name directly from the character object
    const fullCharacterName = character ? character.get('name') : null;

    // Get NPC's character if the NPC has tokens with character sheets
    let npcCharacter: Roll20Character | null = null;
    if (npc && npc.tokenIds && npc.tokenIds.length > 0) {
        const npcToken = getObj('graphic', npc.tokenIds[0]);
        if (npcToken) {
            npcCharacter = getCharacterFromToken(npcToken);
        }
    }
    const npcName = npc ? npc.name : 'NPC';

    // 1. Replace {playerName} with display name (first name only)
    processed = processed.replace(/{playerName}/g, displayName);

    // 2. Replace {monitoredName} with the NPC's name
    processed = processed.replace(/{monitoredName}/g, npcName);

    // 3. Parse and replace character attributes {playerName.attributeName}, {monitoredName.attributeName}
    // Pattern: {playerName.something} or {characterName.something} or {monitoredName.something}
    const attrPattern = /{([\w\s]+)\.([\w\-_]+)}/g;
    processed = processed.replace(attrPattern, (_match, charRef, attrName) => {
        // If it references playerName or the actual character name, use the triggering token's character
        if (charRef.toLowerCase() === 'playername' ||
            (fullCharacterName && charRef.toLowerCase() === fullCharacterName.toLowerCase())) {
            return getCharacterAttribute(character, attrName);
        }

        // If it references monitoredName or the NPC's name, use the NPC's character
        if (charRef.toLowerCase() === 'monitoredname' ||
            (npcName && charRef.toLowerCase() === npcName.toLowerCase())) {
            return getCharacterAttribute(npcCharacter, attrName);
        }

        // Try to find a character by the referenced name
        const refChar = findObjs({ _type: 'character', name: charRef })[0] as Roll20Character;
        if (refChar) {
            return getCharacterAttribute(refChar, attrName);
        }

        return `[${charRef}.${attrName}?]`;
    });

    // 4. Parse and execute dice rolls {1d6}, {2d20+3}, etc.
    const rollPattern = /{([0-9d+\-*/()\s]+)}/g;
    processed = processed.replace(rollPattern, (match, rollExpr) => {
        // Check if this looks like a dice roll (contains 'd')
        if (!rollExpr.toLowerCase().includes('d')) {
            return match; // Not a dice roll, leave as is
        }

        const rollResult = parseDiceRoll(rollExpr);

        if (rollResult.success) {
            // Style the roll result with inverted colors
            const bgColor = cardStyle.textColor || defaultStyle.textColor;
            const textColor = cardStyle.bubbleColor || defaultStyle.bubbleColor;
            const borderColor = cardStyle.borderColor || defaultStyle.borderColor;

            return `<span style="background: ${bgColor}; color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 4px; padding: 2px 6px; font-weight: bold; font-family: monospace;" title="${rollResult.details}">${rollResult.result}</span>`;
        } else {
            return `<span style="color: red; font-weight: bold;">[Invalid Roll: ${rollExpr}]</span>`;
        }
    });

    // 5. Extract buttons (will be sent as separate messages)
    const buttonInfo = extractButtons(processed);

    return { text: buttonInfo.text, buttons: buttonInfo.buttonCommands };
}


