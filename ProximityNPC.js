/* ProximityNPC */

const npcTriggers = {
    'Tharos Raggenthraw': {
        distance: 3,
        message: 'The Guild Master looks up, you see a look of intense thought clear from his eyes. "Ah {playerName}, I hope you\'re keeping your wits sharp; I\'ve got some jobs coming up for you."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/TharosRaggenthraw.png'
    },
    'Kinris Morranfew': {
        distance: 2,
        message: 'Smiling as she wipes down the bar, "{playerName}, long time no see! Need a drink?"',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KinrisMorranfew.png'
    },
    'Ovlan Kalek': {
        distance: 1.5,
        message: 'His head turns towards you but his eyes remain pinned to a thick tome... "Questions about my book? Oh for you {playerName} I\'ll even sign in."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/OvlanKalek.png'
    },
    'Varon Tavis': {
        distance: 2,
        message: '"You\'re welcome to use the forge, there\'s an extra hammer on the wall there." He points to a long line of hanging hammers.',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/VaronTavis.png'
    },
    'Caelum Riversong': {
        distance: 2,
        message: '"Ah, {playerName}, careful with that bandage. Let me show you a proper technique—your hands could save lives yet."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/CaelumRiversong.png'
    },
    'Risha Swiftdancer': {
        distance: 1.5,
        message: 'Risha glances at you with a quick grin. "Got something to fix or someone to trick, {playerName}? Either way, I\'m your gal."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/RishaSwiftdancer.png'
    },
    'Lumen Silverflock': {
        distance: 1.5,
        message: 'Quietly standing by the hall, Lumen nods at you. "I\'ll get that cleaned up, {playerName}. Don\'t worry, it\'ll be perfect."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/LemunSilverflock.png'
    },
    'Bolagor Bonejaw': {
        distance: 2,
        message: '"Hungry, {playerName}? I can whip up something that\'ll put hair on your chest. Don\'t complain if it bites back!"',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/BolagorBonejaw.png'
    },
    'Jade Clearrock': {
        distance: 2,
        message: '"Good day, {playerName}. Your quest report is ready for filing—or are you here to pick up a new adventure?" She gestures to the ledger with a serene smile.',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/JadeClearrock.png'
    },
    'Fiona Wildfist': {
        distance: 2,
        message: 'Fiona crouches beside her drake companion, who nudges you gently. "Mind your step, {playerName}, and say hello properly to my friend there."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/FionaMirage.png'
    },
    'Ilikan Wildfist': {
        distance: 2,
        message: '"Everything in its place, {playerName}. Care to help me mend this armor? You\'ll learn a thing or two."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/IlikanWildfist.png'
    },
    'Auren Wildfist': {
        distance: 1.5,
        message: '"I have the order memorized, {playerName}. Would you like me to fetch it for you, or do you need help with spell prep?"',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/AurenWildfist.png'
    },
    'Keoti Fang': {
        distance: 3,
        message: 'Keoti\'s amber eyes meet yours, sharp as a blade. "Stay alert, {playerName}. I don\'t tolerate slackers in my halls."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KeotiFang.png'
    },
    'Snek Littlefoot': {
        distance: 1.5,
        message: 'Snek darts around you, chattering, "{playerName}! Did you hear the news? I might have... maybe... gotten it a bit wrong..."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/SnekLittlefoot.png'
    },
    'Who Wingfall': {
        distance: 2,
        message: 'Who strums her lute softly, looking up. "A song for you, {playerName}, or just some news from the guild? Either way, I\'ve got you covered."',
        img: 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/WhoWingfall.png'
    }
};

// Store monitored NPCs and their trigger distances
let monitoredNPCs = {};
// Track which tokens have already triggered to avoid spam
let triggeredTokens = {};

