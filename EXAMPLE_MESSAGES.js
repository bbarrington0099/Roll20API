/**
 * EXAMPLE_MESSAGES.js
 * 
 * Ready-to-use example messages demonstrating ProximityNPC dynamic content features.
 * Copy and adapt these examples for your own NPCs.
 * 
 * Features demonstrated:
 * - {playerName} - Triggering player's first name
 * - {monitoredName} - NPC's name (the one speaking)
 * - {playerName.attribute} - Character attribute lookups
 * - {monitoredName.attribute} - NPC's attribute lookups
 * - {1d6}, {2d20+3} - Dice rolls with styled display
 * - [Button](message) - Clickable buttons (can include [[rolls]], whispers, API commands!)
 * 
 * BUTTON CAPABILITIES:
 * - Plain messages: [Text](Message)
 * - Whispers: [Text](w PlayerName Message)
 * - GM whispers: [Text](/w gm Secret)
 * - Inline rolls: [Text](Message with [[1d6]] roll)
 * - Roll commands: [Text](/r 1d20+5)
 * - API commands: [Text](!proximitynpc -menu)
 * - Multiple buttons on one card automatically!
 */

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

// Simple greeting with player name
new MessageObject(
    'Welcome, {playerName}! Good to see you again.',
    3
);

// Greeting with NPC name
new MessageObject(
    'I am {monitoredName}, and you must be {playerName}. Welcome!',
    3
);

// Greeting with dice roll
new MessageObject(
    'Hello, {playerName}! Today\'s lucky number is {1d10}!',
    2
);

// ============================================================================
// {monitoredName} EXAMPLES - NPC Referring to Themselves
// ============================================================================

// NPC introducing themselves
new MessageObject(
    'Greetings, {playerName}. I am {monitoredName}, at your service.',
    3
);

// NPC comparing stats with player
new MessageObject(
    'Your HP is {playerName.hp}, {playerName}. I, {monitoredName}, have {monitoredName.hp} HP. ' +
    'Together we are strong! ' +
    '[Team Up](/w gm {playerName} and {monitoredName} form a party!)',
    2
);

// NPC offering services
new MessageObject(
    'I, {monitoredName}, offer my services to you, {playerName}. ' +
    '[Hire {monitoredName}](/w gm {playerName} hired {monitoredName} as a companion) ' +
    '[Decline](/w gm {playerName} declined {monitoredName}\'s offer)',
    2
);

// ============================================================================
// HEALTH & HEALING EXAMPLES
// ============================================================================

// Health check
new MessageObject(
    'You look hurt, {playerName}. You have {playerName.hp} hit points remaining.',
    2
);

// Healing offer with roll and button (INLINE ROLL in button!)
new MessageObject(
    '"Need healing, {playerName}? Your HP is {playerName.hp}. ' +
    'This potion will restore {1d8+2} HP." ' +
    '[Drink Potion]({playerName} drinks the potion and recovers [[1d8+2]] HP!)',
    2
);

// Healing with multiple options (showing [[roll]] syntax in buttons)
new MessageObject(
    'I can help, {playerName}. Your HP: {playerName.hp}. Choose your healing: ' +
    '[Small Potion]({playerName} drinks and recovers [[1d4+1]] HP) ' +
    '[Medium Potion]({playerName} drinks and recovers [[2d4+2]] HP) ' +
    '[Greater Potion]({playerName} drinks and recovers [[4d4+4]] HP)',
    2
);

// Critical health warning
new MessageObject(
    '"By the gods, {playerName}! You only have {playerName.hp} HP! Let me help!" ' +
    '[Accept Help](/w gm {playerName} accepted emergency healing) ' +
    '[Refuse](/w gm {playerName} refused help)',
    1
);

// ============================================================================
// SHOP KEEPER EXAMPLES
// ============================================================================

// Basic shop greeting
new MessageObject(
    '"Welcome to my shop, {playerName}! You have {playerName.gold} gold pieces."',
    3
);

// Shop with items and prices
new MessageObject(
    '"Fine weapons for sale! You have {playerName.gold} gold. ' +
    'Sword (50g) or Shield (30g)?" ' +
    '[Buy Sword](/w gm {playerName} purchased a sword for 50 gold) ' +
    '[Buy Shield](/w gm {playerName} purchased a shield for 30 gold) ' +
    '[Leave](/w gm {playerName} left without buying)',
    2
);

