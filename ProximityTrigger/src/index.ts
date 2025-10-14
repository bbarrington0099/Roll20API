/**
 * ProximityTrigger - Main Entry Point
 * 
 * A modular Roll20 API script for proximity-based automation.
 * Automatically triggers events when player tokens approach designated areas or objects.
 * 
 * Perfect for:
 * - Interactive NPCs (conversations, greetings)
 * - Trap warnings and hazards
 * - Environmental descriptions
 * - Passive ability checks
 * - Area-based effects
 * - Dynamic storytelling
 * 
 * Features:
 * - Automatic proximity detection
 * - Customizable trigger distances and cooldowns
 * - Weighted random message selection
 * - Styleable message cards
 * - Per-message and per-trigger styling
 * - Interactive chat-based configuration
 * - Manual trigger creation and management
 * 
 * @version 2.1.0
 */

import { initializeState } from './state/initializeState.js';
import { setupChatListener } from './events/chatListener.js';
import { setupTokenListeners } from './events/tokenListener.js';

/**
 * Main initialization function.
 * Called when Roll20 API is ready.
 */
function initialize(): void {
    // Initialize or retrieve persisted state
    const proximityState = initializeState();

    // Set up event listeners
    setupChatListener(proximityState);
    setupTokenListeners(proximityState);

    // Log successful initialization
    log('✅ ProximityTrigger v2.1.0 loaded and ready!');
    log(`   - ${Object.keys(proximityState.monitoredNPCs).length} triggers monitored`);
    log(`   - ${proximityState.cardStyles.length} card styles available`);
    log('   - Command: !pt [options]');
}

// Register the initialization function with Roll20
on('ready', initialize);

