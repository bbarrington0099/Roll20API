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
        `{{--help|-h=Show this help}} ` +
        `{{=**Dynamic Message Content**}} ` +
        `{{**Dice Roll Syntax**=Supported dice notation:}} ` +
        `{{Basic Rolls=1d6, 2d20, 3d8 (XdY format)}} ` +
        `{{With Modifiers=1d20+5, 2d6+3, 1d8-2}} ` +
        `{{Complex=1d20+1d4+3, (2d6+2)*2, 1d100/10}} ` +
        `{{Limits=1-100 dice, 1-1000 sides per die}} ` +
        `{{**Character Attributes**=Supported attribute names:}} ` +
        `{{Core Stats=hp, maxhp, ac, level, gold/gp, inspiration}} ` +
        `{{Abilities=str/dex/con/int/wis/cha (and modifiers)}} ` +
        `{{Examples={playerName.hp}, {monitoredName.ac}, {playerName.gold}}}`
    );
}

