/* ProximityNPC */

/** Represents a card style with colors and formatting.
 * @class
 */
class CardStyle {
    /**
     * Creates a new CardStyle.
     * @param {string} name - The name of the card style
     * @param {string} borderColor - Border color in hex (e.g. '#8b4513')
     * @param {string} backgroundColor - Background color in hex
     * @param {string} bubbleColor - Speech bubble color in hex
     * @param {string} textColor - Text color in hex
     */
    constructor(name, borderColor = '#8b4513', backgroundColor = '#f4e8d8', bubbleColor = '#ffffff', textColor = '#2c1810') {
        this.name = name;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.bubbleColor = bubbleColor;
        this.textColor = textColor;
    }
}

/**
 * Represents a message with content, weight, and optional card style.
 * @class
 */
class MessageObject {
    /**
     * Creates a new MessageObject.
     * @param {string} content - The message text content
     * @param {number} weight - Relative probability weight for random selection (default: 1)
     * @param {string} cardStyle - Optional card style name to override default styling
     */
    constructor(content, weight = 1, cardStyle = null) {
        this.content = content;
        this.weight = weight;
        this.cardStyle = cardStyle;
    }
}

/**
 * Represents a predefined NPC with proximity triggers and messages.
 * @class
 */
class PresetNPC {
    /**
     * Creates a new PresetNPC.
     * @param {string} name - The NPC's name
     * @param {number} distance - Trigger distance in body widths (default: 2)
     * @param {MessageObject[]} messages - Array of possible messages
     * @param {string} img - URL to NPC's image
     * @param {string} cardStyle - Default card style name for this NPC
     * @param {number} timeout - Cooldown time in milliseconds before re-triggering (default: 10000, 0 = permanent)
     */
    constructor(name, distance = 2, messages = [], img = '', cardStyle = 'Default', timeout = 10000) {
        this.name = name;
        this.distance = distance;
        this.messages = messages;
        this.img = img;
        this.cardStyle = cardStyle;
        this.timeout = timeout;
    }
}

/**
 * Represents a monitored NPC token with real-time position tracking.
 * @class
 */
class MonitoredNPC {
    /**
     * Creates a new MonitoredNPC.
     * @param {string} name - The NPC's name
     * @param {number} triggerDistance - Trigger distance body widths
     * @param {string} pageId - Roll20 page ID where NPC is located
     * @param {number} centerX - X coordinate of NPC center
     * @param {number} centerY - Y coordinate of NPC center
     * @param {Object} lastPosition - Last known position {x, y}
     * @param {number} timeout - Cooldown time in milliseconds before re-triggering (default: 10000, 0 = permanent)
     * @param {string} img - URL to NPC's image
     * @param {MessageObject[]} messages - Array of possible messages
     * @param {string} cardStyle - Card style name for this NPC
     */
    constructor(name, triggerDistance = 2, pageId = '', centerX = 0, centerY = 0, lastPosition = { x: 0, y: 0 }, timeout = 10000, img = '', messages = [], cardStyle = 'Default') {
        this.name = name;
        this.triggerDistance = triggerDistance; // body widths
        this.pageId = pageId;
        this.centerX = centerX;
        this.centerY = centerY;
        this.lastPosition = lastPosition; // {x, y}
        this.timeout = timeout;
        this.img = img;
        this.messages = messages;
        this.cardStyle = cardStyle;
    }
}

