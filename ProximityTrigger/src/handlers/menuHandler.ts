/**
 * Menu Handler
 * 
 * Displays the main ProximityTrigger menu with quick access buttons.
 */

/**
 * Shows the main interactive menu with common command buttons.
 * 
 * @param msg - The chat message object
 */
export function handleMenu(msg: ChatMessage): void {
    const who = msg.who;

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} ` +
        `{{name=ProximityTrigger Menu}} ` +
        `{{[Add/Edit Trigger](!pt -M)}}` +
        `{{[List Triggers](!pt -l)}} ` +
        `{{[Activate Trigger](!pt -t)}} ` +
        `{{[Card Styles](!pt -cl)}} ` +
        `{{[Help](!pt -h)}}`
    );
}

