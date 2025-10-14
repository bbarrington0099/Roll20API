/**
 * Card Style Handler
 * 
 * Handles creating, editing, and deleting card styles.
 */

import { CardStyle } from '../classes/CardStyle.js';
import { toSafeName, fromSafeName } from '../utils/nameUtils.js';

/**
 * Handles all card style operations: create, edit, delete, list.
 * Usage: !pt -C <StyleName> <property> <value>
 * 
 * @param msg - The chat message object
 * @param state - The ProximityTrigger state
 */
export function handleCardStyle(msg: ChatMessage, state: ProximityTriggerState): void {
    const who = msg.who || 'gm';
    const args = msg.content.trim().split(' ');

    // Handle creating new card style
    if (args.length >= 3 && (args[2].toLowerCase() === 'new' || args[2].toLowerCase() === 'create')) {
        handleCreateCardStyle(msg, args, state);
        return;
    }

    // Handle deleting card style
    if (args.length >= 3 && (args[2].toLowerCase() === 'delete' || args[2].toLowerCase() === 'remove')) {
        handleDeleteCardStyle(msg, args, state);
        return;
    }

    // If no style name provided, show list of styles for editing
    if (args.length < 3) {
        const styleList = state.cardStyles.map(style =>
            `{{[${style.name}](!pt -C ${toSafeName(style.name)})}}`
        ).join(' ');

        sendChat('Proximity Trigger',
            `/w ${who} &{template:default} {{name=Edit Card Styles}} ` +
            `{{[Create New](!pt -C new)}} ${styleList}`
        );
        return;
    }

    const styleName = fromSafeName(args[2]);
    const cardStyle = state.cardStyles.find(style =>
        style.name.toLowerCase() === styleName.toLowerCase()
    );

    if (!cardStyle) {
        sendChat('Proximity Trigger', `/w ${who} Could not find card style: ${styleName}.`);
        return;
    }

    // If no property specified, show edit dialog
    if (args.length < 4) {
        showCardStyleEditDialog(msg, cardStyle);
        return;
    }

    const property = args[3].toLowerCase();

    // Prevent editing Default style properties
    if (cardStyle.name === 'Default') {
        sendChat('Proximity Trigger',
            `/w ${who} Cannot edit properties of the Default card style.`
        );
        return;
    }

    // If no value provided, show input prompt
    if (args.length < 5) {
        showCardStylePropertyPrompt(msg, cardStyle, property);
        return;
    }

    // Set the property value
    const value = args.slice(4).join(' ').trim().toLowerCase();
    setCardStyleProperty(msg, cardStyle, property, value);
}

/**
 * Shows the edit dialog for a card style with clickable property links.
 * 
 * @param msg - The chat message object
 * @param cardStyle - The card style to edit
 */
