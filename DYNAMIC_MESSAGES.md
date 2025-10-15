# Dynamic Message Content Guide

This guide explains how to use dynamic content in ProximityNPC messages, including dice rolls, character attributes, buttons, and more.

## Overview

Messages in ProximityNPC support special syntax that gets replaced with dynamic content when the message is triggered. This allows for interactive, personalized, and variable messages that respond to the game state.

## Features

### 1. Name Replacements

**Syntax:** `{playerName}` and `{monitoredName}`

**Description:** 
- `{playerName}` - Replaced with the triggering character's first name
- `{monitoredName}` - Replaced with the NPC's name (the one speaking)

**Examples:**
```javascript
new MessageObject('Welcome back, {playerName}! Good to see you again.', 1)
// Result: "Welcome back, Alaric! Good to see you again."

new MessageObject('I am {monitoredName}, and you must be {playerName}.', 1)
// Result: "I am Tharos Raggenthraw, and you must be Alaric."

new MessageObject('{playerName}, remember - {monitoredName} is always here if you need help.', 1)
// Result: "Alaric, remember - Tharos Raggenthraw is always here if you need help."
```

---

### 2. Character Attributes

**Syntax:** `{playerName.attributeName}`, `{monitoredName.attributeName}`, or `{CharacterName.attributeName}`

**Description:** Looks up and displays a character attribute value from the character sheet.

**References:**
- `{playerName.hp}` - Triggering character's HP
- `{monitoredName.hp}` - NPC's HP (if NPC has a character sheet)
- `{CharacterName.hp}` - Specific character's HP by name

**Examples:**
```javascript
new MessageObject('You look hurt, {playerName}. You only have {playerName.hp} health left!', 1)
new MessageObject('Your armor class of {playerName.ac} should protect you well.', 1)
new MessageObject('I see you have {playerName.gold} gold pieces. Planning to spend some?', 1)
new MessageObject('I, {monitoredName}, have {monitoredName.hp} HP and can help with your {playerName.hp} HP.', 1)
```

**Fallback Behavior:**
- If the character has no sheet: `[No Character]`
- If the attribute doesn't exist: `[attributeName?]`
- If the attribute is empty: `[Empty]`
- If there's an error: `[Error]`

**Note:** The attribute name must match the exact name on the character sheet.

---

### 3. Dice Rolls

**Syntax:** `{XdY}`, `{XdY+Z}`, `{XdY-Z}`, `{XdY+XdY}`, etc.

**Description:** Executes dice rolls and displays the result in a styled span with inverted colors matching the card style.

**Supported Expressions:**
- Simple rolls: `{1d6}`, `{2d20}`, `{3d8}`
- With modifiers: `{1d20+5}`, `{2d6-2}`
- Multiple dice: `{1d8+2d6}`, `{3d6+1d4+2}`
- Complex math: `{(2d6+3)*2}`, `{1d20+1d4+5}`

**Examples:**
```javascript
new MessageObject('Roll for initiative: {1d20+3}', 1)
new MessageObject('You take {2d6+4} damage from the trap!', 1)
new MessageObject('Your healing potion restores {1d8+2} hit points.', 1)
new MessageObject('Complex calculation: {1d6+2d4+3} total!', 1)
```

**Display:** Results appear in colored badges with a hover tooltip showing the individual dice rolls.

**Limits:**
- Maximum 100 dice per roll
- Maximum 1000 sides per die
- Invalid expressions show: `[Invalid Roll: expression]`

---

### 4. Clickable Buttons

**Syntax:** `[Button Text](message or command)`

**Description:** Creates clickable buttons that send messages or execute commands when clicked. All buttons from one message appear together on a card titled "{playerName}'s opportunities".

**Button Capabilities - You Can Include:**

1. **Plain Messages:**
```javascript
'[Click Me](This message appears in chat)'
'[Accept]({playerName} accepts the offer)'
```

2. **Whispers to Players:**
```javascript
'[Private Message](w {playerName} This is whispered to you)'
'[Secret Info](w Alaric You learn a secret...)'
```

3. **Whispers to GM:**
```javascript
'[Report to GM](w gm {playerName} clicked this button at {monitoredName}\'s location)'
```

4. **Inline Dice Rolls (using [[roll]] syntax):**
```javascript
'[Roll Damage](You deal [[2d6+3]] damage!)'
'[Heal Self]({playerName} recovers [[1d8+2]] HP)'
'[Attack Roll](Attack result: [[1d20+5]])'
```