// Main function to set up NPC monitoring
function setupNPCProximity() {
    on('chat:message', function(msg) {
        // Listen for API commands to add NPCs to monitoring
        if (msg.type == "api" && msg.content.startsWith("!monitornpc")) {
            handleNPCSelection(msg);
        }
        
        // Add command to list monitored NPCs
        if (msg.type == "api" && msg.content.startsWith("!listnpcs")) {
            listMonitoredNPCs(msg);
        }
        
        // Add command to clear monitored NPCs
        if (msg.type == "api" && msg.content.startsWith("!clearnpcs")) {
            monitoredNPCs = {};
            triggeredTokens = {};
            sendChat("NPC Monitor", "/w " + msg.who + " Cleared all monitored NPCs.");
        }
    });

    // Monitor all token movements
    on('change:graphic', function(token) {
        // Only check tokens that have moved (position changes)
        if (token.get('left') !== token.previous('left') || token.get('top') !== token.previous('top')) {
            checkAllProximities(token);
        }
    });
}

// Handle NPC token selection and configuration
function handleNPCSelection(msg) {
    let who = msg.who;
    let playerId = msg.playerid;
    
    if (!msg.selected || msg.selected.length === 0) {
        sendChat("NPC Monitor", "/w " + who + " Please select an NPC token to monitor, then run the command again.");
        return;
    }
    
    let tokenId = msg.selected[0]._id;
    let token = getObj('graphic', tokenId);
    
    if (!token) {
        sendChat("NPC Monitor", "/w " + who + " Could not find selected token.");
        return;
    }
    
    let tokenName = token.get('name');
    
    if (!npcTriggers[tokenName]) {
        sendChat("NPC Monitor", "/w " + who + " No trigger configuration found for '" + tokenName + "'. Please add it to npcTriggers.");
        return;
    }
    
    // Calculate trigger distance in pixels (body widths * token diameter)
    let tokenWidth = token.get('width');
    let triggerDistancePixels = tokenWidth * npcTriggers[tokenName].distance;
    
    // Store NPC monitoring data
    monitoredNPCs[tokenId] = {
        name: tokenName,
        triggerDistance: triggerDistancePixels,
        pageId: token.get('pageid'),
        centerX: token.get('left') + (tokenWidth / 2),
        centerY: token.get('top') + (token.get('height') / 2),
        lastPosition: { x: token.get('left'), y: token.get('top') }
    };
    
    sendChat("NPC Monitor", "/w " + who + " ✅ Now monitoring " + tokenName + " with trigger distance of " + npcTriggers[tokenName].distance + " body widths (" + Math.round(triggerDistancePixels) + " pixels).");
}

// List all currently monitored NPCs
function listMonitoredNPCs(msg) {
    let who = msg.who;
    let npcCount = Object.keys(monitoredNPCs).length;
    
    if (npcCount === 0) {
        sendChat("NPC Monitor", "/w " + who + " No NPCs are currently being monitored. Use !monitornpc while selecting an NPC token.");
        return;
    }
    
    let message = "Currently monitored NPCs (" + npcCount + "):";
    Object.keys(monitoredNPCs).forEach(npcId => {
        let npc = monitoredNPCs[npcId];
        message += "<br/>- " + npc.name + " (" + Math.round(npc.triggerDistance) + "px trigger)";
    });
    
    sendChat("NPC Monitor", "/w " + who + " " + message);
}

// Calculate distance between two points (simple Pythagorean theorem)
function calculateDistance(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// Check proximity for all moving tokens against monitored NPCs
function checkAllProximities(movedToken) {
    let movedTokenId = movedToken.id;
    let movedTokenPage = movedToken.get('pageid');
    let movedTokenWidth = movedToken.get('width');
    let movedTokenX = movedToken.get('left') + (movedTokenWidth / 2);
    let movedTokenY = movedToken.get('top') + (movedToken.get('height') / 2);
    
    // Get player name from token
    let playerName = getPlayerNameFromToken(movedToken);
    
    // Check against all monitored NPCs
    Object.keys(monitoredNPCs).forEach(npcTokenId => {
        let npc = monitoredNPCs[npcTokenId];
        
        // Only check if on same page
        if (npc.pageId !== movedTokenPage) return;
        
        // Update NPC position if it has moved
        let npcToken = getObj('graphic', npcTokenId);
        let npcName = getPlayerNameFromToken(npcToken);
        if (playerName == npcName) return;
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
                triggerNPCMessage(npc, playerName, movedTokenId);
                triggeredTokens[triggerKey] = true;
                
                // Clear the trigger after 30 seconds to allow re-triggering
                setTimeout(() => {
                    delete triggeredTokens[triggerKey];
                }, 30000);
            }
        } else {
            // If token moves out of range, clear the trigger
            delete triggeredTokens[triggerKey];
        }
    });
}