state.ProximityNPC = {
    defaultImagePath: '',
    defaultDistance: 2,
    presetNPCs: [
        new PresetNPC(
            'Tharos Raggenthraw',
            3,
            [
                new MessageObject('The Guild Master looks up, you see a look of intense thought clear from his eyes. "Ah {playerName}, I hope you\'re keeping your wits sharp; I\'ve got some jobs coming up for you."', 3),
                new MessageObject('Tharos nods at you, "Good to see you again, {playerName}. Remember, the guild is always here if you need assistance."', 3, 'Warm')
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/TharosRaggenthraw.png',
            'GuildMaster'
        ),
        new PresetNPC(
            'Kinris Morranfew',
            2,
            [
                new MessageObject('Smiling as she wipes down the bar, "{playerName}, long time no see! Need a drink?"', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KinrisMorranfew.png'
        ),
        new PresetNPC(
            'Ovlan Kalek',
            1.5,
            [
                new MessageObject('His head turns towards you but his eyes remain pinned to a thick tome... "Questions about my book? Oh for you {playerName} I\'ll even sign it."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/OvlanKalek.png'
        ),
        new PresetNPC(
            'Varon Tavis',
            2,
            [
                new MessageObject('"You\'re welcome to use the forge, there\'s an extra hammer on the wall there." He points to a long line of hanging hammers.', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/VaronTavis.png'
        ),
        new PresetNPC(
            'Caelum Riversong',
            2,
            [
                new MessageObject('"Ah, {playerName}, careful with that bandage. Let me show you a proper technique—your hands could save lives yet."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/CaelumRiversong.png'
        ),
        new PresetNPC(
            'Risha Swiftdancer',
            1.5,
            [
                new MessageObject('Risha glances at you with a quick grin. "Got something to fix or someone to trick, {playerName}? Either way, I\'m your gal."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/RishaSwiftdancer.png'
        ),
        new PresetNPC(
            'Lumen Silverflock',
            1.5,
            [
                new MessageObject('Quietly standing by the hall, Lumen nods at you. "I\'ll get that cleaned up, {playerName}. Don\'t worry, it\'ll be perfect."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/LemunSilverflock.png'
        ),
        new PresetNPC(
            'Bolagor Bonejaw',
            2,
            [
                new MessageObject('"Hungry, {playerName}? I can whip up something that\'ll put hair on your chest. Don\'t complain if it bites back!"', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/BolagorBonejaw.png'
        ),
        new PresetNPC(
            'Jade Clearrock',
            2,
            [
                new MessageObject('"Good day, {playerName}. Your quest report is ready for filing—or are you here to pick up a new adventure?" She gestures to the ledger with a serene smile.', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/JadeClearrock.png'
        ),
        new PresetNPC(
            'Fiona Wildfist',
            2,
            [
                new MessageObject('Fiona crouches beside her drake companion, who nudges you gently. "Mind your step, {playerName}, and say hello properly to my friend there."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/FionaMirage.png'
        ),
        new PresetNPC(
            'Ilikan Wildfist',
            2,
            [
                new MessageObject('"Everything in its place, {playerName}. Care to help me mend this armor? You\'ll learn a thing or two."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/IlikanWildfist.png'
        ),
        new PresetNPC(
            'Auren Wildfist',
            1.5,
            [
                new MessageObject('"I have the order memorized, {playerName}. Would you like me to fetch it for you, or do you need help with spell prep?"', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/AurenWildfist.png'
        ),
        new PresetNPC(
            'Keoti Fang',
            3,
            [
                new MessageObject('Keoti\'s amber eyes meet yours, sharp as a blade. "Stay alert, {playerName}. I don\'t tolerate slackers in my halls."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KeotiFang.png'
        ),
        new PresetNPC(
            'Snek Littlefoot',
            1.5,
            [
                new MessageObject('Snek darts around you, chattering, "{playerName}! Did you hear the news? I might have... maybe... gotten it a bit wrong..."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/SnekLittlefoot.png'
        ),
        new PresetNPC(
            'Who Wingfall',
            2,
            [
                new MessageObject('Who strums her lute softly, looking up. "A song for you, {playerName}, or just some news from the guild? Either way, I\'ve got you covered."', 3)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/WhoWingfall.png'
        )
    ],
    monitoredNPCs: {},
    cardStyles: [
        new CardStyle('Default'),
        new CardStyle('Warm', '#d2691e', '#fff0e0', '#ffffff', '#4b2e1e'),
        new CardStyle('GuildMaster', '#4b0082', '#e6e0f8', '#ffffff', '#2c1a4b'),
    ]
}

// Track which tokens have already triggered to avoid spam
let triggeredTokens = {};

/**
 * Finds a preset NPC by name.
 * @param {string} name - The NPC name to search for
 * @returns {PresetNPC|undefined} The found NPC or undefined
 */
function getPresetNPCByName(name) {
    return state.ProximityNPC.presetNPCs.find(npc => npc.name === name);
}

/**
 * Main function to set up NPC monitoring and event handlers.
 * Initializes chat message listeners and token movement tracking.
 */
function setupNPCProximity() {
    on('chat:message', function (msg) {
        let who = msg.who || "gm";

        // Listen for API commands to add NPCs to monitoring
        if (msg.type == "api" && msg.content.startsWith("!proximitynpc")) {
            if (msg.content.includes("--monitor") || msg.content.includes("-M")) {
                let args = msg.content.trim().split(" ");

                // If more than 3 args, treat as edit call
                if (args.length > 3) {
                    handleEditMonitoredNPC(msg);
                } else {
                    handleMonitorNPC(msg);
                }
                return;
            }

            if (msg.content.includes("--edit") || msg.content.includes("-e")) {
                handleEditMonitoredNPC(msg);
                handleListMonitoredNPCs(msg);
                return;
            }

            if (msg.content.includes("--menu") || msg.content.includes("-m")) {
                handleProximityNPCMenu(msg);
                return;
            }

            if (msg.content.includes("--list") || msg.content.includes("-l")) {
                handleListMonitoredNPCs(msg);
                return;
            }

            if (msg.content.includes("--help") || msg.content.includes("-h")) {
                showHelpMessage(msg);
                return;
            }

            if (msg.content.includes("--cardstyles") || msg.content.includes("-c")) {
                handleListCardStyles(msg);
                return;
            }

            if (msg.content.includes("--cardstyle") || msg.content.includes("-C")) {
                handleEditCardStyle(msg);
                return;
            }

            if (msg.content.includes("--trigger") || msg.content.includes("-t")) {
                handleTriggerNPC(msg);
                return;
            }

            if (msg.content.includes("--delete") || msg.content.includes("-D")) {
                handleDeleteMonitor(msg);
                return;
            }
            
            sendChat("NPC Monitor", "/w " + who + " Unknown command. Review the help:");
            showHelpMessage(msg);
            return;
        }
    });

    // Monitor all token movements (new Roll20 API format)
    on('change:graphic', function (token, prev) {
        // Only check tokens that have moved
        if (token.get('left') !== prev.left || token.get('top') !== prev.top) {
            checkAllProximities(token);
        }
    });
}

function createMonitoredNPCFromToken(msg, token) {
    if (!state.ProximityNPC.monitoredNPCs[token.id]) {
        state.ProximityNPC.monitoredNPCs[token.id] = 
            new MonitoredNPC(
                token.get('name'),
                state.ProximityNPC.defaultDistance || 2,
                token.get('pageid'),
                token.get('left') + (token.get('width') / 2),
                token.get('top') + (token.get('height') / 2),
                { x: token.get('left'), y: token.get('top') },
                state.ProximityNPC.defaultTimeout || 10000,
                state.ProximityNPC.defaultImagePath || '',
                [],
                state.ProximityNPC.cardStyles[0].name || 'Default'
            );
    }
    showEditMonitorNPCDialog(msg, token);
}

function toSafeName(name) {
    return name.trim().replace(/\s+/g, "_");
}

function fromSafeName(safeName) {
    return safeName.replace(/_/g, " ").trim();
}

function showEditMonitorNPCDialog(msg, token) {
    let properties = [
        { name: 'Trigger Distance (body widths)', type: 'number', attr: 'triggerDistance'},
        { name: 'Timeout (ms, 0 permanent)', type: 'number', attr: 'timeout'},
        { name: 'Image URL', type: 'text', attr: 'img'},
        { name: 'Card Style', type: 'select', attr: 'cardStyle', options: state.ProximityNPC.cardStyles.map(style => style.name)},
        { name: 'Messages', type: 'messages', attr: 'messages'}
    ];

    let monitoredNPC = state.ProximityNPC.monitoredNPCs[token.id];
    if (!monitoredNPC) {
        sendChat("NPC Monitor", "/w gm Could not find monitored NPC for " + token.get('name'));
        return;
    }

    let safeNPCName = toSafeName(monitoredNPC.name);
    sendChat("NPC Monitor", `/w gm &{template:default} {{name=Edit Monitored NPC: ${monitoredNPC.name}}} ${properties.map((prop) => {
        return `{{[${prop.name}](!proximitynpc -M ${safeNPCName} ${prop.attr})}}`
    }).join(" ")} {{[Delete](!proximitynpc -D ${safeNPCName})}}`);
}

function showHelpMessage(msg = {who: "gm"}) {
    let who = msg.who || "gm";

    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Help}} {{!proximitynpc=Main call required before args}} {{--monitor | -M=Requires token to be selected, ensures the token is monitored up to date and opens the editing menu}} {{--list | -l=Lists all currently monitored NPC tokens}} {{--menu | -m=Opens the main menu for managing ProximityNPC}} {{--help | -h=Displays this help message}}`);
    return;
}

/* !proximitynpc --C Style_Name prop value */
/* !proximitynpc --C Style_Name prop value */
/* !proximitynpc --C Style_Name prop value */
function handleEditCardStyle(msg) {
    let who = msg.who || "gm";
    let args = msg.content.trim().split(" ");
    
    // Handle creating new card style
    if (args.length >= 3 && (args[2].toLowerCase() === 'new' || args[2].toLowerCase() === 'create')) {
        let styleName = fromSafeName(args.slice(3).join(" "));
        
        if (!styleName) {
            sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Create New Card Style}} {{Enter style name=[Click Here](!proximitynpc -C new ?{Style Name})}}`);
            return;
        }
        
        // Check if style already exists
        if (state.ProximityNPC.cardStyles.find(style => style.name.toLowerCase() === styleName.toLowerCase())) {
            sendChat("NPC Monitor", `/w ${who} Card style "${styleName}" already exists.`);
            return;
        }
        
        // Create new card style with default colors
        let newStyle = new CardStyle(styleName);
        state.ProximityNPC.cardStyles.push(newStyle);
        
        sendChat("NPC Monitor", `/w ${who} Created new card style: "${styleName}".`);
        handleEditCardStyle({
            content: `!proximitynpc -C ${toSafeName(style.name)}`,
            who: who
        })
        return;
    }
    
    // Handle deleting card style
    if (args.length >= 3 && (args[2].toLowerCase() === 'delete' || args[2].toLowerCase() === 'remove')) {
        if (args.length < 4) {
            // Show clickable menu of styles to delete (excluding Default)
            let deletableStyles = state.ProximityNPC.cardStyles.filter(style => style.name !== 'Default');
            
            if (deletableStyles.length === 0) {
                sendChat("NPC Monitor", `/w ${who} No card styles can be deleted (Default style is protected).`);
                return;
            }
            
            let styleList = deletableStyles.map(style => 
                `{{[${style.name}](!proximitynpc -C delete ${toSafeName(style.name)})}}`
            ).join(' ');
            
            sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Delete Card Style}} ${styleList}`);
            return;
        }
        
        let styleName = args.slice(3).join(" ").replace("_", " ").trim();
        
        // Prevent deletion of Default style
        if (styleName.toLowerCase() === 'default') {
            sendChat("NPC Monitor", `/w ${who} Cannot delete the Default card style.`);
            return;
        }
        
        let styleIndex = state.ProximityNPC.cardStyles.findIndex(style => style.name.toLowerCase() === styleName.toLowerCase());
        
        if (styleIndex === -1) {
            sendChat("NPC Monitor", `/w ${who} Could not find card style: ${styleName}`);
            return;
        }
        
        // Check if any NPCs are using this style
        let npcsUsingStyle = [];
        Object.values(state.ProximityNPC.monitoredNPCs).forEach(npc => {
            if (npc.cardStyle === state.ProximityNPC.cardStyles[styleIndex].name) {
                npcsUsingStyle.push(npc.name);
            }
        });
        
        state.ProximityNPC.presetNPCs.forEach(npc => {
            if (npc.cardStyle === state.ProximityNPC.cardStyles[styleIndex].name) {
                npcsUsingStyle.push(npc.name);
            }
        });
        
        if (npcsUsingStyle.length > 0) {
            sendChat("NPC Monitor", `/w ${who} Cannot delete "${styleName}" - it's being used by: ${npcsUsingStyle.join(', ')}. Change their card styles first.`);
            return;
        }
        
        let deletedStyle = state.ProximityNPC.cardStyles.splice(styleIndex, 1)[0];
        sendChat("NPC Monitor", `/w ${who} Deleted card style: "${deletedStyle.name}"`);
        return;
    }
    
    // If no style name provided, show list of styles for editing
    if (args.length < 3) {
        let styleList = state.ProximityNPC.cardStyles.map(style => 
            `{{[${style.name}](!proximitynpc -C ${toSafeName(style.name)})}}`
        ).join(' ');
        
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Edit Card Styles}} {{[Create New](!proximitynpc -C new)}} ${styleList}`);
        return;
    }
    
    let styleName = args[2].replace("_", " ").trim();
    let cardStyle = state.ProximityNPC.cardStyles.find(style => style.name.toLowerCase() === styleName.toLowerCase());
    
    if (!cardStyle) {
        sendChat("NPC Monitor", `/w ${who} Could not find card style: ${styleName}. Use !proximitynpc --cardstyles to see available styles.`);
        return;
    }
    
    // If no property specified, show edit dialog with clickable properties
    if (args.length < 4) {
        // Don't allow editing of Default style properties
        if (cardStyle.name === 'Default') {
            sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Card Style: ${cardStyle.name}}} {{This is the default style and cannot be edited.}} {{[Create New Style](!proximitynpc -C new)}}`);
            return;
        }
        
        let properties = [
            { name: 'Border Color', type: 'color', attr: 'borderColor', value: cardStyle.borderColor },
            { name: 'Background Color', type: 'color', attr: 'backgroundColor', value: cardStyle.backgroundColor },
            { name: 'Bubble Color', type: 'color', attr: 'bubbleColor', value: cardStyle.bubbleColor },
            { name: 'Text Color', type: 'color', attr: 'textColor', value: cardStyle.textColor }
        ];
        
        let propertyLinks = properties.map(prop => 
            `{{[${prop.name}: ${prop.value}](!proximitynpc -C ${toSafeName(cardStyle.name)} ${prop.attr})}}`
        ).join(" ");
        
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Edit Card Style: ${cardStyle.name}}} ${propertyLinks} {{[Delete Style](!proximitynpc -C delete ${toSafeName(cardStyle.name)})}}`);
        return;
    }
    
    let property = args[3].toLowerCase();
    
    // Prevent editing Default style properties
    if (cardStyle.name === 'Default') {
        sendChat("NPC Monitor", `/w ${who} Cannot edit properties of the Default card style.`);
        return;
    }
    
    // If no value provided, show input prompt with current value as default
    if (args.length < 5) {
        let promptMessage = "";
        let currentValue = cardStyle[property];
        
        switch(property) {
            case 'bordercolor':
                promptMessage = "Enter border color ^any CSS color - red, #ff0000, rgb^255,0,0^, etc.^:";
                break;
            case 'backgroundcolor':
                promptMessage = "Enter background color ^any CSS color^:";
                break;
            case 'bubblecolor':
                promptMessage = "Enter speech bubble color ^any CSS color^:";
                break;
            case 'textcolor':
                promptMessage = "Enter text color ^any CSS color^:";
                break;
            default:
                sendChat("NPC Monitor", `/w ${who} Unknown property: ${property}. Valid properties: borderColor, backgroundColor, bubbleColor, textColor`);
                return;
        }
        
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set ${property} for ${cardStyle.name}}} {{Current: ${currentValue}}} {{${promptMessage}=[Click Here](!proximitynpc -C ${toSafeName(cardStyle.name)} ${property} ?{${promptMessage}|${currentValue}})}}`);
        return;
    }
    
    let value = args.slice(4).join(" ").trim();
    
    // No validation - accept any string as CSS will handle validation at runtime
    // This allows color names, hex, rgb(), hsl(), etc.
    
    switch(property) {
        case 'bordercolor':
            cardStyle.borderColor = value;
            sendChat("NPC Monitor", `/w ${who} Updated ${cardStyle.name} border color to "${value}"`);
            break;
        case 'backgroundcolor':
            cardStyle.backgroundColor = value;
            sendChat("NPC Monitor", `/w ${who} Updated ${cardStyle.name} background color to "${value}"`);
            break;
        case 'bubblecolor':
            cardStyle.bubbleColor = value;
            sendChat("NPC Monitor", `/w ${who} Updated ${cardStyle.name} bubble color to "${value}"`);
            break;
        case 'textcolor':
            cardStyle.textColor = value;
            sendChat("NPC Monitor", `/w ${who} Updated ${cardStyle.name} text color to "${value}"`);
            break;
        default:
            sendChat("NPC Monitor", `/w ${who} Unknown property: ${property}. Valid properties: borderColor, backgroundColor, bubbleColor, textColor`);
            return;
    }
    
    // Show the updated edit dialog
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Card Style Updated}} {{[Continue Editing ${cardStyle.name}](!proximitynpc -C ${toSafeName(cardStyle.name)})}}`);
}

// Also update the handleListCardStyles function to be more interactive
function handleListCardStyles(msg) {
    let who = msg.who || "gm";

    let styleList = state.ProximityNPC.cardStyles.map(style => 
        `{{[${style.name}](!proximitynpc -C ${toSafeName(style.name)})}}`
    ).join(' ');

    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Card Styles}} {{[Create New](!proximitynpc -C new)}} ${styleList}`);
}

/* !proximitynpc --delete NPC_Name */
function handleDeleteMonitor(msg) {
    let who = msg.who || "gm";
    let args = msg.content.trim().split(" ");

    // If no NPC name is given, show a clickable menu of monitored NPCs
    if (args.length < 3) {
        let monitoredNPCs = Object.values(state.ProximityNPC.monitoredNPCs);
        if (monitoredNPCs.length === 0) {
            sendChat("NPC Monitor", `/w ${who} No NPCs are currently being monitored.`);
            return;
        }

        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Delete}} ` +
            monitoredNPCs.map(npc => {
                let safeName = toSafeName(npc.name);
                return `{{[${npc.name}](!proximitynpc -D ${safeName})}}`;
            }))
        return;
    }

    // Otherwise, delete the specific NPC
    // Parsing argument safely
    let npcName = fromSafeName(args[2]);

    // When generating delete menu
    

    let npcEntry = Object.entries(state.ProximityNPC.monitoredNPCs)
        .find(([tokenId, npc]) => npc.name.trim() === npcName);

    if (!npcEntry) {
        sendChat("NPC Monitor", `/w ${who} Could not find monitored NPC with name: ${npcName}`);
        return;
    }

    let [tokenId, npc] = npcEntry;

    // Remove from monitored list
    delete state.ProximityNPC.monitoredNPCs[tokenId];

    // Remove any pending triggers for this NPC
    Object.keys(triggeredTokens).forEach(key => {
        if (key.endsWith(`_${tokenId}`)) {
            delete triggeredTokens[key];
        }
    });

    sendChat("NPC Monitor", `/w ${who} Successfully removed ${npc.name} from monitoring.`);
}

/* !proximitynpc --edit NPC_Name prop value */
function handleEditMonitoredNPC(msg) {
    let who = msg.who || "gm";
    let args = msg.content.trim().split(" "); 
    
    // Parsing argument safely
    let npcName = fromSafeName(args[2]);

    if (args.length < 4) {
        let tokenId = msg.selected[0]._id;
        let token = getObj('graphic', tokenId);
        showEditMonitorNPCDialog(msg, token);
        return;
    }

    let property = args[3].toLowerCase();
    if (args.length < 5) {
        let promptMessage = "";

        switch(property) {
            case 'triggerdistance':
                promptMessage = "Enter a new trigger distance ^in body widths^:";
                break;
            case 'timeout':
                promptMessage = "Enter a new timeout value ^ms, 0 permanent^:";
                break;
            case 'img':
                promptMessage = "Paste the new image URL:";
                break;
            case 'cardstyle':
                promptMessage = "Enter a card style name:";
                handleListCardStyles(msg);
                break;
            default:
                sendChat("NPC Monitor", `/w ${who} Unknown property: ${property}`);
                return;
        }

        // When generating edit dialog
        let safeName = toSafeName(npcName);
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set ${property} for ${npcName}}} {{${promptMessage}=[Click Here](!proximitynpc -M ${safeName} ${property} ?{${promptMessage}})}}`);
        return;
    }

    let value = args.slice(4).join(" ").trim();

    let monitoredNPC = Object.values(state.ProximityNPC.monitoredNPCs).find(npc => npc.name.trim() === npcName);

    if (!monitoredNPC) {
        sendChat("NPC Monitor", "/w " + who + " Could not find monitored NPC with name: " + npcName);
        return;
    }

    switch (property) {
        case 'triggerdistance':
            let distance = parseFloat(value);
            if (isNaN(distance) || distance <= 0) {
                sendChat("NPC Monitor", "/w " + who + " Invalid distance value. Must be a positive number.");
                monitoredNPC.triggerDistance = state.ProximityNPC.defaultDistance || 2;
                return;
            }
            monitoredNPC.triggerDistance = distance;
            sendChat("NPC Monitor", "/w " + who + " Updated " + monitoredNPC.name + " trigger distance to " + distance);
            return;
        case 'timeout':
            let timeout = parseInt(value);
            if (isNaN(timeout) || timeout < 0) {
                sendChat("NPC Monitor", "/w " + who + " Invalid timeout value. Must be a non-negative integer.");
                monitoredNPC.timeout = state.ProximityNPC.defaultTimeout || 10000;
                return;
            }
            monitoredNPC.timeout = timeout;
            sendChat("NPC Monitor", "/w " + who + " Updated " + monitoredNPC.name + " timeout to " + timeout + " ms");
            return;
        case 'img':
            monitoredNPC.img = value;
            sendChat("NPC Monitor", "/w " + who + " Updated " + monitoredNPC.name + " image URL.");
            return;
        case 'cardstyle':
            let cardStyle = state.ProximityNPC.cardStyles.find(style => style.name.toLowerCase() === value.toLowerCase());
            if (!cardStyle) {
                sendChat("NPC Monitor", "/w " + who + " Invalid card style name. Use !proximitynpc --cardstyles to list available styles.");
                return;
            }
            monitoredNPC.cardStyle = cardStyle.name;
            sendChat("NPC Monitor", "/w " + who + " Updated " + monitoredNPC.name + " card style to " + cardStyle.name);
            return;
        default:
            sendChat("NPC Monitor", "/w " + who + " Unknown property: " + property + ". Valid properties are: triggerdistance, timeout, img, cardstyle.");
            return;
    }
}

function handleProximityNPCMenu(msg) {
    let who = msg.who;
    
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Menu}} {{[Add/Edit NPC Monitor](!proximitynpc -M)}}{{[List Monitored NPCs](!proximitynpc -l)}} {{[Trigger NPC](!proximitynpc -t)}} {{[Card Styles](!proximitynpc -c)}} {{[Help](!proximitynpc -h)}}`);
    return;
}

function handleListMonitoredNPCs(msg) {
    let who = msg.who || "gm";

    let monitoredNPCs = Object.values(state.ProximityNPC.monitoredNPCs);

    if (monitoredNPCs.length === 0) {
        sendChat("NPC Monitor", "/w " + who + " No NPCs are currently being monitored. Use !proximitynpc --monitor to add one.");
        return;
    }

    let list = monitoredNPCs.map(npc => {
        let safeName = toSafeName(npc.name);
        return `{{[${npc.name}](!proximitynpc -M ${safeName})=(Distance: ${npc.triggerDistance}, Timeout: ${npc.timeout} ms, Messages: ${npc.messages.length}, CardStyle: ${npc.cardStyle})}}`;
    }).join(' ');


    sendChat("NPC Monitor", "/w " + who + "&{template:default} {{name=NPC Proximity Monitor List}} "  + list);
    return;
}

function handleTriggerNPC(msg) {
    if (!msg.selected || msg.selected.length === 0) {
        sendChat("NPC Monitor", "/w " + msg.who + " Please select a token to trigger.");
        return;
    }

    let tokenId = msg.selected[0]._id;
    let token = getObj('graphic', tokenId);

    if (!token) {
        sendChat("NPC Monitor", "/w " + msg.who + " Could not find selected token.");
        return;
    }

    let monitoredNPC = state.ProximityNPC.monitoredNPCs[tokenId];

    if (!monitoredNPC) {
        sendChat("NPC Monitor", "/w " + msg.who + " Selected token is not a monitored NPC.");
        return;
    }

    triggerNPCMessage(monitoredNPC);
    return;
}

/**
 * Handles NPC token selection and configuration via chat command !proximitynpc (--monitor | -m).
 * @param {Object} msg - The chat message object containing selection data
 */
function handleMonitorNPC(msg) {
    let who = msg.who;

    // If a token is selected, use it
    if (msg.selected && msg.selected.length > 0) {
        let tokenId = msg.selected[0]._id;
        let token = getObj('graphic', tokenId);
        if (!token) {
            sendChat("NPC Monitor", "/w " + who + " Could not find the selected token.");
            return;
        }

        // If not monitored yet, create and show dialog
        if (!state.ProximityNPC.monitoredNPCs[tokenId]) {
            createMonitoredNPCFromToken(msg, token);
            return;
        }

        // Already monitored: update and show edit dialog
        showEditMonitorNPCDialog(msg, token);
        return;
    }

    // If no token is selected, show menu of available tokens
    let tokens = findObjs({ type: 'graphic', subtype: 'token', layer: 'objects' });
    if (tokens.length === 0) {
        sendChat("NPC Monitor", "/w " + who + " No tokens found on the page to monitor.");
        return;
    }

    // Show menu of tokens to select for monitoring
    // When showing menu of tokens
    let menu = tokens.map(t => {
        let safeName = toSafeName(t.get('name'));
        return `{{[${t.get('name')}](!proximitynpc -M ${safeName})}}`;
    }).join(' ');

    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Select a Token to Monitor}} ${menu}`);
}


/**
 * Calculates the distance between two points using Pythagorean theorem.
 * @param {number} x1 - First point X coordinate
 * @param {number} y1 - First point Y coordinate
 * @param {number} x2 - Second point X coordinate
 * @param {number} y2 - Second point Y coordinate
 * @returns {number} The calculated distance
 */
function calculateDistance(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Checks proximity for all moving tokens against monitored NPCs.
 * @param {Graphic} movedToken - The token that moved
 */
function checkAllProximities(movedToken) {
    let movedTokenId = movedToken.id;
    let movedTokenPage = movedToken.get('pageid');
    let movedTokenWidth = movedToken.get('width');
    let movedTokenX = movedToken.get('left') + (movedTokenWidth / 2);
    let movedTokenY = movedToken.get('top') + (movedToken.get('height') / 2);

    // Get player name from token
    let playerName = getPlayerNameFromToken(movedToken);

    // Check against all monitored NPCs
    Object.keys(state.ProximityNPC.monitoredNPCs).forEach(npcTokenId => {
        let npc = state.ProximityNPC.monitoredNPCs[npcTokenId];

        // Only check if on same page
        if (npc.pageId !== movedTokenPage) return;

        // Prevent an NPC token from triggering itself if it's being moved
        if (movedTokenId === npcTokenId) return;

        // Update NPC position if it has moved
        let npcToken = getObj('graphic', npcTokenId);
        if (npcToken && (npcToken.get('left') !== npc.lastPosition.x || npcToken.get('top') !== npc.lastPosition.y)) {
            let npcWidth = npcToken.get('width');
            npc.centerX = npcToken.get('left') + (npcWidth / 2);
            npc.centerY = npcToken.get('top') + (npcToken.get('height') / 2);
            npc.lastPosition = { x: npcToken.get('left'), y: npcToken.get('top') };
        }

        // Calculate distance using simple distance formula
        let distance = calculateDistance(npc.centerX, npc.centerY, movedTokenX, movedTokenY);

        // Create unique key for this token-NPC combination
        let triggerKey = movedTokenId + '_' + npcTokenId;

        if (distance <= npc.triggerDistance) {
            // Only trigger if this token hasn't triggered for this NPC recently
            if (!triggeredTokens[triggerKey]) {
                triggerNPCMessage(npc, playerName);
                triggeredTokens[triggerKey] = true;

                // Clear the trigger after 30 seconds to allow re-triggering
                setTimeout(() => {
                    if (npc.timeout === 0) return; // Permanent trigger, do not clear
                    delete triggeredTokens[triggerKey];
                }, npc.timeout > 0 ? npc.timeout : 1 || 10000);
            }
        }
    });
}

/**
 * Extracts player name from a token via its represented character.
 * @param {Graphic} token - The token to get the player name from
 * @returns {string} The player/character name or 'Guild Member' as fallback
 */
function getPlayerNameFromToken(token) {
    let characterId = token.get('represents');
    if (characterId) {
        let character = getObj('character', characterId);
        if (character) {
            return character.get('name').trim() || 'Guild Member';
        }
    }
    return 'Guild Member';
}

/**
 * Gets a random message from an array of MessageObjects.
 * 
 * Custom message object can have:
 * - content: The message text (required)
 * - weight: Relative chance of being selected (default 1)
 * - cardStyle: Optional card style to override NPC default
 *  
 * @param {MessageObject[]} messageObjects - Array of message objects to choose from
 * @returns {MessageObject} A randomly selected message object
 */
function getRandomMessage(messageObjects) {
    if (!messageObjects || messageObjects.length === 0) {
        return {
            content: "They are lost in thought, not even looking your way."
        }
    };
    let messages = [];
    messageObjects.forEach(messageObject => {
        let weight = messageObject.weight || 1;
        for (let i = 0; i < weight; i++) {
            messages.push(messageObject);
        }
    });
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Triggers and displays an NPC message when proximity condition is met.
 * @param {MonitoredNPC} npc - The NPC that triggered the message
 * @param {string} playerName - The name of the player who triggered the NPC
 */
function triggerNPCMessage(npc, playerName="Guild Member") {
    if (!npc) return;

    let selectedMessage = getRandomMessage(npc.messages);

    // Replace player name placeholder
    let personalizedMessage = selectedMessage.content.replace(/{playerName}/g, playerName == "Guild Member" ? playerName : playerName.split(" ")[0]);

    let defaultCardStyle = state.ProximityNPC.cardStyles.find(style => style.name === 'Default');

    let cardStyle = defaultCardStyle;

    if (npc.cardStyle) {
        cardStyle = state.ProximityNPC.cardStyles.find(style => style.name === npc.cardStyle);
    }

    if (selectedMessage.cardStyle) {
        cardStyle = state.ProximityNPC.cardStyles.find(style => style.name === selectedMessage.cardStyle);
    }

    // Build styled card
    let card = `<div style="background: ${cardStyle.backgroundColor || defaultCardStyle.backgroundColor}; border: 3px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 10px; padding: 15px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">` +
        (npc.img ? `<div style="text-align: center; margin-bottom: 10px;">` +
            `<img src="` + npc.img + `" style="max-width: 200px; border: 4px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">` +
            `</div>` : ``) +
        `<div style="background: ${cardStyle.bubbleColor || defaultCardStyle.bubbleColor}; border: 2px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 8px; padding: 12px; position: relative;">` +
        `<div style="position: absolute; top: -10px; left: 20px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid ${cardStyle.borderColor || defaultCardStyle.borderColor};"></div>` +
        `<div style="position: absolute; top: -7px; left: 21px; width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 9px solid white;"></div>` +
        `<p style="margin: 0; color: ${cardStyle.textColor || defaultCardStyle.textColor}; font-size: 14px; line-height: 1.6;"><strong>` + npc.name + `:</strong></p>` +
        `<p style="margin: 8px 0 0 0; color: ${cardStyle.textColor || defaultCardStyle.textColor}; font-size: 14px; line-height: 1.6; font-style: italic;">` + personalizedMessage + `</p>` +
        `</div>` +
        `</div>`;

    // Send as whisper to the player who triggered it
    sendChat(npc.name, card);

    // Prevent self-triggering
    if (getPresetNPCByName(playerName)) return;
}

/**
 * Automatically monitors all NPC tokens from presetNPCs that exist on the current page.
 * Scans all tokens and adds matching preset NPCs to monitoring.
 */
function autoMonitorNPCs() {
    // Get all tokens on the current Roll20 page
    let allTokens = findObjs({ type: 'graphic', subtype: 'token' });

    allTokens.forEach(token => {
        let tokenName = token.get('name');

        let presetNPC = getPresetNPCByName(tokenName);

        if (presetNPC) {
            // Skip if already monitored
            if (Object.values(state.ProximityNPC.monitoredNPCs).some(npc => npc.name === tokenName)) return;

            let tokenWidth = token.get('width');
            let triggerDistancePixels = tokenWidth * presetNPC.distance;

            state.ProximityNPC.monitoredNPCs[token.id] = new MonitoredNPC(
                tokenName,
                triggerDistancePixels,
                token.get('pageid'),
                token.get('left') + (tokenWidth / 2),
                token.get('top') + (token.get('height') / 2),
                { x: token.get('left'), y: token.get('top') },
                presetNPC.timeout,
                presetNPC.img,
                presetNPC.messages,
                presetNPC.cardStyle || 'Default',
            );
        }
    });
}

// Initialize the script when ready
on('ready', function () {
    setupNPCProximity();
    autoMonitorNPCs(); // <-- automatically monitor all NPCs in presetNPCs
    log('✅ NPC Proximity Trigger Script loaded and auto-monitoring NPCs!');
});