// Haggling mechanic
new MessageObject(
    '"That item costs 100 gold, {playerName}. You have {playerName.gold}g. ' +
    'Want to haggle? Roll: {1d20+3}" ' +
    '[Pay Full Price](/w gm {playerName} paid 100 gold) ' +
    '[Walk Away](/w gm {playerName} walked away)',
    1
);

// ============================================================================
// COMBAT EXAMPLES
// ============================================================================

// Surprise attack with damage
new MessageObject(
    '"Watch out, {playerName}!" The trap springs! Take {2d6+3} damage! ' +
    '[Dodge](!r 1d20+@{selected|dexterity_mod}#Dexterity Save) ' +
    '[Block](!r 1d20+@{selected|strength_mod}#Strength Save)',
    1
);

// Enemy appears
new MessageObject(
    'An enemy appears! Roll for initiative: {1d20} ' +
    '[Attack](!r 1d20+@{selected|strength_mod}#Attack Roll) ' +
    '[Flee](/w gm {playerName} attempts to flee)',
    1
);

// Arena challenge
new MessageObject(
    '"Face the arena challenge, {playerName}! Your AC is {playerName.ac}. ' +
    'The beast attacks with {1d20+5}!" ' +
    '[Fight](!r 1d20+@{selected|strength_mod}#Attack) ' +
    '[Surrender](/w gm {playerName} surrendered)',
    1
);

// ============================================================================
// SOCIAL INTERACTION EXAMPLES
// ============================================================================

// Persuasion check
new MessageObject(
    '"Convince me, {playerName}. Your charisma is {playerName.charisma}." ' +
    '[Persuade](!r 1d20+@{selected|charisma_mod}#Persuasion Check) ' +
    '[Intimidate](!r 1d20+@{selected|strength_mod}#Intimidation Check) ' +
    '[Leave](/w gm {playerName} walked away)',
    2
);

// Information gathering
new MessageObject(
    '"I might have information, {playerName}... for a price. You have {playerName.gold} gold." ' +
    '[Pay 20 Gold](/w gm {playerName} paid for information) ' +
    '[Decline](/w gm {playerName} declined to pay)',
    1
);

// Multiple dialogue options
new MessageObject(
    '"What brings you here, {playerName}?" ' +
    '[Ask about Quest](w {playerName} "Tell me about the quest") ' +
    '[Ask about Town](w {playerName} "What\'s happening in town?") ' +
    '[Leave](/w gm {playerName} ended the conversation)',
    3
);

// ============================================================================
// SKILL CHECK EXAMPLES
// ============================================================================

// Perception check
new MessageObject(
    '"Search carefully, {playerName}. Your perception is {playerName.perception}." ' +
    '[Search Area](!r 1d20+@{selected|perception}#Perception Check)',
    2
);

// Investigation with clues
new MessageObject(
    '"Examine the scene, {playerName}. Roll investigation: {1d20+2}" ' +
    '[Investigate Further](!r 1d20+@{selected|investigation}#Investigation) ' +
    '[Move On](/w gm {playerName} moved on)',
    1
);

// Stealth challenge
new MessageObject(
    '"Guards ahead, {playerName}! Sneak past them?" ' +
    '[Stealth Check](!r 1d20+@{selected|dexterity_mod}#Stealth) ' +
    '[Fight Guards](/w gm {playerName} attacks the guards) ' +
    '[Go Around](/w gm {playerName} takes another route)',
    1
);

// ============================================================================
// QUEST EXAMPLES
// ============================================================================

// Quest offer with requirements
new MessageObject(
    '"I have a quest, {playerName}. Your level is {playerName.level}. ' +
    'This is dangerous work..." ' +
    '[Accept Quest](/w gm {playerName} accepted the quest) ' +
    '[Decline](/w gm {playerName} declined the quest)',
    2
);

// Quest completion
new MessageObject(
    '"Excellent work, {playerName}! Here\'s your reward: {3d6*10} gold!" ' +
    '[Thank you](/w gm {playerName} completed the quest)',
    1
);

