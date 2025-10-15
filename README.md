# ProximityNPC - Dynamic NPC Interaction System for Roll20

A powerful Roll20 API script that creates interactive NPCs with proximity triggers, dynamic messages, dice rolls, character attributes, and clickable buttons.

---

## 🌟 Features

### Core Functionality
- ✅ **Automatic Proximity Detection** - NPCs react when players get close
- ✅ **Dynamic Message Content** - Dice rolls, character attributes, and buttons
- ✅ **Weighted Random Messages** - Natural variety in NPC dialogue
- ✅ **Beautiful Styled Cards** - Customizable visual appearance
- ✅ **Multiple Trigger Modes** - Always on, one-time, or disabled
- ✅ **Interactive UI** - Full chat-based configuration
- ✅ **Persistent State** - All settings saved between sessions

### Dynamic Content (NEW in v2.0!)
- 🎲 **Dice Rolls** - `{1d6}`, `{2d20+3}` directly in messages with styled display
- 📊 **Character Attributes** - `{playerName.hp}`, `{playerName.gold}` with smart alias detection
- 🔘 **Clickable Buttons** - `[Button Text](message)` with [[roll]], whispers, API commands
- 👤 **Player Name** - `{playerName}` for triggering character (first name)
- 🎭 **NPC Name** - `{monitoredName}` for the NPC speaking (full name)
- 🎯 **NPC Attributes** - `{monitoredName.hp}` for NPC's stats (if NPC has sheet)

---

## 📦 Quick Start

### 1. Installation
```javascript
// 1. Copy ProximityNPC.js contents
// 2. In Roll20: Settings → API Scripts → New Script
// 3. Paste and save
// 4. Script will auto-load and monitor preset NPCs
```

### 2. Create Your First Interactive NPC
```javascript
// In Roll20 chat:
!proximitynpc -M

// Then select a token and follow the menu to:
// - Set trigger distance
// - Add messages
// - Configure appearance
```

### 3. Add Dynamic Content
```javascript
// Example message with all features:
"I am {monitoredName}. Welcome {playerName}! HP: {playerName.hp}. Roll: {1d20}! 
[Heal]({playerName} recovers [[2d8+4]] HP!) [Continue](w gm Continue)"
```

**Note:** Buttons use `[[roll]]` for inline rolls that execute when clicked!

---

## 🎯 Quick Examples

### Health Check NPC
```javascript
new MessageObject(
    'You look hurt, {playerName}. You have {playerName.hp} HP. 
    [Get Healing]({playerName} recovers [[2d8+4]] HP from {monitoredName}!) 
    [Decline](w gm {playerName} declined healing)',
    2
)
```

### Shop Keeper
```javascript
new MessageObject(
    'Welcome to {monitoredName}\'s shop! You have {playerName.gold} gold. 
    [Buy Sword 50g](w gm {playerName} bought sword: -50g, +[[1d8]] dmg) 
    [Buy Potion 20g](w gm {playerName} bought potion: [[2d4+2]] healing) 
    [Leave](w gm Left shop)',
    3
)
```

### Random Encounter
```javascript
new MessageObject(
    'A creature appears! Initiative: {1d20+3}! 
    [Attack]({playerName} attacks! Hit: [[1d20+5]], Dmg: [[2d6+3]]) 
    [Flee](w gm {playerName} fled)',
    1
)
```

---

## 📖 Documentation

### Essential Guides
- **[DYNAMIC_MESSAGES.md](DYNAMIC_MESSAGES.md)** - Complete guide to dynamic content (START HERE!)
- **[EXAMPLE_MESSAGES.js](EXAMPLE_MESSAGES.js)** - 60+ copy-paste examples with all features
- **[ProximityTrigger/src/types/roll20.d.ts](ProximityTrigger/src/types/roll20.d.ts)** - Complete attribute reference
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

### Help Commands
```javascript
!proximitynpc --help         // Show help
!proximitynpc --attributes   // List character attributes (find attribute names!)
!proximitynpc --menu         // Interactive menu
```

---

## 🎮 Commands