function showCardStyleEditDialog(
    msg: ChatMessage,
    cardStyle: CardStyle
): void {
    const who = msg.who || 'gm';

    // Don't allow editing Default style
    if (cardStyle.name === 'Default') {
        sendChat('Proximity Trigger',
            `/w ${who} &{template:default} {{name=Card Style: ${cardStyle.name}}} ` +
            `{{This is the default style and cannot be edited.}} ` +
            `{{[Create New Style](!pt -C new)}}`
        );
        return;
    }

    const properties = [
        { name: 'Border Color', attr: 'borderColor', value: cardStyle.borderColor },
        { name: 'Background Color', attr: 'backgroundColor', value: cardStyle.backgroundColor },
        { name: 'Bubble Color', attr: 'bubbleColor', value: cardStyle.bubbleColor },
        { name: 'Text Color', attr: 'textColor', value: cardStyle.textColor },
        { name: 'Whisper', attr: 'whisper', value: cardStyle.whisper },
        { name: 'Badge', attr: 'badge', value: cardStyle.badge }
    ];

    const propertyLinks = properties.map(prop =>
        `{{[${prop.name}: ${prop.attr == 'badge' ? (prop.value || 'None').slice(0, 16) : (prop.value || 'None')}](!pt -C ${toSafeName(cardStyle.name)} ${prop.attr})}}`
    ).join(' ');

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Edit Card Style: ${cardStyle.name}}} ` +
        `${propertyLinks} ` +
        `{{[Delete Style](!pt -C delete ${toSafeName(cardStyle.name)})}}`
    );
}

/**
 * Shows an input prompt for a specific card style property.
 * 
 * @param msg - The chat message object
 * @param cardStyle - The card style being edited
 * @param property - The property to edit
 */
function showCardStylePropertyPrompt(
    msg: ChatMessage,
    cardStyle: CardStyle,
    property: string
): void {
    const who = msg.who || 'gm';
    const currentValue = (cardStyle as any)[property];
    let promptMessage = '';

    switch (property) {
        case 'bordercolor':
            promptMessage = 'Enter border color ^any CSS color - red, #ff0000, rgb^255,0,0^, etc.^:';
            break;
        case 'backgroundcolor':
            promptMessage = 'Enter background color ^any CSS color^:';
            break;
        case 'bubblecolor':
            promptMessage = 'Enter speech bubble color ^any CSS color^:';
            break;
        case 'textcolor':
            promptMessage = 'Enter text color ^any CSS color^:';
            break;
        case 'whisper':
            promptMessage = 'Enter whisper mode ^\'character\', \'gm\', or \'off\'^:';
            break;
        case 'badge':
            promptMessage = "Enter URL for Badge Image ^'clear' to remove^:"
            break;
        default:
            sendChat('Proximity Trigger',
                `/w ${who} Unknown property: ${property}. ` +
                `Valid properties: borderColor, backgroundColor, bubbleColor, textColor, whisper, badge`
            );
            return;
    }

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Set ${property} for ${cardStyle.name}}} ` +
        `{{Current: ${property == 'badge' ? (currentValue ? currentValue.slice(0, 30) : 'None') : (currentValue || '')}}} ` +
        `{{${promptMessage}=[Click Here](!pt -C ${toSafeName(cardStyle.name)} ${property} ?{${promptMessage}|${currentValue}})}}`
    );
}

/**
 * Sets a card style property to a new value.
 * 
 * @param msg - The chat message object
 * @param cardStyle - The card style being edited
 * @param property - The property to set
 * @param value - The new value
 */
