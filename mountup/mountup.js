import { Settings } from "./settings.js";
import { MountHud } from "./mountHud.js";
import { MountManager } from "./mountManager.js";

Hooks.on('ready', () => {
    Settings.registerSettings();
});

Hooks.on('canvasReady', () => {
    MountManager.popAllRiders();
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    MountHud.renderMountHud(app, html, data);
});

Hooks.on('preUpdateToken', async (scene, token, updateData) => {
    if (updateData.x || updateData.y) {
        await MountManager.handleTokenMovement(token._id, updateData);
    }
});

Hooks.on('updateToken', async (scene, token, updateData) => {
    if (MountManager.isaMount(updateData._id)) {
        await MountManager.popRider(updateData._id);
    }
});

Hooks.on('controlToken', async (token) => {
    if (MountManager.isaMount(token.id)) {
        await MountManager.popRider(token.id);
    }
});

Hooks.on('preDeleteToken', async (scene, token) => {
    await MountManager.handleTokenDelete(token._id);
    return true;
});