### Main Commands
| Command | Shorthand | Description |
|---------|-----------|-------------|
| `!proximitynpc --menu` | `-m` | Open interactive menu |
| `!proximitynpc --monitor [Token]` | `-M` | Add/edit NPC |
| `!proximitynpc --list` | `-l` | List all NPCs |
| `!proximitynpc --trigger [NPC]` | `-t` | Manually trigger NPC |
| `!proximitynpc --delete [NPC]` | `-D` | Delete NPC |
| `!proximitynpc --help` | `-h` | Show help |

### Configuration
| Command | Description |
|---------|-------------|
| `!proximitynpc --edit [NPC] [property] [value]` | Edit NPC settings |
| `!proximitynpc --cardstyles` | List card styles |
| `!proximitynpc --cardstyle [Style] [property] [value]` | Edit card style |

---

## ✨ Dynamic Content Syntax

### Name Replacements
```javascript
{playerName}        // Triggering character's FIRST NAME ("Who" from "Who Wingfall")
{monitoredName}     // NPC's FULL NAME ("Tharos Raggenthraw")
```

### Character Attributes (Smart Aliases!)
```javascript
{playerName.hp}           // Player's HP (auto-finds currentHP in JSON)
{playerName.gold}         // Player's gold (auto-finds gp in currencies)
{playerName.level}        // Player's level
{playerName.ac}           // Player's armor class
{monitoredName.hp}        // NPC's HP (if NPC has character sheet)
{CharacterName.strength}  // Specific character's attribute by name
```

**Supported Attributes:** hp, maxhp, gold, level, ac, strength/str, dexterity/dex, constitution/con, intelligence/int, wisdom/wis, charisma/cha, all ability modifiers, all skills, age, alignment, inspiration, and more!

**Find Your Sheet's Attributes:** `!proximitynpc --attributes`

### Dice Rolls (In Message Text)
```javascript
{1d6}           // Simple roll - shows styled result
{2d20+3}        // Roll with modifier
{1d8+2d6}       // Multiple dice
{1d8+2d6+2}     // Complex expression
```
**Hover tooltip shows breakdown:** `1d8=[4]+2d6=[3,5]+2`

### Clickable Buttons (Full Capabilities!)
```javascript
[Button Text](message)                           // Plain message to chat
[Whisper](w {playerName} Private message)        // Whisper to player
[GM Note](w gm {playerName} did something)       // Whisper to GM
[Heal]({playerName} recovers [[2d8+4]] HP!)      // INLINE ROLL with [[syntax]]
[Attack](/r 1d20+@{selected|strength_mod})       // Roll command
[Menu](!proximitynpc -m)                         // API command
[Chain NPC](!proximitynpc -t Other_NPC)          // Trigger another NPC
```

**Key Points:**
- ✅ Multiple buttons from one message appear on ONE card
- ✅ Use `[[roll]]` in buttons for rolls that execute on click
- ✅ Use `{roll}` in message text for styled immediate rolls
- ✅ {playerName} and {monitoredName} work in button messages!

---

## 🎨 Example Use Cases

### Healer NPC
```javascript
new MessageObject(
    '"You need healing, {playerName}. Your HP: {playerName.hp}/{playerName.maxhp}. ' +
    'I am {monitoredName} and can help." ' +
    '[Get Healing]({playerName} recovers [[2d8+4]] HP from {monitoredName}!) ' +
    '[Decline](w gm {playerName} declined healing)',
    2
)
```

### Merchant NPC
```javascript
new MessageObject(
    '"Welcome to {monitoredName}\'s shop! You have {playerName.gold} gold. ' +
    'Sword (50g, [[1d8]] dmg) or Shield (30g, +2 AC)?" ' +
    '[Buy Sword](w gm {playerName} bought sword from {monitoredName}: -50g) ' +
    '[Buy Shield](w gm {playerName} bought shield from {monitoredName}: -30g) ' +
    '[Haggle](You haggle: [[1d20+@{selected|charisma_mod}]] vs DC 15) ' +
    '[Leave](w gm Left shop)',
    3
)
```