// Multi-part quest
new MessageObject(
    '"Your quest progress: Stage {1d3} of 3. Continue, {playerName}?" ' +
    '[Continue](/w gm {playerName} continues the quest) ' +
    '[Rest First](/w gm {playerName} decides to rest)',
    2
);

// ============================================================================
// GAMBLING & MINIGAMES
// ============================================================================

// Dice game
new MessageObject(
    '"Roll the dice, {playerName}! You: {1d20}, Me: {1d20}. Highest wins 10 gold!" ' +
    '[Play Again](/w gm {playerName} plays another round) ' +
    '[Cash Out](/w gm {playerName} leaves the table)',
    2
);

// Card draw simulation
new MessageObject(
    '"Draw a card, {playerName}! You drew: {1d13}. Beat my {1d13}!" ' +
    '[Draw Again](proximitynpc -t Dealer) ' +
    '[Fold](/w gm {playerName} folded)',
    1
);

// Betting game with gold
new MessageObject(
    '"Bet on red or black, {playerName}! You have {playerName.gold} gold. Roll: {1d2} (1=red, 2=black)" ' +
    '[Bet Red](/w gm {playerName} bet on red) ' +
    '[Bet Black](/w gm {playerName} bet on black)',
    2
);

// ============================================================================
// RANDOM EVENTS
// ============================================================================

// Weather effects
new MessageObject(
    'A storm rolls in! Take {1d4} cold damage, {playerName}. ' +
    '[Seek Shelter](/w gm {playerName} seeks shelter) ' +
    '[Press On](/w gm {playerName} continues through the storm)',
    1
);

// Random loot
new MessageObject(
    'You found treasure, {playerName}! Roll for loot value: {2d6*10} gold! ' +
    '[Take It](/w gm {playerName} takes the treasure)',
    1
);

// Random encounter difficulty
new MessageObject(
    'An enemy appears! Difficulty: {1d10}. Your level: {playerName.level}. ' +
    '[Fight](!r 1d20+@{selected|strength_mod}#Attack) ' +
    '[Run](/w gm {playerName} flees)',
    1
);

// ============================================================================
// REST & RECOVERY
// ============================================================================

// Short rest option
new MessageObject(
    '"Rest here, {playerName}? You\'ll recover {1d8+2} HP. Current: {playerName.hp}" ' +
    '[Short Rest](/w gm {playerName} takes a short rest) ' +
    '[Continue](/w gm {playerName} continues without resting)',
    2
);

// Inn keeper
new MessageObject(
    '"A room costs 5 gold, {playerName}. You have {playerName.gold} gold. ' +
    'You\'ll recover all HP." ' +
    '[Rent Room](/w gm {playerName} rents a room for the night) ' +
    '[Sleep Outside](/w gm {playerName} sleeps rough)',
    3
);

// Food vendor
new MessageObject(
    '"Hungry, {playerName}? Food costs 2 gold. Restores {1d4+1} HP. You have {playerName.gold}g." ' +
    '[Buy Food](/w gm {playerName} buys food) ' +
    '[Not Now](/w gm {playerName} declines)',
    2
);

// ============================================================================
// INFORMATION & LORE
// ============================================================================

// Sage/Scholar
new MessageObject(
    '"Ask me anything, {playerName}. Your intelligence is {playerName.intelligence}." ' +
    '[Ask Question](w {playerName} You ask about the ancient ruins) ' +
    '[Thank Them](/w gm {playerName} thanks the sage)',
    2
);

// Librarian
new MessageObject(
    '"Research takes time, {playerName}. Roll for success: {1d20+3}" ' +
    '[Search Books](!r 1d20+@{selected|investigation}#Research) ' +
    '[Leave](/w gm {playerName} leaves the library)',
    1
);

// ============================================================================
// TAVERN SCENES
// ============================================================================

// Bar tender
new MessageObject(
    '"What\'ll it be, {playerName}? Ale is 1 gold, you have {playerName.gold}g." ' +
    '[Order Ale](/w gm {playerName} orders an ale) ' +
    '[Order Water](/w gm {playerName} orders water) ' +
    '[Leave](/w gm {playerName} leaves the bar)',
    3
);

