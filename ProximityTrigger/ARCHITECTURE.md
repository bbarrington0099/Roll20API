# ProximityTrigger Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Roll20 API                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  ProximityTrigger                      │  │
│  │                                                         │  │
│  │  ┌──────────┐      ┌──────────┐      ┌──────────┐    │  │
│  │  │  Events  │ ───▶ │ Handlers │ ───▶ │   Core   │    │  │
│  │  └──────────┘      └──────────┘      └──────────┘    │  │
│  │       │                  │                  │          │  │
│  │       │                  └────────┬─────────┘          │  │
│  │       ▼                           ▼                    │  │
│  │  ┌──────────┐             ┌──────────┐                │  │
│  │  │  Utils   │ ◀────────── │  State   │                │  │
│  │  └──────────┘             └──────────┘                │  │
│  │       ▲                           ▲                    │  │
│  │       │                           │                    │  │
│  │       └───────────┬───────────────┘                    │  │
│  │                   ▼                                    │  │
│  │             ┌──────────┐                               │  │
│  │             │ Classes  │                               │  │
│  │             └──────────┘                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Module Dependencies

### Layer 1: Data Models (No Dependencies)
```
┌─────────────────┐
│    Classes      │  Foundation layer - pure data structures
├─────────────────┤
│ • CardStyle     │
│ • MessageObject │
│ • PresetNPC     │
│ • MonitoredNPC  │
└─────────────────┘
```

### Layer 2: Utilities (Classes)
```
┌─────────────────┐
│     Utils       │  Helper functions using classes
├─────────────────┤
│ • tokenUtils    │  Depends on: Roll20 API, State
│ • nameUtils     │  Depends on: none
│ • distanceUtils │  Depends on: none
│ • messageUtils  │  Depends on: MessageObject
└─────────────────┘
```

### Layer 3: State Management (Classes, Utils)
```
┌─────────────────┐
│     State       │  Persistent data and initialization
├─────────────────┤
│ • initState     │  Depends on: CardStyle, PresetData
│ • presetData    │  Depends on: PresetNPC, MessageObject
│ • triggeredTokens│ Depends on: none (simple object)
└─────────────────┘
```

### Layer 4: Core Logic (Classes, Utils, State)
```
┌─────────────────┐
│      Core       │  Business logic layer
├─────────────────┤
│ • messageDisplay│  Depends on: messageUtils, State
│ • proximityCheck│ Depends on: distanceUtils, tokenUtils,
│                 │              triggeredTokens, messageDisplay
│ • autoMonitor   │  Depends on: MonitoredNPC, tokenUtils
└─────────────────┘
```

### Layer 5: Handlers (All Above)
```
┌──────────────────┐
│    Handlers      │  Command processing layer
├──────────────────┤
│ • helpHandler    │  Depends on: none
│ • menuHandler    │  Depends on: none
│ • listNPCs      │  Depends on: nameUtils, State
│ • monitorHandler│  Depends on: MonitoredNPC, tokenUtils, nameUtils
│ • editNPC       │  Depends on: nameUtils, State
│ • triggerHandler│  Depends on: tokenUtils, nameUtils, messageDisplay
│ • cardStyle     │  Depends on: CardStyle, nameUtils, State
│ • messages      │  Depends on: MessageObject, nameUtils, State
│ • deleteNPC     │  Depends on: nameUtils, triggeredTokens, State
└──────────────────┘
```

### Layer 6: Events (Handlers, Core)
```
┌──────────────────┐
│     Events       │  Roll20 event listeners
├──────────────────┤
│ • chatListener   │  Depends on: All Handlers
│ • tokenListener  │  Depends on: MonitoredNPC, proximityChecker,
│                  │              tokenUtils, triggeredTokens
└──────────────────┘
```

### Layer 7: Entry Point (Everything)
```
┌──────────────────┐
│    index.js      │  Application initialization
├──────────────────┤
│ Orchestrates:    │
│ • initializeState│
│ • setupChatListener
│ • setupTokenListeners
│ • autoMonitorNPCs
└──────────────────┘
```

## Data Flow

### Command Processing Flow
```
User Command in Chat
       ↓
chatListener (events)
       ↓
Route to appropriate Handler
       ↓
Handler processes command
       ↓
Uses Utils for calculations
       ↓
Updates State
       ↓
Sends response via sendChat
```

