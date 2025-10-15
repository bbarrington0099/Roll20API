/**
 * Roll20 API Type Definitions
 * 
 * Type definitions for the Roll20 API Sandbox environment.
 * These types allow TypeScript to understand Roll20's global functions and objects.
 */

/**
 * Roll20 Object Types
 */
type Roll20ObjectType =
    | 'graphic'
    | 'text'
    | 'path'
    | 'character'
    | 'ability'
    | 'attribute'
    | 'handout'
    | 'rollabletable'
    | 'tableitem'
    | 'macro'
    | 'player'
    | 'page'
    | 'campaign';

/**
 * Base Roll20 Object
 */
interface Roll20Object {
    id: string;
    get(property: string): any;
    set(property: string, value: any): void;
    set(properties: Record<string, any>): void;
}

/**
 * Graphic (Token) Object
 */
interface Graphic extends Roll20Object {
    get(property: 'id'): string;
    get(property: 'type'): 'graphic';
    get(property: 'subtype'): 'token' | 'card';
    get(property: 'name'): string;
    get(property: 'left'): number;
    get(property: 'top'): number;
    get(property: 'width'): number;
    get(property: 'height'): number;
    get(property: 'rotation'): number;
    get(property: 'layer'): 'gmlayer' | 'objects' | 'map' | 'walls';
    get(property: 'pageid'): string;
    get(property: 'imgsrc'): string;
    get(property: 'represents'): string;
    get(property: 'bar1_value'): string;
    get(property: 'bar2_value'): string;
    get(property: 'bar3_value'): string;
    get(property: 'aura1_radius'): string;
    get(property: 'aura2_radius'): string;
    get(property: 'tint_color'): string;
    get(property: 'statusmarkers'): string;
    get(property: 'controlledby'): string;
    get(property: string): any;
}

/**
 * Character Object
 */
interface Character extends Roll20Object {
    get(property: 'id'): string;
    get(property: 'name'): string;
    get(property: 'avatar'): string;
    get(property: 'bio'): string;
    get(property: 'gmnotes'): string;
    get(property: 'archived'): boolean;
    get(property: 'inplayerjournals'): string;
    get(property: 'controlledby'): string;
    get(property: string): any;
}

/**
 * Page Object
 */
interface Page extends Roll20Object {
    get(property: 'id'): string;
    get(property: 'name'): string;
    get(property: 'width'): number;
    get(property: 'height'): number;
    get(property: 'scale_number'): number;
    get(property: 'scale_units'): string;
    get(property: string): any;
}

/**
 * Campaign Object
 */
interface CampaignObject extends Roll20Object {
    get(property: 'playerpageid'): string;
    get(property: 'playerspecificpages'): any;
    get(property: string): any;
}

/**
 * Chat Message Object
 */
interface ChatMessage {
    type: 'general' | 'rollresult' | 'gmrollresult' | 'emote' | 'whisper' | 'desc' | 'api';
    who: string;
    playerid: string;
    content: string;
    selected?: Array<{ _id: string; _type: string }>;
    rolltemplate?: string;
    target?: string;
    target_name?: string;
}

/**
 * Find Objects Query
 */
interface FindObjectsQuery {
    _id?: string;
    _type?: Roll20ObjectType;
    _pageid?: string;
    type?: Roll20ObjectType;
    subtype?: string;
    represents?: string;
    controlledby?: string;
    layer?: string;
    name?: string;
    [key: string]: any;
}

/**
 * Event Types for 'on' function
 */
type Roll20EventType =
    | 'ready'
    | 'chat:message'
    | 'change:graphic'
    | 'change:character'
    | 'change:attribute'
    | 'change:campaign'
    | 'add:graphic'
    | 'add:character'
    | 'destroy:graphic'
    | 'destroy:character'
    | string;

/**
 * Global Roll20 API Functions
 */

/**
 * Register an event handler
 */
declare function on(event: Roll20EventType, callback: (obj?: any, prev?: any) => void): void;

/**
 * Send a message to chat
 */
declare function sendChat(
    speakingAs: string,
    input: string,
    callback?: (operations: any[]) => void,
    options?: {
        noarchive?: boolean;
        use3d?: boolean;
    }
): void;

/**
 * Find Roll20 objects matching a query
 */
declare function findObjs(attributes: FindObjectsQuery): Roll20Object[];

/**
 * Get a specific Roll20 object by type and ID
 */
declare function getObj(type: Roll20ObjectType, id: string): Roll20Object | undefined;

/**
 * Get the Campaign object
 */
declare function Campaign(): CampaignObject;

/**
 * Log a message to the API console
 */