function setCardStyleProperty(
    msg: ChatMessage,
    cardStyle: CardStyle,
    property: string,
    value: string
): void {
    const who = msg.who || 'gm';

    switch (property) {
        case 'bordercolor':
            cardStyle.borderColor = value;
            sendChat('Proximity Trigger',
                `/w ${who} Updated ${cardStyle.name} border color to "${value}"`
            );
            break;
        case 'backgroundcolor':
            cardStyle.backgroundColor = value;
            sendChat('Proximity Trigger',
                `/w ${who} Updated ${cardStyle.name} background color to "${value}"`
            );
            break;
        case 'bubblecolor':
            cardStyle.bubbleColor = value;
            sendChat('Proximity Trigger',
                `/w ${who} Updated ${cardStyle.name} bubble color to "${value}"`
            );
            break;
        case 'textcolor':
            cardStyle.textColor = value;
            sendChat('Proximity Trigger',
                `/w ${who} Updated ${cardStyle.name} text color to "${value}"`
            );
            break;
        case 'whisper':
            if (value === 'character' || value === 'gm' || value === 'off') {
                cardStyle.whisper = value as 'character' | 'gm' | 'off';
                sendChat('Proximity Trigger',
                    `/w ${who} Updated ${cardStyle.name} whisper to "${value}"`
                );
            } else {
                cardStyle.whisper = 'off';
                sendChat('Proximity Trigger',
                    `/w ${who} Invalid whisper value "${value}". Set to "off". ` +
                    `Valid values: 'character', 'gm', 'off'`
                );
            }
            break;
        case 'badge':
            let clear = value.toLowerCase().trim() == 'clear';
            cardStyle.badge = clear ? null : value;
            sendChat('Proximity Trigger', `/w ${who} ${clear ? 'Removed' : 'Updated'} ${cardStyle.name} badge url to ${clear ? '' : `"${value}"`}`);
            break;
        default:
            sendChat('Proximity Trigger',
                `/w ${who} Unknown property: ${property}. ` +
                `Valid properties: borderColor, backgroundColor, bubbleColor, textColor, whisper, badge`
            );
            return;
    }

    // Show the updated edit dialog
    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} {{name=Card Style Updated}} ` +
        `{{[Continue Editing ${cardStyle.name}](!pt -C ${toSafeName(cardStyle.name)})}}`
    );
}

/**
 * Handles creating a new card style.
 * 
 * @param msg - The chat message object
 * @param args - Command arguments
 * @param state - The ProximityTrigger state
 */
function handleCreateCardStyle(
    msg: ChatMessage,
    args: string[],
    state: ProximityTriggerState
): void {
    const who = msg.who || 'gm';
    const styleName = fromSafeName(args.slice(3).join(' '));

    if (!styleName) {
        sendChat('Proximity Trigger',
            `/w ${who} &{template:default} {{name=Create New Card Style}} ` +
            `{{Enter style name=[Click Here](!pt -C new ?{Style Name})}}`
        );
        return;
    }

    // Check if style already exists
    if (state.cardStyles.find(style => style.name.toLowerCase() === styleName.toLowerCase())) {
        sendChat('Proximity Trigger', `/w ${who} Card style "${styleName}" already exists.`);
        return;
    }

    // Create new card style with default colors
    const newStyle = new CardStyle(styleName);
    state.cardStyles.push(newStyle);

    sendChat('Proximity Trigger', `/w ${who} Created new card style: "${styleName}".`);

    // Show edit dialog for the new style
    handleCardStyle({
        content: `!pt -C ${toSafeName(styleName)}`,
        who: who
    } as ChatMessage, state);
}

/**
 * Handles deleting a card style.
 * 
 * @param msg - The chat message object
 * @param args - Command arguments
 * @param state - The ProximityTrigger state
 */
function handleDeleteCardStyle(
    msg: ChatMessage,
    args: string[],
    state: ProximityTriggerState
): void {
    const who = msg.who || 'gm';

    if (args.length < 4) {
        // Show clickable menu of styles to delete (excluding Default)
        const deletableStyles = state.cardStyles.filter(style => style.name !== 'Default');

        if (deletableStyles.length === 0) {
            sendChat('Proximity Trigger',
                `/w ${who} No card styles can be deleted (Default style is protected).`
            );
            return;
        }

        const styleList = deletableStyles.map(style =>
            `{{[${style.name}](!pt -C delete ${toSafeName(style.name)})}}`
        ).join(' ');

        sendChat('Proximity Trigger',
            `/w ${who} &{template:default} {{name=Delete Card Style}} ${styleList}`
        );
        return;
    }

    const styleName = fromSafeName(args.slice(3).join('_'));

    // Prevent deletion of Default style
    if (styleName.toLowerCase() === 'default') {
        sendChat('Proximity Trigger', `/w ${who} Cannot delete the Default card style.`);
        return;
    }

    const styleIndex = state.cardStyles.findIndex(style =>
        style.name.toLowerCase() === styleName.toLowerCase()
    );

    if (styleIndex === -1) {
        sendChat('Proximity Trigger', `/w ${who} Could not find card style: ${styleName}`);
        return;
    }

    // Check if any triggers are using this style
    const triggersUsingStyle: string[] = [];

    Object.values(state.monitoredNPCs).forEach(npc => {
        if (npc.cardStyle === state.cardStyles[styleIndex].name) {
            triggersUsingStyle.push(npc.name);
        }
    });

    if (triggersUsingStyle.length > 0) {
        sendChat('Proximity Trigger',
            `/w ${who} Cannot delete "${styleName}" - it's being used by: ` +
            `${triggersUsingStyle.join(', ')}. Change their card styles first.`
        );
        return;
    }

    const deletedStyle = state.cardStyles.splice(styleIndex, 1)[0];
    sendChat('Proximity Trigger', `/w ${who} Deleted card style: "${deletedStyle.name}"`);
}