// Get player name from token
function getPlayerNameFromToken(token) {
    let characterId = token.get('represents');
    if (characterId) {
        let character = getObj('character', characterId);
        if (character) {
            return character.get('name') || 'Guild Member';
        }
    }
    return 'Guild Member';
}

// Trigger and send the NPC message
function triggerNPCMessage(npc, playerName, triggeredById) {
    let messageConfig = npcTriggers[npc.name];
    
    if (!messageConfig) return;
    
    // Replace player name placeholder
    let personalizedMessage = messageConfig.message.replace(/{playerName}/g, playerName);
    
    // Build styled card
    let card = '<div style="background: #f4e8d8; border: 3px solid #8b4513; border-radius: 10px; padding: 15px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-family: Georgia, serif;">' +
        (messageConfig.img ? '<div style="text-align: center; margin-bottom: 10px;">' +
        '<img src="' + messageConfig.img + '" style="max-width: 200px; border: 4px solid #8b4513; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">' +
        '</div>' : '') +
        '<div style="background: white; border: 2px solid #8b4513; border-radius: 8px; padding: 12px; position: relative;">' +
        '<div style="position: absolute; top: -10px; left: 20px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid #8b4513;"></div>' +
        '<div style="position: absolute; top: -7px; left: 21px; width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 9px solid white;"></div>' +
        '<p style="margin: 0; color: #2c1810; font-size: 14px; line-height: 1.6;"><strong>' + npc.name + ':</strong></p>' +
        '<p style="margin: 8px 0 0 0; color: #2c1810; font-size: 14px; line-height: 1.6; font-style: italic;">' + personalizedMessage + '</p>' +
        '</div>' +
        '</div>';

    // Send as whisper to the player who triggered it
    sendChat(npc.name, '/w "' + playerName + '" ' + card);
    
    // Also send to GM for visibility
    if (npcTriggers[playerName]) return;
    sendChat(npc.name, '/w gm ' + card);
}

function autoMonitorNPCs() {
    // Get all tokens on the current Roll20 page
    let allTokens = findObjs({ type: 'graphic', subtype: 'token' });
    
    allTokens.forEach(token => {
        let tokenName = token.get('name');
        
        if (npcTriggers[tokenName]) {
            // Skip if already monitored
            if (Object.values(monitoredNPCs).some(npc => npc.name === tokenName)) return;

            let tokenWidth = token.get('width');
            let triggerDistancePixels = tokenWidth * npcTriggers[tokenName].distance;
            
            monitoredNPCs[token.id] = {
                name: tokenName,
                triggerDistance: triggerDistancePixels,
                pageId: token.get('pageid'),
                centerX: token.get('left') + (tokenWidth / 2),
                centerY: token.get('top') + (token.get('height') / 2),
                lastPosition: { x: token.get('left'), y: token.get('top') }
            };

            log(`✅ Auto-monitoring NPC: ${tokenName} (Trigger: ${npcTriggers[tokenName].distance} body widths)`);
        }
    });
}

// Initialize the script when ready
on('ready', function() {
    setupNPCProximity();
    log('✅ NPC Proximity Trigger Script loaded! Commands:');
    log('   !monitornpc - Start monitoring selected NPC token');
    log('   !listnpcs - List all monitored NPCs');
    log('   !clearnpcs - Clear all monitored NPCs');
    autoMonitorNPCs(); // <-- automatically monitor all NPCs in npcTriggers
    log('✅ NPC Proximity Trigger Script loaded and auto-monitoring NPCs!');
});