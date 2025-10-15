/**
 * Messages Handler
 * 
 * Handles adding, editing, and deleting messages for monitored NPCs.
 */

import { MessageObject } from '../classes/MessageObject.js';
import { toSafeName, fromSafeName } from '../utils/nameUtils.js';
import { MonitoredNPC } from '../classes/MonitoredNPC.js';

/**
 * Handles all message management operations for a monitored NPC.
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleMessages(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const args = msg.content.trim().split(' ');

    // Extract the entity name from the command
    const safeName = args[2];
    const npcName = fromSafeName(safeName);
    const action = args[4] ? args[4].toLowerCase() : 'menu';

    // Find the monitored NPC by name
    const monitoredNPC = state.monitoredNPCs[safeName];
    if (!monitoredNPC) {
        sendChat('Proximity Trigger', `/w ${who} Could not find monitored NPC: ${npcName}`);
        return;
    }

    const safeNPCName = toSafeName(monitoredNPC.name);

    // Route to appropriate handler based on action
    switch (action) {
        case 'menu':
            showMessagesMenu(msg, monitoredNPC, safeNPCName);
            break;
        case 'add':
            handleAddMessage(msg, args, monitoredNPC, safeNPCName);
            break;
        case 'add_content':
            handleAddMessageContent(msg, args, monitoredNPC, safeNPCName);
            break;
        case 'add_weight':
            handleAddMessageWeight(msg, args, monitoredNPC, safeNPCName);
            break;
        case 'edit':
            handleEditMessage(msg, args, monitoredNPC, safeNPCName);
            break;
        case 'edit_content':
            handleEditMessageContent(msg, args, monitoredNPC, safeNPCName, npcName);
            break;
        case 'edit_content_save':
            handleEditMessageContentSave(msg, args, monitoredNPC, safeNPCName, npcName);
            break;
        case 'edit_weight':
            handleEditMessageWeight(msg, args, monitoredNPC, safeNPCName);
            break;
        case 'edit_weight_save':
            handleEditMessageWeightSave(msg, args, monitoredNPC, safeNPCName, npcName);
            break;
        case 'edit_cardstyle':
            handleEditMessageCardStyle(msg, args, monitoredNPC, safeNPCName, state);
            break;
        case 'set_cardstyle':
            handleSetMessageCardStyle(msg, args, monitoredNPC, safeNPCName, state);
            break;
        case 'delete':
            handleDeleteMessage(msg, args, monitoredNPC, safeNPCName);
            break;
        default:
            sendChat('Proximity Trigger', `/w ${who} Unknown message action: ${action}`);
    }
}

/**
 * Shows the main messages management menu for a monitored entity.
 */
function showMessagesMenu(
    msg: ChatMessage,
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    let messageList = '{{No messages configured}}';

    if (npc.messages.length > 0) {
        messageList = npc.messages.map((msgObj, index) => {
            const preview = msgObj.content.length > 50
                ? msgObj.content.substring(0, 50) + '...'
                : msgObj.content;
            return `{{[${index + 1}: ${preview}](!pt -M ${safeNPCName} messages edit ${index})}}`;
        }).join(' ');
    }

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Message Manager: ${npc.name}}} ` +
        `{{Total Messages: ${npc.messages.length}}} ${messageList} ` +
        `{{[Add New Message](!pt -M ${safeNPCName} messages add)}} ` +
        `{{[Back to NPC Edit](!pt -M ${safeNPCName})}}`
    );
}

/**
 * Prompts for adding a new message.
 */
function handleAddMessage(
    msg: ChatMessage,
    _args: string[],
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    const promptMessage = 'Enter the new message text. Use {playerName} as a placeholder:';

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Add Message to ${npc.name}}} ` +
        `{{${promptMessage}=[Click Here](!pt -M ${safeNPCName} messages add_content ?{Message Text})}}`
    );
}

/**
 * Handles setting the content for a new message.
 */
