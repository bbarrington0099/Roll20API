/* WelcomeMessage */

on('ready', function() {
    log('Welcome Message API Ready');
    
    // Small delay to ensure player objects are loaded
    setTimeout(function() {
        var players = findObjs({ _type: 'player' });
        log('Found ' + players.length + ' players');
        
        players.forEach(function(player) {
            if (player.get('_online')) {
                sendWelcome(player);
            }
        });
    }, 1000);
});

on('change:player:_online', function(obj) {
    // Fires when a player connects/disconnects
    if (obj.get('_online') === true) {
        sendWelcome(obj);
    }
});

function sendWelcome(player) {
    var name = player.get('_displayname') || 'Adventurer';
    log('Sending welcome to: ' + name);
    
    var card = '<div style="background: #f4e8d8; border: 3px solid #8b4513; border-radius: 10px; padding: 15px; margin: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-family: Georgia, serif;">' +
        '<div style="text-align: center; margin-bottom: 10px;">' +
        '<img src="https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/staffImages/TharosRaggenthraw.png" style="max-width: 200px; border: 4px solid #8b4513; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">' +
        '</div>' +
        '<div style="background: white; border: 2px solid #8b4513; border-radius: 8px; padding: 12px; position: relative;">' +
        '<div style="position: absolute; top: -10px; left: 20px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid #8b4513;"></div>' +
        '<div style="position: absolute; top: -7px; left: 21px; width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 9px solid white;"></div>' +
        '<p style="margin: 0; color: #2c1810; font-size: 14px; line-height: 1.6;">Welcome back, <strong>' + name + '</strong>!</p>' +
        '<p style="margin: 8px 0 0 0; color: #2c1810; font-size: 14px; line-height: 1.6;">Be sure to drop a token on the <img src="https://studionimbus.dev/Projects/AlabastriaCharacterAssistant/GuildEmblem.png" style="height: 20px; width: 20px; vertical-align: middle; margin: 0 2px; border: 1px solid #8b4513; border-radius: 3px;"> <strong>spawn point</strong> of the current map and prepare for adventure!</p>' +
        '</div>' +
        '<p style="text-align: center; margin: 10px 0 0 0; color: #8b4513; font-size: 12px; font-style: italic;">- Guild Master Tharos</p>' +
        '</div>';
    
    sendChat('Guild Master Tharos', '/w "' + name + '" ' + card);
}