### Quest Giver
```javascript
new MessageObject(
    '"I, {monitoredName}, have a quest. Your level: {playerName.level}. ' +
    'Danger level: {1d10}. Reward: [[3d6*10]] gold!" ' +
    '[Accept Quest](w gm {playerName} (Lvl {playerName.level}) accepted {monitoredName}\'s quest) ' +
    '[Ask Details](w {playerName} {monitoredName} explains the details...) ' +
    '[Decline](w gm {playerName} declined)',
    1
)
```

### Gambling NPC
```javascript
new MessageObject(
    '"Roll with {monitoredName}, {playerName}! You: {1d20}, Me: {1d20}!" ' +
    '[Bet 10 Gold]({playerName} bets 10g! Your roll: [[1d20]]) ' +
    '[Double Down]({playerName} doubles! Rolls: [[2d20]] take highest) ' +
    '[Cash Out](w gm {playerName} cashed out from {monitoredName})',
    2
)
```

---

## ⚙️ Configuration

### NPC Properties
- **Trigger Distance** - How close players must be (in token widths)
- **Timeout** - Cooldown between triggers (milliseconds, 0 = permanent)
- **Messages** - Array of MessageObject with content, weight, style
- **Card Style** - Visual appearance (colors, whisper mode, badge)
- **Mode** - `on` (repeating), `once` (one-time), `off` (disabled)

### Message Properties
- **Content** - The message text with dynamic placeholders
- **Weight** - Probability (0 = disabled, 1+ = relative likelihood)
- **Card Style** - Override default style for this message

### Card Style Properties
- **Colors** - Border, background, bubble, text (hex or CSS)
- **Whisper** - `off` (public), `character` (to player), `gm` (to GM)
- **Badge** - Optional URL to badge image

---

## 🔧 Advanced Features

### Preset NPCs
The script includes preset NPCs with pre-configured messages. When you place a token with a matching name, it auto-monitors with the preset configuration.

### Multi-Token Support
Multiple tokens with the same name share one configuration. Perfect for:
- Groups of similar NPCs
- NPCs that appear in multiple locations
- Consistent behavior across tokens

### Weighted Random Selection
Control message frequency with weights:
```javascript
new MessageObject('Common greeting', 5)    // 5x more likely
new MessageObject('Rare greeting', 1)      // Standard likelihood
new MessageObject('Testing', 0)            // Disabled
```

### Per-Message Styling
Override the NPC's default style for specific messages:
```javascript
new MessageObject('Friendly message', 2, 'Coal Rank')
new MessageObject('Urgent warning!', 1, 'Gold Rank')  // Different style
```

---

## 🛡️ Safety Features

### Graceful Fallbacks
Every dynamic feature has safe fallbacks:

| Feature | If Missing | Shows |
|---------|-----------|-------|
| `{playerName}` | No character | "Guild Member" |
| `{playerName.hp}` | No character | `[No Character]` |
| `{playerName.hp}` | No attribute | `[hp?]` |
| `{playerName.hp}` | Empty | `[Empty]` |
| `{1d6}` | Invalid | `[Invalid Roll: 1d6]` |
| `[Button](cmd)` | Malformed | Plain text |

### Input Validation
- Dice expressions validated before evaluation
- Attribute lookups sanitized
- Maximum dice limits (100 dice, 1000 sides)
- Safe mathematical expression evaluation
- Error logging for debugging

---

## 🐛 Troubleshooting

### "NPC not triggering?"
- Check mode is `on` or `once` (not `off`)
- Verify trigger distance is large enough
- Ensure NPC has messages configured
- Confirm tokens are on same page

### "Attribute shows [hp?]"
- Check exact spelling on character sheet
- Case matters: `hp` vs `HP`
- Look for underscores: `dexterity_mod` not `dexterity mod`
- Ensure token represents a character

### "Roll shows [Invalid Roll: ...]"
- Check dice notation: `1d6` not `d6`
- Verify math: `{1d20+5}` works, `{1d20++5}` doesn't
- Keep expressions simple
- Avoid very complex nested expressions

### "Button doesn't work"
- Test command manually in chat first
- Check syntax: `[Text](command)` no `!` needed
- Verify command is valid
- Try simpler commands

---

## 📝 Tips & Best Practices

### For NPCs
- Use multiple messages with varied weights
- Set appropriate trigger distances (2-3 for friendly, 1-2 for cautious)
- Combine static and dynamic content
- Provide context around attributes

