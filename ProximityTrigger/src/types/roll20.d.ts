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

