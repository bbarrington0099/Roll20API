/**
 * Name Utilities
 * 
 * Functions for converting between display names and safe command names.
 */

/**
 * Converts a display name to a safe command-friendly name.
 * Replaces spaces with underscores for use in chat commands.
 * 
 * @param name - The original display name
 * @returns Safe name with underscores instead of spaces
 */
export function toSafeName(name: string): string {
    return name.trim().replace(/\s+/g, '_');
}

/**
 * Converts a safe command name back to a display name.
 * Replaces underscores with spaces.
 * 
 * @param safeName - The underscored safe name
 * @returns Display name with spaces
 */
export function fromSafeName(safeName: string): string {
    return safeName.replace(/_/g, ' ').trim();
}