### For Messages
- Test dice expressions before adding
- Keep button commands simple
- Handle missing attributes gracefully
- Use weight 0 to disable test messages

### For Performance
- Don't over-monitor - only set up needed NPCs
- Use appropriate timeouts to prevent spam
- Clean up unused NPCs with `!proximitynpc -D`
- Keep dice expressions reasonable

---

## 🎓 Learning Path

### Beginners
1. Read **FEATURE_UPDATE_SUMMARY.md**
2. Try basic examples from **EXAMPLE_MESSAGES.js**
3. Create a simple NPC with `!proximitynpc -M`
4. Add a `{playerName}` message
5. Test with `!proximitynpc -t NPCName`

### Intermediate
1. Add dice rolls: `{1d6}` - styled immediate results
2. Add character attributes: `{playerName.hp}` - smart alias detection
3. Use `{monitoredName}` for NPC self-reference
4. Create buttons: `[Click Me](Message with [[1d6]] roll)`
5. Experiment with weights and styles

### Advanced
1. Read **DYNAMIC_MESSAGES.md** completely
2. Use `[[roll]]` in buttons for click-to-roll functionality
3. Combine {playerName}, {monitoredName}, attributes, rolls, and buttons
4. Chain NPCs with button API commands: `[Next](!proximitynpc -t NPC)`
5. Use whispers strategically: `(w {playerName} Secret)` or `(w gm Note)`
6. Build interactive storylines with multiple choice buttons

---

## 📊 Version History

### Version 2.0 (Current) - October 2025
- ➕ **NEW:** Dice roll support `{1d6}`, `{2d20+3}` with styled display and tooltips
- ➕ **NEW:** Character attribute lookups `{playerName.hp}` with smart alias detection
- ➕ **NEW:** NPC name and attributes `{monitoredName}`, `{monitoredName.hp}`
- ➕ **NEW:** Clickable buttons `[Text](message)` with callback system
- ➕ **NEW:** Button capabilities: `[[roll]]` inline rolls, whispers, API commands
- ➕ **NEW:** JSON attribute search - finds `currentHP`, `gp`, etc. in nested JSON
- ➕ **NEW:** Multiple buttons consolidated on one card
- ➕ **NEW:** Comprehensive attribute alias system (hp→currentHP, gold→gp, etc.)
- ✨ Enhanced message processing with 5-stage pipeline
- 📚 Comprehensive documentation (2,500+ lines)
- 🔍 TypeScript definitions with full attribute reference
- 🛡️ Safe fallbacks for all features
- ✅ Full backward compatibility
- 🎯 Debug command: `!proximitynpc --attributes`

### Version 1.0
- Initial release with preset NPCs
- Basic proximity detection
- Simple message system with `{playerName}`
- Card styling system
- Chat-based UI

---

## 🤝 Support

### Need Help?
1. Check **[DYNAMIC_MESSAGES.md](DYNAMIC_MESSAGES.md)** for detailed docs
2. Review **[EXAMPLE_MESSAGES.js](EXAMPLE_MESSAGES.js)** for working examples
3. Use `!proximitynpc -h` for in-game help
4. Test manually with `!proximitynpc -t NPCName`

### Found a Bug?
- Check the Roll20 API console for errors
- Verify your syntax matches the documentation
- Test with simpler examples to isolate the issue
- Review the troubleshooting section above

---

## 📜 License

MIT License - Free to use and modify for your Roll20 games.

---

## 🙏 Credits

**Original Version:** bbarr  
**Dynamic Features:** v2.0 Update (2025-10-15)

Created for the Roll20 community to enable rich, interactive NPC experiences.

---

## 🚀 Get Started Now!

1. **Install** the script in your Roll20 game
2. **Place** a token on your map
3. **Type** `!proximitynpc -M` and select it
4. **Add** your first dynamic message:
   ```javascript
   "Hello {playerName}! Roll: {1d6}! [Click](w gm Test)"
   ```
5. **Test** by moving a player token close to it!

**Enjoy dynamic, interactive NPCs in your Roll20 games! 🎲✨**

