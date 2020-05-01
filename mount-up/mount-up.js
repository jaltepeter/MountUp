import { registerSettings } from "./settings.js"
import { MountHud } from "./mountHud.js"
import { MountManager } from "./mountManager.js";

Hooks.on('ready', () => {
    registerSettings();
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    MountHud.addMountButton(app, html, data);
});

Hooks.on('updateToken', (scene, token, updateData) => {
    if (updateData.x || updateData.y) {
        MountManager.handleTokenMovement(token._id, updateData);
    }
});

Hooks.on('preDeleteToken', (scene, token) => {
    
    MountManager.deleteToken(token);
});

Hooks.on('canvasReady', (canvas) => {
    MountManager.popAllRiders();
});