declare function log(message: any): void;

/**
 * Create a Roll20 object
 */
declare function createObj(type: Roll20ObjectType, attributes: Record<string, any>): Roll20Object;

/**
 * Get attribute objects for a character
 */
declare function filterObjs(callback: (obj: Roll20Object) => boolean): Roll20Object[];

/**
 * Get all objects of a type
 */
declare function getAllObjs(): Roll20Object[];

/**
 * Get the currently selected objects
 */
declare function getAttrByName(character_id: string, attribute_name: string, value_type?: 'current' | 'max'): string | number;

/**
 * Random integer generation
 */
declare function randomInteger(max: number): number;

/**
 * Play a jukebox playlist
 */
declare function playJukeboxPlaylist(playlist_id: string): void;

/**
 * Stop jukebox playlists
 */
declare function stopJukeboxPlaylist(): void;

/**
 * PlayerIsGM check
 */
declare function playerIsGM(playerid: string): boolean;

/**
 * State object - persists between game sessions
 */
declare const state: {
    ProximityTrigger?: ProximityTriggerState;
    [key: string]: any;
};

/**
 * ProximityTrigger State Interface
 */
interface ProximityTriggerState {
    defaultImagePath: string;
    defaultDistance: number;
    defaultTimeout: number;
    monitoredNPCs: Record<string, MonitoredNPCData>;
    cardStyles: CardStyleData[];
}

/**
 * Monitored NPC Data (for state persistence)
 */
interface MonitoredNPCData {
    name: string;
    triggerDistance: number;
    tokenIds: string[];
    timeout: number;
    img: string;
    messages: MessageObjectData[];
    cardStyle: string;
    mode: 'on' | 'off' | 'once';
}

/**
 * Message Object Data (for state persistence)
 */
interface MessageObjectData {
    content: string;
    weight: number;
    cardStyle: string | null;
}

/**
 * Card Style Data (for state persistence)
 */
interface CardStyleData {
    name: string;
    borderColor: string;
    backgroundColor: string;
    bubbleColor: string;
    textColor: string;
    whisper: 'off' | 'character' | 'gm';
    badge: string | null;
}

// ============================================================================
// CHARACTER SHEET ATTRIBUTE REFERENCE
// ============================================================================

/**
 * Roll20 Character Sheet Attributes - Comprehensive Reference
 * 
 * Modern character sheets (like D&D 5e by Roll20) store data in JSON format
 * within special "container" attributes. This reference documents the structure
 * found through actual Roll20 API inspection.
 * 
 * ATTRIBUTE STORAGE TYPES:
 * 
 * 1. DIRECT ATTRIBUTES (simple key-value at character level):
 *    - store, builder, appState, sheetVersion, updateId, USECOLOR, USEBLOOD
 * 
 * 2. JSON ATTRIBUTES (complex nested data stored as JSON strings):
 *    - store: Main game data (HP, gold, level, abilities, etc.)
 *    - builder: Character creation/builder data
 * 
 * ProximityNPC automatically searches both direct and JSON attributes!
 */

/**
 * Top-level character attributes found on D&D 5e by Roll20 sheets
 */
export interface CharacterFrameworkAttributes {
    /** Main data store - contains all character game data as JSON string */
    store: string;

    /** Character builder data - used by character creation tools */
    builder: string;

    /** Current sheet state: 'sheet' or 'builder' */
    appState: 'sheet' | 'builder';

    /** Character sheet version number */
    sheetVersion: string;

    /** Unique update identifier for synchronization */
    updateId: string;

    /** Whether to use color themes: 'YES' or 'NO' */
    USECOLOR: 'YES' | 'NO';

    /** Blood/gore display setting: 'DEFAULT', 'NONE', etc. */
    USEBLOOD: string;
}

/**
 * Common attribute names that can be used in ProximityNPC messages
 * 
 * Usage in messages: {playerName.attributeName} or {monitoredName.attributeName}
 * 
 * IMPORTANT: Just use the simple names (hp, gold, level)!
 * The system automatically finds them even if stored with different names in the JSON.
 * 
 * The "Actual location" comments show WHERE the data is stored internally,
 * but you DON'T need to use those names - the aliases work automatically!
 * 
 * The system automatically:
 * - Searches direct attributes first
 * - Then searches in JSON containers (store, builder, data, character, stats)
 * - Uses case-insensitive matching
 * - Tries common aliases (hp → currentHP, gold → gp, etc.)
 * - Recursively searches nested objects up to 10 levels deep
 */
