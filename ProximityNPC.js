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
     * @param {string} badge - Optional url to badge image
     */
    constructor(name, borderColor = '#8b4513', backgroundColor = '#f4e8d8', bubbleColor = '#ffffff', textColor = '#2c1810', whisper = 'off', badge = null) {
        this.name = name;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.bubbleColor = bubbleColor;
        this.textColor = textColor;
        this.whisper = whisper;
        this.badge = badge;
    }
}

/**
 * Represents a message with content, weight, and optional card style.
 * Supports dynamic content replacements:
 * - {playerName} - Replaced with triggering character's first name
 * - {monitoredName} - Replaced with the NPC's name who is speaking
 * - {playerName.attributeName} - Replaced with character attribute value (e.g., {playerName.hp})
 * - {monitoredName.attributeName} - Replaced with NPC's character attribute value (if NPC has sheet)
 * - {1d6}, {2d20+3}, {1d8+2d6} - Dice rolls (displayed in styled spans with inverted colors)
 * - [Button Text](message) - Creates clickable buttons that send messages to chat
 * @class
 */
class MessageObject {
    /**
     * Creates a new MessageObject.
     * @param {string} content - The message text content with optional dynamic placeholders
     * @param {number} weight - Relative probability weight for random selection (default: 1, 0 = disabled)
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
 * Represents a monitored NPC with multiple tokens sharing the same configuration.
 * @class
 */
class MonitoredNPC {
    /**
     * Creates a new MonitoredNPC.
     * @param {string} name - The NPC's name
     * @param {number} triggerDistance - Trigger distance body widths
     * @param {string[]} tokenIds - Array of token IDs that represent this NPC
     * @param {number} timeout - Cooldown time in milliseconds before re-triggering (default: 10000, 0 = permanent)
     * @param {string} img - URL to NPC's image
     * @param {MessageObject[]} messages - Array of possible messages
     * @param {string} cardStyle - Card style name for this NPC
     * @param {string} mode - 'on', 'off', 'once' The mode
     */
    constructor(name, triggerDistance = 2, tokenIds = [], timeout = 10000, img = 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/GuildEmblem.png', messages = [], cardStyle = 'Default', mode = "on") {
        this.name = name;
        this.triggerDistance = triggerDistance; // body widths
        this.tokenIds = tokenIds; // Array of token IDs
        this.timeout = timeout;
        this.img = img;
        this.messages = messages;
        this.cardStyle = cardStyle;
        this.mode = mode;
    }
}

state.ProximityNPC = {
    defaultImagePath: '',
    defaultDistance: 2,
    buttonCallbacks: {},
    presetNPCs: [
        new PresetNPC(
            'Tharos Raggenthraw',
            3,
            [
                new MessageObject('The Guild Master looks up, you see a look of intense thought clear from his eyes. "Ah {playerName}, I hope you\'re keeping your wits sharp; I\'ve got some jobs coming up for you."', 3),
                new MessageObject('Tharos nods at you, "Good to see you again, {playerName}. Remember, the guild is always here if you need assistance."', 3),
                new MessageObject('"Tempus favors the bold, {playerName}, but he also favors the prepared. Make sure you\'re both before heading out." He taps Ruinbreaker\'s haft thoughtfully.', 2),
                new MessageObject('His booming laugh echoes through the hall. "That reminds me of the time I faced that wyvern! The story has become legend by all the bards over the years, but have I ever told you about how I barely escaped with my life?"', 1),
                // Relationship messages
                new MessageObject('"Keoti came from the army with the highest of recommendations, my former battle buddy claimed that he had \'Never seen a tabaxi move so fast with a greataxe\' - he\'s earned every bit of trust I place in him."', 2),
                new MessageObject('"When Risha tried to steal Ruinbreaker, I nearly threw her in the dungeons. But after realizing what she\'d done to it... brilliant! Sometimes second chances create our strongest allies."', 2),
                new MessageObject('"Ilikan may be our groundskeeper, but he has the patience of the giants who raised him. The guild wouldn\'t be standing without his careful maintenance."', 1),
                // Messages with dynamic features
                new MessageObject('"Let me see your stance, {playerName}. Show me your readiness! [Practice Attack]({playerName} demonstrates their form for Tharos who dances along with it readily. "Good form!")"', 2),
                new MessageObject('"In the wilds, every bandage counts." [Ask for Healing](w Caelum Riversong {playerName} could use some healing from {monitoredName}\'s recommendation) [Tough It Out]({playerName} decides to press on with {playerName.hp} HP)', 1),
                new MessageObject('"I\'ve faced beasts that could swallow a man whole!" You\'ve heard his tales, but the truth is often even stranger. Rolled: {1d20}. [10 or higher](You know the horrifying truths behind what he is writing off so casually.) [Below 10](You remain unaware of the darker realities behind his stories.)', 1),
                new MessageObject('"The guild stands at your back, {playerName}. Remember our strength when you face the darkness ahead."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/TharosRaggenthraw.png',
            'Mithral Rank'
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
                new MessageObject('"Bolagor and I have an arrangement - my best ale for his spiciest stew. The resulting feast nearly brought Tharos to tears last Winter."', 2),
                new MessageObject('"Snek once tried to help me serve drinks. We lost three mugs and gained a wonderful story. That kobold means well, even when his intentions lead to disaster."', 1),
                // Messages with dynamic features
                new MessageObject('"Very few members can go pour for pour with me on this Giant\'s Ale." She slides a mug across the bar. Rolled: {1d20 - 2}. [Lower than 17](You\'re instantly regretting that last round.) [17 or higher](You feel like you could take on the world after that round.)', 0.5),
                new MessageObject('"A discount?! Let\'s flip a coin for it, I call heads!" Rolled: {1d2}. [On a 2](Your drink is half priced) [On a 1](You pay double).', 1),
                new MessageObject('"You seem burdened, {playerName}. Sometimes sharing helps lighten the load. [Share a Secret](You confide in Kinris) [Keep to Yourself]({playerName} politely declines to share)"', 1),
                new MessageObject('"My special brew can put some fire in your belly!" Roll a Con save DC 15. [Success](You gain resistance to fire damage for one day) [Fail](You rush to the bathroom, praying to Tempus that there is mercy.)', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KinrisMorranfew.png',
            'Coal Rank'
        ),
        new PresetNPC(
            'Ovlan Kalek',
            1.5,
            [
                new MessageObject('His head turns towards you but his eyes remain pinned to a thick tome... "Questions about my book? Oh for you {playerName} I\'ll even sign it."', 3),
                new MessageObject('The boy is quite well in his studies, you\'d be foolish to underestimate him in sparring {playerName}', 2),
                new MessageObject('"Fascinating! {playerName}, come look at this passage - it perfectly describes the hunting patterns of a pack of gnolls!"', 2),
                new MessageObject('He looks up, startled as if waking from a dream. "Oh! {playerName}, I was just... how long have I been reading?"', 1),
                // Relationship messages
                new MessageObject('"Young Auren has a mind for graviturgy that I haven\'t seen in decades. Last week he corrected my calculations on feather fall... he was right, of course."', 2),
                new MessageObject('"Jade and I compiled the guild archives together. Her memory for detail is... unsettlingly good. Former spies make excellent record keepers it turns out."', 2),
                new MessageObject('"Fiona once helped me track a fey-touched beast for my research. Her connection to both drake and fey wilds made the difference between success and disaster."', 1),
                // Messages with dynamic features
                new MessageObject('"Your intellectual curiosity is noted, {playerName}. Let\'s test your knowledge with a simple puzzle!" Roll a Int save DC 12. [Success](You solve the puzzle with ease) [Fail](You feel your mind throbbing and take [[1d6]] psychic damage)', 2),
                new MessageObject('"Research can be dangerous! I once got quite hurt from an enchanted book. [Ask About Research](Ovlan shares research safety tips) [Share Your Story]({playerName} tells {monitoredName} about their own \'research\' mishaps)"', 1),
                new MessageObject('"The arcane arts require precision, {playerName}. Let me demonstrate a basic cantrip - watch closely!" Ovlan casts the most powerful form of Prestidigitation {playerName} has ever seen, cleaning the entire library in an instance.', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/OvlanKalek.png',
            'Silver Rank'
        ),
        new PresetNPC(
            'Varon Tavis',
            2,
            [
                new MessageObject('"You\'re welcome to use the forge {playerName}, there\'s an extra hammer on the wall there." He points to a long line of hanging hammers.', 3),
                new MessageObject('"Steel doesn\'t lie, {playerName}. It shows every flaw and every strength. People could learn from that."', 2),
                new MessageObject('"This blade needs more tempering. Show me your grip, {playerName} - proper form saves fingers."', 2),
                new MessageObject('"In the wilds, a dull blade gets you killed. Here, it just gets you a lecture from me." He almost smiles.', 1),
                // Relationship messages
                new MessageObject('"Tharos gave me a place when my own clan wouldn\'t. I\'d break every hammer in this forge before I betrayed that trust."', 2),
                new MessageObject('"Risha\'s \'improvements\' to my tools usually work, eventually. The exploding tongs were... educational." He rubs a faint scar on his arm.', 2),
                new MessageObject('"Ilikan understands materials - wood, stone, metal. We repaired the main gate together after that ogre incident. Good worker."', 1),
                // Messages with dynamic features
                new MessageObject('"Let\'s test your metalworking knowledge. See if you can identify this alloy by its weight and color." Rolled: {2d8}. [Higher than 8](Varon is very impressed.) [8 or lower](Varon looks puzzled by your answer.)', 1),
                new MessageObject('"I got badly burned from a forge accident once. Safety first in my smithy. [Learn Safety](Varon teaches forge safety) [Share Experience]({playerName} tells Varon about their own crafting experiences)"', 1),
                new MessageObject('"The heat of the forge is a lot like battle. Both can leave scars, but both make us stronger."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/VaronTavis.png',
            'Coal Rank'
        ),
        new PresetNPC(
            'Caelum Riversong',
            2,
            [
                new MessageObject('"Ah, {playerName}, careful with that bandage. Let me show you a proper technique—your hands could save lives yet."', 3),
                new MessageObject('"My research is going well {playerName}, but I really need our shipment of exotic herbs and oils from Kantra to come in..." You now notice a new crate of empty vials awaiting their contents.', 2),
                new MessageObject('"Lathander\'s light guide your path, {playerName}. And if it doesn\'t, my poultices will have to suffice."', 2),
                new MessageObject('"Precision saves lives, {playerName}. Whether in surgery or spellcasting, the principle remains."', 1),
                // Relationship messages
                new MessageObject('"Ilikan and I often pray to Lathander together at dawn. His giant-taught prayers have a... grounding quality to them."', 2),
                new MessageObject('"Kinris supplies me with the strongest spirits for disinfecting wounds. Her brew stings worse than any monster\'s bite, but it works."', 2),
                new MessageObject('"I treated Fiona\'s drake when it ate something it shouldn\'t have. Remarkable creature - even its digestive troubles were impressive."', 1),
                // Messages with dynamic features
                new MessageObject('"This poultice should help with minor wounds. Let me show you how to apply it properly."', 2),
                new MessageObject('"I\'ve seen wounds that would make a lesser person fall. The worst was from a wyvern\'s sting. [Ask About Treatment](Caelum explains advanced wound care) [Share Experience]({playerName} describes their own healing experiences)"', 1),
                new MessageObject('"Every sunrise brings new hope for healing, {playerName}. Remember that when your spirits are low."', 1),
                new MessageObject('He looks very busy mixing compounds and reviewing notes as you approach. "Ah {playerName}, perfect timing! Can you hand me that poison siphon leaf over there?" Roll a Nature check DC {1d4 + 8}. [Success](Caelum carefully extracts and mixes in the oil taken from the leaf, afterwards handing you a Potion of \'Potion of Cure Poison\') [Fail](You select an open container of leaves and begin uncontrollably sneezing for the next hour with Caelum shaking his head in amusement.)', 2)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/CaelumRiversong.png',
            'Coal Rank'
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
                new MessageObject('"Tharos could have had me hanged. Instead he saw my potential. Never told him I was just trying to up the value before fencing it off."', 2),
                new MessageObject('"Varon grumbles about my \'tinkering\' but he\'s the first to test my new designs. We built a self-sharpening whetstone that actually works... mostly."', 2),
                new MessageObject('"Snek brings me the most interesting scrap metal he finds. Half of it\'s junk, but that other half... pure inspiration."', 1),
                // Messages with dynamic features
                new MessageObject('"Let\'s make something explode! Well, not really... unless you want to? Care to help with this delicate work?" [Offer Help]({playerName} offers to assist Risha with her invention. Rolled: [[1d20]]. [Lower than 13](Around 30 minutes in, a small boom can be heard throughout the Guildhall and you take [[1d4]] thunder damage as soot covers your face and your ears ring.)) [Decline Help]({playerName} declines to assist Risha, knowing how things can go in her very \'reinforced\' workshop.)', 2),
                new MessageObject('"This device misfired and gave me quite a shock! Worth it for the breakthrough! [Ask About Invention](Risha explains her latest creation) [Share Idea]({playerName} suggests an invention to Risha)"', 1),
                new MessageObject('"They said my crossbow modifications were impossible. I said they lacked vision. Guess who was right?"', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/RishaSwiftdancer.png',
            'Coal Rank'
        ),
        new PresetNPC(
            'Lumen Silverflock',
            1.5,
            [
                new MessageObject('A mug crashes against the wall near you. "I\'ll get that cleaned up, {playerName}. Don\'t worry, I move a mop as well as I do a sword."', 1),
                new MessageObject('You notice Lumen feigning attacks with an invisible sword. "Master Keoti says there\'s always time to practice."', 3),
                new MessageObject('"Kelemvor teaches that every life deserves justice, {playerName}. That\'s why I train so hard."', 2),
                new MessageObject('"Could you show me that parry again, {playerName}? I want to get it perfect before Master Keoti returns."', 2),
                // Relationship messages
                new MessageObject('"Master Keoti found me practicing alone one night and just... started teaching me. He doesn\'t say much, but he shows me everything."', 2),
                new MessageObject('"Kinris lets me help in the kitchen sometimes. She says I remind her of... well, she gets quiet after that. But she\'s always kind."', 2),
                new MessageObject('"The guild party that rescued me... I don\'t remember all their names, but Tharos was there. His mane was the first thing I saw in the ruins."', 1),
                // Messages with dynamic features
                new MessageObject('"I\'ve been practicing my attacks! Watch this - I\'m getting better every day. [Offer Training]({playerName} shows Lumen a combat technique) [Watch Practice]({playerName} watches Lumen train)"', 2),
                new MessageObject('"I did well on my history test yesterday! Ovlan said I\'m improving. [Ask About Studies](Lumen shares what he\'s learning) [Encourage Studies]({playerName} encourages Lumen\'s education)"', 1),
                new MessageObject('"Justice doesn\'t care about age, {playerName}. Even I can help make things right."', 1),
                new MessageObject('You see Lumen uncharacteristically confused. "{playerName}, can you help me with understanding how to do these calculations Ovlan gave me?" Roll an Intelligence save DC 12. [Success](Lumen quickly grasps the concept and thanks you profusely) [Fail](He sighs and says "That\'s what I thought too, but Ovlan said it wasn\'t quite right.")', 2)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/LemunSilverflock.png',
            'Copper Rank'
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
                new MessageObject('"Jade and I handle the guild\'s finances. She balances the books, I ensure negotiations keep us within budget. Between us, we keep this place from bankruptcy."', 2),
                new MessageObject('"Kinris and I have a standing bet on who can create the more... memorable beverage. Last time, her ale made a dwarf cry. I respect that."', 2),
                new MessageObject('"Little Auren is the only one who remembers every ingredient in my seven-pepper stew. Sharp mind, that one."', 1),
                // Messages with dynamic features
                new MessageObject('"This stew will restore your strength! Good food is the best medicine. [Try the Stew]({playerName} tries Bolagor\'s special stew) [Politely Decline]({playerName} declines the spicy offering)"', 2),
                new MessageObject('"Let\'s see how well you haggle! I learned from the best merchants in the land." Roll a Charisma save DC {1d6 + 11}. [Success](Bolagor smirks "Oh you\'d be one to walk away with what wasn\'t even for sale huh, {playerName}.") [Fail](He narrows his eyes and says "Maybe let one of your friends handle your coin.")', 1),
                new MessageObject('"I once set my apron on fire from an over-spiced pan. The kitchen is as dangerous as the hunt! [Ask Cooking Tips]({playerName} Bolagor shares cooking wisdom) [Share Kitchen Story]({playerName} tells Bolagor about their own cooking experiences)"', 1),
                new MessageObject('"Good food fuels good fighters, {playerName}. Never underestimate a proper meal before battle."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/BolagorBonejaw.png',
            'Coal Rank'
        ),
        new PresetNPC(
            'Jade Clearrock',
            2,
            [
                new MessageObject('"Good day, {playerName}. I don\t have any quests available at the moment, but for any record look-ups..." She gestures to the ledger with a serene smile.', 3),
                new MessageObject('"Tymora smiles on the prepared, {playerName}. What kind of quests would you like me to look out for?"', 2),
                new MessageObject('"Looking for advice on certain aspects of adventuring, {playerName}?" You can almost sense the usefulness this conversation could have.', 2),
                new MessageObject('"Diplomacy first, blades if necessary. That was my motto in the field, and it serves well here too."', 1),
                new MessageObject('She looks up at you from the papers she\'s going over meticulously, "Keep striving to rank up, and build your reputation here, you\'re one of my favorite reports to read."', 1),
                // Relationship messages
                new MessageObject('"Ovlan and I compiled the guild archives together. His memory for arcane lore is unmatched even by mine..."', 2),
                new MessageObject('"Bolagor drives the hardest bargain I\'ve seen since my espionage days. I rather enjoy sitting in on his negotiations - it keeps me sharp."', 2),
                new MessageObject('"Who comes to me for stories of my adventuring days. She says they make good songs. I suppose everyone deserves a legend, even former spies."', 1),
                // Messages with dynamic features
                new MessageObject('"Let me check the quest records for someone of your capabilities... I keep detailed notes on all our members."', 2),
                new MessageObject('"In my field days, I got quite injured from a fey trap once. Retirement has its perks." [Ask About Past](Jade shares an adventuring story) [Share Your Story]({playerName} tells Jade about their own dangerous encounters)', 1),
                new MessageObject('"Tymora favors those who plan ahead, {playerName}. Always have an exit strategy."', 1),
                new MessageObject('"Want to practice your decoding skills? Here\'s a cipher I used in the field." Rolled: {2d10}. [Lower than 11](You read the message to Jade outloud, after which she cocks her head and says "Not quite {playerName}, maybe give that some more thought.") [11 or Higher]("Impressive, I\'ll have to keep an eye on my personal records when you\'re around.")', 2)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/JadeClearrock.png',
            'Iron Rank'
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
                new MessageObject('"Snek helps me with the smaller creatures. They trust him in a way they don\'t trust most people. There\'s a pure heart beneath that chatter."', 1),
                // Messages with dynamic features
                new MessageObject('"Let\'s see if you have a way with beasts! This young griffon seems to like you already." Roll a Animal Handling check DC {1d6 + 12}. [Success](You successfully befriend the griffon) [Fail](The griffon remains wary)', 2),
                new MessageObject('"I once got badly wounded protecting my drake from a manticore. Worth every scar. [Ask About Drake](Fiona shares how she met her drake companion) [Share Beast Story]({playerName} tells Fiona about their own beast encounters)"', 1),
                new MessageObject('"The wilds speak to those who listen, {playerName}. My drake seems to think you\'re worth listening to."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/FionaMirage.png',
            'Gold Rank'
        ),
        new PresetNPC(
            'Ilikan Wildfist',
            2,
            [
                new MessageObject('"Everything in its place, {playerName}. Care to help repair this table leg? You\'ll learn a thing or two."', 3),
                new MessageObject('"My giant-kin taught me: every avalanche begins as a single pebble. Good work starts small, {playerName}."', 2),
                new MessageObject('"Lathander\'s dawn reminds us that even broken things can be made new. These flowers just need patience, {playerName}."', 2),
                new MessageObject('"The gardens need tending, {playerName}. There\'s peace in working with the earth - care to join me?"', 1),
                // Relationship messages
                new MessageObject('"Fiona still has the wild fey spark that drew me to her, but now it\'s tempered by motherhood. Our son has her brilliant mind and, thankfully, my patience."', 2),
                new MessageObject('"Caelum and I share dawn prayers to Lathander. He tends to souls while I tend to the earth, but we both serve renewal in our ways."', 2),
                new MessageObject('"I teach Auren Giant not just for language, but for perspective. The world looks different when you understand how giants think."', 1),
                // Messages with dynamic features
                new MessageObject('"Let\'s test your repair skills! This curtain needs careful mending." Roll a Sleight of Hand check DC {1d8 + 8}. [Success](You successfully mend the curtain) [Fail](The curtain remains damaged)', 2),
                new MessageObject('"I got hurt from a falling beam during hall repairs last year. Safety matters in all work. [Learn Safety](Ilikan shares construction safety tips) [Share Work Story]({playerName} tells Ilikan about their own work experiences)"', 1),
                new MessageObject('"Lathander\'s light reveals what needs mending, both in our halls and in our hearts."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/IlikanWildfist.png',
            'Coal Rank'
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
                new MessageObject('"Master Ovlan says I\'m the best student he\'s had, but I bet he\'s said that to all his apprentices. Still, it makes me want to work harder."', 2),
                new MessageObject('"Father says our family follows Lathander because every morning is a new beginning. I like that - it means I can always try again tomorrow."', 1),
                // Messages with dynamic features
                new MessageObject('"I can carry several plates without dropping them! Watch! [Test Balance](Auren demonstrates his serving skills) [Offer Help]({playerName} helps Auren with his duties)"', 2),
                new MessageObject('"I did well on my magic test yesterday! Master Ovlan said I\'m improving. [Ask About Studies](Auren shares his magical studies) [Encourage Learning]({playerName} encourages Auren\'s education)"', 1),
                new MessageObject('"Service is an honor, {playerName}. Father says every task done well makes the guild stronger."', 1),
                new MessageObject('"{playerName}, do you mind if I test this new spell on you? It shouldn\'t hurt." Roll a Strength save DC 12. [Success](You withstand the minor gravitational pulse Auren casts, feeling a slight tug but no harm) [Fail](You stumble as Auren\'s spell momentarily increases your weight, causing you to fall prone as Auren quickly apologizes and helps you to your feet.)', 2)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/AurenWildfist.png',
            'Coal Rank'
        ),
        new PresetNPC(
            'Keoti Fang',
            3,
            [
                new MessageObject('Keoti\'s amber eyes meet yours, sharp as a blade. "Stay alert, {playerName}. Let me know of any trouble."', 3),
                new MessageObject('"Sehanine guides us through dreams and darkness both, {playerName}. Trust your instincts as you would her moonlight."', 2),
                new MessageObject('"The scar teaches what the victory forgets, {playerName}. Learn from both."', 1),
                // Relationship messages
                new MessageObject('"Lumen trains harder than soldiers twice his age. The boy carries grief like armor, but I\'m teaching him to wear it like a cloak instead."', 2),
                new MessageObject('"Tharos may have served years before me, but I\'ve always felt we share the same nightmares. Only difference is, he built a guild while I found a god."', 2),
                new MessageObject('"I patrol with Fiona\'s drake sometimes. The creature sees things even I miss. Useful partner, if you don\'t mind the shedding."', 1),
                // Messages with dynamic features
                new MessageObject('"A guard must notice what others miss. Let me test your awareness." Roll a Perception check DC {1d8 + 9} [Success](You notice a piece of cloth stuffed in the lock on a window) [Fail](Keoti points to a window, "That lock has been tampered with, anyone could sneak in.")', 1),
                new MessageObject('"I got badly wounded holding the line at Riverbend. Some scars remind us why we fight. [Ask About Service](Keoti shares a war story) [Share Battle Story]({playerName} tells Keoti about their own battle experiences)"', 1),
                new MessageObject('"Sehanine\'s moonlight reveals truths the sun cannot see. Remember that when your path seems dark."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/KeotiFang.png',
            'Coal Rank'
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
                new MessageObject('"Fiona lets me help with the animals! Well, the small ones. The big ones sit on me sometimes."', 2),
                new MessageObject('"Who sings the prettiest songs! I try to remember the words but they get mixed up, but she says it\'s the feeling that matters anyway."', 2),
                new MessageObject('"Kinris is my favorite! She gives me the leftover fruit from her brewing and never gets mad when I spill things. Well, not TOO mad."', 1),
                // Messages with dynamic features
                new MessageObject('"Let\'s play a game! Try to catch this message bird - he\'s very fast!"', 2),
                new MessageObject('"I heard of this game called two truths and a lie, want to play?" Roll an Insight check DC {1d4 + 16} [Success](You are able to sort out which claims seem the most grounded in reality... somehow) [Fail](None of these details even go together... you question everything you know about Snek)', 1),
                new MessageObject('"The birds say the weather will be nice tomorrow! Or was it rainy? I get their chirps mixed up sometimes."', 1)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/SnekLittlefoot.png',
            'Copper Rank'
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
                new MessageObject('"Tharos took a chance on a street performer, and now I have a home. I write songs about his wyvern fight, but I make the ending happier than it really was."', 1),
                // Messages with dynamic features
                new MessageObject('"Let me play you something uplifting! Music can lift the heaviest spirits."', 2),
                new MessageObject('"This song is about healing - it might help restore your energy! [Listen Closely](Who performs her healing song) [Request Different Song]({playerName} asks Who for a different type of music)"', 1),
                new MessageObject('"I once got hurt from a broken lute string! The high E is dangerous when it snaps. [Ask About Music](Who shares musician stories) [Share Performance Story]({playerName} tells Who about their own performance experience)"', 1),
                new MessageObject('"Tymora guides my fingers on the strings, {playerName}. Every note is a chance for beauty."', 1),
                new MessageObject('You notice Who looking a bit distracted as she tunes her lute. "Oh, {playerName}, could you help me figure out this tuning? I think I\'m a bit off." Roll a Performance check DC 12. [Success](You help Who get the perfect pitch, and she beams with gratitude) [Fail](Who sighs, "Close enough, I suppose. Maybe Tymora will forgive my mistakes today.")', 2)
            ],
            'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/WhoWingfall.png',
            'Coal Rank'
        ),
        // PCs
        new PresetNPC(
            'Whisper',
            2,
            [
                new MessageObject('Whispering from a voice not your own, "He follows you, you know... in the space between footsteps."', 1),
                new MessageObject('"If my dagger trusts you, so do I." {monitoredName} says in a raspy tone.', 1),
                new MessageObject('Whisper releases from his beak a sound identical to that of a creaking door, "Opportunity knocks."', 3),
                new MessageObject('"Buy me a drink?" Followed by the sound of coins clinking together from the back of his throat.', 4),
                new MessageObject('“Patience, foresight… blah blah. Time\'s short, bird\'s faster.” Whisper says, with the voice of Xandros.')
            ],
            'https://files.d20.io/images/460434705/KqFKgRYKTp96aUbz494YeQ/med.jpg?1760576338',
            'Copper Rank'
        ),
        new PresetNPC(
            'Xandros Kirvath',
            2,
            [
                new MessageObject('"Sweet dreams lately, {playerName}?"', 2),
                new MessageObject('"“Every action leaves its echo in time, {playerName}. Best we choose our steps with care.”', 2),
                new MessageObject('"“I remember the first time you spoke in my dreams. I thought you were a curse. Now I know you\'re my compass.”', 1),
                new MessageObject('"“The others think I talk to ghosts. Let them. You\'re more real to me than they\'ll ever understand.”', 1)
            ],
            'https://files.d20.io/images/459909611/OFJdlRki_OurTvZvS7tLkA/med.jpg?1760213725',
            'Copper Rank'
        ),
        new PresetNPC(
            'Verdi SapKnot',
            2,
            [
                new MessageObject('“You think living is easy? It\'s work — but it\'s the finest work there is.”', 2),
                new MessageObject('“I am the eyes of the green. I see what the roots cannot.”', 1),
                new MessageObject('"I wish I could be a real boy...", Verdi says staring off.', 2),
                new MessageObject('A twig falls from his arm, "Don\'t worry about that, it should grow back in a few years."', 1),
                new MessageObject('"No no no, I have absolutely no desire for such things." You swear his nose grows slightly.', 2),
                new MessageObject('"For the Grove!!" {monitoredName} exlaims, seemingly to hold back a stream of tears.', 3)
            ],
            'https://files.d20.io/images/460438195/SUeS63XKOY0o1VkteOpHjA/med.png?1760578255',
            'Copper Rank'
        ),
        new PresetNPC(
            'Varkun Tarlok',
            2,
            [
                new MessageObject('"Aye {playerName}, have an ale with me when you\'re free." Varkun reaches for a \'waterskin\' kept on his belt.', 2),
                new MessageObject('"The Guild is all I know, Tharos is like a second father to me."', 1),
                new MessageObject('"This Guildhall is my second home, the old Guildhall was my first."', 2),
                new MessageObject('"Ovlan said sometimes these mauls \'awaken\', but mine sure can sleep through a lot."', 2)
            ],
            'https://files.d20.io/images/460447956/6zI5Bg298MEFRs0FnakYlQ/med.jpg?1760584645',
            'Copper Rank'
        )
    ],
    monitoredNPCs: {},
    cardStyles: [
        new CardStyle('Default'),
        new CardStyle('Coal Rank', '#2b2b2b', '#3a3a3a', '#555555', '#e0e0e0', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/coal_rank.png'),
        new CardStyle('Copper Rank', '#b87333', '#ffe5b4', '#fff2e0', '#4a2c00', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/copper_rank.png'),
        new CardStyle('Iron Rank', '#5a5a5a', '#d8d8d8', '#f5f5f5', '#1e1e1e', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/iron_rank.png'),
        new CardStyle('Silver Rank', '#c0c0c0', '#f8f8f8', '#ffffff', '#303030', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/silver_rank.png'),
        new CardStyle('Gold Rank', '#ffd700', '#fff8dc', '#fffaf0', '#5a4300', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/gold_rank.png'),
        new CardStyle('Platinum Rank', '#e5e4e2', '#fefefe', '#ffffff', '#222222', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/platinum_rank.png'),
        new CardStyle('Mithral Rank', '#7fd4ff', '#e6f7ff', '#f0fbff', '#00334d', 'off', 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/rankImages/mithral_rank.png'),
        new CardStyle('Enemy', '#8b0000', '#3b0000', '#660000', '#ffe5e5', 'off')
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

        // Listen for button clicks
        if (msg.type == "api" && msg.content.startsWith("!proximitynpc-button")) {
            let args = msg.content.trim().split(" ");
            if (args.length > 1) {
                let buttonId = args[1];
                if (state.ProximityNPC.buttonCallbacks && state.ProximityNPC.buttonCallbacks[buttonId]) {
                    let callback = state.ProximityNPC.buttonCallbacks[buttonId];
                    sendChat(callback.sender, callback.whisper + callback.message);
                    // Clean up the callback
                    delete state.ProximityNPC.buttonCallbacks[buttonId];
                }
            }
            return;
        }

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

    // Monitor when new graphics are added to the page
    on('add:graphic', function (token) {
        if (token.get('subtype') !== 'token') return;

        let tokenName = getTokenEffectiveName(token);
        if (!tokenName) return; // Skip if no name found

        let safeName = toSafeName(tokenName);

        // Check if this token should be monitored
        let monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
        if (monitoredNPC) {
            // Add this token ID to the monitored NPC if not already there
            if (!monitoredNPC.tokenIds.includes(token.id)) {
                monitoredNPC.tokenIds.push(token.id);
                log(`Added token ${token.id} to monitored NPC ${tokenName}`);
            }
        } else {
            // Check if it's a preset NPC that should be auto-monitored
            let presetNPC = state.ProximityNPC.presetNPCs.find(npc => npc.name === tokenName);
            if (presetNPC) {
                state.ProximityNPC.monitoredNPCs[safeName] = new MonitoredNPC(
                    tokenName,
                    presetNPC.distance,
                    [token.id],
                    presetNPC.timeout,
                    getBestTokenImage(token),
                    presetNPC.messages,
                    presetNPC.cardStyle || 'Default',
                    'on'
                );
                log(`Auto-monitored new NPC ${tokenName} with token ${token.id}`);
            }
        }
    });

    // Monitor when graphics are destroyed
    on('destroy:graphic', function (token) {
        if (token.get('subtype') !== 'token') return;

        let tokenName = getTokenEffectiveName(token);
        if (!tokenName) return; // Skip if no name found

        let safeName = toSafeName(tokenName);

        // Remove this token ID from the monitored NPC if it exists
        let monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
        if (monitoredNPC && monitoredNPC.tokenIds) {
            let index = monitoredNPC.tokenIds.indexOf(token.id);
            if (index > -1) {
                monitoredNPC.tokenIds.splice(index, 1);
                log(`Removed token ${token.id} from monitored NPC ${tokenName}`);

                // Clear any triggered tokens for this token
                Object.keys(triggeredTokens).forEach(key => {
                    if (key.includes(token.id)) {
                        delete triggeredTokens[key];
                    }
                });
            }
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
 * Gets the effective name for a token - either the token's name or the character it represents.
 * @param {Graphic} token - The token to get the name for
 * @returns {string} The token's name or character name, or empty string
 */
function getTokenEffectiveName(token) {
    // First try the token's own name
    let tokenName = token.get('name');
    if (tokenName && tokenName.trim() !== '') {
        return tokenName.trim();
    }

    // If no token name, check if it represents a character
    let charId = token.get('represents');
    if (charId) {
        let character = getObj('character', charId);
        if (character) {
            let charName = character.get('name');
            if (charName && charName.trim() !== '') {
                return charName.trim();
            }
        }
    }

    return '';
}

/**
 * Creates a MonitoredNPC entry for the given token and opens its edit dialog.
 * @param {Object} msg - The chat message for whispering back.
 * @param {Graphic} token - The token to monitor.
 */
function createMonitoredNPCFromToken(msg, token) {
    let name = getTokenEffectiveName(token);
    if (!name) {
        sendChat("NPC Monitor", `/w ${msg.who} Token has no name and doesn't represent a named character.`);
        return;
    }
    let safeName = toSafeName(name);

    // Check if this NPC already exists
    if (state.ProximityNPC.monitoredNPCs[safeName]) {
        // Add this token to the existing NPC if not already there
        let monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
        if (!monitoredNPC.tokenIds.includes(token.id)) {
            monitoredNPC.tokenIds.push(token.id);
            sendChat("NPC Monitor", `/w ${msg.who} Added token to existing monitored NPC "${name}".`);
        }
    } else {
        // Create a new monitored NPC with this token
        state.ProximityNPC.monitoredNPCs[safeName] = new MonitoredNPC(
            name,
            state.ProximityNPC.defaultDistance || 2, // in token widths
            [token.id],
            state.ProximityNPC.defaultTimeout || 10000,
            getBestTokenImage(token),
            [],
            state.ProximityNPC.cardStyles[0].name || 'Default',
            'on'
        );
    }
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
 * @param {Graphic} token - The token object for the NPC (optional, can also use name).
 */
function showEditMonitorNPCDialog(msg, token) {
    let npc;
    let safeName;

    if (token) {
        let tokenName = getTokenEffectiveName(token);
        safeName = toSafeName(tokenName);
        npc = state.ProximityNPC.monitoredNPCs[safeName];
        if (!npc) {
            sendChat("NPC Monitor", `/w ${msg.who} Token "${tokenName}" is not monitored.`);
            return;
        }
    } else {
        // Try to find NPC by name from message args
        let args = msg.content.trim().split(" ");
        if (args.length > 2) {
            let npcName = fromSafeName(args[2]);
            safeName = toSafeName(npcName);
            npc = state.ProximityNPC.monitoredNPCs[safeName];
            if (!npc) {
                sendChat("NPC Monitor", `/w ${msg.who} NPC "${npcName}" is not monitored.`);
                return;
            }
        } else {
            sendChat("NPC Monitor", `/w ${msg.who} Please specify an NPC to edit.`);
            return;
        }
    }

    // Build clickable fields for each property
    let properties = [
        { label: 'Mode', attr: 'mode' },
        { label: 'Trigger Distance ^in token widths^', attr: 'triggerDistance' },
        { label: 'Timeout (ms)', attr: 'timeout' },
        { label: 'Image URL', attr: 'img' },
        { label: 'Card Style', attr: 'cardStyle' },
        { label: 'Messages', attr: 'messages' }
    ];
    let buttons = properties.map(prop => {
        return `{{[${prop.label}](!proximitynpc -M ${safeName} ${prop.attr})}}`;
    }).join(" ");

    let tokenCount = npc.tokenIds ? npc.tokenIds.length : 0;
    sendChat("NPC Monitor", `/w ${msg.who} &{template:default} {{name=Edit NPC: ${npc.name}}} {{Tokens: ${tokenCount}}} ${buttons} {{[Delete Monitor](!proximitynpc -D ${safeName})}}`);
}

/**
 * Shows the help/usage information via chat.
 * @param {Object} msg - The chat message (for determining recipient).
 */
function showHelpMessage(msg = { who: "gm" }) {
    let who = msg.who || "gm";
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=NPC Proximity Monitor Help}} {{!proximitynpc=Main call (must include one flag)}} {{--monitor|-M [Token/Name]=Add or edit an NPC monitor (requires a token or name). Use underscores for spaces.}} {{--list|-l=List all monitored NPCs}} {{--menu|-m=Open the ProximityNPC menu}} {{--edit|-e [Name] [prop] [value]=Edit a monitored NPC's property (prop: triggerDistance, timeout, img, cardStyle)}} {{--trigger|-t [Token/Name]=Manually trigger an NPC message}} {{--attributes|-a [Token]=List all attributes for selected token/character}} {{--cardstyles|-cl=List all card styles}} {{--cardstyle|-C [StyleName] [property] [value]=Edit or create a card style}} {{--delete|-D [Name]=Delete a monitored NPC}} {{--help|-h=Show this help}} {{=**Dynamic Message Content**}} {{{playerName}=Triggering character's first name}} {{{monitoredName}=NPC's name}} {{{playerName.hp}=Character attribute value}} {{{monitoredName.hp}=NPC's attribute value}} {{{1d6} or {2d20+3}=Dice rolls (styled)}} {{'sqr'Text'sqr'(message)=Clickable button (can include rolls with [[1d6]], whispers, API calls)}} {{**Dice Roll Syntax**=Supported dice notation:}} {{Basic Rolls=1d6, 2d20, 3d8 (XdY format)}} {{With Modifiers=1d20+5, 2d6+3, 1d8-2}} {{Complex=1d20+1d4+3, (2d6+2)*2, 1d100/10}} {{Limits=1-100 dice, 1-1000 sides per die}} {{**Character Attributes**=Supported attribute names:}} {{Core Stats=hp, maxhp, ac, level, gold/gp, inspiration}} {{Abilities=str/dex/con/int/wis/cha (and modifiers)}} {{Examples={playerName.hp}, {monitoredName.ac}, {playerName.gold}}}`);
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
    return tokens.find(t => t.get("layer") === "objects") || tokens[0] || null;
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
    let safeName = args[2];
    let npcName = fromSafeName(safeName);
    let action = args[4] ? args[4].toLowerCase() : 'menu'; // Actions: 'menu', 'add', 'edit', 'delete'

    // Find the monitored NPC by name
    let monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
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

        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set Message Weight}} {{Message added! Now set its relative weight ^higher number more likely to appear^:}} {{Weight ^default 1, off 0^=[Click Here](!proximitynpc -M ${safeNPCName} messages add_weight ${monitoredNPC.messages.length - 1} ?{Weight|1})}}`);
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
        if (isNaN(weight) || weight < 0) {
            sendChat("NPC Monitor", `/w ${who} Weight must be >= 0. Using default of 1.`);
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
        if (isNaN(newWeight) || newWeight < 0) newWeight = 1;
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

    let styleName = fromSafeName(args[2]);
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
            { name: 'Whisper', type: 'whisper', attr: 'whisper', value: cardStyle.whisper },
            { name: 'Badge', type: 'url', attr: 'badge', value: cardStyle.badge }
        ];

        let propertyLinks = properties.map(prop =>
            `{{[${prop.name}: ${prop.attr == 'badge' ? 'Image URL' : (prop.value || 'None')}](!proximitynpc -C ${toSafeName(cardStyle.name)} ${prop.attr})}}${prop.attr == 'badge' && prop.value ? ` {{[Link](${prop.value || 'None'})}}` : ''}`
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

        switch (property) {
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
                let whispers = ['off', 'gm', 'character'].map(w =>
                    `{{[${w.toUpperCase()}](!proximitynpc -C ${toSafeName(cardStyle.name)} whisper ${w})}}`
                ).join(" ");
                sendChat('NPC Monitor',
                    `/w ${who} &{template:default} {{name=Set Whisper for ${cardStyle.name}}} ` +
                    `{{Current: ${currentValue}}} ` +
                    `${whispers}`
                );
                return;
            case 'badge':
                promptMessage = "Enter URL for Badge Image ^'clear' to remove^:"
                break;
            default:
                sendChat("NPC Monitor", `/w ${who} Unknown property: ${property}. Valid properties: borderColor, backgroundColor, bubbleColor, textColor, whisper`);
                return;
        }

        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set ${property} for ${cardStyle.name}}} {{Current: ${property == 'badge' ? currentValue ? `[Link](${currentValue || 'None'})` : `None` : (currentValue || '')}}} {{${promptMessage}=[Click Here](!proximitynpc -C ${toSafeName(cardStyle.name)} ${property} ?{${promptMessage}|${currentValue}})}}`);
        return;
    }

    let value = args.slice(4).join(" ").trim();

    // Handle property-specific validation and setting
    switch (property) {
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
            let lowerWhisper = value.toLowerCase();
            if (lowerWhisper === 'character' || lowerWhisper === 'gm' || lowerWhisper === 'off') {
                cardStyle.whisper = lowerWhisper;
                sendChat("NPC Monitor", `/w ${who} Updated ${cardStyle.name} whisper to "${lowerWhisper}"`);
            } else {
                // Default to 'off' for invalid values
                cardStyle.whisper = 'off';
                sendChat("NPC Monitor", `/w ${who} Invalid whisper value "${value}". Set to "off". Valid values: 'character', 'gm', 'off'`);
            }
            break;
        case 'badge':
            let clear = value.toLowerCase().trim() == 'clear';
            cardStyle.badge = clear ? null : value;
            sendChat("NPC Monitor", `/w ${who} ${clear ? 'Removed' : 'Updated'} ${cardStyle.name} badge url to ${clear ? '' : `"${value}"`}`);
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

    let safeName = args[2];
    let name = fromSafeName(safeName);
    let npc = state.ProximityNPC.monitoredNPCs[safeName];

    if (!npc) {
        sendChat("NPC Monitor", `/w ${who} Monitored NPC "${name}" not found.`);
        return;
    }

    // Clear any pending triggers for all tokens of this NPC
    if (npc.tokenIds) {
        npc.tokenIds.forEach(tokenId => {
            Object.keys(triggeredTokens).forEach(key => {
                if (key.includes(tokenId)) {
                    delete triggeredTokens[key];
                }
            });
        });
    }

    delete state.ProximityNPC.monitoredNPCs[safeName];
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
    let safeName = args[2];
    let npcName = fromSafeName(safeName);
    let npc = state.ProximityNPC.monitoredNPCs[safeName];

    if (!npc) {
        sendChat("NPC Monitor", `/w ${who} Monitored NPC "${npcName}" not found.`);
        return;
    }

    // If no prop given, open edit dialog
    if (args.length < 4) {
        // Try to get one of the tokens for this NPC
        let token = null;
        if (npc.tokenIds && npc.tokenIds.length > 0) {
            token = getObj('graphic', npc.tokenIds[0]);
        }
        showEditMonitorNPCDialog({ who: who }, token);
        return;
    }

    let property = args[3].toLowerCase();

    if (property === 'cardstyle' && args.length < 5) {
        // List all styles for user to pick
        let styleList = state.ProximityNPC.cardStyles.map(s =>
            `{{[${s.name}](!proximitynpc -e ${toSafeName(npc.name)} cardStyle ${s.name})}}`
        ).join(" ");
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Select Card Style for ${npc.name}}} {{Current: ${npc.cardStyle || 'Default'}}} ${styleList}`);
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
            `{{Current: ${npc.img ? `[Link](${npc.img})` : `None`}}} ` +
            `{{New URL=[Click Here](!proximitynpc -e ${toSafeName(npc.name)} img ?{Enter new image URL ^'clear' to remove^|${npc.img || 'https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/GuildEmblem.png'}})}}`
        );
        return;
    }

    if (property === 'mode' && args.length < 5) {
        let modeList = ['on', 'off', 'once'].map(m =>
            `{{[${m.toUpperCase()}](!proximitynpc -e ${toSafeName(npc.name)} mode ${m})}}`
        ).join(" ");
        sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Set Mode for ${npc.name}}} {{Current: ${npc.mode || 'on'}}} ${modeList}`);
        return;
    }


    let value = args.slice(4).join(" ").trim();

    switch (property) {
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
            let clear = value.toLowerCase().trim() == 'clear';
            npc.img = clear ? null : value;
            sendChat("NPC Monitor", `/w ${who} ${clear ? 'Removed' : 'Updated'} ${npc.name} image url${clear ? '' : ` to "${value}"`}`);
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
        case 'mode':
            let mode = value.toLowerCase();
            if (mode != 'on' && mode != 'off' && mode != 'once') {
                sendChat("NPC Monitor", `/w ${who} Mode ${value} not supported, defaulting to 'on'.`);
                npc.mode = 'on';
            } else {
                npc.mode = mode;
                sendChat("NPC Monitor", `/w ${who} ${npc.name} mode set to ${npc.mode}.`);
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
        return `{{[${npc.name}](!proximitynpc -M ${safeName})=(Mode: ${npc.mode}, Dist: ${npc.triggerDistance}, Timeout: ${npc.timeout}ms, Messages: ${npc.messages.length}, Style: ${npc.cardStyle})}}`;
    }).join(" ");
    sendChat("NPC Monitor", `/w ${who} &{template:default} {{name=Monitored NPCs}} ${list}`);
}

/**
 * Handles manual NPC triggering.
 * If a token is selected, triggers that NPC using the selected token as the triggering character.
 * If no token is selected and no name is provided, lists all monitored NPCs for selection.
 * @param {Object} msg - The chat message object.
 */
function handleTriggerNPC(msg) {
    const who = msg.who || "gm";
    const args = msg.content.trim().split(/\s+/);

    // Get the selected token if any (for character attribute lookups)
    let selectedToken = null;
    if (msg.selected && msg.selected.length > 0) {
        selectedToken = getObj('graphic', msg.selected[0]._id);
    }

    const token = getTokenFromCall(msg);

    // If a token is selected → trigger its monitored NPC
    if (token) {
        const tokenName = getTokenEffectiveName(token);
        const safeName = toSafeName(tokenName);
        const monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
        if (!monitoredNPC) {
            sendChat("NPC Monitor", `/w ${who} Token "${tokenName}" is not a monitored NPC.`);
            return;
        }
        // Use selectedToken if available, otherwise use default
        let playerName = selectedToken ? getPlayerNameFromToken(selectedToken) : "Guild Member";
        triggerNPCMessage(monitoredNPC, playerName, selectedToken);
        return;
    }

    // No token selected → try by name argument
    if (args.length > 2) {
        const safeName = args.slice(2).join("_");
        const npcName = fromSafeName(safeName);
        const monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
        if (monitoredNPC) {
            let playerName = selectedToken ? getPlayerNameFromToken(selectedToken) : "Guild Member";
            triggerNPCMessage(monitoredNPC, playerName, selectedToken);
            return;
        }
    }

    // No token and no matching name → list all monitored NPCs to choose from
    const npcEntries = Object.entries(state.ProximityNPC.monitoredNPCs);
    if (npcEntries.length === 0) {
        sendChat("NPC Monitor", `/w ${who} No monitored NPCs are currently active.`);
        return;
    }

    const npcButtons = npcEntries.map(([safeName, npc]) => {
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
        let tokenName = getTokenEffectiveName(token);
        let safeName = toSafeName(tokenName);

        // Update or create monitored entry
        if (!state.ProximityNPC.monitoredNPCs[safeName]) {
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
    let menu = tokens.map(t => {
        let name = getTokenEffectiveName(t);
        if (!name) return ''; // Skip tokens with no name
        return `{{[${name}](!proximitynpc -M ${toSafeName(name)})}}`;
    }).filter(item => item !== '').join(" ");
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
    return Math.sqrt(dx * dx + dy * dy);
}

/** 
 * Checks all monitored NPCs whenever a token moves. Triggers messages if in range.
 * @param {Graphic} movedToken - The token that moved.
 */
function checkAllProximities(movedToken) {
    let movedId = movedToken.id;
    let pageId = movedToken.get('pageid');
    let movedCenterX = movedToken.get('left') + movedToken.get('width') / 2;
    let movedCenterY = movedToken.get('top') + movedToken.get('height') / 2;
    let playerName = getPlayerNameFromToken(movedToken);

    // Check each monitored NPC
    Object.entries(state.ProximityNPC.monitoredNPCs).forEach(([npcName, npc]) => {
        // Skip if this NPC doesn't have any tokens
        if (!npc.tokenIds || npc.tokenIds.length === 0) return;

        // Check each token representing this NPC
        npc.tokenIds.forEach(tokenId => {
            // Skip if the moved token is one of this NPC's tokens
            if (tokenId === movedId) return;

            let npcToken = getObj('graphic', tokenId);
            if (!npcToken) return;

            // Skip if not on same page
            if (npcToken.get('pageid') !== pageId) return;

            // Calculate NPC token position
            let npcCenterX = npcToken.get('left') + npcToken.get('width') / 2;
            let npcCenterY = npcToken.get('top') + npcToken.get('height') / 2;

            let distance = calculateDistance(npcCenterX, npcCenterY, movedCenterX, movedCenterY);
            let threshold = npc.triggerDistance * npcToken.get('width') + (npcToken.get('width') / 2);

            // Use token ID in the trigger key to track each token separately
            let key = movedId + '_' + tokenId;

            if (distance <= threshold && !triggeredTokens[key]) {
                triggerNPCMessage(npc, playerName, movedToken);
                triggeredTokens[key] = true;
                setTimeout(() => {
                    if (npc.timeout !== 0) delete triggeredTokens[key];
                }, npc.timeout > 0 ? npc.timeout : 1);
            }
        });
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
 * Retrieves the character object from a token.
 * @param {Graphic} token - The token to get the character from.
 * @returns {Character|null} The character object or null if not found.
 */
function getCharacterFromToken(token) {
    let charId = token.get('represents');
    if (charId) {
        return getObj('character', charId);
    }
    return null;
}

/**
 * Parses and executes a dice roll expression (e.g., "1d6", "2d20+3", "1d8+2d6").
 * @param {string} rollExpression - The dice roll expression to parse.
 * @returns {Object} Object with {result: number, expression: string, success: boolean}
 */
function parseDiceRoll(rollExpression) {
    try {
        // Clean up the expression
        let expr = rollExpression.trim().replace(/\s+/g, '');
        let originalExpr = expr;

        // Pattern to match dice notation: XdY where X and Y are numbers
        let dicePattern = /(\d+)d(\d+)/gi;
        let workingExpr = expr;
        let detailParts = [];

        // Track positions of dice rolls to build detailed breakdown
        let lastIndex = 0;
        let matches = [];

        // Collect all matches first
        let match;
        while ((match = dicePattern.exec(expr)) !== null) {
            matches.push({
                fullMatch: match[0],
                numDice: parseInt(match[1]),
                numSides: parseInt(match[2]),
                index: match.index
            });
        }

        // Process each dice roll
        let offset = 0;
        matches.forEach(m => {
            // Validate dice parameters
            if (m.numDice <= 0 || m.numDice > 100 || m.numSides <= 0 || m.numSides > 1000) {
                throw new Error('Invalid dice parameters');
            }

            // Roll the dice
            let rollTotal = 0;
            let rolls = [];
            for (let i = 0; i < m.numDice; i++) {
                let roll = Math.floor(Math.random() * m.numSides) + 1;
                rolls.push(roll);
                rollTotal += roll;
            }

            // Add any text before this dice roll to detail
            let beforeText = originalExpr.substring(lastIndex, m.index);
            if (beforeText) {
                detailParts.push(beforeText);
            }

            // Add the dice roll detail
            detailParts.push(`${m.numDice}d${m.numSides}=[${rolls.join(',')}]`);
            lastIndex = m.index + m.fullMatch.length;

            // Replace in working expression
            let replaceIndex = m.index + offset;
            workingExpr = workingExpr.substring(0, replaceIndex) +
                rollTotal.toString() +
                workingExpr.substring(replaceIndex + m.fullMatch.length);
            offset += rollTotal.toString().length - m.fullMatch.length;
        });

        // Add any remaining text after the last dice roll
        if (lastIndex < originalExpr.length) {
            detailParts.push(originalExpr.substring(lastIndex));
        }

        // Evaluate the final mathematical expression
        // Only allow numbers, +, -, *, /, (, ) for safety
        if (!/^[\d+\-*/().\s]+$/.test(workingExpr)) {
            return { result: 0, expression: rollExpression, success: false };
        }

        let result = eval(workingExpr);

        return {
            result: Math.round(result),
            expression: rollExpression,
            details: detailParts.join(''),
            success: true
        };
    } catch (error) {
        log(`Error parsing dice roll "${rollExpression}": ${error}`);
        return { result: 0, expression: rollExpression, success: false };
    }
}

/**
 * Searches within a JSON object for a value by key name (case-insensitive, recursive).
 * @param {Object} obj - The object to search
 * @param {string} keyName - The key name to find
 * @param {number} depth - Current recursion depth
 * @returns {*} The value if found, null otherwise
 */
function searchJsonForKey(obj, keyName, depth = 0) {
    if (!obj || typeof obj !== 'object') return null;

    let lowerKeyName = keyName.toLowerCase();

    // Check current level keys
    for (let key in obj) {
        if (key.toLowerCase() === lowerKeyName) {
            return obj[key];
        }
    }

    // Recursively search nested objects (limit depth to avoid infinite loops)
    if (depth < 10) {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                let result = searchJsonForKey(obj[key], keyName, depth + 1);
                if (result !== null && result !== undefined) return result;
            }
        }
    }

    return null;
}

/**
 * Gets a character attribute value by name.
 * @param {Character} character - The character object.
 * @param {string} attrName - The attribute name to look up.
 * @returns {string} The attribute value or a fallback message.
 */
function getCharacterAttribute(character, attrName) {
    if (!character) {
        return `[No Character]`;
    }

    try {
        // Get all attributes for this character
        let attrs = findObjs({
            _type: 'attribute',
            _characterid: character.id
        });

        // Try exact match first
        let attr = attrs.find(a => a.get('name') === attrName);

        // If not found, try case-insensitive match
        if (!attr) {
            attr = attrs.find(a => a.get('name').toLowerCase() === attrName.toLowerCase());
        }

        if (attr) {
            let current = attr.get('current');
            return current !== undefined && current !== null ? current.toString() : '[Empty]';
        }

        // If not found as direct attribute, search in JSON attributes
        // Build list of possible attribute name variations
        let namesToTry = [attrName];
        let lowerAttr = attrName.toLowerCase();

        // Add common variations for HP
        if (lowerAttr === 'hp') {
            namesToTry.push('currentHP', 'current_hp', 'hitpoints', 'hit_points', 'HP', 'health');
        }

        // Add common variations for max HP
        if (lowerAttr === 'maxhp' || lowerAttr === 'max_hp') {
            namesToTry.push('maximumWithoutTemp', 'hp_max', 'maximum_hp', 'maxhp', 'max_hp');
        }

        // Add common variations for gold
        if (lowerAttr === 'gold' || lowerAttr === 'gp') {
            namesToTry.push('gold', 'gp', 'goldPieces', 'gold_pieces');
        }

        // Add common variations for level
        if (lowerAttr === 'level' || lowerAttr === 'lvl') {
            namesToTry.push('level', 'characterLevel', 'character_level', 'lvl');
        }

        // Add common variations for AC
        if (lowerAttr === 'ac') {
            namesToTry.push('ac', 'armorClass', 'armor_class', 'armour_class', 'AC');
        }

        // Add common variations for inspiration
        if (lowerAttr === 'inspiration' || lowerAttr === 'inspired') {
            namesToTry.push('inspiration', 'isInspired', 'is_inspired', 'inspired');
        }

        // Add common variations for ability scores
        const abilityAliases = {
            'str': ['str', 'strength', 'STR', 'Strength'],
            'dex': ['dex', 'dexterity', 'DEX', 'Dexterity'],
            'con': ['con', 'constitution', 'CON', 'Constitution'],
            'int': ['int', 'intelligence', 'INT', 'Intelligence'],
            'wis': ['wis', 'wisdom', 'WIS', 'Wisdom'],
            'cha': ['cha', 'charisma', 'CHA', 'Charisma']
        };

        for (let [shortName, variations] of Object.entries(abilityAliases)) {
            if (lowerAttr === shortName || lowerAttr === variations[1].toLowerCase()) {
                namesToTry.push(...variations);
                break;
            }
        }

        // Add modifiers
        const modAliases = {
            'strength_mod': ['strength_mod', 'str_mod', 'strengthMod', 'strMod'],
            'dexterity_mod': ['dexterity_mod', 'dex_mod', 'dexterityMod', 'dexMod'],
            'constitution_mod': ['constitution_mod', 'con_mod', 'constitutionMod', 'conMod'],
            'intelligence_mod': ['intelligence_mod', 'int_mod', 'intelligenceMod', 'intMod'],
            'wisdom_mod': ['wisdom_mod', 'wis_mod', 'wisdomMod', 'wisMod'],
            'charisma_mod': ['charisma_mod', 'cha_mod', 'charismaMod', 'chaMod']
        };

        for (let [modName, variations] of Object.entries(modAliases)) {
            if (lowerAttr === modName || lowerAttr === variations[1]) {
                namesToTry.push(...variations);
                break;
            }
        }

        // Search common JSON container attributes
        let jsonContainers = ['store', 'builder', 'data', 'character', 'stats'];
        for (let containerName of jsonContainers) {
            let containerAttr = attrs.find(a => a.get('name') === containerName);
            if (containerAttr) {
                let value = containerAttr.get('current');
                try {
                    let parsed = typeof value === 'string' ? JSON.parse(value) : value;

                    // Try all name variations
                    for (let nameVariant of namesToTry) {
                        let found = searchJsonForKey(parsed, nameVariant);
                        if (found !== null && found !== undefined) {
                            return found.toString();
                        }
                    }
                } catch (e) {
                    // Not JSON or parse error, continue to next container
                }
            }
        }

        // If still not found, return a fallback
        return `[${attrName}?]`;
    } catch (error) {
        log(`ProximityNPC ERROR getting attribute "${attrName}": ${error}`);
        return `[Error]`;
    }
}

/**
 * Extracts buttons from text and creates clickable chat buttons.
 * Buttons send messages to chat when clicked.
 * @param {string} text - The text containing button syntax.
 * @returns {Object} {text: string (without buttons), buttonCommands: array of button info}
 */
function extractButtons(text) {
    // Pattern to match [Button Text](message)
    let buttonPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let buttonCommands = [];

    // Extract all buttons
    let match;
    while ((match = buttonPattern.exec(text)) !== null) {
        let buttonText = match[1].trim();
        let message = match[2].trim();

        // Store the button info
        buttonCommands.push({
            text: buttonText,
            message: message
        });
    }

    // Remove button syntax from text
    let cleanText = text.replace(buttonPattern, '');

    return { text: cleanText, buttonCommands: buttonCommands };
}

/**
 * Processes all dynamic replacements in a message (rolls, attributes, buttons).
 * @param {string} messageContent - The raw message content with placeholders.
 * @param {string} displayName - The player name for display (first name only).
 * @param {Graphic} triggeringToken - The token that triggered the message (optional).
 * @param {MonitoredNPC} npc - The NPC that is speaking (for {monitoredName}).
 * @param {Object} cardStyle - The card style for styling.
 * @param {Object} defaultStyle - The default card style.
 * @returns {Object} {text: processed message, buttons: array of button markdown}
 */
function processMessageDynamics(messageContent, displayName, triggeringToken, npc, cardStyle, defaultStyle) {
    let processed = messageContent;

    // Get the character from the triggering token (if available)
    let character = triggeringToken ? getCharacterFromToken(triggeringToken) : null;

    // Get the full character name directly from the character object (not from split name)
    let fullCharacterName = character ? character.get('name') : null;

    // Get NPC's character if the NPC has tokens with character sheets
    let npcCharacter = null;
    if (npc && npc.tokenIds && npc.tokenIds.length > 0) {
        let npcToken = getObj('graphic', npc.tokenIds[0]);
        if (npcToken) {
            npcCharacter = getCharacterFromToken(npcToken);
        }
    }
    let npcName = npc ? npc.name : 'NPC';

    // 1. Replace {playerName} with display name (first name only)
    processed = processed.replace(/{playerName}/g, displayName);

    // 2. Replace {monitoredName} with the NPC's name
    processed = processed.replace(/{monitoredName}/g, npcName);

    // 3. Parse and replace character attributes {playerName.attributeName}, {monitoredName.attributeName}
    // Pattern: {playerName.something} or {characterName.something} or {monitoredName.something}
    let attrPattern = /{([\w\s]+)\.([\w\-_]+)}/g;
    processed = processed.replace(attrPattern, (match, charRef, attrName) => {
        // If it references playerName or the actual character name, use the triggering token's character
        if (charRef.toLowerCase() === 'playername' ||
            (fullCharacterName && charRef.toLowerCase() === fullCharacterName.toLowerCase())) {
            return getCharacterAttribute(character, attrName);
        }

        // If it references monitoredName or the NPC's name, use the NPC's character
        if (charRef.toLowerCase() === 'monitoredname' ||
            (npcName && charRef.toLowerCase() === npcName.toLowerCase())) {
            return getCharacterAttribute(npcCharacter, attrName);
        }

        // Try to find a character by the referenced name
        let refChar = findObjs({ _type: 'character', name: charRef })[0];
        if (refChar) {
            return getCharacterAttribute(refChar, attrName);
        }

        return `[${charRef}.${attrName}?]`;
    });

    // 4. Parse and execute dice rolls {1d6}, {2d20+3}, etc.
    let rollPattern = /{([0-9d+\-*/()\s]+)}/g;
    processed = processed.replace(rollPattern, (match, rollExpr) => {
        // Check if this looks like a dice roll (contains 'd')
        if (!rollExpr.toLowerCase().includes('d')) {
            return match; // Not a dice roll, leave as is
        }

        let rollResult = parseDiceRoll(rollExpr);

        if (rollResult.success) {
            // Style the roll result with inverted colors
            let bgColor = cardStyle.textColor || defaultStyle.textColor;
            let textColor = cardStyle.bubbleColor || defaultStyle.bubbleColor;
            let borderColor = cardStyle.borderColor || defaultStyle.borderColor;

            return `<span style="background: ${bgColor}; color: ${textColor}; border: 1px solid ${borderColor}; border-radius: 4px; padding: 2px 6px; font-weight: bold; font-family: monospace;" title="${rollResult.details}">${rollResult.result}</span>`;
        } else {
            return `<span style="color: red; font-weight: bold;">[Invalid Roll: ${rollExpr}]</span>`;
        }
    });

    // 5. Extract buttons (will be sent as separate messages)
    let buttonInfo = extractButtons(processed);

    return { text: buttonInfo.text, buttons: buttonInfo.buttonCommands };
}

/**
 * Chooses a random message from an array, weighted by `messageObject.weight`.
 * Messages with weight 0 are completely excluded from selection.
 * @param {MessageObject[]} messages - Array of message objects.
 * @returns {MessageObject} The selected message.
 */
function getRandomMessage(messages) {
    if (!messages || messages.length === 0) {
        return new MessageObject("They are lost in thought...", 1);
    }

    // Filter out messages with weight 0 or negative weight
    const validMessages = messages.filter(m => {
        let weight = (m.weight !== undefined && m.weight !== null) ? m.weight : 1;
        return weight > 0;
    });

    if (validMessages.length === 0) {
        return new MessageObject("They are lost in thought...", 1);
    }

    let pool = [];
    validMessages.forEach(m => {
        let w = (m.weight !== undefined && m.weight !== null) ? m.weight : 1;
        for (let i = 0; i < w; i++) pool.push(m);
    });

    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Triggers and displays an NPC message when proximity condition is met.
 * Supports dynamic content:
 * - {playerName} - Triggering character's first name
 * - {monitoredName} - NPC's name
 * - {playerName.hp} - Character attributes
 * - {monitoredName.hp} - NPC's attributes
 * - {1d6} - Dice rolls
 * - [Text](message) - Clickable buttons (can include [[rolls]], whispers, API commands)
 * @param {MonitoredNPC} npc - The NPC that was triggered
 * @param {string} playerName - The name of the player who triggered the NPC
 * @param {Graphic} triggeringToken - The token that triggered the NPC (optional, for attribute lookups)
 */
function triggerNPCMessage(npc, playerName = "Guild Member", triggeringToken = null) {
    if (!npc || npc.mode == "off") return;
    if (npc.mode == "once") {
        npc.mode = "off";
    }

    let selectedMessage = getRandomMessage(npc.messages);

    // Get default card style
    let defaultCardStyle = state.ProximityNPC.cardStyles.find(style => style.name === 'Default');

    // Determine which card style to use (message > NPC > default)
    let cardStyle = defaultCardStyle;

    if (npc.cardStyle) {
        cardStyle = state.ProximityNPC.cardStyles.find(style => style.name === npc.cardStyle) || defaultCardStyle;
    }

    if (selectedMessage.cardStyle) {
        cardStyle = state.ProximityNPC.cardStyles.find(style => style.name === selectedMessage.cardStyle) || cardStyle;
    }

    // Get display name (first name only) - full name comes from character object in processing
    let displayName = playerName == "Guild Member" ? playerName : playerName.split(" ")[0];

    // Process all dynamic content (rolls, attributes, buttons, playerName, monitoredName)
    let messageInfo = processMessageDynamics(
        selectedMessage.content,
        displayName,
        triggeringToken,
        npc,
        cardStyle,
        defaultCardStyle
    );

    // Build styled card - only show image if it exists
    let card = `<div style="background: ${cardStyle.backgroundColor || defaultCardStyle.backgroundColor}; border: 3px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 10px; padding: 15px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">` +
        (npc.img && npc.img.trim() !== '' ? `<div style="text-align: center; margin-bottom: 10px;">` +
            `<img src="` + npc.img + `" style="max-width: 200px; border: 4px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">` +
            `</div>` : ``) +
        `<div style="background: ${cardStyle.bubbleColor || defaultCardStyle.bubbleColor}; border: 2px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 8px; padding: 12px; position: relative;">` +
        `<div style="position: absolute; top: -10px; left: 20px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid ${cardStyle.borderColor || defaultCardStyle.borderColor};"></div>` +
        `<div style="position: absolute; top: -7px; left: 21px; width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 9px solid ${cardStyle.bubbleColor};"></div>` +
        `<p style="margin: 0; color: ${cardStyle.textColor || defaultCardStyle.textColor}; font-size: 14px; line-height: 1.6; align-items: center;">${cardStyle.badge ? `<img src="` + cardStyle.badge + `" style="height: 20px; width: 20px; border: 3px solid ${cardStyle.borderColor || defaultCardStyle.borderColor}; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"> ` : ''}<strong>` + npc.name + `:</strong></p>` +
        `<p style="margin: 8px 0 0 0; color: ${cardStyle.textColor || defaultCardStyle.textColor}; font-size: 14px; line-height: 1.6; font-style: italic;">` + messageInfo.text + `</p>` +
        `</div>` +
        `</div>`;

    // Determine whisper mode
    let whisperPrefix = (cardStyle.whisper == 'off') ? '' : (cardStyle.whisper == 'character') ? `/w ${playerName} ` : '/w gm ';

    // Send the card
    sendChat(npc.name, whisperPrefix + card);

    // If there are buttons, send all as one Roll20 template card with multiple buttons
    if (messageInfo.buttons && messageInfo.buttons.length > 0) {
        // Build button fields for the template
        let buttonFields = messageInfo.buttons.map((button, index) => {
            // Create a unique button ID for this interaction
            let buttonId = `${npc.name.replace(/\s+/g, '_')}_${Date.now()}_${index}`;

            // Store button data in state for callback
            if (!state.ProximityNPC.buttonCallbacks) {
                state.ProximityNPC.buttonCallbacks = {};
            }
            state.ProximityNPC.buttonCallbacks[buttonId] = {
                message: button.message,
                whisper: whisperPrefix,
                sender: npc.name
            };

            // Return button field for template
            return `{{[${button.text}](!proximitynpc-button ${buttonId})}}`;
        }).join(' ');

        // Send all buttons as one Roll20 template card
        let buttonTemplate = `&{template:default} {{name=${displayName}'s opportunities}} ${buttonFields}`;
        sendChat(npc.name, whisperPrefix + buttonTemplate);
    }
}

/**
 * Automatically monitors all NPC tokens from presetNPCs that exist on the current page.
 * Scans all tokens and adds matching preset NPCs to monitoring.
 */
function autoMonitorNPCs() {
    // Get all tokens on the current Roll20 page
    let allTokens = findObjs({ type: 'graphic', subtype: 'token' });

    allTokens.forEach(token => {
        let tokenName = getTokenEffectiveName(token);
        if (!tokenName) return; // Skip tokens with no name
        let safeName = toSafeName(tokenName);

        let presetNPC = state.ProximityNPC.presetNPCs.find(npc => npc.name === tokenName);
        if (presetNPC) {
            // Check if this NPC is already monitored
            if (state.ProximityNPC.monitoredNPCs[safeName]) {
                // Add this token to the existing monitored NPC if not already there
                let monitoredNPC = state.ProximityNPC.monitoredNPCs[safeName];
                if (!monitoredNPC.tokenIds.includes(token.id)) {
                    monitoredNPC.tokenIds.push(token.id);
                }
            } else {
                // Create new monitored NPC with this token
                state.ProximityNPC.monitoredNPCs[safeName] = new MonitoredNPC(
                    tokenName,
                    presetNPC.distance,
                    [token.id],
                    presetNPC.timeout,
                    getBestTokenImage(token),
                    presetNPC.messages,
                    presetNPC.cardStyle || 'Default',
                    'on'
                );
            }
        }
    });
}

// Initialize the script when ready
on('ready', function () {
    setupNPCProximity();
    autoMonitorNPCs(); // <-- automatically monitor all NPCs in presetNPCs
    log('✅ NPC Proximity Trigger Script loaded and auto-monitoring NPCs!');
});