5. **Roll20 Commands:**
```javascript
'[Roll Attack](/r 1d20+5 Attack Roll)'
'[Perception Check](/r 1d20+@{selected|perception} Perception)'
'[Initiative](/r 1d20+@{selected|dexterity_mod} Initiative)'
```

6. **API Commands:**
```javascript
'[Show Card Styles](!proximitynpc -cl)'
'[Open Menu](!proximitynpc -m)'
'[Trigger Another NPC](!proximitynpc -t OtherNPC)'
```

7. **Complex Combinations:**
```javascript
'[Accept & Roll]({playerName} accepts! Rolling result: [[1d20+3]])'
'[Buy Item](w gm {playerName} spent {playerName.gold} gold on a sword)'
```

**Multiple Buttons - One Card:**
All buttons from a single message appear together:
```javascript
new MessageObject(
    'Choose your path, {playerName}: ' +
    '[Path A](You chose Path A) ' +
    '[Path B](You chose Path B) ' +
    '[Path C](You chose Path C)',
    1
)
```

**Result:**
```
┌─────────────────────────┐
│ Who's opportunities      │
│ [Path A] [Path B]       │
│ [Path C]                │
└─────────────────────────┘
```

**Button Features:**
- ✅ All buttons clickable
- ✅ Can include {playerName}, {monitoredName} placeholders
- ✅ Supports [[roll]] syntax for inline rolls
- ✅ Whispers work (/w syntax)
- ✅ API commands work (!command syntax)
- ✅ Roll commands work (/r syntax)
- ✅ Multiple buttons consolidated on one card

---

## Combining Features

You can combine multiple dynamic features in a single message:

```javascript
new MessageObject(
    'Well met, {playerName}! You have {playerName.hp} HP remaining. ' +
    'I, {monitoredName}, have {monitoredName.hp} HP and can assist you. ' +
    'Roll for a random encounter: {1d20}! ' +
    '[Rest Here](w {playerName} You rest and recover [[1d8+2]] HP) ' +
    '[Get Healing from {monitoredName}]({playerName} receives healing from {monitoredName}: [[2d8+4]] HP!) ' +
    '[Continue Journey](w gm {playerName} continues their journey)',
    1
)
```

**This message includes:**
- ✅ {playerName} - "Alaric"
- ✅ {monitoredName} - "Tharos Raggenthraw"
- ✅ {playerName.hp} - Player's HP value
- ✅ {monitoredName.hp} - NPC's HP value
- ✅ {1d20} - Dice roll with styling
- ✅ 3 clickable buttons with [[roll]] inline rolls
- ✅ Whispers and plain messages

---

## ⚠️ Important: Roll Syntax Differences

There are **two different roll syntaxes** depending on where you use them:

### In Message Text: `{1d6}` (Single Braces)
```javascript
'You take {2d6+3} damage!'
```
- ✅ Roll executes immediately when message triggers
- ✅ Shows styled result in message
- ✅ Hover tooltip shows breakdown

### In Buttons: `[[1d6]]` (Double Brackets)
```javascript
'[Attack](You deal [[2d6+3]] damage!)'
```
- ✅ Roll executes when button is CLICKED
- ✅ Shows result in chat when button clicked
- ✅ Standard Roll20 inline roll syntax

**Why Two Syntaxes?**
- **Message rolls** `{1d6}` are processed by ProximityNPC for styling
- **Button rolls** `[[1d6]]` are processed by Roll20 when button clicked

**Example Combining Both:**
```javascript
new MessageObject(
    'This trap deals {2d6} damage now! ' +
    '[Try to Dodge]({playerName} dodges! Roll: [[1d20+@{selected|dexterity_mod}]])',
    1
)
```
- First roll `{2d6}` executes immediately, shows styled result
- Second roll `[[1d20+...]]` executes when button clicked

---

## Best Practices

### 1. Use Appropriate Weights

Set weight to `0` to disable messages with advanced features during testing:
```javascript
new MessageObject('Test message with {1d20} roll', 0) // Weight 0 = disabled
```

### 2. Provide Context

Always provide context around dynamic content:
```javascript
// Good
new MessageObject('Your HP is {playerName.hp} out of your maximum', 1)

// Less clear
new MessageObject('Your HP: {playerName.hp}', 1)
```