export type CommonAttributeNames =
    // === HIT POINTS ===
    // USE: {playerName.hp} - System automatically finds currentHP in the JSON!
    // Tries: hp, currentHP, current_hp, hitpoints, hit_points, HP, health
    | 'hp'              // ← USE THIS! (Actual storage: store.currentHP)
    | 'currentHP'       // (works but 'hp' is easier)
    | 'maxhp'           // ← USE THIS! (Actual storage: store.maximumWithoutTemp)
    | 'maximumWithoutTemp'  // (works but 'maxhp' is easier)

    // === CURRENCY ===
    // USE: {playerName.gold} - System automatically finds gp in currencies!
    // Tries: gold, gp, goldPieces, gold_pieces
    | 'gold' | 'gp'     // ← USE EITHER! (Actual storage: store.currencies.gp)
    | 'silver' | 'sp'   // (Actual storage: store.currencies.sp)
    | 'copper' | 'cp'   // (Actual storage: store.currencies.cp)
    | 'platinum' | 'pp' // (Actual storage: store.currencies.pp)
    | 'electrum' | 'ep' // (Actual storage: store.currencies.ep)

    // === CORE STATS ===
    | 'level'            // USE: {playerName.level}
    | 'ac'               // USE: {playerName.ac} - Armor class
    | 'initiative'
    | 'speed'
    | 'proficiency'

    // === ABILITY SCORES ===
    | 'strength' | 'str'
    | 'dexterity' | 'dex'
    | 'constitution' | 'con'
    | 'intelligence' | 'int'
    | 'wisdom' | 'wis'
    | 'charisma' | 'cha'

    // === ABILITY MODIFIERS ===
    | 'strength_mod' | 'str_mod'
    | 'dexterity_mod' | 'dex_mod'
    | 'constitution_mod' | 'con_mod'
    | 'intelligence_mod' | 'int_mod'
    | 'wisdom_mod' | 'wis_mod'
    | 'charisma_mod' | 'cha_mod'

    // === SKILLS ===
    | 'acrobatics'
    | 'animal_handling' | 'animalHandling'
    | 'arcana'
    | 'athletics'
    | 'deception'
    | 'history'
    | 'insight'
    | 'intimidation'
    | 'investigation'
    | 'medicine'
    | 'nature'
    | 'perception'
    | 'performance'
    | 'persuasion'
    | 'religion'
    | 'sleight_of_hand' | 'sleightOfHand'
    | 'stealth'
    | 'survival'

    // === CHARACTER INFO ===
    | 'age'              // Actual location: store.about.characteristics.age
    | 'alignment'        // Actual location: store.about.characteristics.alignment
    | 'faith'            // Actual location: store.about.characteristics.faith
    | 'size'             // Actual location: store.about.characteristics.size
    | 'pronouns'         // Actual location: store.character.pronouns
    | 'creatureType'     // Actual location: store.character.creatureType
    | 'race' | 'species'
    | 'background'
    | 'class'

    // === OTHER ===
    | 'experience' | 'exp' | 'xp' | 'currentExp'
    | 'inspiration' | 'isInspired';  // Actual location: store.isInspired

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUICK ANSWER: YES, just use {playerName.hp} and it works!
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * You DON'T need to know where attributes are stored internally.
 * The "Actual location" comments are just FYI for developers.
 * 
 * JUST USE THE SIMPLE NAMES:
 * - {playerName.hp} ✅ Works! (system finds currentHP automatically)
 * - {playerName.gold} ✅ Works! (system finds gp automatically)
 * - {playerName.maxhp} ✅ Works! (system finds maximumWithoutTemp automatically)
 * - {playerName.level} ✅ Works!
 * - {playerName.ac} ✅ Works!
 * 
 * The system handles everything behind the scenes!
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Attribute Alias Mappings
 * 
 * When ProximityNPC looks up an attribute, it tries these variations automatically.
 * This allows users to type {playerName.hp} and have it find currentHP in the JSON.
 * 
 * YOU DON'T NEED TO MEMORIZE THIS - just use hp, gold, level, etc. and it works!
 */
export const ATTRIBUTE_ALIASES: Record<string, string[]> = {
    // HP variations - when you use 'hp', system automatically tries these
    hp: ['hp', 'currentHP', 'current_hp', 'hitpoints', 'hit_points', 'HP', 'health'],

    // Max HP variations - when you use 'maxhp', system automatically tries these
    maxhp: ['maxhp', 'max_hp', 'maximumWithoutTemp', 'hp_max', 'maximum_hp'],

    // Gold variations - when you use 'gold', system automatically tries these
    gold: ['gold', 'gp', 'goldPieces', 'gold_pieces'],

    // Level variations
    level: ['level', 'characterLevel', 'character_level', 'lvl'],

    // AC variations
    ac: ['ac', 'armorClass', 'armor_class', 'armour_class', 'AC'],

    // Inspiration variations
    inspiration: ['inspiration', 'isInspired', 'is_inspired', 'inspired']
};

