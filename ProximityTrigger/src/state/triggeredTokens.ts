/**
 * Triggered Tokens Tracking
 * 
 * Maintains a cache of which tokens have recently triggered NPCs.
 * This prevents spam by enforcing cooldown periods.
 */

/**
 * Tracks which token pairs have triggered recently.
 * Key format: "movingTokenId_npcTokenId"
 * Value: true if triggered and on cooldown
 */
export const triggeredTokens: Record<string, boolean> = {};

