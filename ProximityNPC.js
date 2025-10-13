/* ProximityNPC */

/** Represents a card style with colors and formatting.
 * @class
 */
class CardStyle {
    /**
     * Creates a new CardStyle.
     * Colors in hex (e.g. '#8b4513') or plaintext (e.g. 'red')
     * @param {string} name - The name of the card style
     * @param {string} borderColor - Border color
     * @param {string} backgroundColor - Background color
     * @param {string} bubbleColor - Speech bubble color
     * @param {string} textColor - Text color
     * @param {string} whisper - Whisper to 'character', 'gm', 'off'
     */
    constructor(name, borderColor = '#8b4513', backgroundColor = '#f4e8d8', bubbleColor = '#ffffff', textColor = '#2c1810', whisper = 'off') {
        this.name = name;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.bubbleColor = bubbleColor;
        this.textColor = textColor;
        this.whisper = whisper;
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
    constructor(name, triggerDistance = 2, pageId = '', centerX = 0, centerY = 0, lastPosition = { x: 0, y: 0 }, timeout = 10000, img = 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/GuildEmblem.png', messages = [], cardStyle = 'Default') {
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
                new MessageObject('Tharos nods at you, "Good to see you again, {playerName}. Remember, the guild is always here if you need assistance."', 3, 'Warm'),
                new MessageObject('"Tempus favors the bold, {playerName}, but he also favors the prepared. Make sure you\'re both before heading out." He taps Ruinbreaker\'s haft thoughtfully.', 2),
                new MessageObject('His booming laugh echoes through the hall. "That reminds me of the time I faced that wyvern! Though you didn\'t hear it from me..."', 1),
                // Relationship messages
                new MessageObject('"Keoti came from the army with the highest of recommendations, my former battle body claimed that he had "Never seen a tabaxi move so fast with a greataxe" - he\'s earned every bit of trust I place in him."', 2),
                new MessageObject('"When Risha tried to steal Ruinbreaker, I nearly threw her in the dungeons. But after realizing what she\'d done to it... brilliant. Sometimes second chances create our strongest allies."', 2),
                new MessageObject('"Ilikan may be our groundskeeper, but he has the patience of the giants who raised him. The guild wouldn\'t be standing without his careful maintenance."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/TharosRaggenthraw.png',
            'GuildMaster'
        ),
        new PresetNPC(
            'Kinris Morranfew',
            2,
            [
                new MessageObject('Smiling as she wipes down the bar, "{playerName}, long time no see! Need a drink?"', 3),
                new MessageObject('"Tell me everything, {playerName} - the good, the bad, and the parts you think nobody wants to hear. I\'m listening." She leans in with genuine interest.', 2),
                new MessageObject('"This new brew might be my best yet! Care to be my taste-tester, {playerName}?" She gestures to a foaming mug with a mischievous grin.', 2),
                new MessageObject('"Sometimes the strongest healing happens over a good drink and better company. You look like you could use both."', 1),
                // Relationship messages
                new MessageObject('"Lumen reminds me of myself at his age - so much heartache, but such determination. I make sure he gets extra sweets when Keoti isn\'t looking."', 2),
                new MessageObject('"Bolagor and I have an arrangement - my best ale for his spiciest stew. The resulting feast nearly brought Tharos to tears last Winter\'s Crest."', 2),
                new MessageObject('"Snek once tried to help me serve drinks. We lost three mugs and gained a wonderful story. That kobold means well, even when he\'s a disaster."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KinrisMorranfew.png'
        ),
        new PresetNPC(
            'Ovlan Kalek',
            1.5,
            [
                new MessageObject('His head turns towards you but his eyes remain pinned to a thick tome... "Questions about my book? Oh for you {playerName} I\'ll even sign it."', 3),
                new MessageObject('The boy is quite well in his studies, you\'d be foolish to underestimate him in sparring {playerName}', 2),
                new MessageObject('"Fascinating! {playerName}, come look at this passage - it perfectly describes the hunting patterns of the very creature you faced last week!"', 2),
                new MessageObject('He looks up, startled as if waking from a dream. "Oh! {playerName}, I was just... how long have I been reading?"', 1),
                // Relationship messages
                new MessageObject('"Young Auren has a mind for graviturgy that I haven\'t seen in decades. Last week he corrected my calculations on feather fall... he was right, of course."', 2),
                new MessageObject('"Jade and I compiled the guild archives together. Her memory for detail is... unsettlingly good. Former spies make excellent librarians."', 2),
                new MessageObject('"Fiona once helped me track a fey-touched beast for my research. Her connection to both drake and fey wilds made the difference between success and disaster."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/OvlanKalek.png'
        ),
        new PresetNPC(
            'Varon Tavis',
            2,
            [
                new MessageObject('"You\'re welcome to use the forge, there\'s an extra hammer on the wall there." He points to a long line of hanging hammers.', 3),
                new MessageObject('"Steel doesn\'t lie, {playerName}. It shows every flaw and every strength. People could learn from that."', 2),
                new MessageObject('"This blade needs more tempering. Show me your grip, {playerName} - proper form saves fingers."', 2),
                new MessageObject('"In the wilds, a dull blade gets you killed. Here, it just gets you a lecture from me." He almost smiles.', 1),
                // Relationship messages
                new MessageObject('"Tharos gave me a place when my own clan wouldn\'t. I\'d break every hammer in this forge before I betrayed that trust."', 2),
                new MessageObject('"Risha\'s \'improvements\' to my tools usually work, eventually. The exploding tongs were... educational." He rubs a faint scar on his arm.', 2),
                new MessageObject('"Ilikan understands materials - wood, stone, metal. We repaired the main gate together after that ogre incident. Good worker."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/VaronTavis.png'
        ),
        new PresetNPC(
            'Caelum Riversong',
            2,
            [
                new MessageObject('"Ah, {playerName}, careful with that bandage. Let me show you a proper technique—your hands could save lives yet."', 3),
                new MessageObject('"My research is going well {playerName}, but I really need our shippment of exotic herbs and oils from Kantra to come in..." You now notice a new crate of emty vial awaiting their contents.', 2),
                new MessageObject('"Lathander\'s light guide your path, {playerName}. And if it doesn\'t, my poultices will have to suffice."', 2),
                new MessageObject('"Precision saves lives, {playerName}. Whether in surgery or spellcasting, the principle remains."', 1),
                // Relationship messages
                new MessageObject('"Ilikan and I often pray to Lathander together at dawn. His giant-taught prayers have a... grounding quality to them."', 2),
                new MessageObject('"Kinris supplies me with the strongest spirits for disinfecting wounds. Her brew stings worse than any monster\'s bite, but it works."', 2),
                new MessageObject('"I treated Fiona\'s drake when it ate something it shouldn\'t have. Remarkable creature - even its digestive troubles were impressive."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/CaelumRiversong.png'
        ),
        new PresetNPC(
            'Risha Swiftdancer',
            1,
            [
                new MessageObject('Risha pays little mind until you are close enough to break her concentration. "Give me an idea, {playerName}; some absolutely wild proposition. Let\'s see what we can make from it"', 3),
                new MessageObject('"They said it couldn\'t be done, {playerName}. Want to help me prove them wrong again?" Her eyes gleam with challenge.', 2),
                new MessageObject('"This gadget nearly took my finger off, but the principle is sound! Come look, {playerName}!"', 2),
                new MessageObject('"Rules are just suggestions written by people who lacked imagination, {playerName}."', 1),
                // Relationship messages
                new MessageObject('"Tharos could have had me hanged. Instead he saw potential in my \'modifications\' to his axe. Never told him I was just trying to lighten it to steal faster."', 2),
                new MessageObject('"Varon grumbles about my \'tinkering\' but he\'s the first to test my new designs. We built a self-sharpening whetstone that actually works... mostly."', 2),
                new MessageObject('"Snek brings me the most interesting scrap metal he finds. Half of it\'s junk, but that other half... pure inspiration."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/RishaSwiftdancer.png'
        ),
        new PresetNPC(
            'Lumen Silverflock',
            1.5,
            [
                new MessageObject('A mug crashes against the wall near you. "I\'ll get that cleaned up, {playerName}. Don\'t worry, I move a mop as well as a sword."', 1),
                new MessageObject('You notice Lumn feigning attacks with an invisible sword. "Master Keoti says there\s alway time to practice"', 3),
                new MessageObject('"Kelemvor teaches that every life deserves justice, {playerName}. That\'s why I train so hard."', 2),
                new MessageObject('"Could you show me that parry again, {playerName}? I want to get it perfect before Master Keoti returns."', 2),
                // Relationship messages
                new MessageObject('"Master Keoti found me practicing alone one night and just... started teaching me. He doesn\'t say much, but he shows me everything."', 2),
                new MessageObject('"Kinris lets me help in the kitchen sometimes. She says I remind her of... well, she gets quiet after that. But she\'s always kind."', 2),
                new MessageObject('"The guild party that rescued me... I don\'t remember all their names, but Tharos was there. His mane was the first thing I saw in the ruins."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/LemunSilverflock.png'
        ),
        new PresetNPC(
            'Bolagor Bonejaw',
            2,
            [
                new MessageObject('"Hungry, {playerName}? I can whip up something that\'ll put hair on your chest. Don\'t complain if it bites back!"', 3),
                new MessageObject('"That merchant tried to overcharge me again. He won\'t make that mistake twice, {playerName}."', 2),
                new MessageObject('"My master always said: good food makes good fighters. So eat up, {playerName} - we need you strong."', 2),
                new MessageObject('"This stew has three different peppers from the eastern markets. Care to test your mettle, {playerName}?"', 1),
                // Relationship messages
                new MessageObject('"Jade and I handle the guild\'s finances. She negotiates contracts, I handle supplies. Between us, we keep this place from bankruptcy."', 2),
                new MessageObject('"Kinris and I have a standing bet on who can create the more... memorable beverage. Last time, her ale made a dwarf cry. I respect that."', 2),
                new MessageObject('"Little Auren is the only one who remembers every ingredient in my seven-pepper stew. Sharp mind, that one."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/BolagorBonejaw.png'
        ),
        new PresetNPC(
            'Jade Clearrock',
            2,
            [
                new MessageObject('"Good day, {playerName}. I don\t have any quests available at the moment, but for any record look-ups..." She gestures to the ledger with a serene smile.', 3),
                new MessageObject('"Tymora smiles on the prepared, {playerName}. What kind of quests would you like me to look out for?"', 2),
                new MessageObject('"Looking for advice on certain aspects of adventuring, {playerName}?" You can almost sense the usefulness this conversation could have.', 2),
                new MessageObject('"Diplomacy first, blades if necessary. That was my motto in the field, and it serves well here too."', 1),
                // Relationship messages
                new MessageObject('"Ovlan and I compiled the guild archives together. His memory for arcane lore is matched only by mine for... well, let\'s call it professional details."', 2),
                new MessageObject('"Bolagor drives the hardest bargain I\'ve seen since my espionage days. I rather enjoy our negotiations - it keeps me sharp."', 2),
                new MessageObject('"Who comes to me for stories of my adventuring days. She says they make good songs. I suppose everyone deserves a legend, even former spies."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/JadeClearrock.png'
        ),
        new PresetNPC(
            'Fiona Wildfist',
            2,
            [
                new MessageObject('Fiona crouches beside her drake companion, who nudges you gently. "Mind your step, {playerName}, and say hello properly to my friend there."', 3),
                new MessageObject('"Selûne\'s phases guide all creatures, {playerName}. Even the wildest beast has its rhythms and reasons."', 2),
                new MessageObject('"The griffons need extra grooming today, {playerName}. Care to help? They quite like you."', 2),
                new MessageObject('"My drake remembers you, {playerName}. They don\'t forget kindness, no matter how small."', 1),
                // Relationship messages
                new MessageObject('"Ilikan proposed to me during the great meteor shower. He said each falling star was a promise for our future. My practical husband has his moments of poetry."', 2),
                new MessageObject('"Auren gets his curiosity from me, but his patience from his father. Between us, we\'re raising quite the remarkable young man."', 2),
                new MessageObject('"Snek helps me with the smaller creatures. They trust him in a way they don\'t trust most people. There\'s a pure heart beneath that chatter."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/FionaMirage.png'
        ),
        new PresetNPC(
            'Ilikan Wildfist',
            2,
            [
                new MessageObject('"Everything in its place, {playerName}. Care to help repair this table leg? You\'ll learn a thing or two."', 3),
                new MessageObject('"My giant-kin taught me: every avalanche begins as a single pebble. Good work starts small, {playerName}."', 2),
                new MessageObject('"Lathander\'s dawn reminds us that even broken things can be made new. This armor just needs patience, {playerName}."', 2),
                new MessageObject('"The gardens need tending, {playerName}. There\'s peace in working with the earth - care to join me?"', 1),
                // Relationship messages
                new MessageObject('"Fiona still has the wild fey spark that drew me to her, but now it\'s tempered by motherhood. Our son has her brilliant mind and, thankfully, my patience."', 2),
                new MessageObject('"Caelum and I share dawn prayers to Lathander. He tends to souls while I tend to the earth, but we both serve renewal in our ways."', 2),
                new MessageObject('"I teach Auren Giant not just for language, but for perspective. The world looks different when you understand how giants think."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/IlikanWildfist.png'
        ),
        new PresetNPC(
            'Auren Wildfist',
            1.5,
            [
                new MessageObject('"I have the order memorized, {playerName}. Would you like me to fetch it for you, or are we feeling adventurous?" Auren looks at you with a shine in his eye.', 3),
                new MessageObject('"Master Ovlan says gravity affects everything, even magic! Isn\'t that fascinating, {playerName}?"', 2),
                new MessageObject('"Father taught me this Giant phrase for \'well-met,\' {playerName}. Would you like to learn it?"', 2),
                new MessageObject('"I\'ve been practicing my serving posture. Is my form correct, {playerName}?"', 1),
                // Relationship messages
                new MessageObject('"Mother lets me help with the baby griffons sometimes. She says I have her way with creatures, but I think they just like the treats I sneak them."', 2),
                new MessageObject('"Master Ovlan says I\'m his best student, but I think he says that to all his apprentices. Still, it makes me want to work harder."', 2),
                new MessageObject('"Father says our family follows Lathander because every morning is a new beginning. I like that - it means I can always try again tomorrow."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/AurenWildfist.png'
        ),
        new PresetNPC(
            'Keoti Fang',
            3,
            [
                new MessageObject('Keoti\'s amber eyes meet yours, sharp as a blade. "Stay alert, {playerName}. Let me know of any trouble."', 3),
                new MessageObject('"Sehanine guides us through dreams and darkness both, {playerName}. Trust your instincts as you would her moonlight."', 2),
                new MessageObject('"I\'ve walked your patrol route, {playerName}. Report anything unusual immediately."', 2),
                new MessageObject('"The scar teaches what the victory forgets, {playerName}. Learn from both."', 1),
                // Relationship messages
                new MessageObject('"Lumen trains harder than soldiers twice his age. The boy carries grief like armor, but I\'m teaching him to wear it like a cloak instead."', 2),
                new MessageObject('"Tharos and I served in different companies during the war, but we shared the same nightmares. Only difference is, he built a guild while I found a god."', 2),
                new MessageObject('"I patrol with Fiona\'s drake sometimes. The creature sees things even I miss. Useful partner, if you don\'t mind the shedding."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KeotiFang.png'
        ),
        new PresetNPC(
            'Snek Littlefoot',
            1.5,
            [
                new MessageObject('Snek darts around you, chattering, "{playerName}! Did you hear the news? I might have... maybe... gotten it a bit wrong..."', 3),
                new MessageObject('"The sparrows told me the most incredible thing, {playerName}! Well, I think that\'s what they said..."', 2),
                new MessageObject('"Tymora must be smiling on us today, {playerName}! I found an extra shiny coin by the stables!"', 2),
                new MessageObject('"I\'m not supposed to tell anyone, but since it\'s you, {playerName}..." He immediately proceeds to share everything.', 1),
                // Relationship messages
                new MessageObject('"Fiona lets me help with the animals! Well, the small ones. The big ones step on me sometimes. But the rabbits love me!"', 2),
                new MessageObject('"Who sings the prettiest songs! I try to remember the words but they get mixed up. She says it\'s the feeling that matters anyway."', 2),
                new MessageObject('"Kinris is my favorite! She gives me the leftover fruit from her brewing and never gets mad when I spill things. Well, not TOO mad."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/SnekLittlefoot.png'
        ),
        new PresetNPC(
            'Who Wingfall',
            2,
            [
                new MessageObject('Who strums her lute softly, looking up. "A song for you, {playerName}, or should I bring you something from the kitchen?"', 3),
                new MessageObject('"My father\'s song speaks of courage in dark places, {playerName}. I think you\'d appreciate the third verse."', 2),
                new MessageObject('"Tymora led me to this guild, {playerName}. Now I have endless stories to set to music!"', 2),
                new MessageObject('"This new melody came to me in a dream, {playerName}. Would you be the first to hear it?"', 1),
                // Relationship messages
                new MessageObject('"Jade tells the most amazing stories from her adventuring days! I\'m turning her escape from the Shadow Guild into an epic ballad."', 2),
                new MessageObject('"Auren and I practice serving together. For a nine-year-old, he has remarkable rhythm. I think he\'d make a fine bard if wizardry doesn\'t work out."', 2),
                new MessageObject('"Tharos took a chance on a street performer, and now I have a home. I write songs about his wyvern fight, but I make the ending happier than it really was."', 1)
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

                if (args.length > 3 && args[3] === 'messages') {
                    handleEditMessages(msg);
                    return;
                }
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

            if (msg.content.includes("--cardstyles") || msg.content.includes("-cl")) {
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

/**
 * Gets the best available image URL for a token in priority order:
 * 1. Character avatar
 * 2. Token image
 * 3. Default image from state
 * 4. Empty string
 * @param {Graphic} token - The token to get the image for
 * @returns {string} The best available image URL
 */
function getBestTokenImage(token) {
    // Check if token represents a character and get avatar
    let charId = token.get('represents');
    if (charId) {
        let character = getObj('character', charId);
        if (character) {
            let avatar = character.get('avatar');
            if (avatar && avatar.trim() !== '') {
                return avatar;
            }
        }
    }
    
    // Fall back to token image
    let tokenImg = token.get('imgsrc');
    if (tokenImg && tokenImg.trim() !== '') {
        return tokenImg;
    }
    
    // Fall back to default image from state
    if (state.ProximityNPC.defaultImagePath && state.ProximityNPC.defaultImagePath.trim() !== '') {
        return state.ProximityNPC.defaultImagePath;
    }
    
    // Final fallback to empty string
    return '';
}

/**
 * Creates a MonitoredNPC entry for the given token and opens its edit dialog.
 * @param {Object} msg - The chat message for whispering back.
 * @param {Graphic} token - The token to monitor.
 */
function createMonitoredNPCFromToken(msg, token) {
    let name = token.get('name');
    state.ProximityNPC.monitoredNPCs[token.id] = new MonitoredNPC(
        name,
        state.ProximityNPC.defaultDistance || 2, // in token widths
        token.get('pageid'),
        token.get('left') + token.get('width')/2,
        token.get('top') + token.get('height')/2,
        { x: token.get('left'), y: token.get('top') },
        state.ProximityNPC.defaultTimeout || 10000,
        getBestTokenImage(token),
        [],
        state.ProximityNPC.cardStyles[0].name || 'Default'
    );
    showEditMonitorNPCDialog(msg, token);
}

/**
 * Replaces spaces in a string with underscores for safe command usage.
 * @param {string} name - The original name.
 * @returns {string} The safe name (spaces → underscores).
 */
function toSafeName(name) {
    return name.trim().replace(/\s+/g, "_");
}

/** 
 * Reverses toSafeName: replaces underscores with spaces.
 * @param {string} safeName - The underscored name.
 * @returns {string} The original name with spaces.
 */
function fromSafeName(safeName) {
    return safeName.replace(/_/g, " ").trim();
}

/**
 * Displays the edit dialog for a monitored NPC, with options for each property.
 * @param {Object} msg - The chat message (including GM whisper).
 * @param {Graphic} token - The token object for the NPC.
 */
function showEditMonitorNPCDialog(msg, token) {
    if (!token) {
        sendChat("NPC Monitor", `/w ${msg.who} Please select a valid token to edit.`);
        return;
    }
    let npc = state.ProximityNPC.monitoredNPCs[token.id];
    if (!npc) {
        sendChat("NPC Monitor", `/w ${msg.who} Token "${token.get('name')}" is not monitored.`);
        return;
    }
    let safeName = toSafeName(npc.name);
    // Build clickable fields for each property
    let properties = [
        { label: 'Trigger Distance (in token widths)', attr: 'triggerDistance'},
        { label: 'Timeout (ms)', attr: 'timeout'},
        { label: 'Image URL', attr: 'img'},
        { label: 'Card Style', attr: 'cardStyle'},
        { label: 'Messages', attr: 'messages'}
    ];
    let buttons = properties.map(prop => {
        return `{{[${prop.label}](!proximitynpc -M ${safeName} ${prop.attr})}}`;
    }).join(" ");
    sendChat("NPC Monitor", `/w ${msg.who} &{template:default} {{name=Edit NPC: ${npc.name}}} ${buttons} {{[Delete Monitor](!proximitynpc -D ${safeName})}}`);
}

/**
 * Shows the help/usage information via chat.
 * @param {Object} msg - The chat message (for determining recipient).
 */
function showHelpMessage(msg = {who: "gm"}) {
    let who = msg.who || "gm";
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Help}} {{!proximitynpc=Main call (must include one flag)}} {{--monitor|-M [Token/Name]=Add or edit an NPC monitor (requires a token or name). Use underscores for spaces.}} {{--list|-l=List all monitored NPCs}} {{--menu|-m=Open the ProximityNPC menu}} {{--edit|-e [Name] [prop] [value]=Edit a monitored NPC's property (prop: triggerDistance, timeout, img, cardStyle)}} {{--trigger|-t [Token/Name]=Manually trigger an NPC message}} {{--cardstyles|-cl=List all card styles}} {{--cardstyle|-C [StyleName] [property] [value]=Edit or create a card style}} {{--delete|-D [Name]=Delete a monitored NPC}} {{--help|-h=Show this help}}`);
}

/**
 * Finds a token on the GM’s current page by a character’s name.
 * @param {string} charName - The character name to find.
 * @returns {Graphic|null} The first matching token, or null if none found.
 */
function findTokenByCharacterName(charName) {
    let character = findObjs({ _type: 'character', name: charName })[0];
    if (!character) return null;
    let pageId = Campaign().get("playerpageid");
    let tokens = findObjs({ _pageid: pageId, _type: "graphic", represents: character.id });
    return tokens.find(t => t.get("layer")==="objects") || tokens[0] || null;
}

/**
 * Extracts the token to act on from a chat command or selection.
 * Chat args take priority over a selected token.
 * @param {Object} msg - The chat message object (`msg.type === "api"`).
 * @returns {Graphic|undefined} The token to use.
 */
function getTokenFromCall(msg) {
    let args = msg.content.trim().split(" ");
    // If command includes a name after flag, use that.
    if (args.length > 2) {
        return findTokenByCharacterName(fromSafeName(args[2]));
    } 
    // Otherwise, if a token is selected, use that.
    if (msg.selected && msg.selected.length > 0) {
        return getObj('graphic', msg.selected[0]._id);
    }
    return;
}

/**
 * Handles adding, editing, listing, and deleting messages for a monitored NPC.
 * @param {Object} msg - The chat message object
 */
function handleEditMessages(msg) {
    let who = msg.who || "gm";
    let args = msg.content.trim().split(" ");
    
    // Extract the NPC name from the command (e.g., "Keoti_Fang")
    let npcName = fromSafeName(args[2]);
    let action = args[4] ? args[4].toLowerCase() : 'menu'; // Actions: 'menu', 'add', 'edit', 'delete'

    // Find the monitored NPC
    let monitoredNPC = Object.values(state.ProximityNPC.monitoredNPCs).find(npc => npc.name.trim() === npcName);
    if (!monitoredNPC) {
        sendChat("NPC Monitor", `/w ${who} Could not find monitored NPC: ${npcName}`);
        return;
    }

    let safeNPCName = toSafeName(monitoredNPC.name);

    // Show the main Messages management menu
    if (action === 'menu' || !action) {
        let messageList = "{{No messages configured}}";
        if (monitoredNPC.messages.length > 0) {
            messageList = monitoredNPC.messages.map((msgObj, index) => {
                let preview = msgObj.content.length > 50 ? msgObj.content.substring(0, 50) + "..." : msgObj.content;
                return `{{[${index + 1}: ${preview}](!proximitynpc -M ${safeNPCName} messages edit ${index})}}`;
            }).join(' ');
        }

        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Message Manager: ${monitoredNPC.name}}} {{Total Messages: ${monitoredNPC.messages.length}}} ${messageList} {{[Add New Message](!proximitynpc -M ${safeNPCName} messages add)}} {{[Back to NPC Edit](!proximitynpc -M ${safeNPCName})}}`);
        return;
    }

    // Handle adding a new message
    if (action === 'add') {
        let promptMessage = "Enter the new message text. Use {playerName} as a placeholder:";
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Add Message to ${monitoredNPC.name}}} {{${promptMessage}=[Click Here](!proximitynpc -M ${safeNPCName} messages add_content ?{Message Text})}}`);
        return;
    }

    // Handle setting the content for a new message
    if (action === 'add_content') {
        let newContent = args.slice(5).join(" ").trim();
        if (!newContent) {
            sendChat("NPC Monitor", `/w ${who} Message content cannot be empty. Make sure to include {playerName} if needed.`);
            return;
        }

        let newMessage = new MessageObject(newContent, 1, null); // Default weight: 1
        monitoredNPC.messages.push(newMessage);

        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set Message Weight}} {{Message added! Now set its relative weight (higher number = more likely to appear):}} {{Weight (default 1)=[Click Here](!proximitynpc -M ${safeNPCName} messages add_weight ${monitoredNPC.messages.length - 1} ?{Weight|1})}}`);
        return;
    }

    // Handle editing message content
    if (action === 'edit_content') {
        let msgIndex = parseInt(args[5]);
        let monitoredMessage = monitoredNPC.messages[msgIndex];
        if (!monitoredMessage) {
            sendChat("NPC Monitor", `/w ${who} Invalid message index.`);
            return;
        }
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Edit ${npcName} Message Content}} {{Current: ${monitoredMessage.content}}} {{Enter new text. Use {playerName} as a placeholder: [Click Here](!proximitynpc -M ${safeNPCName} messages edit_content_save ${msgIndex} ?{Message Text})}}`);
        return;
    }

    // Save edited message content
    if (action === 'edit_content_save') {
        let msgIndex = parseInt(args[5]);
        let newContent = args.slice(6).join(" ").trim();
        if (!newContent) {
            sendChat("NPC Monitor", `/w ${who} Message content cannot be empty. Remember {playerName} placeholder.`);
            return;
        }
        monitoredNPC.messages[msgIndex].content = newContent;
        sendChat("NPC Monitor", `/w ${who} Message content updated.`);
        handleEditMessages({ content: `!proximitynpc -M ${safeNPCName} messages`, who: who });
        return;
    }

    // Handle setting the weight for the newly added message
    if (action === 'add_weight') {
        let msgIndex = parseInt(args[5]);
        let weight = parseInt(args[6]);

        if (isNaN(msgIndex) || msgIndex < 0 || msgIndex >= monitoredNPC.messages.length) {
            sendChat("NPC Monitor", `/w ${who} Invalid message index.`);
            return;
        }
        if (isNaN(weight) || weight <= 0) {
            sendChat("NPC Monitor", `/w ${who} Weight must be a positive number. Using default of 1.`);
            weight = 1;
        }

        monitoredNPC.messages[msgIndex].weight = weight;
        sendChat("NPC Monitor", `/w ${who} Message weight set to ${weight}.`);
        // Return to the messages menu
        handleEditMessages({ content: `!proximitynpc -M ${safeNPCName} messages`, who: who });
        return;
    }

    // In the handleEditMessages function, inside the 'edit' action block:
    if (action === 'edit') {
        let msgIndex = parseInt(args[5]);
        // Adjust for zero-based index immediately
        let actualIndex = msgIndex;
        
        // Validate the adjusted index
        if (isNaN(actualIndex) || actualIndex < 0 || actualIndex >= monitoredNPC.messages.length) {
            sendChat("NPC Monitor", `/w ${who} Invalid message selection.`);
            return;
        }
        
        let messageToEdit = monitoredNPC.messages[actualIndex];
        // Show edit options for the specific message. Note: Display shows actualIndex + 1 for user clarity.
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Edit ${npcName} Message ${actualIndex + 1}}} {{Card Style: ${messageToEdit.cardStyle || 'Default'}}} {{Content: ${messageToEdit.content}}} {{Weight: ${messageToEdit.weight}}} {{[Edit Content](!proximitynpc -M ${safeNPCName} messages edit_content ${actualIndex})}} {{[Edit Weight](!proximitynpc -M ${safeNPCName} messages edit_weight ${actualIndex})}} {{[Change Card Style](!proximitynpc -M ${safeNPCName} messages edit_cardstyle ${actualIndex})}} {{[Delete Message](!proximitynpc -M ${safeNPCName} messages delete ${actualIndex})}} {{[Back to Messages](!proximitynpc -M ${safeNPCName} messages)}}`);
        return;
    }

    // Handle deleting a message
    if (action === 'delete') {
        let msgIndex = parseInt(args[5]);
        if (isNaN(msgIndex) || msgIndex < 0 || msgIndex >= monitoredNPC.messages.length) {
            sendChat("NPC Monitor", `/w ${who} Invalid message index for deletion.`);
            return;
        }

        let deletedMessage = monitoredNPC.messages.splice(msgIndex, 1)[0];
        sendChat("NPC Monitor", `/w ${who} Deleted message: "${deletedMessage.content.substring(0, 50)}..."`);
        // Return to the messages menu
        handleEditMessages({ content: `!proximitynpc -M ${safeNPCName} messages`, who: who });
        return;
    }

    if (action === 'edit_content') {
        let msgIndex = parseInt(args[5]);
        let monitoredMessage = monitoredNPC.messages[msgIndex];
        if (!monitoredMessage) {
            sendChat("NPC Monitor", `/w ${who} Invalid message index.`);
            return;
        }
        let safeNPCName = toSafeName(monitoredNPC.name);
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Edit ${npcName} Message Content}} ${msgIndex} {{Current: ${monitoredMessage.content}}} {{New Content: [Click Here](!proximitynpc -M ${safeNPCName} messages edit_content_save ${msgIndex} ?{Message Text|${monitoredMessage.content}})}}`);
        return;
    }

    if (action === 'edit_content_save') {
        let msgIndex = parseInt(args[5]);
        let newContent = args.slice(6).join(" ").trim();
        if (!newContent) {
            sendChat("NPC Monitor", `/w ${who} Message content cannot be empty.`);
            return;
        }
        monitoredNPC.messages[msgIndex].content = newContent;
        sendChat("NPC Monitor", `/w ${who} ${npcName} Message ${msgIndex + 1} content updated.`);
        handleEditMessages({ content: `!proximitynpc -M ${safeNPCName} messages`, who: who });
        return;
    }

    if (action === 'edit_weight') {
        let msgIndex = parseInt(args[5]);
        let monitoredMessage = monitoredNPC.messages[msgIndex];
        if (!monitoredMessage) {
            sendChat("NPC Monitor", `/w ${who} Invalid message index.`);
            return;
        }
        let safeNPCName = toSafeName(monitoredNPC.name);
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Edit ${npcName} Message ${msgIndex + 1} Weight}} {{Current Weight: ${monitoredMessage.weight}}} {{New Weight: [Click Here](!proximitynpc -M ${safeNPCName} messages edit_weight_save ${msgIndex} ?{Weight|${monitoredMessage.weight}})}}`);
        return;
    }

    if (action === 'edit_weight_save') {
        let msgIndex = parseInt(args[5]);
        let newWeight = parseInt(args[6]);
        if (isNaN(newWeight) || newWeight <= 0) newWeight = 1;
        monitoredNPC.messages[msgIndex].weight = newWeight;
        sendChat("NPC Monitor", `/w ${who} ${npcName} Message ${msgIndex + 1} weight updated to ${newWeight}.`);
        handleEditMessages({ content: `!proximitynpc -M ${safeNPCName} messages`, who: who });
        return;
    }

    if (action === 'edit_cardstyle') {
        let msgIndex = parseInt(args[5]);
        let styleList = state.ProximityNPC.cardStyles.map(style =>
            `{{[${style.name}](!proximitynpc -M ${safeNPCName} messages set_cardstyle ${msgIndex} ${toSafeName(style.name)})}}`
        ).join(' ');
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set Message Card Style}} ${styleList} \
    {{[Back to Edit ${npcName} Message](!proximitynpc -M ${safeNPCName} messages edit ${msgIndex})}}`);
        return;
    }
    if (action === 'set_cardstyle') {
        let msgIndex = parseInt(args[5]);
        let styleName = fromSafeName(args.slice(6).join(" "));
        let style = state.ProximityNPC.cardStyles.find(s => s.name.toLowerCase() === styleName.toLowerCase());
        if (!style) {
            sendChat("NPC Monitor", `/w ${who} Card style "${styleName}" not found.`);
            return;
        }
        monitoredNPC.messages[msgIndex].cardStyle = style.name;
        sendChat("NPC Monitor", `/w ${who} ${npcName} Message ${msgIndex + 1} card style set to ${style.name}.`);
        // Return to the message edit screen
        handleEditMessages({ content: `!proximitynpc -M ${safeNPCName} messages edit ${msgIndex}`, who: who });
        return;
    }
}

/**
 * Edits a card style's properties via chat.
 * Usage: !proximitynpc -C <StyleName> <property> <value>
 * @param {Object} msg - The chat message.
 */
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
            content: `!proximitynpc -C ${toSafeName(styleName)}`,
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
        sendChat("NPC Monitor", `/w ${who} Could not find card style: ${styleName}.`);
        handleListCardStyles(msg);
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
            { name: 'Text Color', type: 'color', attr: 'textColor', value: cardStyle.textColor },
            { name: 'Whisper', type: 'whisper', attr: 'whisper', value: cardStyle.whisper }
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
            case 'whisper':
                promptMessage = "Enter whisper mode ^'character', 'gm', or 'off'^:";
                break;
            default:
                sendChat("NPC Monitor", `/w ${who} Unknown property: ${property}. Valid properties: borderColor, backgroundColor, bubbleColor, textColor, whisper`);
                return;
        }
        
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set ${property} for ${cardStyle.name}}} {{Current: ${currentValue}}} {{${promptMessage}=[Click Here](!proximitynpc -C ${toSafeName(cardStyle.name)} ${property} ?{${promptMessage}|${currentValue}})}}`);
        return;
    }
    
    let value = args.slice(4).join(" ").trim().toLowerCase();
    
    // Handle property-specific validation and setting
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
        case 'whisper':
            // Sanitize bad args - only allow 'character', 'gm', or 'off'
            if (value === 'character' || value === 'gm' || value === 'off') {
                cardStyle.whisper = value;
                sendChat("NPC Monitor", `/w ${who} Updated ${cardStyle.name} whisper to "${value}"`);
            } else {
                // Default to 'off' for invalid values
                cardStyle.whisper = 'off';
                sendChat("NPC Monitor", `/w ${who} Invalid whisper value "${value}". Set to "off". Valid values: 'character', 'gm', 'off'`);
            }
            break;
        default:
            sendChat("NPC Monitor", `/w ${who} Unknown property: ${property}. Valid properties: borderColor, backgroundColor, bubbleColor, textColor, whisper`);
            return;
    }
    
    // Show the updated edit dialog
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Card Style Updated}} {{[Continue Editing ${cardStyle.name}](!proximitynpc -C ${toSafeName(cardStyle.name)})}}`);
}

/**
 * Lists or creates card styles via chat command.
 * @param {Object} msg - The chat message object.
 */
function handleListCardStyles(msg) {
    let who = msg.who || "gm";
    let list = state.ProximityNPC.cardStyles.map(s => `{{[${s.name}](!proximitynpc -C ${toSafeName(s.name)})}}`).join(" ");
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Card Styles}} {{[Create New](!proximitynpc -C new)}} ${list}`);
}

/**
 * Handles deleting a monitored NPC (removing it from state).
 * @param {Object} msg - The chat message object.
 */
function handleDeleteMonitor(msg) {
    let who = msg.who || "gm";
    let args = msg.content.trim().split(" ");
    // If no name provided, list them
    if (args.length < 3) {
        let entries = Object.values(state.ProximityNPC.monitoredNPCs);
        if (entries.length === 0) {
            sendChat("NPC Monitor", `/w ${who} No NPCs are monitored.`);
            return;
        }
        let menu = entries.map(npc => `{{[${npc.name}](!proximitynpc -D ${toSafeName(npc.name)})}}`).join(" ");
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Delete Monitored NPC}} ${menu}`);
        return;
    }
    let name = fromSafeName(args[2]);
    let entry = Object.entries(state.ProximityNPC.monitoredNPCs).find(([id,npc]) => npc.name === name);
    if (!entry) {
        sendChat("NPC Monitor", `/w ${who} Monitored NPC "${name}" not found.`);
        return;
    }
    let [tokenId, npc] = entry;
    delete state.ProximityNPC.monitoredNPCs[tokenId];
    // Clear any pending triggers
    Object.keys(triggeredTokens).forEach(key => {
        if (key.endsWith(`_${tokenId}`)) delete triggeredTokens[key];
    });
    sendChat("NPC Monitor", `/w ${who} Removed "${npc.name}" from monitoring.`);
}

/**
 * Edits properties of a monitored NPC via chat command.
 * Usage: !proximitynpc -e <NPC_Name> <prop> <value>
 * @param {Object} msg - The chat message.
 */
function handleEditMonitoredNPC(msg) {
    let who = msg.who || "gm";
    let args = msg.content.trim().split(" ");
    let npcName = fromSafeName(args[2]);
    let entry = Object.entries(state.ProximityNPC.monitoredNPCs).find(([id,npc]) => npc.name === npcName);
    if (!entry) {
        sendChat("NPC Monitor", `/w ${who} Monitored NPC "${npcName}" not found.`);
        return;
    }
    let [tokenId, npc] = entry;
    // If no prop given, open edit dialog
    if (args.length < 4) {
        let token = getObj('graphic', tokenId);
        showEditMonitorNPCDialog({who: who}, token);
        return;
    }

    let property = args[3].toLowerCase();

    if (property === 'cardstyle' && args.length < 5) {
        // List all styles for user to pick
        let styleList = state.ProximityNPC.cardStyles.map(s =>
            `{{[${s.name}](!proximitynpc -e ${toSafeName(npc.name)} cardStyle ${s.name})}}`
        ).join(" ");
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Select Card Style for ${npc.name}}} ${styleList}`);
        return;
    }

    if (property === 'triggerdistance' && args.length < 5) {
        let curr = npc.triggerDistance;
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set Distance for ${npc.name}}} {{Current: ${curr}}} {{Distance (token widths)=[Click Here](!proximitynpc -e ${toSafeName(npc.name)} triggerDistance ?{Distance|${curr}})}}`);
        return;
    }

    if (property === 'timeout' && args.length < 5) {
        let curr = npc.timeout;
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set Timeout for ${npc.name}}} {{Current: ${curr} ms}} {{Timeout (ms)=[Click Here](!proximitynpc -e ${toSafeName(npc.name)} timeout ?{Timeout|${curr}})}}`);
        return;
    }

    if (property === 'img' && args.length < 5) {
        sendChat("NPC Monitor",
            `/w ${who} &{template:default} {{name=Set Image URL for ${npc.name}}} ` +
            `{{Current: [Link](${npc.img || 'none'})}} ` +
            `{{New URL=[Click Here](!proximitynpc -e ${toSafeName(npc.name)} img ?{Enter new image URL|${npc.img || 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/GuildEmblem.png'}})}}`
        );
        return;
    }


    let value = args.slice(4).join(" ").trim();
    switch(property) {
        case 'triggerdistance':
            let dist = parseFloat(value);
            if (isNaN(dist) || dist <= 0) {
                sendChat("NPC Monitor", `/w ${who} Invalid distance. Using default ${state.ProximityNPC.defaultDistance}.`);
                npc.triggerDistance = state.ProximityNPC.defaultDistance || 2;
            } else {
                npc.triggerDistance = dist;
                sendChat("NPC Monitor", `/w ${who} ${npc.name} trigger distance set to ${dist}.`);
            }
            break;
        case 'timeout':
            let to = parseInt(value);
            if (isNaN(to) || to < 0) {
                sendChat("NPC Monitor", `/w ${who} Invalid timeout. Using default ${state.ProximityNPC.defaultTimeout}.`);
                npc.timeout = state.ProximityNPC.defaultTimeout || 10000;
            } else {
                npc.timeout = to;
                sendChat("NPC Monitor", `/w ${who} ${npc.name} timeout set to ${to}ms.`);
            }
            break;
        case 'img':
            npc.img = value;
            sendChat("NPC Monitor", `/w ${who} ${npc.name} image URL updated.`);
            break;
        case 'cardstyle':
            let style = state.ProximityNPC.cardStyles.find(s => s.name.toLowerCase() === value.toLowerCase());
            if (!style) {
                sendChat("NPC Monitor", `/w ${who} Card style "${value}" not found. Use --cardstyles to list available styles.`);
            } else {
                npc.cardStyle = style.name;
                sendChat("NPC Monitor", `/w ${who} ${npc.name} style set to ${style.name}.`);
            }
            break;
        default:
            sendChat("NPC Monitor", `/w ${who} Unknown property "${property}".`);
    }
}

/**
 * Displays a menu of buttons with command paths set up
 * Usage: !proximitynpc -m
 * @param {Object} msg - The chat message object.
 */ 
function handleProximityNPCMenu(msg) {
    let who = msg.who;
    
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Menu}} {{[Add/Edit NPC Monitor](!proximitynpc -M)}}{{[List Monitored NPCs](!proximitynpc -l)}} {{[Trigger NPC](!proximitynpc -t)}} {{[Card Styles](!proximitynpc -cl)}} {{[Help](!proximitynpc -h)}}`);
    return;
}

/**
 * Lists all currently monitored NPCs and their settings.
 * @param {Object} msg - The chat message (for recipient).
 */
function handleListMonitoredNPCs(msg) {
    let who = msg.who || "gm";
    let monitored = Object.values(state.ProximityNPC.monitoredNPCs);
    if (monitored.length === 0) {
        sendChat("NPC Monitor", `/w ${who} No NPCs are currently monitored. Use !proximitynpc --monitor to add one.`);
        return;
    }
    let list = monitored.map(npc => {
        let safeName = toSafeName(npc.name);
        return `{{[${npc.name}](!proximitynpc -M ${safeName})=(Dist: ${npc.triggerDistance}, Timeout: ${npc.timeout}ms, Messages: ${npc.messages.length}, Style: ${npc.cardStyle})}}`;
    }).join(" ");
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Monitored NPCs}} ${list}`);
}

/**
 * Handles manual NPC triggering.
 * If a token is selected, triggers that NPC.
 * If no token is selected and no name is provided, lists all monitored NPCs for selection.
 * @param {Object} msg - The chat message object.
 */
function handleTriggerNPC(msg) {
    const who = msg.who || "gm";
    const args = msg.content.trim().split(/\s+/);
    const token = getTokenFromCall(msg);

    // 1️⃣ If a token is selected → trigger its monitored NPC
    if (token) {
        const monitoredNPC = state.ProximityNPC.monitoredNPCs[token.id];
        if (!monitoredNPC) {
            sendChat("NPC Monitor", `/w ${who} Token "${token.get('name')}" is not a monitored NPC.`);
            return;
        }
        triggerNPCMessage(monitoredNPC);
        return;
    }

    // 2️⃣ No token selected → try by name argument
    if (args.length > 2) {
        const npcName = fromSafeName(args.slice(2).join(" "));
        const entry = Object.entries(state.ProximityNPC.monitoredNPCs)
            .find(([id, npc]) => npc.name.trim().toLowerCase() === npcName.trim().toLowerCase());
        if (entry) {
            const [, npcObj] = entry;
            triggerNPCMessage(npcObj);
            return;
        }
    }

    // 3️⃣ No token and no matching name → list all monitored NPCs to choose from
    const npcEntries = Object.entries(state.ProximityNPC.monitoredNPCs);
    if (npcEntries.length === 0) {
        sendChat("NPC Monitor", `/w ${who} No monitored NPCs are currently active.`);
        return;
    }

    const npcButtons = npcEntries.map(([id, npc]) => {
        const safeName = toSafeName(npc.name);
        return `{{[${npc.name}](!proximitynpc -t ${safeName})}}`;
    }).join(" ");

    sendChat("NPC Monitor",
        `/w ${who} &{template:default} {{name=Trigger a Monitored NPC}} ${npcButtons}`
    );
}

/**
 * Edits or creates a new MonitoredNPC from the selected token.
 * @param {Object} msg - The chat message with possible selection.
 * @returns {void}
 */
function handleMonitorNPC(msg) {
    let who = msg.who;
    let token = getTokenFromCall(msg);
    if (token) {
        // Update or create monitored entry
        if (!state.ProximityNPC.monitoredNPCs[token.id]) {
            createMonitoredNPCFromToken(msg, token);
        } else {
            showEditMonitorNPCDialog(msg, token);
        }
        return;
    }
    // If no token given, show a menu of tokens on the page
    let tokens = findObjs({ type: 'graphic', subtype: 'token', layer: 'objects' });
    if (tokens.length === 0) {
        sendChat("NPC Monitor", `/w ${who} No tokens found to monitor on this page.`);
        return;
    }
    let menu = tokens.map(t => `{{[${t.get('name')}](!proximitynpc -M ${toSafeName(t.get('name'))})}}`).join(" ");
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Select Token to Monitor}} ${menu}`);
}

/**
 * Calculates distance between two points (Euclidean).
 * @param {number} x1 - X coord of first point.
 * @param {number} y1 - Y coord of first point.
 * @param {number} x2 - X coord of second point.
 * @param {number} y2 - Y coord of second point.
 * @returns {number} The distance.
 */
function calculateDistance(x1, y1, x2, y2) {
    let dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

/** 
 * Checks all monitored NPCs whenever a token moves. Triggers messages if in range.
 * @param {Graphic} movedToken - The token that moved.
 */
function checkAllProximities(movedToken) {
    let movedId = movedToken.id;
    let pageId = movedToken.get('pageid');
    let movedCenterX = movedToken.get('left') + movedToken.get('width')/2;
    let movedCenterY = movedToken.get('top') + movedToken.get('height')/2;
    let playerName = getPlayerNameFromToken(movedToken);
    Object.entries(state.ProximityNPC.monitoredNPCs).forEach(([npcId, npc]) => {
        if (npc.pageId !== pageId || npcId === movedId) return;
        let npcToken = getObj('graphic', npcId);
        if (!npcToken) return;
        // Update NPC position
        let newX = npcToken.get('left'), newY = npcToken.get('top');
        if (newX !== npc.lastPosition.x || newY !== npc.lastPosition.y) {
            npc.centerX = newX + npcToken.get('width')/2;
            npc.centerY = newY + npcToken.get('height')/2;
            npc.lastPosition = {x: newX, y: newY};
        }
        let distance = calculateDistance(npc.centerX, npc.centerY, movedCenterX, movedCenterY);
        let threshold = npc.triggerDistance * npcToken.get('width') + (npcToken.get('width')/2);
        let key = movedId + '_' + npcId;
        if (distance <= threshold && !triggeredTokens[key]) {
            triggerNPCMessage(npc, playerName);
            triggeredTokens[key] = true;
            setTimeout(() => {
                if (npc.timeout !== 0) delete triggeredTokens[key];
            }, npc.timeout > 0 ? npc.timeout : 1);
        }
    });
}

/**
 * Retrieves a player/character name from a token for personalization.
 * @param {Graphic} token - The moved token.
 * @returns {string} Player name or default "Guild Member".
 */
function getPlayerNameFromToken(token) {
    let charId = token.get('represents');
    if (charId) {
        let character = getObj('character', charId);
        if (character) return character.get('name').split(" ")[0] || 'Guild Member';
    }
    return 'Guild Member';
}

/**
 * Chooses a random message from an array, weighted by `messageObject.weight`.
 * @param {MessageObject[]} messages - Array of message objects.
 * @returns {MessageObject} The selected message.
 */
function getRandomMessage(messages) {
    if (!messages || messages.length===0) {
        return new MessageObject("They are lost in thought...", 1);
    }
    let pool = [];
    messages.forEach(m => {
        let w = m.weight || 1;
        for (let i=0; i<w; i++) pool.push(m);
    });
    return pool[Math.floor(Math.random()*pool.length)];
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

    // Build styled card - only show image if it exists
    let card = `<div style="background: ${cardStyle.backgroundColor || defaultCardStyle.backgroundColor}; border: 3px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 10px; padding: 15px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">` +
        (npc.img && npc.img.trim() !== '' ? `<div style="text-align: center; margin-bottom: 10px;">` +
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
    sendChat(npc.name, `${(cardStyle.whisper == 'off') ? '' : (cardStyle.whisper == 'character') ? `/w ${playerName} ` : '/w gm '}${card}`);
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

        let presetNPC = state.ProximityNPC.presetNPCs.find(npc => npc.name === tokenName);
        if (presetNPC) {
            // Skip if already monitored
            if (Object.values(state.ProximityNPC.monitoredNPCs).some(npc => npc.name === tokenName)) return;

            let tokenWidth = token.get('width');

            state.ProximityNPC.monitoredNPCs[token.id] = new MonitoredNPC(
                tokenName,
                presetNPC.distance,
                token.get('pageid'),
                token.get('left') + (tokenWidth / 2),
                token.get('top') + (token.get('height') / 2),
                { x: token.get('left'), y: token.get('top') },
                presetNPC.timeout,
                getBestTokenImage(token), // Use fallback system instead of preset image
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