function handleAddMessageContent(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    const newContent = args.slice(5).join(' ').trim();

    if (!newContent) {
        sendChat('Proximity Trigger',
            `/w ${who} Message content cannot be empty. Make sure to include {playerName} if needed.`
        );
        return;
    }

    const newMessage = new MessageObject(newContent, 1, null);
    npc.messages.push(newMessage);

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Set Message Weight}} ` +
        `{{Message added! Now set its relative weight ^higher number more likely to appear^:}} ` +
        `{{Weight ^default 1, off 0^=[Click Here](!pt -M ${safeNPCName} messages add_weight ${npc.messages.length - 1} ?{Weight|1})}}`
    );
}

/**
 * Handles setting the weight for a newly added message.
 */
function handleAddMessageWeight(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);
    let weight = parseInt(args[6]);

    if (isNaN(msgIndex) || msgIndex < 0 || msgIndex >= npc.messages.length) {
        sendChat('Proximity Trigger', `/w ${who} Invalid message index.`);
        return;
    }

    if (isNaN(weight) || weight < 0) {
        sendChat('Proximity Trigger', `/w ${who} Weight must be >= 0. Using default of 1.`);
        weight = 1;
    }

    npc.messages[msgIndex].weight = weight;
    sendChat('Proximity Trigger', `/w ${who} Message weight set to ${weight}.`);

    // Return to the messages menu
    handleMessages(
        { content: `!pt -M ${safeNPCName} messages`, who: who } as ChatMessage,
        { monitoredNPCs: { [safeNPCName]: npc } } as any
    );
}

/**
 * Shows the edit menu for a specific message.
 */
function handleEditMessage(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);

    if (isNaN(msgIndex) || msgIndex < 0 || msgIndex >= npc.messages.length) {
        sendChat('Proximity Trigger', `/w ${who} Invalid message selection.`);
        return;
    }

    const messageToEdit = npc.messages[msgIndex];

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Edit ${npc.name} Message ${msgIndex + 1}}} ` +
        `{{Card Style: ${messageToEdit.cardStyle || 'Default'}}} ` +
        `{{Content: ${messageToEdit.content}}} ` +
        `{{Weight: ${messageToEdit.weight}}} ` +
        `{{[Edit Content](!pt -M ${safeNPCName} messages edit_content ${msgIndex})}} ` +
        `{{[Edit Weight](!pt -M ${safeNPCName} messages edit_weight ${msgIndex})}} ` +
        `{{[Change Card Style](!pt -M ${safeNPCName} messages edit_cardstyle ${msgIndex})}} ` +
        `{{[Delete Message](!pt -M ${safeNPCName} messages delete ${msgIndex})}} ` +
        `{{[Back to Messages](!pt -M ${safeNPCName} messages)}}`
    );
}

/**
 * Shows prompt to edit message content.
 */
function handleEditMessageContent(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string,
    npcName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);
    const monitoredMessage = npc.messages[msgIndex];

    if (!monitoredMessage) {
        sendChat('Proximity Trigger', `/w ${who} Invalid message index.`);
        return;
    }

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Edit ${npcName} Message Content}} ` +
        `{{Current: ${monitoredMessage.content}}} ` +
        `{{Enter new text. Use {playerName} as a placeholder: ` +
        `[Click Here](!pt -M ${safeNPCName} messages edit_content_save ${msgIndex} ?{Message Text})}}`
    );
}

/**
 * Saves edited message content.
 */
function handleEditMessageContentSave(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string,
    _npcName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);
    const newContent = args.slice(6).join(' ').trim();

    if (!newContent) {
        sendChat('Proximity Trigger',
            `/w ${who} Message content cannot be empty. Remember {playerName} placeholder.`
        );
        return;
    }

    npc.messages[msgIndex].content = newContent;
    sendChat('Proximity Trigger', `/w ${who} Message content updated.`);

    // Return to messages menu
    handleMessages(
        { content: `!pt -M ${safeNPCName} messages`, who: who } as ChatMessage,
        { monitoredNPCs: { [safeNPCName]: npc } } as any
    );
}

/**
 * Shows prompt to edit message weight.
 */
function handleEditMessageWeight(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);
    const monitoredMessage = npc.messages[msgIndex];

    if (!monitoredMessage) {
        sendChat('Proximity Trigger', `/w ${who} Invalid message index.`);
        return;
    }

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Edit ${npc.name} Message ${msgIndex + 1} Weight}} ` +
        `{{Current Weight: ${monitoredMessage.weight}}} ` +
        `{{New Weight: [Click Here](!pt -M ${safeNPCName} messages edit_weight_save ${msgIndex} ?{Weight|${monitoredMessage.weight}})}}`
    );
}