### 3. Handle Missing Attributes Gracefully

Messages should still make sense if attributes are missing:
```javascript
// Good - still readable if HP is missing
new MessageObject('You look wounded, {playerName}. Current HP: {playerName.hp}', 1)

// Bad - awkward if HP is missing
new MessageObject('{playerName.hp} is your current hit points', 1)
```

### 4. Test Your Rolls

Verify that dice expressions work before adding them to messages:
```javascript
// Simple expressions are less likely to fail
new MessageObject('Damage: {2d6+3}', 1) // Good

// Complex expressions may have issues
new MessageObject('Calculation: {((2d6+3)*2)-(1d4)}', 1) // Test first!
```

### 5. Button Command Safety

Keep button commands simple and test them:
```javascript
// Good - simple whisper
[Click Me](w gm Player clicked the button)

// Good - simple roll
[Roll Attack](r 1d20+5)

// Complex - test thoroughly
[Complex Action](fx explosion-fire @{target|token_id};w gm Effect triggered)
```

---

## Examples by Use Case

### Combat Encounters
```javascript
new MessageObject(
    '"Watch out, {playerName}!" The trap springs! Take {2d6} damage! ' +
    '[Dodge](!r 1d20+@{selected|dexterity_mod} Dexterity Save) ' +
    '[Take It](!&#13;/w {playerName} You take the full damage!)',
    1
)
```

### Shopping/Trading
```javascript
new MessageObject(
    '"That\'ll be 50 gold, {playerName}. You have {playerName.gold} gold." ' +
    '[Buy Item](w gm {playerName} purchased the item) ' +
    '[Walk Away](w gm {playerName} decided not to buy)',
    1
)
```

### Social Interactions
```javascript
new MessageObject(
    '"Nice to meet you, {playerName}! Roll for persuasion: {1d20+2}" ' +
    '[Tell Truth](w gm {playerName} told the truth) ' +
    '[Tell Lie](w gm {playerName} told a lie)',
    1
)
```

### Healing/Recovery
```javascript
new MessageObject(
    '"You\'re at {playerName.hp} HP, {playerName}. Here, this potion will restore {1d8+2} HP." ' +
    '[Drink Potion](w gm {playerName} drank the healing potion)',
    1
)
```

### Skill Checks
```javascript
new MessageObject(
    '"Think you can spot the hidden door, {playerName}? Your perception is {playerName.perception}." ' +
    '[Search](!&#13;/r 1d20+@{selected|perception}#Perception Check)',
    1
)
```

---

## Troubleshooting

### Rolls Not Working
- **Issue:** Roll shows `[Invalid Roll: ...]`
- **Solutions:**
  - Check for typos in the dice notation
  - Ensure spaces are inside the `{}`: `{1d6 + 3}` works
  - Verify dice counts are reasonable (< 100 dice, < 1000 sides)
  - Test the mathematical expression separately

### Attributes Not Found
- **Issue:** Shows `[attributeName?]`
- **Solutions:**
  - Verify the attribute name matches the character sheet exactly
  - Check for case sensitivity: `hp` vs `HP`
  - Ensure the triggering token represents a character
  - Look for underscores vs hyphens: `dexterity_mod` vs `dexterity-mod`

### Buttons Not Clicking
- **Issue:** Buttons don't execute commands
- **Solutions:**
  - Ensure the command syntax is valid
  - Test the command manually in chat first
  - Check for special characters that need escaping
  - Try simpler commands to isolate the issue

### PlayerName Not Replacing
- **Issue:** `{playerName}` appears literally in message
- **Solutions:**
  - This is a bug - report to the GM
  - As a workaround, ensure tokens represent named characters
  - Check that the script is loaded properly

---

## Advanced Techniques

### Conditional Messages with Weights

Use character attributes in combination with multiple messages of different weights to create pseudo-conditional logic:

```javascript
// High HP message - lower weight
new MessageObject('You look healthy, {playerName}! {playerName.hp} HP is plenty!', 1)

// Low HP warning - make this rarer so it feels special when HP IS low
new MessageObject('You look hurt! Only {playerName.hp} HP remaining!', 1)
```

### Nested Commands