### Proximity Detection Flow
```
Token Moves
       ↓
tokenListener (events)
       ↓
proximityChecker (core)
       ↓
Calculate distances (distanceUtils)
       ↓
Check against monitored NPCs (State)
       ↓
Trigger if in range & not on cooldown
       ↓
messageDisplay (core)
       ↓
Render styled message card
       ↓
sendChat to players
```

### NPC Monitoring Flow
```
Token Added to Map
       ↓
tokenListener (events)
       ↓
Check if preset NPC (State)
       ↓
Create MonitoredNPC (if preset)
       ↓
Add to State
       ↓
Ready for proximity detection
```

## File Organization Rationale

### Why This Structure?

**Classes First:** Foundation of the system - pure data structures with no dependencies.

**Utils Second:** Reusable functions that operate on classes and provide common functionality.

**State Third:** Manages persistent data, depends on classes for data structures.

**Core Fourth:** Business logic that orchestrates utils and manages state.

**Handlers Fifth:** User-facing command processing, uses everything below.

**Events Sixth:** Listens to Roll20, delegates to handlers and core.

**Index Last:** Entry point that initializes everything.

### Dependency Rule

**Higher layers can depend on lower layers, but not vice versa.**

This ensures:
- No circular dependencies
- Clear separation of concerns
- Easy testing (mock lower layers)
- Predictable behavior

## Key Design Patterns

### 1. Module Pattern
Each file exports specific functionality, keeping implementation details private.

### 2. Single Responsibility
Each handler/util/core module has one clear purpose.

### 3. Dependency Injection
State is passed to functions rather than globally accessed (where possible).

### 4. Event-Driven
Roll20 events trigger handlers, which process and update state.

### 5. Separation of Concerns
- **Classes:** Data structures
- **Utils:** Pure functions
- **Core:** Business logic
- **Handlers:** User interaction
- **Events:** External triggers

## Roll20 Integration Points

### Global Objects Used
```javascript
state           // Persistent storage
on()            // Event registration
sendChat()      // Output to chat
findObjs()      // Query objects
getObj()        // Get specific object
log()           // Console output
Campaign()      // Campaign info
```

### Events Listened To
```javascript
'ready'           // Initialization
'chat:message'    // Commands
'change:graphic'  // Token movement
'add:graphic'     // Token creation
'destroy:graphic' // Token deletion
```

## Build Process

```
Source Files (src/)
       ↓
Rollup Bundler
       ↓
Combine modules
       ↓
Resolve imports/exports
       ↓
Wrap in IIFE
       ↓
dist/ProximityTrigger.js
       ↓
Copy to Roll20
```

### Why IIFE (Immediately Invoked Function Expression)?

Roll20 requires scripts to be self-contained. The IIFE:
- Creates isolated scope
- Prevents global namespace pollution
- Works with Roll20's sandbox environment

## Performance Considerations

### Hot Paths
- **Token movement:** Runs frequently, must be fast
- **Proximity checking:** Optimized with early returns
- **Message selection:** Weighted pool is pre-computed

### Optimization Strategies
- Early validation and returns
- Minimal object creation in hot paths
- Efficient distance calculations
- Cooldown tracking prevents spam

## Extension Points

Want to add functionality? Here's where:

| What                  | Where                          |
|-----------------------|--------------------------------|
| New command           | Create handler + register      |
| New NPC               | Add to presetData.js           |
| New utility function  | Add to appropriate utils file  |
| New core logic        | Add to core/                   |
| New class/model       | Add to classes/                |
| New event listener    | Add to events/                 |

## Testing Strategy (Future)

```
Unit Tests
├── Classes (pure)
├── Utils (pure functions)
└── Handlers (mock state)

Integration Tests
├── Core logic (mock Roll20 API)
└── Event flows (mock Roll20 events)

E2E Tests
└── Full Roll20 environment
```

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Predictable dependency flow
- ✅ Easy to locate functionality
- ✅ Simple to extend
- ✅ Maintainable and testable
- ✅ Roll20 compatible output

The modular design makes the codebase approachable for new developers while maintaining all the functionality of the original monolithic script.

