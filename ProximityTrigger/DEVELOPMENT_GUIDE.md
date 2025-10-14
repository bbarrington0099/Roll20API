# ProximityTrigger Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Build the script
npm run build

# Watch for changes (auto-rebuild)
npm run watch

# Clean build artifacts
npm run clean
```

## Project Structure

```
Roll20API/
├── src/                    # Source code (edit these!)
│   ├── classes/           # Data models
│   ├── handlers/          # Command handlers
│   ├── utils/             # Helper functions
│   ├── core/              # Core logic
│   ├── events/            # Event listeners
│   ├── state/             # State management
│   └── index.js           # Entry point
├── dist/                   # Build output (don't edit!)
│   └── ProximityTrigger.js    # Bundled script for Roll20
├── node_modules/           # Dependencies (auto-generated)
├── package.json            # Project config
├── rollup.config.js        # Bundler config
├── ProximityTrigger.js         # Original backup
└── README.md               # Documentation

```

## Development Workflow

### Making Changes

1. **Edit source files** in `src/` directory
2. **Build the script:** `npm run build`
3. **Test in Roll20:**
   - Copy contents of `dist/ProximityTrigger.js`
   - Paste into Roll20 API Scripts
   - Save and test

### Watch Mode (Recommended)

For active development, use watch mode:
```bash
npm run watch
```

This automatically rebuilds when you save changes. You still need to manually update Roll20.

## Common Tasks

### Adding a New NPC

Edit `src/state/presetData.js`:

```javascript
new PresetNPC(
    'NPC Name',
    2,  // distance in token widths
    [
        new MessageObject('Hello {playerName}!', 3),
        new MessageObject('Good to see you!', 2)
    ],
    'https://example.com/image.png',
    'Default',  // card style
    10000  // timeout in ms
)
```

### Adding a New Command

1. **Create handler** in `src/handlers/myCommandHandler.js`:
```javascript
export function handleMyCommand(msg, state) {
    const who = msg.who || 'gm';
    sendChat('NPC Monitor', `/w ${who} My command executed!`);
}
```

2. **Export from index:** Add to `src/handlers/index.js`:
```javascript
export { handleMyCommand } from './myCommandHandler.js';
```

3. **Register in chat listener:** Add to `src/events/chatListener.js`:
```javascript
import { handleMyCommand } from '../handlers/index.js';

// In setupChatListener function:
if (msg.content.includes('--mycommand')) {
    handleMyCommand(msg, state);
    return;
}
```

4. **Add to help:** Update `src/handlers/helpHandler.js`

### Adding a Utility Function

Create or edit files in `src/utils/`:

```javascript
// src/utils/myUtils.js
export function myUtilityFunction(param) {
    // Your logic here
    return result;
}
```

Export from `src/utils/index.js`:
```javascript
export * from './myUtils.js';
```

### Modifying Core Logic

Edit files in `src/core/`:
- `messageDisplay.js` - Message rendering
- `proximityChecker.js` - Proximity detection
- `autoMonitor.js` - Auto-monitoring

## Code Style Guidelines

### Naming Conventions
- **Functions:** camelCase (`handleMonitor`, `getBestTokenImage`)
- **Classes:** PascalCase (`CardStyle`, `MonitoredNPC`)
- **Constants:** UPPER_CASE (`DEFAULT_DISTANCE`)
- **Files:** camelCase.js (`helpHandler.js`, `tokenUtils.js`)

### Documentation
Always include JSDoc comments:

```javascript
/**
 * Brief description of what the function does.
 * 
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */
export function myFunction(paramName) {
    // Implementation
}
```

### Module Structure
```javascript
/**
 * Module Name
 * 
 * Brief description of the module's purpose.
 */

import { dependency } from './otherModule.js';

// Implementation

export { myFunction };
```

### Error Handling
- Always validate input parameters
- Provide helpful error messages
- Use sendChat for user feedback

```javascript
if (!npc) {
    sendChat('NPC Monitor', `/w ${who} NPC "${name}" not found.`);
    return;
}
```

## Debugging

### Enable Logging
Add log statements in your code:
```javascript
log('Debug info:', variable);
```

View logs in Roll20 API Console.

### Common Issues

**Build fails:**
- Check for syntax errors
- Ensure all imports are correct
- Verify file paths use `.js` extension

**Script doesn't load in Roll20:**
- Check Roll20 API Console for errors
- Verify the bundled output is valid JavaScript
- Make sure all Roll20 globals are accessible

**Changes not appearing:**
- Rebuild: `npm run build`
- Copy the NEW `dist/ProximityTrigger.js` content
- Save in Roll20 (may need to restart sandbox)

## Testing

Currently, testing is manual in Roll20. To test:

1. Build the script
2. Load in Roll20 API Scripts
3. Test each command systematically
4. Verify proximity detection works
5. Test edge cases (empty messages, invalid tokens, etc.)

## Performance Considerations

- Proximity checking runs on every token movement
- Keep proximity logic efficient
- Use lazy evaluation where possible
- Cache computed values when appropriate

## Roll20 API Specifics

### Available Globals
- `state` - Persistent storage (survives restarts)
- `on()` - Event listener registration
- `sendChat()` - Send messages to chat
- `findObjs()` - Find Roll20 objects
- `getObj()` - Get specific object
- `log()` - Console logging
- `Campaign()` - Campaign object

### State Management
- State persists between game sessions
- Always initialize state on 'ready' event
- Use `state.ProximityTrigger` namespace

### Token Objects
Access token properties with `.get()`:
```javascript
token.get('left')
token.get('top')
token.get('name')
token.get('represents')  // character ID
```

## Building for Production

### Final Build
```bash
npm run clean
npm run build
```

### Verification Checklist
- [ ] All features work in Roll20
- [ ] No console errors
- [ ] Proximity detection accurate
- [ ] Commands respond correctly
- [ ] Help text is current
- [ ] No linting errors (if linter added)

### Deployment
1. Test thoroughly in Roll20 dev game
2. Copy `dist/ProximityTrigger.js`
3. Deploy to production game
4. Verify functionality
5. Keep backup of previous version

## Getting Help

### Resources
- Roll20 API Documentation: https://wiki.roll20.net/API
- Rollup Documentation: https://rollupjs.org/
- This codebase: Read the well-commented source!

### Common Questions

**Q: Why is the bundled file larger?**
A: Documentation, comments, and module wrapper code. It's worth it for maintainability.

**Q: Can I use TypeScript?**
A: Yes! Add TypeScript support to the build config. The bundler can handle it.

**Q: How do I revert to the original?**
A: The original `ProximityTrigger.js` is preserved. Just use that in Roll20.

**Q: Can I minify the output?**
A: Yes, add a minification plugin to `rollup.config.js`. Not recommended though - debugging is harder.

## Next Steps

Consider adding:
- **Unit tests** with Jest or Mocha
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Husky** for pre-commit hooks
- **CI/CD** for automated building

Happy coding! 🎲

