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
                handleMonitorNPC(msg);
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

            if (msg.content.includes("--trigger") || msg.content.includes("-t")) {
                handleTriggerNPC(msg);
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

function createMonitoredNPCFromToken(token) {
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
    showEditMonitorNPCDialog(token);
}

function showEditMonitorNPCDialog(token) {
}

function showHelpMessage(msg = {who: "gm"}) {
    let who = msg.who || "gm";

    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Help}} {{!proximitynpc=Main call required before args}} {{--monitor | -M=Requires token to be selected, ensures the token is monitored up to date and opens the editing menu}} {{--list | -l=Lists all currently monitored NPC tokens}} {{--menu | -m=Opens the main menu for managing ProximityNPC}} {{--help | -h=Displays this help message}}`);
    return;
}

function handleProximityNPCMenu(msg) {
    let who = msg.who;
    
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Menu}} {{[Add/Edit NPC Monitor](!proximitynpc -M)}}{{[List Monitored NPCs](!proximitynpc -l)}} {{[Trigger NPC](!proximitynpc -t)}} {{[Card Styles](!proximitynpc -c)}} {{[Help](!proximitynpc -h)}}`);
    return;
}

function handleListMonitoredNPCs(msg) {
    let who = msg.who;

    let monitoredNPCs = Object.values(state.ProximityNPC.monitoredNPCs);

    if (monitoredNPCs.length === 0) {
        sendChat("NPC Monitor", "/w " + who + " No NPCs are currently being monitored. Use !proximitynpc --monitor to add one.");
        return;
    }

    let list = monitoredNPCs.map(npc => `- ${npc.name} (Distance: ${npc.triggerDistance}, Timeout: ${npc.timeout} ms, Messages: ${npc.messages.length}, CardStyle: ${npc.cardStyle})`).join('\n');

    sendChat("NPC Monitor", "/w " + who + " Currently monitored NPCs:\n" + list);
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

function handleListCardStyles(msg) {
    
}

/**
 * Handles NPC token selection and configuration via chat command !proximitynpc (--monitor | -m).
 * @param {Object} msg - The chat message object containing selection data
 */
function handleMonitorNPC(msg) {
    let who = msg.who;

    // If there is no token selected, show help message
    if (!msg.selected || msg.selected.length === 0) {
        sendChat("NPC Monitor", "/w " + who + " Please select a token to monitor.");
        showHelpMessage();
        return;
    }

    let tokenId = msg.selected[0]._id;
    let token = getObj('graphic', tokenId);

    if (!token) {
        sendChat("NPC Monitor", "/w " + who + " Could not find selected token.");
        return;
    }

    let tokenName = token.get('name');

    // If token is not already monitored, create a new monitored NPC entry and show dialog to configure
    if (!state.ProximityNPC.monitoredNPCs[tokenId]) {
        createMonitoredNPCFromToken(token);
        showEditMonitorNPCDialog(who, token);
        return;
    }

    // If token is already monitored, update its position and show dialog to edit
    let monitoredNPC = state.ProximityNPC.monitoredNPCs[tokenId];

    // Calculate trigger distance in pixels (body widths * token diameter)
    let tokenWidth = token.get('width');
    let triggerDistancePixels = tokenWidth * (monitoredNPC.distance + tokenWidth / 50);

    // Store NPC monitoring data
    state.ProximityNPC.monitoredNPCs[tokenId] = new MonitoredNPC(
        tokenName,
        triggerDistancePixels,
        token.get('pageid'),
        token.get('left') + (tokenWidth / 2),
        token.get('top') + (token.get('height') / 2),
        { x: token.get('left'), y: token.get('top') },
        monitoredNPC.timeout,
        monitoredNPC.img,
        monitoredNPC.messages,
        monitoredNPC.cardStyle || 'Default'
    );

    showEditMonitorNPCDialog(who, token);
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