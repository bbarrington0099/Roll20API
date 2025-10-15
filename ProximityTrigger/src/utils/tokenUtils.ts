/**
 * Token Utilities
 * 
 * Helper functions for working with Roll20 tokens and their properties.
 */

/**
 * Gets the best available image URL for a token in priority order:
 * 1. Character avatar (if token represents a character)
 * 2. Token image
 * 3. Default image from state
 * 4. Empty string
 * 
 * @param token - The Roll20 token object
 * @param state - The ProximityTrigger state object
 * @returns The best available image URL
 */
export function getBestTokenImage(token: Graphic, state: ProximityTriggerState): string {
    // Check if token represents a character and get avatar
    const charId = token.get('represents');
    if (charId) {
        const character = getObj('character', charId) as Character | undefined;
        if (character) {
            const avatar = character.get('avatar');
            if (avatar && avatar.trim() !== '') {
                return avatar;
            }
        }
    }

    // Fall back to token image
    const tokenImg = token.get('imgsrc');
    if (tokenImg && tokenImg.trim() !== '') {
        return tokenImg;
    }

    // Fall back to default image from state
    if (state.defaultImagePath && state.defaultImagePath.trim() !== '') {
        return state.defaultImagePath;
    }

    // Final fallback
    return '';
}

/**
 * Gets the effective name for a token - either the token's name or the character it represents.
 * 
 * @param token - The Roll20 token object
 * @returns The token's name, character name, or empty string
 */
export function getTokenEffectiveName(token: Graphic): string {
    // First try the token's own name
    const tokenName = token.get('name');
    if (tokenName && tokenName.trim() !== '') {
        return tokenName.trim();
    }

    // If no token name, check if it represents a character
    const charId = token.get('represents');
    if (charId) {
        const character = getObj('character', charId) as Character | undefined;
        if (character) {
            const charName = character.get('name');
            if (charName && charName.trim() !== '') {
                return charName.trim();
            }
        }
    }

    return '';
}

/**
 * Retrieves a player/character name from a token for message personalization.
 * Returns the first name only for brevity in messages.
 * 
 * @param token - The token that triggered the interaction
 * @returns Player/character first name or "Triggerer"
 */
export function getPlayerNameFromToken(token: Graphic): string {
    const charId = token.get('represents');
    if (charId) {
        const character = getObj('character', charId) as Character | undefined;
        if (character) {
            const fullName = character.get('name');
            return fullName.split(' ')[0] || 'Triggerer';
        }
    }
    return 'Triggerer';
}

/**
 * Finds a token on the current page by a character's name.
 * 
 * @param charName - The character name to search for
 * @returns The first matching token, or null if none found
 */
export function findTokenByCharacterName(charName: string): Graphic | null {
    const characters = findObjs({ _type: 'character', name: charName });
    const character = characters[0];
    if (!character) return null;

    const pageId = Campaign().get('playerpageid');
    const tokens = findObjs({
        _pageid: pageId,
        _type: 'graphic',
        represents: character.id
    }) as Graphic[];

    return tokens.find(t => t.get('layer') === 'objects') || tokens[0] || null;
}

/**
 * Extracts the token to act on from a chat command or selection.
 * Chat args take priority over a selected token.
 * 
 * @param msg - The chat message object (msg.type === "api")
 * @param fromSafeNameFn - Function to convert safe names back to display names
 * @returns The token to use, or undefined if none found
 */
export function getTokenFromCall(
    msg: ChatMessage,
    fromSafeNameFn: (name: string) => string
): Graphic | undefined {
    const args = msg.content.trim().split(' ');

    // If command includes a name after flag, use that
    if (args.length > 2) {
        const token = findTokenByCharacterName(fromSafeNameFn(args[2]));
        return token || undefined;
    }

    // Otherwise, if a token is selected, use that
    if (msg.selected && msg.selected.length > 0) {
        return getObj('graphic', msg.selected[0]._id) as Graphic | undefined;
    }

    return undefined;
}

