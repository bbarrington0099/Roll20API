/**
 * Chat Listener
 * 
 * Handles chat message events and routes commands to appropriate handlers.
 */

import {
    handleHelp,
    handleMenu,
    handleListNPCs,
    handleDeleteNPC,
    handleListCardStyles,
    handleTrigger,
    handleMonitor,
    handleEditNPC,
    handleCardStyle,
    handleMessages
} from '../handlers/index.js';

/**
 * Sets up the chat message listener for API commands.
 * Routes commands to appropriate handlers based on flags.
 * 
 * @param state - The ProximityTrigger state
 */
export function setupChatListener(state: ProximityTriggerState): void {
    on('chat:message', function (msg: ChatMessage) {
        const who = msg.who || 'gm';

        // Handle button clicks from dynamic messages
        if (msg.type === 'api' && msg.content.startsWith('!proximitytrigger-button')) {
            const args = msg.content.trim().split(' ');
            if (args.length > 1) {
                const buttonId = args[1];
                if (state.buttonCallbacks && state.buttonCallbacks[buttonId]) {
                    const callback = state.buttonCallbacks[buttonId];
                    sendChat(callback.sender, callback.whisper + callback.message);
                    // Clean up the callback
                    delete state.buttonCallbacks[buttonId];
                }
            }
            return;
        }

        // Only handle API commands that start with !pt
        if (msg.type !== 'api' || !msg.content.startsWith('!pt')) {
            return;
        }

        // Handle --monitor or -M (with special case for messages)
        if (msg.content.includes('--monitor') || msg.content.includes('-M')) {
            const args = msg.content.trim().split(' ');

            if (args.length > 3 && args[3] === 'messages') {
                handleMessages(msg, state);
                return;
            }

            // If more than 3 args, treat as edit call
            if (args.length > 3) {
                handleEditNPC(msg, state);
            } else {
                handleMonitor(msg, state);
            }
            return;
        }

        // Handle --edit or -e
        if (msg.content.includes('--edit') || msg.content.includes('-e')) {
            handleEditNPC(msg, state);
            return;
        }

        // Handle --menu or -m
        if (msg.content.includes('--menu') || msg.content.includes('-m')) {
            handleMenu(msg);
            return;
        }

        // Handle --list or -l
        if (msg.content.includes('--list') || msg.content.includes('-l')) {
            handleListNPCs(msg, state);
            return;
        }

        // Handle --help or -h
        if (msg.content.includes('--help') || msg.content.includes('-h')) {
            handleHelp(msg);
            return;
        }

        // Handle --cardstyles or -cl
        if (msg.content.includes('--cardstyles') || msg.content.includes('-cl')) {
            handleListCardStyles(msg, state);
            return;
        }

        // Handle --cardstyle or -C
        if (msg.content.includes('--cardstyle') || msg.content.includes('-C')) {
            handleCardStyle(msg, state);
            return;
        }

        // Handle --trigger or -t
        if (msg.content.includes('--trigger') || msg.content.includes('-t')) {
            handleTrigger(msg, state);
            return;
        }

        // Handle --delete or -D
        if (msg.content.includes('--delete') || msg.content.includes('-D')) {
            handleDeleteNPC(msg, state);
            return;
        }

        // Unknown command
        sendChat('Proximity Trigger', `/w ${who} Unknown command. Review the help:`);
        handleHelp(msg);
    });
}