// Drinking contest
new MessageObject(
    '"Drinking contest, {playerName}? Constitution check! Your roll: {1d20+3}, Mine: {1d20+2}" ' +
    '[Accept](/w gm {playerName} accepts the challenge) ' +
    '[Decline](/w gm {playerName} wisely declines)',
    1
);

// Rumors
new MessageObject(
    '"I heard a rumor, {playerName}... " Roll for quality: {1d10}. ' +
    '[Pay for Info](/w gm {playerName} pays for the rumor) ' +
    '[Ignore](/w gm {playerName} ignores the rumor)',
    2
);

// ============================================================================
// TRAP & HAZARD EXAMPLES
// ============================================================================

// Spike trap
new MessageObject(
    'A trap triggers! Take {3d6} piercing damage, {playerName}! ' +
    '[Try to Dodge](!r 1d20+@{selected|dexterity_mod}#Dex Save)',
    1
);

// Poison gas
new MessageObject(
    'Poison gas fills the room! Constitution save needed, {playerName}! ' +
    'Damage: {2d4+1} ' +
    '[Hold Breath](!r 1d20+@{selected|constitution_mod}#Con Save) ' +
    '[Run](/w gm {playerName} flees the room)',
    1
);

// Falling rocks
new MessageObject(
    'Rocks fall! {playerName}, take {1d10+5} damage! Your AC: {playerName.ac} ' +
    '[Dodge](!r 1d20+@{selected|dexterity_mod}#Dodge)',
    1
);

// ============================================================================
// COMPLEX COMBINATION EXAMPLES
// ============================================================================

// Full interaction scene
new MessageObject(
    '"Greetings, {playerName}! I see you have {playerName.gold} gold and {playerName.hp} HP. ' +
    'My services: Healing ({1d8+2} HP, 20g) or Blessing (roll {1d20} for effect, 30g)?" ' +
    '[Buy Healing](/w gm {playerName} purchased healing) ' +
    '[Buy Blessing](/w gm {playerName} purchased blessing) ' +
    '[Just Browsing](/w gm {playerName} is browsing)',
    2
);

// Battle preparation
new MessageObject(
    '"Prepare for battle, {playerName}! Your HP: {playerName.hp}, AC: {playerName.ac}. ' +
    'Enemy strength: {1d10+5}. Ready?" ' +
    '[Attack](!r 1d20+@{selected|strength_mod}#Attack) ' +
    '[Defend](!r 1d20+@{selected|dexterity_mod}#Dodge) ' +
    '[Flee](/w gm {playerName} attempts to flee)',
    1
);

// Mysterious merchant
new MessageObject(
    '"Special items today, {playerName}. Your level: {playerName.level}, Gold: {playerName.gold}. ' +
    'Mystery box costs 50g, contains {1d100} value!" ' +
    '[Buy Box](/w gm {playerName} bought mystery box, roll {1d100} for contents) ' +
    '[Negotiate](/w gm {playerName} tries to negotiate) ' +
    '[Leave](/w gm {playerName} leaves)',
    1
);

// ============================================================================
// BUTTON CAPABILITIES SHOWCASE
// ============================================================================

// INLINE ROLLS with [[dice]] syntax - rolls execute when button clicked!
new MessageObject(
    'Test your luck, {playerName}! ' +
    '[Roll Attack]({playerName} attacks! Hit: [[1d20+5]], Damage: [[2d6+3]]) ' +
    '[Roll Save]({playerName} saves! Result: [[1d20+2]])',
    1
);

// WHISPER to specific player
new MessageObject(
    'Choose wisely, {playerName}: ' +
    '[Secret Option](w {playerName} You chose the secret path. [[1d20]] for success!) ' +
    '[Public Option]({playerName} chose the public path openly)',
    1
);

// WHISPER to GM
new MessageObject(
    'What will you do, {playerName}? ' +
    '[Honest Answer](/w gm {playerName} told the truth) ' +
    '[Lie](/w gm {playerName} lied to {monitoredName})',
    1
);

// API COMMANDS in buttons
new MessageObject(
    'Need assistance, {playerName}? ' +
    '[View Card Styles](!proximitynpc -cl) ' +
    '[Open Menu](!proximitynpc -m) ' +
    '[List NPCs](!proximitynpc -l)',
    1
);

