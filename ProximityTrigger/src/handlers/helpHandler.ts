/**
 * Help Handler
 * 
 * Displays usage information and command reference.
 */

/**
 * Shows comprehensive help message with all available commands.
 * 
 * @param msg - The chat message object
 */
export function handleHelp(msg: ChatMessage): void {
    const who = msg.who || 'gm';

    sendChat('Proximity Trigger',
        `/w ${who} &{template:default} ` +
        `{{name=ProximityTrigger Help}} ` +
        `{{!pt=Main command (must include one flag)}} ` +
        `{{Use for=NPCs, traps, environment, passive checks, area effects}} ` +
        `{{--monitor|-M [Token/Name]=Add or edit a trigger (requires a token or name). Use underscores for spaces.}} ` +
        `{{--list|-l=List all monitored triggers}} ` +
        `{{--menu|-m=Open the ProximityTrigger menu}} ` +
        `{{--edit|-e [Name] [prop] [value]=Edit a trigger's property (prop: triggerDistance, timeout, img, cardStyle, mode)}} ` +
        `{{--trigger|-t [Token/Name]=Manually activate a trigger}} ` +
        `{{--cardstyles|-cl=List all card styles}} ` +
        `{{--cardstyle|-C [StyleName] [property] [value]=Edit or create a card style}} ` +
        `{{--delete|-D [Name]=Delete a monitored trigger}} ` +
        `{{--help|-h=Show this help}}`
    );
}