/**
 * Known JSON container attributes in Roll20 character sheets
 * 
 * These attributes contain JSON data with nested character information.
 * ProximityNPC automatically searches these when looking for attributes.
 */
export const JSON_CONTAINERS = ['store', 'builder', 'data', 'character', 'stats'] as const;

/**
 * Store Attribute Structure (D&D 5e by Roll20 sheet)
 * 
 * The 'store' attribute contains a JSON string with this structure.
 * ProximityNPC recursively searches through this to find attributes.
 * 
 * Common attribute paths:
 * - currentHP: store.currentHP (depth 0)
 * - maximumWithoutTemp: store.maximumWithoutTemp (depth 0) 
 * - gold: store.currencies.gp (depth 1)
 * - age: store.about.characteristics.age (depth 2)
 * - alignment: store.about.characteristics.alignment (depth 2)
 * - isInspired: store.isInspired (depth 0)
 */
export interface StoreAttributeStructure {
    // === DIRECT PROPERTIES (Depth 0) ===
    currentHP?: number;                    // {playerName.hp} finds this
    maximumWithoutTemp?: number;           // {playerName.maxhp} finds this
    isInspired?: boolean;                  // {playerName.inspiration} finds this

    // === NESTED SECTIONS (Depth 1+) ===
    about?: {
        characteristics?: {
            age?: string;                   // {playerName.age}
            alignment?: string;             // {playerName.alignment}
            faith?: string;                 // {playerName.faith}
            size?: string;                  // {playerName.size}
        };
        aboutItems?: Record<string, any>;
    };

    character?: {
        pronouns?: string;                  // {playerName.pronouns}
        creatureType?: string;              // {playerName.creatureType}
        createdWithBuilder?: boolean;
    };

    currencies?: {
        cp?: number;                        // {playerName.copper}
        sp?: number;                        // {playerName.silver}
        ep?: number;                        // {playerName.electrum}
        gp?: number;                        // {playerName.gold} finds this
        pp?: number;                        // {playerName.platinum}
    };

    classLevel?: {
        currentExp?: number;                // {playerName.exp}
    };

    deathSaves?: {
        failures?: number;
        successes?: number;
        open?: boolean;
    };

    // ... many more nested sections (actions, attacks, features, spells, etc.)
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HOW TO USE ATTRIBUTES IN PROXIMITYNPC MESSAGES - SIMPLE GUIDE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Basic Syntax (JUST USE THESE!):
 * - {playerName.hp} ✅ - Triggering character's HP
 * - {playerName.gold} ✅ - Triggering character's gold
 * - {playerName.level} ✅ - Triggering character's level
 * - {playerName.ac} ✅ - Triggering character's armor class
 * - {monitoredName.hp} ✅ - NPC's HP (if NPC has character sheet)
 * - {CharacterName.hp} ✅ - Specific character's HP by name
 * 
 * YOU DON'T NEED TO KNOW THE INTERNAL NAMES!
 * The system automatically maps:
 * - hp → finds currentHP in JSON
 * - gold → finds gp in currencies
 * - maxhp → finds maximumWithoutTemp
 * - And many more!
 * 
 * Examples:
 * 
 * 1. Health Check:
 *    "You have {playerName.hp} HP remaining, {playerName}."
 *    → "You have 35 HP remaining, Who."
 * 
 * 2. Gold Check:
 *    "You have {playerName.gold} gold pieces."
 *    → "You have 150 gold pieces."
 * 
 * 3. NPC Comparing Stats:
 *    "Your HP: {playerName.hp}, my HP: {monitoredName.hp}"
 *    → "Your HP: 35, my HP: 150"
 * 
 * 4. Multiple Attributes:
 *    "HP: {playerName.hp}/{playerName.maxhp}, Gold: {playerName.gold}g, Level: {playerName.level}"
 *    → "HP: 35/50, Gold: 150g, Level: 5"
 * 
 * Finding Attribute Names for YOUR Character Sheet:
 * Select a token and run: !proximitynpc --attributes
 * This lists ALL available attributes for that character with their values.
 * 
 * Fallback Behavior (Safe Defaults):
 * - No character: [No Character]
 * - Attribute not found: [hp?]
 * - Empty value: [Empty]
 * - Error: [Error]
 * 
 * The message still displays even if an attribute is missing!
 * ═══════════════════════════════════════════════════════════════════════════
 */