/**
 * Saves edited message weight.
 */
function handleEditMessageWeightSave(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string,
    npcName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);
    let newWeight = parseInt(args[6]);

    if (isNaN(newWeight) || newWeight < 0) newWeight = 1;

    npc.messages[msgIndex].weight = newWeight;
    sendChat('Proximity Trigger',
        `/w ${who} ${npcName} Message ${msgIndex + 1} weight updated to ${newWeight}.`
    );

    // Return to messages menu
    handleMessages(
        { content: `!pt -M ${safeNPCName} messages`, who: who } as ChatMessage,
        { monitoredNPCs: { [safeNPCName]: npc } } as any
    );
}

/**
 * Shows card style selection for a message.
 */
function handleEditMessageCardStyle(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string,
    state: ProximityTriggerState
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);

    const styleList = state.cardStyles.map(style =>
        `{{[${style.name}](!pt -M ${safeNPCName} messages set_cardstyle ${msgIndex} ${toSafeName(style.name)})}}`
    ).join(' ');

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Set Message Card Style}} ${styleList} ` +
        `{{[Back to Edit ${npc.name} Message](!pt -M ${safeNPCName} messages edit ${msgIndex})}}`
    );
}

/**
 * Sets the card style for a message.
 */
function handleSetMessageCardStyle(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string,
    state: ProximityTriggerState
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);
    const styleName = fromSafeName(args.slice(6).join(' '));

    const style = state.cardStyles.find(s =>
        s.name.toLowerCase() === styleName.toLowerCase()
    );

    if (!style) {
        sendChat('Proximity Trigger', `/w ${who} Card style "${styleName}" not found.`);
        return;
    }

    npc.messages[msgIndex].cardStyle = style.name;
    sendChat('Proximity Trigger',
        `/w ${who} ${npc.name} Message ${msgIndex + 1} card style set to ${style.name}.`
    );

    // Return to the message edit screen
    handleMessages(
        { content: `!pt -M ${safeNPCName} messages edit ${msgIndex}`, who: who } as ChatMessage,
        { monitoredNPCs: { [safeNPCName]: npc }, cardStyles: state.cardStyles } as any
    );
}

/**
 * Deletes a message from a monitored entity.
 */
function handleDeleteMessage(
    msg: ChatMessage,
    args: string[],
    npc: MonitoredNPC,
    safeNPCName: string
): void {
    const who = msg.who || 'gm';
    const msgIndex = parseInt(args[5]);

    if (isNaN(msgIndex) || msgIndex < 0 || msgIndex >= npc.messages.length) {
        sendChat('Proximity Trigger', `/w ${who} Invalid message index for deletion.`);
        return;
    }

    const deletedMessage = npc.messages.splice(msgIndex, 1)[0];
    const preview = deletedMessage.content.length > 50
        ? deletedMessage.content.substring(0, 50) + '...'
        : deletedMessage.content;

    sendChat('Proximity Trigger', `/w ${who} Deleted message: "${preview}"`);

    // Return to messages menu
    handleMessages(
        { content: `!pt -M ${safeNPCName} messages`, who: who } as ChatMessage,
        { monitoredNPCs: { [safeNPCName]: npc } } as any
    );
}