// ROLL COMMANDS in buttons
new MessageObject(
    'Make your checks, {playerName}: ' +
    '[Perception](/r 1d20+@{selected|perception} Perception Check) ' +
    '[Investigation](/r 1d20+@{selected|investigation} Investigation Check) ' +
    '[Insight](/r 1d20+@{selected|insight} Insight Check)',
    1
);

// COMPLEX COMBINATIONS - Placeholders + Inline Rolls + Whispers
new MessageObject(
    'Greetings, {playerName}! I am {monitoredName}. You have {playerName.hp} HP. ' +
    '[Get Blessing]({playerName} receives {monitoredName}\'s blessing: [[1d6+2]] temp HP!) ' +
    '[Make Donation](/w gm {playerName} donated [[1d10]] gold to {monitoredName}) ' +
    '[Ask for Quest](w {playerName} {monitoredName} tells you about a quest...)',
    2
);

// TRIGGER OTHER NPCs from buttons
new MessageObject(
    'I can introduce you to others, {playerName}: ' +
    '[Meet the Blacksmith](!proximitynpc -t Varon_Tavis) ' +
    '[Meet the Healer](!proximitynpc -t Caelum_Riversong) ' +
    '[Meet the Bartender](!proximitynpc -t Kinris_Morranfew)',
    1
);

// ============================================================================
// NOTES ON USAGE
// ============================================================================

/*
 * PLACEHOLDERS:
 * - {playerName} - Triggering character's FIRST NAME ONLY (e.g., "Alaric" from "Alaric Stoneheart")
 * - {monitoredName} - NPC's FULL NAME (e.g., "Tharos Raggenthraw")
 * - {playerName.hp} - Triggering character's attribute
 * - {monitoredName.hp} - NPC's attribute (if NPC has character sheet)
 * 
 * ATTRIBUTE NAMES:
 * Common attributes (system tries variations automatically):
 * - hp (tries: hp, currentHP, current_hp, hitpoints, HP, health)
 * - gold (tries: gold, gp, goldPieces)
 * - maxhp (tries: maxhp, maximumWithoutTemp, hp_max)
 * - level, ac, strength, dexterity, etc.
 * 
 * To find YOUR sheet's attributes: Select token, run !proximitynpc --attributes
 * 
 * DICE NOTATION (in message text with {curly braces}):
 * - Simple: {1d6}, {2d8}, {3d10}
 * - With modifier: {1d20+5}, {2d6-2}
 * - Multiple dice: {1d8+2d6}, {3d6+1d4+2}
 * - Complex: {(2d6+3)*2}
 * - Limits: Max 100 dice, max 1000 sides
 * 
 * BUTTON CAPABILITIES (in button message with [[double brackets]] for rolls):
 * - Plain message: [Text](Message appears in chat)
 * - Whisper to player: [Text](w PlayerName Secret message)
 * - Whisper to GM: [Text](/w gm GM-only info)
 * - Inline roll (IMPORTANT - use [[double brackets]]): [Text](Message with [[1d6]] inline roll)
 * - Roll command: [Text](/r 1d20+5 Description)
 * - API command: [Text](!proximitynpc -menu)
 * - Character references: [Text](/r 1d20+@{selected|perception})
 * - Multiple buttons: All appear on ONE card automatically!
 * 
 * BUTTON ROLL SYNTAX DIFFERENCE:
 * - In MESSAGE TEXT: Use {1d6} with single braces - shows styled result
 * - In BUTTON: Use [[1d6]] with double brackets - executes when clicked
 * 
 * Example:
 * 'Damage: {2d6}!' - Shows styled result immediately in message
 * '[Attack](You deal [[2d6]] damage!)' - Roll executes when button clicked
 * 
 * WEIGHT VALUES:
 * - 0 = Disabled (for testing)
 * - 1 = Normal (default)
 * - 2+ = More likely to appear
 * 
 * SAFE FALLBACKS:
 * - Missing attribute: [attributeName?]
 * - No character: [No Character]
 * - Empty value: [Empty]
 * - Bad roll: [Invalid Roll: expression]
 */