Create buttons that trigger other buttons:
```javascript
new MessageObject(
    '"Choose your path, {playerName}!" ' +
    '[Path A](w {playerName} You chose Path A. [Continue](w gm Continuing Path A)) ' +
    '[Path B](w {playerName} You chose Path B. [Continue](w gm Continuing Path B))',
    1
)
```

### Multi-step Interactions

Create a sequence of messages using buttons:
```javascript
// Message 1 - in NPC "Merchant"
new MessageObject(
    '"Want to see my wares?" [Yes](proximitynpc -t Merchant_Shop)',
    1
)

// Message 2 - in a different NPC "Merchant_Shop" 
new MessageObject(
    '"Here\'s what I have: Sword (50g), Shield (30g)." ' +
    '[Buy Sword](w gm Bought sword) [Buy Shield](w gm Bought shield) ' +
    '[Leave](proximitynpc -t Merchant)',
    1
)
```

---

## API Reference

### Message Processing Order

When a message is triggered, replacements happen in this order:

1. **{playerName}** - Basic player name replacement
2. **{playerName.attribute}** - Character attribute lookups
3. **{dice rolls}** - Dice roll execution and formatting
4. **[Buttons](commands)** - Button HTML generation

This order ensures that player names work in attributes, buttons, and rolls.

### Safe Fallbacks

All dynamic features have safe fallbacks:

| Feature | Failure Condition | Fallback Display |
|---------|------------------|------------------|
| {playerName} | No character | "Guild Member" |
| {playerName.attr} | No character | `[No Character]` |
| {playerName.attr} | Attribute not found | `[attr?]` |
| {playerName.attr} | Attribute empty | `[Empty]` |
| {1d6} | Invalid expression | `[Invalid Roll: expr]` |
| [Button](cmd) | Malformed | Raw text (no button) |

### Style Integration

Dynamic content is styled to match the card style:

- **Dice rolls:** Background = text color, Text = bubble color
- **Buttons:** Background = text color, Text = bubble color, Border = border color
- **Hover effects:** Automatically applied to buttons
- **Tooltips:** Dice rolls show individual die results on hover

---

## Tips for GMs

1. **Start Simple:** Begin with `{playerName}` and basic rolls before trying complex features
2. **Test Messages:** Use `!proximitynpc -t NPCName` to manually trigger and test messages
3. **Weight Strategically:** Use weight 0 for testing, 1+ for active messages
4. **Document Attributes:** Keep a list of common character sheet attribute names
5. **Share Examples:** Show players example messages so they know what to expect
6. **Create Templates:** Build a library of common message patterns
7. **Handle Failures:** Write messages that still work if attributes are missing
8. **Use Comments:** Add comments to explain complex messages in presetNPCs array

---

## Example Message Library

Copy and adapt these examples for your own NPCs:

```javascript
// Basic greeting
new MessageObject('Hello, {playerName}!', 3)

// Health check
new MessageObject('You have {playerName.hp} hit points remaining.', 2)

// Random encounter
new MessageObject('A wild creature appears! Roll initiative: {1d20}', 1)

// Shop interaction
new MessageObject(
    'Welcome to my shop! You have {playerName.gold} gold. ' +
    '[Buy Sword (50g)](w gm {playerName} bought a sword) ' +
    '[Buy Potion (25g)](w gm {playerName} bought a potion)',
    2
)

// Skill challenge
new MessageObject(
    'Try to persuade them, {playerName}! Your charisma is {playerName.charisma}. ' +
    '[Attempt Persuasion](!r 1d20+@{selected|charisma_mod}#Persuasion)',
    1
)

// Combat action
new MessageObject(
    'The enemy attacks! Take {2d6+3} damage! ' +
    '[Block](!r 1d20+@{selected|dexterity_mod}#Block) ' +
    '[Dodge](!r 1d20+@{selected|dexterity_mod}#Dodge)',
    1
)

// Rest/Recovery
new MessageObject(
    'Rest here, {playerName}? You\'ll recover {1d8+2} HP. ' +
    '[Short Rest](w gm {playerName} took a short rest) ' +
    '[Continue](w gm {playerName} continued their journey)',
    2
)
```

---

## Version History

- **v1.0** - Initial release with {playerName} support
- **v2.0** - Added dynamic content support:
  - Dice rolls {1d6}
  - Character attributes {playerName.hp}
  - Clickable buttons [Text](command)
  - Safe fallbacks for all features
  - Styled inline elements

